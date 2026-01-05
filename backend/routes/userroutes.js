import express from "express";
import {
  askToAssistant,
  getCurrentUser,
  updateAssistant,
} from "./../controllers/userController.js";
import isAuth from "../middlewares/isauth.js";
import upload from "../middlewares/multer.js";

const userRoutes = express.Router();

userRoutes.get("/currentUser", isAuth, getCurrentUser);
userRoutes.post(
  "/update",
  isAuth,
  upload.single("assistantImage"),
  updateAssistant
);
userRoutes.post("/asktoassistant", isAuth, askToAssistant);

export default userRoutes;
