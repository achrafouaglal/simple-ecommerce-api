const mongoose = require("mongoose")

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, // Removes leading/trailing spaces
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative'],
    },
    category: {
        type: String,
        required: true,
        enum: ['Clothing', 'Accessories', 'Footwear', 'Others'], // Can add more categories as needed
    },
    images: [{
        type: String, // URL of the image (you can store Cloudinary URLs or others)
        required: true,
    }],
    stock: {
        type: Number,
        default: 0, // Default to 0 if not specified
        min: [0, 'Stock cannot be negative'],
    },
    isActive: {
        type: Boolean,
        default: true, // Product can be active or inactive (out of stock, discontinued, etc.)
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the creation date
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Automatically set the update date
    },
    },
    { timestamps: true }
)

const Product = mongoose.model("product", ProductSchema )


exports.postProduct = async (data) => {
  try {
    let newProduct = new Product({
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      images: data.images,
      stock: data.stock,
      isActive: data.isActive,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    const savedProduct = await newProduct.save();

    return savedProduct;
  } catch (error) {
    return { error: error.message };
  }
};

exports.getProductById = async (id) => {
    try {
        const product = await Product.findById(id)
        return product;
    } catch (error) {
        return error;
    }
}

exports.getProductByStatus = async (status) => {
    try {
        
        const product = status == null ?  await Product.find({}): await Product.find({status:status});
        return product;
    } catch (error) {
        return error;
    }
}