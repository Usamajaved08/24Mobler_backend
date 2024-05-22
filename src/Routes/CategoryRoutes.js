import express from "express";
import { addNewCategory } from "../Controllers/CategoryController.js"
import { IsAuthUser } from "../Utils/IsAuthUser.js";
const router = express.Router();

router.post("/add", IsAuthUser, addNewCategory);

export default router;
