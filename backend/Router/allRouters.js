import express from "express";
import authRoutes from "../routes/authRoutes.js";
import userRoutes from "../routes/userroutes.js";

const AllRouter = express.Router();

AllRouter.use("/auth", authRoutes);
AllRouter.use("/user", userRoutes);

export default AllRouter;
