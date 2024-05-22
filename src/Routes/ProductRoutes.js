import express from "express";
import {
  addNewProduct,
  getAllProducts,
  getAllApprovedProducts,
  getProductsByUserId,
  getAllPendingProducts,
  getProductsHistory,
  updateProductById,
  updateProductStatus,
  getSoldProducts,
  confirmProductPayment,
  declineProductPayment,
  deleteProductsHistory,
} from "../Controllers/ProductController.js";
import { IsAuthUser } from "../Utils/IsAuthUser.js";
import upload from "../Utils/Uploads.js";
const router = express.Router();

router.post("/add", upload.array("imageNames", 5), addNewProduct);
router.get("/all", getAllProducts);
router.get("/user/:posterId", getProductsByUserId);
router.get("/approveds", getAllApprovedProducts);
router.get("/pendings", getAllPendingProducts);
router.get("/history", getProductsHistory);
router.post("/history/:id", deleteProductsHistory);
router.get("/sold", getSoldProducts);
router.put("/update/:id", upload.array("imageNames", 5), updateProductById);
router.put("/status", updateProductStatus);
router.put("/confirm/payment", confirmProductPayment);
router.put("/decline/payment", declineProductPayment);
export default router;
