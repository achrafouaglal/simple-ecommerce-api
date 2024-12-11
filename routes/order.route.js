const Router = require("express").Router();
const orderController = require("../controllers/order.controller");


Router.get("/order",orderController.getOrder)
Router.get("/order-list",orderController.getOrderList)
Router.get("/order/:id",orderController.getOrderById)
Router.post("/order", orderController.postOrder); 
Router.delete("/order/:id" , orderController.deleteOrder)

module.exports = Router;
