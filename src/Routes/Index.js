import express from "express";
import UserRoutes from "./UserRoutes.js";
import ProductRoutes from "./ProductRoutes.js";
import ReviewRoutes from "./ReviewRoutes.js";
import CategoryRoutes from "./CategoryRoutes.js";
import OrderRoutes from "./OrderRoutes.js";
import KlarnaRoutes from "./KlarnaRoutes.js";

// import GoogleRoutes from "./GoogleRoutes.js"
// import FacebookRoutes from "./FacebookRoutes.js"

const router = express.Router();

router.use("/user", UserRoutes);
// router.use("/auth", GoogleRoutes);
// router.use("/auth", FacebookRoutes);
router.use("/product", ProductRoutes);
router.use("/order", OrderRoutes);
router.use("/category", CategoryRoutes);
router.use("/review", ReviewRoutes);
router.use("/klarna", KlarnaRoutes);

export default router;
