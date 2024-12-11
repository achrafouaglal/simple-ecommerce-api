const Router = require("express").Router();
const productController = require("../controllers/product.controller");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const BodyParser = require("body-parser");

Router.post("/product", upload.array("images"), BodyParser.urlencoded({ extended: true }), productController.postProduct);

module.exports = Router;
