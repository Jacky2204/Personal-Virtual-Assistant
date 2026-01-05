import User from "../models/userModel.js";
import uploadOnCloudinary from "./../config/cloudinary.js";
import geminiResponse from "./../gemini.js";
import { json, response } from "express";
import moment from "moment/moment.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User Found Successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "get current user error",
    });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const userId = req.userId;
    const { assistantName, imageUrl } = req.body;

    let assistantImage;

    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { assistantName, assistantImage },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "User Updated Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "user update error",
    });
  }
};

export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    const user = await User.findById(req.userId);
    const userName = user.name;
    const assistantName = user.assistantName;
    user.history.push(command);
    user.save();

    const result = await geminiResponse(command, assistantName, userName);

    const jsonMatch = result.match(/{[\s\S]*}/);

    if (!jsonMatch) {
      return res
        .status(400)
        .json({ success: false, response: "Sorry, I can't understand" });
    }

    const gemResult = JSON.parse(jsonMatch[0]);
    const type = gemResult.type;

    switch (type) {
      /* ------------------ TIME & DATE ------------------ */
      case "get-date":
        return res.status(200).json({
          success: true,
          type,
          userInput: gemResult.userInput,
          response: `Today's date is ${moment().format("YYYY-MM-DD")}`,
        });

      case "get-time":
        return res.status(200).json({
          success: true,
          type,
          userInput: gemResult.userInput,
          response: `Current time is ${moment().format("hh:mm A")}`,
        });

      case "get-day":
        return res.status(200).json({
          success: true,
          type,
          userInput: gemResult.userInput,
          response: `Today is ${moment().format("dddd")}`,
        });

      case "get-month":
        return res.status(200).json({
          success: true,
          type,
          userInput: gemResult.userInput,
          response: `Current month is ${moment().format("MMMM")}`,
        });

      /* ------------------ SEARCH & GENERAL ------------------ */
      case "general":
      case "google-search":
      case "youtube-search":
      case "youtube-play":
      case "play-song":
      case "weather-show":

      /* ------------------ OPEN WEBSITES / APPS ------------------ */
      case "open-google":
      case "open-youtube":
      case "open-instagram":
      case "open-facebook":
      case "open-twitter":
      case "open-linkedin":
      case "open-github":
      case "open-reddit":
      case "open-naukri":
      case "open-unstop":
      case "open-amazon":
      case "open-flipkart":
      case "open-snapdeal":
      case "open-netflix":
      case "open-spotify":
      case "open-wikipedia":
      case "open-quora":
      case "open-medium":
      case "open-swiggy":
      case "open-zomato":
      case "open-whatsapp":
      case "open-whatsapp-chat":
      case "open-telegram":
      case "calculator-open":
        return res.status(200).json({
          success: true,
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });

      /* ------------------ FALLBACK ------------------ */
      default:
        return res.status(400).json({
          success: false,
          type: "unknown",
          response: "Sorry, I didn't understand that command.",
        });
    }
  } catch (error) {
    /* -------- GEMINI RATE LIMIT (429) -------- */
    if (error.response?.status === 429) {
      return res.status(200).json({
        success: true, // important: frontend continues flow
        type: "general",
        userInput: req.body.command,
        response: "I'm a bit busy right now. Please try again in a moment.",
      });
    }

    /* -------- OTHER SERVER ERRORS -------- */
    return res.status(500).json({
      success: false,
      response: "Ask assistant error",
    });
  }
};
