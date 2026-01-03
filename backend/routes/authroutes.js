import express from "express";
import { logIn, logout, signUp } from "../controllers/authController.js";

const authRoutes = express.Router();

authRoutes.post("/signup", signUp);
authRoutes.post("/login", logIn);
authRoutes.get("/logout", logout);

export default authRoutes; 
 