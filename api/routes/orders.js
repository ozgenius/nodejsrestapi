const express=require("express");

const router = express.Router();


const mongoose = require("mongoose");
const Order = require("../models/m_order");




//orders istegini karşılıyor.  tüm saparişler
router.get("/", (req, res, next)=>{
    Order.find()
    .select("product quantity _id")
    .populate("product", "name price _id")
    .exec()
    .then(results=>{
        res.status(200).json(
         {
            count: results.length,
            orders: results.map((result)=>{
                return {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity,
                    requests: {
                        type: "GET",
                        url: "http://localhost:1453/orders/"+result._id
                    }
                }
            }
              
            )
         }
        )
    })
    .catch(err=>{
        res.status(500).json(err.message);
    })
})


//yeni siparis
router.post("/",(req, res, next)=>{
    const order = new Order ({
        _id: new mongoose.Types.ObjectId,
         product: req.body.productId,
         quantity: req.body.quantity
    })
    order.save()
    .then(result=>{
        console.log(result);
        res.status(201).json({
            order: result,
            requests: {
                type: "GET",
                url: "http://localhost:1453/orders"+result._id
            }
        });
    })
    .catch(err=>{
        res.status(500).json({
            message: err.message
        })
    })
})



//sipariş detayı
router.get("/:orderId",(req,res,next)=>{
    const id = req.params.orderId;
    Order.findById(id)
    .select("product quantity _id")
    .populate("product", "name price _id")
    .exec()
    .then(result=>{
        res.status(200).json({
            order: result,
            requests: {
                type: "GET",
                url: "http://localhost:1453/orders/"+id
            }
        })
    })
    .catch(err=>{
        res.status(500).json({
            message: err.message
        })
    })
})

//router.patch();

router.delete("/:orderId",(req,res,next)=>{
    const id = req.params.orderId;
    Order.remove({_id:id}).exec()
    .then(result=>{
        res.status(200).json({
            message: id+"siparişi silindi",
            requests: {
                type: "GET",
                url: "http://localhost:1453/orders"
            }
        })
    })
    .catch(err=>{
        res.status(500).json({
            message: err.message
        })
    })
})


module.exports=router;