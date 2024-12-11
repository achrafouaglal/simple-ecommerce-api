const Router = require("express").Router();
const orderController = require("../controllers/order.controller");


Router.get("/api/order",orderController.getOrder)
Router.get("/api/order-list",orderController.getOrderList)
Router.get("/api/order/:id",orderController.getOrderById)
Router.post("/api/order", orderController.postOrder); 
Router.delete("/api/order/:id" , orderController.deleteOrder)

module.exports = Router;
