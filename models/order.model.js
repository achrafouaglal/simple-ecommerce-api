const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  wilaya: {
    type: String,
    required: true, 
  },
  wilayaId: {
    type: Number,
    required: true,
  },
  deliverType: {
    type: String,
    enum: ['bureau', 'domicile'],
    required: true,
  },
  deliveryPrice: {
    type: Number,
    required: true,
  },
  itemsPrice: {
    type: Number,
    required: true, 
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending','delivered', 'canceled'],
    default: 'pending',
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true, 
      },
      category: {
        type: String,
        required: true, 
      },
      size: {
        type: String,
      },
      color: {
        type: String,
      },
      productImage: [
        {
          type: String,
        },
      ],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now, 
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


const Order = mongoose.model("order", OrderSchema )


exports.getOrderByQuery = async (q) => {
    try {
        const orders = Object.keys(q).length === 0 
            ? await Order.find({}) 
            : await Order.find(q);

        return orders;
    } catch (error) {
        return error;
    }
};


exports.AddOrder = async (data) => {
    try {
      console.log(data.name)
      let newOrder = new Order({
        name: data.name,
        phone: data.phone,
        wilaya: data.wilaya,
        wilayaId: data.wilayaId,
        deliverType: data.deliverType,
        deliveryPrice: data.deliveryPrice,
        itemsPrice: data.itemsPrice,
        totalPrice: data.totalPrice,
        items: data.items, 
      });

      const savedOrder = await newOrder.save();

      return savedOrder;
    } catch (error) {
        return { error: error.message };
    }
};

exports.getOrderById = async (id) => {
    try {
      const order = await Order.findById(id);
      
      if (!order) {
        return Error("Order not found");
      }
  
      return order;
    } catch (error) {
      return { error: error.message };
    }
  };

  

exports.deleteOrder = async (id) => {
  try {
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      throw new Error("Order not found");
    }

    return { message: "Order deleted successfully" };
  } catch (error) {
    return { error: error.message };
  }
};

exports.getOrdersByPagination = async (page, limit) => {
  try {
    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .skip(skip)
      .limit(limit)
      .exec();

    const totalOrders = await Order.countDocuments();

    return { orders, totalOrders };
  } catch (error) {
    throw new Error("Error fetching orders with pagination");
  }
};