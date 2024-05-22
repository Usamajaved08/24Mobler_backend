import express from "express";
import { addNewReview } from "../Controllers/ReviewController.js";
import { IsAuthUser } from "../Utils/IsAuthUser.js";
const router = express.Router();

router.post("/add", IsAuthUser, addNewReview);

export default router;
