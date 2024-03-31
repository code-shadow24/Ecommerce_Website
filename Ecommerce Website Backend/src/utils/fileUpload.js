import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET_KEY 
});

const fileUpload = async (localStoragePath)=>{

  try {
    if(!localStoragePath) return null;
    const response = await cloudinary.uploader.upload(localStoragePath, {
      resource_type : "auto"
    });
    fs.unlinkSync(localStoragePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localStoragePath);
    return null;

  }



}



export {fileUpload}