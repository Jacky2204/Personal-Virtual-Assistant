import express from "express";
import { logIn, logout, signUp } from "../controllers/authcontroller.js";

const authRoutes = express.Router();

authRoutes.post("/signup", signUp);
authRoutes.post("/login", logIn);
authRoutes.get("/logout", logout);

export default authRoutes; 
 