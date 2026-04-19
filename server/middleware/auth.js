import User from "../models/User.js";
import jwt from "jsonwebtoken";
//middleware to protect routes.
export const protectRoutes = async (req,res, next) => {
    try {
        const token = req.headers.token;
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.userId).select("-password"); 
        
        if(!user) {
            return res.json({success:false, message: "Unauthorized access"});
        }
        
        req.user = user;
        next();

    } catch (error) {
       return res.json({success: false, message: "Unauthorized access"});
        console.log(error.message);
    }
}