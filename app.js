require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const userRoutes = require("./routes/user.js");
const dashboardRoutes = require("./routes/dashboard.js");

const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URL;
main()
 .then(() => {
    console.log("connected to database");
 })
 .catch((err) =>{
    console.log(err);
 })


async function main(){
    await mongoose.connect(MONGO_URL);
}

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname , "views"));
app.set("public", path.join(__dirname , "public"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.get("/", (req,res) =>{
    res.render("index");
})

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/user", dashboardRoutes);

app.listen(3001, ()=>{
    console.log("server is running on port 3001");
})