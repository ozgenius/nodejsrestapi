const express = require("express");

const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
app.use(express.static('uploads'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const mongoose = require("mongoose");



//mongodb connect
mongoose.connect(
    "mongodb://nodejs-rest-api:nodejs-rest-api@nodejs-rest-api-shard-00-00-sf54v.mongodb.net:27017,nodejs-rest-api-shard-00-01-sf54v.mongodb.net:27017,nodejs-rest-api-shard-00-02-sf54v.mongodb.net:27017/test?ssl=true&replicaSet=nodejs-rest-api-shard-0&authSource=admin",
    {
      useMongoClient: true
    }
  ).then(
      (res)=>{
          console.log(res);
      }
  );
  mongoose.Promise = global.Promise;



//app middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });




const productRoutes=require("./api/routes/products");
const orderRoutes=require("./api/routes/orders");
const userRoutes=require("./api/routes/user");



app.use(morgan("dev"));


app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);



app.use((req,res,next)=>{
    const error=new Error("Not Found");
    error.status=404;
    next(error);
})

app.use((error, req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports=app;