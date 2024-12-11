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
        res.status(200).json(product !== null ? product : {message:"Product not fount"})
    } catch (error) {
        res.status(400).json({error:error})
    }
}


exports.getProduct = async (req,res,next) => {
  try {
      let q = req.query;
      const product = await ProductModel.getProductByQuery(q)
      res.status(200).json(product)
  } catch (error) {
      res.status(500).json({message:"error while get product"})
  }
}


exports.deleteProduct = async (req,res,next) => {
  try {
    const id = req.params.id;
    const product = await ProductModel.getProductById(id);

    if(!product) {
      return res.status(404).json({message:"product not found"})
    }
    if(product.images.length !== 0){
      const imagesPublicId = []
      for (let image of product.images){
        let publicId = image.split("/").pop().split(".")[0]
        imagesPublicId.push(`products/${publicId}`)
      }
      console.log(imagesPublicId)
      try {
        const result = await cloudinary.api.delete_resources(imagesPublicId);
        console.log(result)
        if (result.result === 'ok') {
            console.log('Media deleted from Cloudinary.');
        } else {
            console.error('Media not found on Cloudinary.');
        }
      } catch (error) {
        console.error('Error deleting media from Cloudinary:', error);
        return res.status(500).json({ message: 'Failed to delete media from Cloudinary.', error });
      }


      try {
        await ProductModel.DeleteProduct(id);
        res.status(200).json({message:"product deleted successfully"})
      } catch (error) {
        console.error('Error deleting product from MongoDB:', error);
        res.status(500).json({ message: 'Failed to delete product from MongoDB.', error });
      }
    }else{
      try {
        await ProductModel.DeleteProduct(id);
        res.status(200).json({message:"product deleted successfully"})
      } catch (error) {
        console.error('Error deleting product from MongoDB:', error);
        res.status(500).json({ message: 'Failed to delete product from MongoDB.', error });
      }
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Failed to fetch product.', error });
  }
}

exports.changeProductData = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name, description, price, category, stock, imagesToRemove, status } = req.body;
    const imagesToAdd = req.files;

    const product = await ProductModel.getProductById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (imagesToRemove && Array.isArray(imagesToRemove) && imagesToRemove.length > 0) {
      const imagesPublicId = imagesToRemove.map(imageUrl => {
        const publicId = imageUrl.split("/").pop().split(".")[0];
        return `products/${publicId}`;
      });

      try {
        const result = await cloudinary.api.delete_resources(imagesPublicId);

        if (result.partial || result.deleted.length < imagesToRemove.length) {
          console.warn("Some images could not be deleted from Cloudinary.");
        }
        product.images = product.images.filter(image => !imagesToRemove.includes(image));
      } catch (error) {
        console.error("Error deleting images from Cloudinary:", error);
        return res.status(500).json({ message: "Failed to delete images from Cloudinary.", error });
      }
    }

    if (imagesToAdd && Array.isArray(imagesToAdd) && imagesToAdd.length > 0) {
      try {
        const uploadedImages = [];
        for (let image of imagesToAdd) {
          const uploadResponse = await cloudinary.uploader.upload(image.path, {
            resource_type: "image",
            public_id: `products/${Date.now()}`,
            transformation: [{ width: 800, crop: "scale", quality: "auto", fetch_format: "auto" }],
          });

          uploadedImages.push(uploadResponse.secure_url);
        }

        product.images = [...product.images, ...uploadedImages];
      } catch (error) {
        console.error("Error uploading new images to Cloudinary:", error);
        return res.status(500).json({ message: "Failed to upload new images to Cloudinary.", error });
      }
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (status) product.status = status;
    if (stock) {
      product.stock = stock;
      product.isActive = stock > 0;
    }

    const updatedProduct = await ProductModel.updateProduct(id, product);

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product.", error });
  }
};


exports.getProductList = async (req,res,next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { products, totalProducts } = await ProductModel.getProductsByPagination(page, limit);

    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      currentPage: page,
      totalPages,
      totalProducts,
      Products: products,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders.", error: error.message });
  }
}