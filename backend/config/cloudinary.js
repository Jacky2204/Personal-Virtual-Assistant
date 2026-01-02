import { v2 as cloudinary } from "cloudinary";
import { error } from "console";
import fs from "fs";

const uploadOnCloudinary = async (filePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  try {
    if (!filePath) {
      console.log("could not file path");
    }

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto", //detect file type pdf,img,etc.
    });
    // delete original path of file
    fs.unlinkSync(filePath);

    return uploadResult.secure_url;
  } catch (error) {
    fs.unlinkSync(filePath);
    console.log("error",error);
  }
};

export default uploadOnCloudinary;
