import express from "express";
import dotenv from "dotenv";
import AllRouter from "./Router/allRouters.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import geminiResponse from "./gemini.js";

dotenv.config();
const app = express();

app.use(
    cors({
        origin: "https://personal-virtual-assistant.onrender.com",
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

<<<<<<< HEAD

=======
app.get("/",async(req,res)=>{
  let prompt=req.query.prompt
  let data=await geminiResponse(prompt)
  res.json(data)
})
>>>>>>> a7098b3 (second commit)

connectDB();
const port = process.env.PORT || 2000;
app.listen(port, () => {
  console.log("Server is running on port: ", port);
});
