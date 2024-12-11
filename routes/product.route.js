const Router = require("express").Router();
const productController = require("../controllers/product.controller");
const multer = require("multer");

const upload = multer({ storage: multer.diskStorage({
    filename: function (req,file,cb){
        cb(null , file.originalname)
    }
}) });

Router.get("/product",productController.getProduct)
Router.get("/product/:id",productController.getProductById)
Router.get("/product-list",productController.getProductList)
Router.post("/product", upload.array("images"), productController.postProduct); 
Router.delete("/product/:id" , productController.deleteProduct)
Router.put("/product/:id", upload.array("images"), productController.changeProductData)

module.exports = Router;
