const Router = require("express").Router();
const productController = require("../controllers/product.controller");
const multer = require("multer");

// Set up Multer to store files in memory
const upload = multer({ storage: multer.diskStorage({
    filename: function (req,file,cb){
        cb(null , file.originalname)
    }
}) });


Router.post("/product/add", upload.array("images"), productController.postProduct); // Uploading multiple images

module.exports = Router;
