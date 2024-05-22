import Product from "../Models/Product.js";
import fs from "fs";
import { sendEmail } from "../Utils/Email.js";
import User from "../Models/User.js";
import EmailData from "../Utils/EmailText.json" assert { type: "json" };

const addNewProduct = async (req, res) => {
  try {
    const {
      posterId,
      title,
      price,
      color,
      category,
      condition,
      isQualityVerified,
      rooms,
      model,
      description,
      dimension,
      location,
      pickUpSlots,
    } = req.body;
    if (!posterId) {
      if (req.files) {
        req.files.forEach((file) => fs.unlinkSync(file.path));
      }
      return res
        .status(400)
        .json({ message: "Please login first or user id not found." });
    }
    if (!title || !price || !color || !category) {
      if (req.files) {
        req.files.forEach((file) => fs.unlinkSync(file.path));
      }
      return res
        .status(400)
        .json({ message: "Missing required product details." });
    }
    const existingProduct = await Product.findOne({
      title: title,
      deleted: false,
    });
    if (existingProduct) {
      if (req.files) {
        req.files.forEach((file) => fs.unlinkSync(file.path));
      }
      return res.status(409).json({
        success: false,
        message: "Product with the same name already exists.",
      });
    }
    const imageNames = req?.files?.map((file) => file.filename);
    if (!imageNames || imageNames.length < 1 || imageNames.length > 5) {
      if (req.files) {
        req.files.forEach((file) => fs.unlinkSync(file.path));
      }
      return res
        .status(400)
        .json({ success: false, message: "Please upload 1 to 5 images." });
    }
    const newProduct = new Product({
      posterId,
      title,
      price,
      color,
      imageNames,
      category,
      condition,
      isQualityVerified,
      rooms,
      model,
      description,
      dimension: JSON.parse(dimension),
      location: JSON.parse(location),
      pickUpSlots,
    });
    await newProduct.save();
    const user = await findUserById(newProduct.posterId);
    if (!user) {
      console.log("User who posted that product not found.");
    }
    if (process.env.SMTP2GO_API_KEY) {
      console.log("EmailData?.uploadTexts >>>", EmailData?.uploadTexts);
      await sendEmail({
        newProduct,
        user,
        emailSubject: "Product Uploaded",
        emailMsg: EmailData?.uploadTexts,
      });
    } else {
      console.warn("SMTP2GO API key not found. Email sending disabled.");
    }
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    if (req.files) {
      req.files.forEach((file) => fs.unlinkSync(file.path));
    }
    console.error("Error creating product", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
const getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find({ deleted: false });
    if (allProducts) {
      res.status(200).json({ message: "All Products", allProducts });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }
};
const getProductsByUserId = async (req, res) => {
  try {
    const { posterId } = req.params;
    if (posterId) {
      const myProducts = await Product.find({ posterId, deleted: false });
      if (myProducts.length) {
        res.status(200).json({
          success: 1,
          message: "User's All Products",
          totalCount: myProducts?.length,
          myProducts,
        });
      } else {
        res.status(200).json({ success: 0, message: "No data Found" });
      }
    } else {
      res.status(200).json({ success: 0, message: "user id not Found" });
    }
  } catch (error) {
    res.status(500).json({ success: 0, message: "Internal server error." });
  }
};
const getAllApprovedProducts = async (req, res) => {
  try {
    const approvedProducts = await Product.find({
      status: { $in: ["approved", "preApproved", "declined"] },
      deleted: false,
    });
    if (approvedProducts?.length) {
      res.status(200).json({
        success: 1,
        message: "All Approved Products",
        approvedProducts,
      });
    } else {
      res.status(200).json({ success: 0, message: "No data Found" });
    }
  } catch (error) {
    res.status(500).json({ success: 0, message: "Internal server error." });
  }
};
const getAllPendingProducts = async (req, res) => {
  try {
    const pendingProducts = await Product.find({
      status: "pending",
      deleted: false,
    });
    if (pendingProducts?.length) {
      res
        .status(200)
        .json({ success: 1, message: "All Pending Products", pendingProducts });
    } else {
      res.status(200).json({ success: 0, message: "No data Found" });
    }
  } catch (error) {
    res.status(500).json({ success: 0, message: "Internal server error." });
  }
};

const getProductsHistory = async (req, res) => {
  try {
    const historyProducts = await Product.find({
      status: { $in: ["approved", "preApproved", "declined"] },
      deleted: false,
    }).sort({ createdAt: -1 });
    if (historyProducts?.length) {
      res
        .status(200)
        .json({ success: 1, message: "All Products History", historyProducts });
    } else {
      res.status(200).json({ success: 0, message: "No data Found" });
    }
  } catch (error) {
    res.status(500).json({ success: 0, message: "Internal server error." });
  }
};
const deleteProductsHistory = async (req, res) => {
  try {
    let checkProduct = await Product.findOne({
      _id: req.params.id,
      deleted: false,
    });

    if (!Product) {
      return res.status(400).json({
        message: `Product with the name  does not exist `,
      });
    }

    // Soft delete the role by updating the 'deleted' key to true
    checkProduct.deleted = true;
    await checkProduct.save();

    return res.status(200).json({
      data: checkProduct,
      message: `Product  has been  deleted successfully`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getSoldProducts = async (req, res) => {
  try {
    const soldProducts = await Product.find({
      status: { $in: ["sold"] },
      deleted: false,
    }).sort({ createdAt: -1 });
    if (soldProducts?.length) {
      res
        .status(200)
        .json({ success: 1, message: "All Sold Products", soldProducts });
    } else {
      res.status(200).json({ success: 0, message: "No data Found" });
    }
  } catch (error) {
    res.status(500).json({ success: 0, message: "Internal server error." });
  }
};

const updateProductStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res
        .status(400)
        .json({ success: 0, message: "Invalid product ID." });
    }
    if (!["approved", "declined", "preApproved"].includes(status)) {
      return res.status(400).json({
        success: 0,
        message:
          "Invalid status. Valid values( approved, preApproved & declined)",
      });
    }
    const product = await findProductById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: 0, message: "Product not found." });
    }
    product.status = status;
    const updatedProduct = await updateProduct(product);

    const user = await findUserById(updatedProduct.posterId);
    if (!user) {
      console.log("User who posted that product not found.");
    }
    if (process.env.SMTP2GO_API_KEY) {
      if (updatedProduct?.status === "approved") {
        await sendEmail({
          updatedProduct,
          user,
          emailSubject: "Product Review Status",
          emailMsg: EmailData?.pendingToApproved,
        });
      }
      if (updatedProduct?.status === "declined") {
        const updatedPendingToDeclinedEmailMsg = {
          ...EmailData?.pendingToDeclined,
          "2ndText": `Reason not justified <br>`,
        };
        await sendEmail({
          updatedProduct,
          user,
          emailSubject: "Product Review Status",
          emailMsg: updatedPendingToDeclinedEmailMsg,
        });
      }
    } else {
      console.warn("SMTP2GO API key not found. Email sending disabled.");
    }
    res.status(200).json({
      success: 1,
      message: `Product status updated to: ${status}`,
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: 0, message: "Internal server error." });
  }
};

