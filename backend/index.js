import express from "express";
import dotenv from "dotenv";
import AllRouter from "./router/allrouters.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import geminiResponse from "./gemini.js";

dotenv.config();
const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
        // methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());
app.use(cookieParser());

// app.get("/", (req, res) => {
//   res.send("Hiii");
// });

app.use("/api", AllRouter);



connectDB();
const port = process.env.PORT || 2000;
app.listen(port, () => {
  console.log("Server is running on port: ", port);
});
