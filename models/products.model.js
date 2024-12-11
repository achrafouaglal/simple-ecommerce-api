const mongoose = require("mongoose")

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
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
    },
    images: [{
        type: String, 
        required: true,
    }],
    stock: {
        type: Number,
        default: 0, 
        min: [0, 'Stock cannot be negative'],
    },
    status:{
        type:String,
        default:"hero"
    },
    isActive: {
        type: Boolean,
        default: true, 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
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
      status:data.status,
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

exports.getProductByQuery = async (q) => {
    try {
        const product = Object.keys(q).length === 0 
            ? await Product.find({}) 
            : await Product.find(q);

        return product;
    } catch (error) {
        return error;
    }
}

exports.DeleteProduct = async(id) => {
    try {
        const product = await Product.deleteOne({_id:id})
        return product;
    } catch (error) {
        return error;
    }
}

exports.updateProduct = async (id,product) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {$set:product},
            {new:true}
        )
        return updatedProduct;
    }catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
}

exports.getProductsByPagination = async (page, limit) => {
    try {
      const skip = (page - 1) * limit;
  
      const products = await Product.find()
        .skip(skip)
        .limit(limit)
        .exec();
  
      const totalProducts = await Product.countDocuments();
  
      return { products, totalProducts };
    } catch (error) {
      throw new Error("Error fetching orders with pagination");
    }
  };