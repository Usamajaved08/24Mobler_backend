import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import { setupDatabase } from "./src/Configs/Database.js";
import { applyMiddlewares } from "./src/Configs/Middlewares.js";
// import "./src/Configs/PassportConfig.js"
import PassportConfig from "./src/Configs/PassportConfig.js"; // Import PassportConfig
import { fileURLToPath } from "url";
import Routes from "./src/Routes/Index.js";
import GoogleRoutes from "./src/Routes/GoogleRoutes.js";
import path from "path";
const app = express();

dotenv.config();
setupDatabase();
applyMiddlewares(app);
PassportConfig();
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
console.log(__dirname);
// app.use(express.static("uploads"));
app.use(passport.initialize());
app.use(passport.session());
app.use("/uploads", express.static(__dirname + "/Uploads"));
app.use("/api", Routes);
app.use("/auth", GoogleRoutes);
app.listen(process.env.PORT || 5000, () => {
  console.log(`app is listening to port: ${process.env.PORT}`);
});
export default app;
