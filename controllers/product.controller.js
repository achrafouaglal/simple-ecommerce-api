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

    if (!images || images.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }

    for (let image of images) {
        const uploadResponse = await cloudinary.uploader.upload(image.path,
            { 
            resource_type: 'image', 
            public_id: `products/${Date.now()}`,
            transformation: [
                { width: 800, crop: "scale", quality: "auto", fetch_format: "auto" }
            ]
            },
            (error, result) => {
            if (error) {
                console.log("Cloudinary Upload Error:", error); 
                return res.status(500).json({ error: "Image upload failed", details: error });
            }

            uploadedImages.push(result.secure_url);
            }
        );
    }    
    if (uploadedImages.length === images.length) {
      const data = {
        name,
        description,
        price,
        category,
        images: uploadedImages, 
        stock,
        isActive: stock > 0,
      };

      const savedProduct = await ProductModel.postProduct(data);

      res.status(201).json(savedProduct);
    } else {
      res.status(500).json({ error: "Some images failed to upload" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message }); 
  }
};


exports.getProductById = async (req,res,next) => {
    try {
        let id = req.params.id;
        const product = await ProductModel.getProductById(id);
        res.status(200).json(product)
    } catch (error) {
        res.status(400).json({error:error})
    }
}