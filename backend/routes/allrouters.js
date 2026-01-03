import express from "express";
import authRoutes from "./authroutes.js";
import userRoutes from "./userroutes.js";

const AllRouter = express.Router();

AllRouter.use("/auth", authRoutes);
AllRouter.use("/user", userRoutes);

export default AllRouter;
