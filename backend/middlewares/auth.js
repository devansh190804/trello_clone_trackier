const jwt = require('jsonwebtoken');
const User = require('../models/user');
require("dotenv").config();

exports.auth = async(req, res, next) => {
    try{
        const token = req.headers['authorization'].split(' ')[1];

        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token not available"
            })
        }

        //verify token
        try{
           const decode = await jwt.verify(token, process.env.JWT_SECRET);
           const user = await User.findById(decode.id).select('-password')
           req.user = decode;
        }catch(error){
                  // verification isssue 
                  return res.status(403).json({
                    success:false,
                    message:"Invalid Token"
                });
        }
        next();
    }catch(error){
        console.log("Error occurred while Authentication is : " , error);
        return res.status(500).json({
            success:false,
            message:"Access Failed: Unauthorized"
        });
    }
}
