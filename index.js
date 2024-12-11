const dotenv = require("dotenv");
const express = require("express");
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const path = require("path")
const cors = require("cors");
const app = express();

dotenv.config("./.env")


const DB_URL = process.env.DB_URL;


app.use(cors())
app.use(express.json());

app.set("view engine","ejs")
app.set("views", path.join(__dirname , "views"))

app.use("/", require("./routes/index.route"))
app.get("/add",(req,res) => {
    res.render("index")
})
app.use("/api",require("./routes/product.route"))

mongoose.connect(DB_URL)


app.listen(PORT , () => {
    console.log("server on PORT : " , PORT)
})