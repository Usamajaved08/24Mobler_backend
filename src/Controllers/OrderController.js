import mongoose from "mongoose";
import Order from "../Models/Order.js";
import Joi from "joi";
import { sendEmail } from "../Utils/Email.js";
import User from "../Models/User.js";
import Product from "../Models/Product.js";
import EmailData from "../Utils/EmailText.json" assert { type: "json" };
import { updateProduct } from "./ProductController.js";

const createNewOrder = async (req, res) => {
  try {
    const { customerId, orderItems, shippingAddress, deliverySlots } = req.body;
    const orderSchema = Joi.object({
      customerId: Joi.string()
        .required()
        .custom((value, helper) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helper.error("Invalid customer ID");
          }
          return value;
        }),
      orderItems: Joi.array().required().min(1),
      shippingAddress: Joi.object().required(),
      deliverySlots: Joi.array().required().min(1),
    });
    const validationResult = orderSchema.validate(req.body);
    if (validationResult.error) {
      return res.status(400).json({
        success: false,
        message: validationResult.error.details[0].message,
      });
    }

    let orderNo = await generateUniqueOrderNo();

    const user = await findUserById(customerId);
    if (!user) {
      console.log("User who order that product not found.");
    }

    const createdOrder = await Order.create({
      customerId,
      orderNo,
      orderItems,
      shippingAddress,
      deliverySlots,
    });

    for (const item of orderItems) {
      const product = await findProductById(item.id);
      if (!product) {
        console.log(`Product not found with ID ${item.id}.`);
        continue;
      }
      if (product.status === "approved") {
        // Send email to customer only
        if (process.env.SMTP2GO_API_KEY) {
          await sendEmail({
            product: {},
            user,
            emailSubject: "Product Order",
            emailMsg: EmailData?.orderText,
          });
        } else {
          console.log("SMTP2GO API key not found. Email sending disabled.");
        }
      } else if (product.status === "declined") {
        if (process.env.SMTP2GO_API_KEY) {
          await sendEmail({
            product: {},
            user,
            emailSubject: "Product Order",
            emailMsg: EmailData?.orderText,
          });
        } else {
          console.log("SMTP2GO API key not found. Email sending disabled.");
        }
      } else if (product.status === "preApproved") {
        const productOwner = await findUserById(product.posterId);
        if (productOwner) {
          // Send email to product owner
          if (process.env.SMTP2GO_API_KEY) {
            await sendEmail({
              product: {},
              user: productOwner,
              emailSubject: "Pre Approved Product update",
              emailMsg: EmailData?.preApprovedToApproved,
            });
          } else {
            console.log("SMTP2GO API key not found. Email sending disabled.");
          }
        } else {
          console.log(`Product owner not found with ID ${product.posterId}.`);
        }
        // Also Send email to customer
        if (process.env.SMTP2GO_API_KEY) {
          await sendEmail({
            product: {},
            user,
            emailSubject: "Product Order",
            emailMsg: EmailData?.orderText,
          });
        } else {
          console.log("SMTP2GO API key not found. Email sending disabled.");
        }
      }
      product.status = "sold";
      await updateProduct(product);
    }

    if (createdOrder?._id) {
      res.status(200).json({
        success: true,
        message: "Order created successfully",
        createdOrder,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Order creation failed",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const getCustomerOrders = async (req, res) => {
  try {
    const { customerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid customer ID" });
    }
    const orders = await Order.find({ customerId }).sort({ createdAt: -1 });
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No orders found for this customer.",
      });
    }
    const productIds = orders?.flatMap((order) =>
      order?.orderItems?.map((item) => item?.id)
    );
    const products = await Product.find({
      _id: { $in: productIds },
      status: "deliveryApproved",
    });
    const ordersWithProducts = orders
      ?.map((order) => {
        const orderItemsWithProducts = order?.orderItems?.map((item) => {
          const product = products?.find((product) =>
            product?._id?.equals(item?.id)
          );
          return { ...item, product: product || {} };
        });
        // Check if all products for this order are found, if not, skip the order
        if (orderItemsWithProducts.some((item) => !item.product._id)) {
          return null; // Skip this order
        }
        return { ...order.toObject(), orderItems: orderItemsWithProducts };
      })
      .filter(Boolean);
    res.status(200).json({ success: true, customerOrders: ordersWithProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return res
        .status(200)
        .json({ success: false, message: "No order found" });
    }
    const productIds = orders?.flatMap((order) =>
      order?.orderItems?.map((item) => item?.id)
    );
    const products = await Product.find({ _id: { $in: productIds } });
    const ordersWithProducts = orders?.map((order) => {
      const orderItemsWithProducts = order?.orderItems?.map((item) => {
        const product = products?.find((product) =>
          product?._id?.equals(item?.id)
        );
        return { ...item, product: product || {} };
      });
      return { ...order.toObject(), orderItems: orderItemsWithProducts };
    });
    res.status(200).json({ success: true, allOrders: ordersWithProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const generateUniqueOrderNo = async () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let orderNo;
  do {
    orderNo = "";
    for (let i = 0; i < 5; i++) {
      orderNo += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
  } while (await Order.exists({ orderNo })); // Check for existing order with same ID
  return orderNo;
};

const findUserById = async (userId) => {
  try {
    return await User.findById(userId);
  } catch (error) {
    console.error("Error finding user by ID:", error);
    throw error;
  }
};

const findProductById = async (productId) => {
  try {
    return await Product.findById(productId);
  } catch (error) {
    console.error("Error finding product by ID:", error);
    throw error;
  }
};
export { createNewOrder, getCustomerOrders, getAllOrders };
