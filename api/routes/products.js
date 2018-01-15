const express=require("express");

const router = express.Router();

const mongoose = require("mongoose");
const Product = require("../models/m_product");

const multer = require("multer");

const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
          cb(null, "uploads/");
    },
    filename : (req,file,cb)=>{
        cb(null, new Date().toISOString()+file.originalname);
    }
})

const limits = {
    fileSize: 1024 * 1024 * 5
}

const fileFilter= (req,file,cb)=>{
if(file.mimetype==="image/jpeg" || file.mimetype==="image/png" || file.mimetype ==="jpg"){
    cb(null,true);
}else{
    cb(null,false);
}
}

const upload = multer({
    storage:storage,
    limits: limits,
    fileFilter:fileFilter
})

router.get("/", (req, res, next)=>{
    Product.find()
    .select("name price _id productImage")
    .exec()
    .then(
        (result)=>{
            console.log(result);
            res.status(200).json(result)
        }
    )
    .catch(
        (err)=>{
            console.log(err);
            res.status(500).json({
                message: err.message
            })
        }
    )
})

router.post("/", upload.single("productImage"),(req,res,next)=>{
    const product = new Product({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })
    product.save().then(
        (result)=>{
            console.log(result)
            res.status(201).json({
                message:"yeni urun eklendi",
                newproduct:result
            })
        })
            .catch(
                (err)=>{
                res.status(500).json({
                    message:"hata oluştu",
                    error: err
                })
            }
            );
    res.status(201).json({
        message:"request post for products",
        product: product
    })
})

router.get("/:productId",(req,res,next)=>{
    const id=req.params.productId;
    Product.findById(id).exec().then(
        (doc)=>{
            console.log(doc);
            if(doc){
                res.status(200).json(doc);
            }else {
                res.status(404).json({
                    message: "geçerli bir id girmelisiniz"
                })
            }
           
        }
    ).catch(
        (err)=>{
            res.status(500).json({error: err});
            console.log(err);
        }
    )
})  


router.patch("/:productId",(req,res,next)=>{
    const id = req.params.productId;
    const updateObj={};
    //veri { "name": "x", "value": "25"} şeklinde gönderilmelidir
    for(const obj of req.body){
        updateObj[obj.name]=obj.value   
    }

    Product.update({_id: id}, {$set:updateObj}).exec()
    .then(
        (result)=>{
            res.status(200).json(result);
        }
    )
    .catch(
        (err)=>{
            res.status(500).json({
                message: err.message
            })
        }
    )
})

router.delete("/:productId",(req,res,next)=>{
    const id = req.params.productId;
    Product.remove({_id:id}).exec()
    .then(
        (result)=>{
            res.status(200).json(result);
        }
    )
    .catch(
        (err)=>{
            res.status(500).json({
                message: err.message
            })
        }
    )
})

module.exports=router;