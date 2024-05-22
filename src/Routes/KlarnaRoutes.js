import express from "express";
import { createOrder, orderDetail } from "../Controllers/KlarnaController.js";

const router = express.Router();

// router.post("/create-order", createOrder);
// router.get("/order-detail", orderDetail);

export default router;