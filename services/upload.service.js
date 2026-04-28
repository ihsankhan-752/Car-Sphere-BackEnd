import cloudinary from "../config/cloudinary.config.js";
import { Readable } from "stream";

export const uploadToCloudinary = (fileBuffer, folder = "car-listings") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "image",
        transformation: [
          { width: 1000, height: 750, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      },
    );

    const bufferStream = Readable.from(fileBuffer);
    bufferStream.pipe(uploadStream);
  });
};

export const uploadMultipleToCloudinary = async (
  files,
  folder = "car-listings",
) => {
  const uploadPromises = files.map((file) =>
    uploadToCloudinary(file.buffer, folder),
  );

  const imageUrls = await Promise.all(uploadPromises);

  return imageUrls;
};
