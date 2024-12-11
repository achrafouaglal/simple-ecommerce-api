const Router = require("express").Router();
const productController = require("../controllers/product.controller");
const multer = require("multer");

const upload = multer({ storage: multer.diskStorage({
    filename: function (req,file,cb){
        cb(null , file.originalname)
    }
}) });

Router.get("/api/product",productController.getProduct)
Router.get("/api/product/:id",productController.getProductById)
Router.get("/api/product-list",productController.getProductList)
Router.post("/api/product", upload.array("images"), productController.postProduct); 
Router.delete("/api/product/:id" , productController.deleteProduct)
Router.put("/api/product/:id", upload.array("images"), productController.changeProductData)

module.exports = Router;
