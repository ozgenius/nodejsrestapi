const express=require("express");

const router = express.Router();
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const User = require("../models/m_user");



router.post("/signup",(req,res,next)=>{
        User.find({email: req.body.email}).exec()
        .then(users=>{
             if(users.length > 0){
                return res.status(res.statusCode).json({
                    message: "Bu kullanıcı daha önce kayıt yapılmıs."
                })
             } else {
                bcrypt.hash(req.body.password, 10, (err,hash)=>{
                    if(err){
                        return res.status(500).json({
                            message: err.message,
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId,
                            email: req.body.email,
                            password: hash
                        })
                        user.save()
                        .then(result=>{
                            res.status(201).json({
                                message: "user olusturuldu",
                                user: result
                            })
                        })
                        .catch(err=>{
                            res.status(500).json({
                                message: err.message
                            })
                        })
                    }
                })
             }
        })
        .catch(err=>{
            res.status(res.statusCode).json({
                message : err.message
            })
        })
})

router.post("/login", (req,res,next)=>{
    User.find({email:req.body.email}).exec()
    .then(user=>{
        if(user.length < 1){
            return res.status(401).json({
                message: "Böyle bir kullanıcı yok"
            })
        } 
            bcrypt.compare(req.body.password, user[0].password,(err,result)=>{
                if(err){
                    return res.status(401).json({
                        message: "email ya da şifre hatalı"
                    })
                }
                if(result){
                    const token=jwt.sign({
                        email:user[0].email,
                        userId:user[0]._id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                    );
                    return res.status(200).json({
                        message: "Giriş başarılı",
                        token: token
                    })
                }
                res.status(401).json({
                    message: "Auth failed"
                  });
            })
        
    })
    .catch(err=>{
        res.status(500).json({
            message:err.message
        })
    })
})




module.exports=router;