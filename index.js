const dotenv = require("dotenv");
const express = require("express");
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

dotenv.config("./.env")


const DB_URL = process.env.DB_URL;


app.use(cors())
app.use(express.json());


app.use("/", require("./routes/index.route"))
app.use("/",require("./routes/product.route"))
app.use("/",require("./routes/order.route"))


mongoose.connect(DB_URL)


app.listen(PORT , () => {
    console.log("server on PORT : " , PORT)
})