const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      if (req.files) {
        req.files.forEach((file) => fs.unlinkSync(file.path));
      }
      return res
        .status(400)
        .json({ success: 0, message: "Invalid product ID." });
    }
    const productData = req.body;
    const existingImages = req.body?.existingImages || [];
    const product = await findProductById(id);
    if (!product) {
      if (req.files) {
        req.files.forEach((file) => fs.unlinkSync(file.path));
      }
      return res
        .status(404)
        .json({ success: 0, message: "Product not found." });
    }
    if (req.files && req.files.length > 0) {
      const imageNames = req.files?.map((file) => file.filename);
      product.imageNames = [...existingImages, ...imageNames];
    } else {
      product.imageNames = existingImages;
    }
    if (productData.dimension) {
      productData.dimension = JSON.parse(productData.dimension);
    }
    if (productData.location) {
      productData.location = JSON.parse(productData.location);
    }
    updateNestedFields(product, productData);

    const updatedProduct = await updateProduct(product);
    const user = await findUserById(updatedProduct.posterId);
    if (!user) {
      console.log("User who posted that product not found.");
    }
    if (process.env.SMTP2GO_API_KEY) {
      let fourthTextField;
      if (updatedProduct?.status === "approved") {
        if (updatedProduct?.pickUpSlots?.length) {
          function formatDateAndTime(dateTime) {
            const date = new Date(dateTime.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            const time = dateTime.time;
            return `${date}, Time Slot: ${time}`;
          }
          fourthTextField = updatedProduct?.pickUpSlots
            ?.map((dateTime) => formatDateAndTime(dateTime))
            ?.join("<br>");
          const updatedPendingToApprovedEmailMsg = {
            ...EmailData?.pendingToApproved,
            "4thText": fourthTextField,
          };
          await sendEmail({
            updatedProduct,
            user,
            emailSubject: "Product Review Status",
            emailMsg: updatedPendingToApprovedEmailMsg,
          });
        } else {
          fourthTextField = "No pick up slot added <br>";
          const updatedPendingToApprovedEmailMsg = {
            ...EmailData?.pendingToApproved,
            "4thText": fourthTextField,
          };
          await sendEmail({
            updatedProduct,
            user,
            emailSubject: "Product Review Status",
            emailMsg: updatedPendingToApprovedEmailMsg,
          });
        }
      }
      if (updatedProduct?.status === "preApproved") {
        await sendEmail({
          updatedProduct,
          user,
          emailSubject: "Product Review Status",
          emailMsg: EmailData?.pendingToPreApproved,
        });
      }
      if (updatedProduct?.status === "declined") {
        if (updatedProduct?.reason) {
          const updatedPendingToDeclinedEmailMsg = {
            ...EmailData?.pendingToDeclined,
            "2ndText": `${updatedProduct?.reason}<br>`,
          };
          await sendEmail({
            updatedProduct,
            user,
            emailSubject: "Product Review Status",
            emailMsg: updatedPendingToDeclinedEmailMsg,
          });
        } else {
          const updatedPendingToDeclinedEmailMsg = {
            ...EmailData?.pendingToDeclined,
            "2ndText": `Reason not justified <br>`,
          };
          await sendEmail({
            updatedProduct,
            user,
            emailSubject: "Product Review Status",
            emailMsg: updatedPendingToDeclinedEmailMsg,
          });
        }
      }
    } else {
      console.warn("SMTP2GO API key not found. Email sending disabled.");
    }
    res.status(200).json({
      success: 1,
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    if (req.files) {
      req.files.forEach((file) => fs.unlinkSync(file.path));
    }
    res.status(500).json({ success: 0, message: "Internal server error." });
  }
};

const confirmProductPayment = async (req, res) => {
  try {
    const { id, status, customerId, deliverySlots } = req.body;
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res
        .status(400)
        .json({ success: 0, message: "Invalid product ID." });
    }
    if (!["sold"].includes(status)) {
      return res
        .status(400)
        .json({ success: 0, message: "Invalid status. Valid status( sold )" });
    }
    const product = await findProductById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: 0, message: "Product not found." });
    }
    product.status = "deliveryApproved";
    const updatedProduct = await updateProduct(product);
    const user = await findUserById(customerId);
    if (!user) {
      console.log("customer not found for this order.");
    }
    if (process.env.SMTP2GO_API_KEY) {
      if (deliverySlots?.length) {
        function formatDateAndTime(dateTime) {
          const date = new Date(dateTime.date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          const time = dateTime.time;
          return `${date}, Time Slot: ${time}`;
        }
        const fourthTextField = deliverySlots
          ?.map((dateTime) => formatDateAndTime(dateTime))
          ?.join("<br>");
        const updatedSoldToDeliveryApprovedEmailMsg = {
          ...EmailData?.statussoldTodeliveryApproved,
          "4thText": fourthTextField,
        };
        await sendEmail({
          updatedProduct,
          user,
          emailSubject: "Product Delivery",
          emailMsg: updatedSoldToDeliveryApprovedEmailMsg,
        });
      }
    }
    res.status(200).json({
      success: 1,
      message: `Product status updated successfully`,
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: 0, message: "Internal server error." });
  }
};
const declineProductPayment = async (req, res) => {
  try {
    const { id, status, customerId, deliverySlots } = req.body;
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res
        .status(400)
        .json({ success: 0, message: "Invalid product ID." });
    }
    if (!["sold"].includes(status)) {
      return res
        .status(400)
        .json({ success: 0, message: "Invalid status. Valid status( sold )" });
    }
    const product = await findProductById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: 0, message: "Product not found." });
    }
    product.status = "declined";
    console.log(product);
    const updatedProduct = await updateProduct(product);
    const user = await findUserById(customerId);
    if (!user) {
      console.log("customer not found for this order.");
    }
    if (process.env.SMTP2GO_API_KEY) {
      if (deliverySlots?.length) {
        function formatDateAndTime(dateTime) {
          const date = new Date(dateTime.date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          const time = dateTime.time;
          return `${date}, Time Slot: ${time}`;
        }
        const fourthTextField = deliverySlots
          ?.map((dateTime) => formatDateAndTime(dateTime))
          ?.join("<br>");
        const updatedSoldToDeliveryApprovedEmailMsg = {
          ...EmailData?.paymentDeclined,
        };
        await sendEmail({
          updatedProduct,
          user,
          emailSubject: "Product Delivery",
          emailMsg: updatedSoldToDeliveryApprovedEmailMsg,
        });
      }
    }
    res.status(200).json({
      success: 1,
      message: `Product status updated successfully`,
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: 0, message: "Internal server error." });
  }
};
async function findProductById(productId) {
  try {
    const product = await Product.findOne({ _id: productId, deleted: false });
    return product;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function findUserById(userId) {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateProduct(product) {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      product,
      { new: true }
    );
    if (!updatedProduct) {
      throw new Error("Product not found or update failed.");
    }
    return updatedProduct;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function updateNestedFields(target, source) {
  if (source === undefined || source === null) {
    return; // Handle undefined or null source values
  }

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const targetValue = target[key];
      const sourceValue = source[key];

      if (typeof sourceValue === "object" && !Array.isArray(sourceValue)) {
        // Nested object: Merge recursively
        target[key] = targetValue !== undefined ? targetValue : {};
        updateNestedFields(target[key], sourceValue);
      } else if (Array.isArray(sourceValue)) {
        // Array: Replace with a copy (avoid mutations)
        target[key] = [...sourceValue];
      } else {
        // Other data types: Assign directly
        target[key] = sourceValue;
      }
    }
  }
}

export {
  addNewProduct,
  getAllProducts,
  getProductsByUserId,
  getAllApprovedProducts,
  getAllPendingProducts,
  getProductsHistory,
  updateProductById,
  updateProductStatus,
  getSoldProducts,
  confirmProductPayment,
  declineProductPayment,
  deleteProductsHistory,
};
