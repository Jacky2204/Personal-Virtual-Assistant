import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      requied: true,
    },
    email: {
      type: String,
      requied: true,
      unique: true,
    },
    password: {
      type: String,
      requied: true
    },
    assistantName: {
      type: String,
    },
    assistantImage: {
      type: String,
    },
    history: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
