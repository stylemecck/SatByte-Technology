import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

// Load from server/.env
import dotenv from 'dotenv';
dotenv.config({ path: '.env' }); // Assuming running from server root

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function uploadLogo() {
  try {
    const iconPath = path.resolve('../public/app-icon.png');
    if (!fs.existsSync(iconPath)) {
      console.error('Logo not found at:', iconPath);
      return;
    }

    console.log('Uploading logo to Cloudinary...');
    const result = await cloudinary.uploader.upload(iconPath, {
      folder: 'satbyte/branding',
      public_id: 'email_logo_v1',
      overwrite: true,
    });

    console.log('Logo Uploaded Successfully!');
    console.log('URL:', result.secure_url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
}

uploadLogo();
