import genToken from "../config/token.js";
import User from "../models/usermodel.js";
import bcrypt from "bcrypt";

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existemail = await User.findOne({ email });
    if (existemail) {
      return res.status(400).json({ message: "Email is already exist." });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be 8 Characters." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = await genToken(user._id);
    // console.log(token)

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: false,
    });

    return res.status(201).json({
      success: true,
      message: "Sign Up Successfully",
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Sign Up error ${error}`,
    });
  }
};

export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email does not exist." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch == false) {
      return res.status(400).json({ message: "Incorrect Password." });
    }

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: false,
    });

    return res.status(200).json({
      success: true,
      message: "Log In Successfully",
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Log In error ${error}`,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "Logout Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Logout error ${error}`,
    });
  }
};
