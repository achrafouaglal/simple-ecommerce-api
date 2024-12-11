const OrderModel = require("../models/order.model"); 

exports.getOrder = async (req, res, next) => {
    try {
        const q = req.query; 
        const orders = await OrderModel.getOrderByQuery(q);

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders", error });
    }
};


exports.postOrder = async (req, res, next) => {
  try {
    const { name, phone, wilaya, wilayaId, deliverType, deliveryPrice, itemsPrice, totalPrice, items } = req.body;

    if (!name || !phone || !wilaya || !wilayaId || !deliverType || !deliveryPrice || !itemsPrice || !totalPrice || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    const newOrder = {
      name,
      phone,
      wilaya,
      wilayaId,
      deliverType,
      deliveryPrice,
      itemsPrice,
      totalPrice,
      items, 
    };

    const savedOrder = await OrderModel.AddOrder(newOrder); 

    res.status(201).json({ message: "Order created successfully", order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error while creating order", error });
  }
};


exports.getOrderList = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { orders, totalOrders } = await OrderModel.getOrdersByPagination(page, limit);

    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({
      currentPage: page,
      totalPages,
      totalOrders,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders.", error: error.message });
  }
};



exports.getOrderById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const order = await OrderModel.getOrderById(id); 

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Error while fetching order", error });
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const id = req.params.id;
    const order = await OrderModel.getOrderById(id); 

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await OrderModel.deleteOrder(id);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Error while deleting order", error });
  }
};
