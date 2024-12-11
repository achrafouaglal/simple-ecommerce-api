const cloudinary = require("cloudinary").v2;
const ProductModel = require('../models/products.model');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


exports.postProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const images = req.files; 

    const uploadedImages = [];
    for (let image of images) {
      const uploadResponse = await cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          transformation: [
            { width: 800, crop: "scale", quality: "auto", fetch_format: "auto" }
          ],
        },
        (error, result) => {
          if (error) {
            return res.status(500).json({ error: "Image upload failed", details: error });
          }

          uploadedImages.push(result.secure_url);
        }
      );

      image.stream().pipe(uploadResponse);
    }

    const data ={
      name,
      description,
      price,
      category,
      images: uploadedImages, 
      stock,
      isActive:stock > 0,
    };

    const savedProduct = await ProductModel.postProduct(data);

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
