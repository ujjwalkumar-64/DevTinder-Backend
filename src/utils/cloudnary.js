import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    console.log(`Uploading image: ${localFilePath}`);
    if (!localFilePath) return null;

    
    const uniquePublicId = `image_${uuidv4()}`;  

   
    const uploadResponse = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'image',  
      public_id: uniquePublicId,  
    });


  
     
    const autoCropUrl = cloudinary.url(uploadResponse.public_id, {
      crop: 'auto',
      gravity: 'auto',
      width: 500,
      height: 500,
    });

    
    fs.unlinkSync(localFilePath);

    return   autoCropUrl;

  } catch (error) {
    console.error('Error while uploading image to Cloudinary:', error);

    
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

export { uploadOnCloudinary };
