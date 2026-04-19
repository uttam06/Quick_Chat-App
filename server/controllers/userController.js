import generateToken from "../lib/utils.js";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
export const signup = async (req, res) => {
    const {fullName, email, password, bio} = req.body;
    try {
        if(!fullName || !email || !password) {
            return res.json({success: false, message: "Please fill all the fields"});
        }  
        const user = await User.findOne({email});
        
        if(user) {
            return res.json({success: false, message: "User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hasedPassword = await bcrypt.hash(password, salt);
        
        const newUser = await User.create ({
            fullName, password: hasedPassword, email, bio
        });
        
        const token = generateToken(newUser._id);
        
        res.json({success: true, userData: newUser, message: "User created successfully", token});

    } catch (error) {
        console.log(error.message);
       return res.json({success: false, message: error.message}); 
    }
}

//login controller
export const login = async (req,res) => {
    try {
        const {email, password} = req.body;
        const userData = await User.findOne({email});
        
        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        
        if(!isPasswordCorrect) {
            return res.json({success: false, message: "Invalid credentials"});

        }
        
        const token = generateToken(userData._id);
        
        res.json({success: true, userData, message: "Login successful", token});
        
    } catch (error) {
        console.log(error.message);
       res.json({success: false, message: error.message}); 
    }
}

//get user data controller
export const checkAuth = (req, res) => {
    res.json({success: true, userData: req.user, message: "User authenticated"});
}

//update user data controller
export const updateProfile = async (req, res) => {
    try {
        const {profilePic, fullName, bio} = req.body;
        const userId = req.user._id;
        let updatedUser ;  
        if(!profilePic) {
        updatedUser = await User.findByIdAndUpdate(userId, {fullName, bio},{new: true});
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);
            
            updatedUser = await User.findByIdAndUpdate(userId, {profilePic: upload.secure_url, bio, fullName},{new: true});
        }
        res.json({success: true, user: updatedUser, message: "Profile updated successfully"});
     } catch (error) {
       res.json({success: false, message: error.message});
    }
}