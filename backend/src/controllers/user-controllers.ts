import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";


export const getAllUsers = async (req: Request,res: Response,next: NextFunction) => {
    try{
        const users = await User.find({});
        return res.status(200).json({message:"OK", data: users});
    }catch(error){
        console.log(error)
        return res.status(500).json({message:"ERROR", cause: error.message});
    }
}

export const userSignUp = async (req: Request,res: Response,next: NextFunction) => {
    try{
        const { name, email, password } = req.body;
        const hashedPassword = await hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        //to generate token and send cookies

        res.clearCookie("auth_token", {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });

        const token = createToken(user._id.toString(), user.email, "7d");

        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie("auth_token",token,{
            path:"/",
            domain: "localhost",
            expires,
            httpOnly: true, 
            signed: true
        })

        return res.status(201).json({message:"OK", name: user.name, email: user.email});
    }catch(error){
        console.log(error)
        return res.status(500).json({message:"ERROR", cause: error.message});
    }
}

export const userLogin = async (req: Request,res: Response,next: NextFunction) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user){
            return res.status(401).send("User not Registered");
        }
        const isPasswordCorrect = await compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(403).send("Password is not correct");
        }

        res.clearCookie("auth_token", {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });

        const token = createToken(user._id.toString(), user.email, "7d");

        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie("auth_token",token,{
            path:"/",
            domain: "localhost",
            expires,
            httpOnly: true, 
            signed: true
        })

        return res.status(200).json({message: "OK", name: user.name, email: user.email});
        
    }catch(error){
        console.log(error)
        return res.status(500).json({message:"ERROR", cause: error.message});
    }
}


export const verifyUser = async (req: Request,res: Response,next: NextFunction) => {
    try{
        
        const user = await User.findById( res.locals.jwtData.id );
        if(!user){
            return res.status(401).send("User not Registered or token is invalid");
        }
        if(user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions Denied!");
        }

        return res.status(200).json({message: "OK", name: user.name, email: user.email});
        
    }catch(error){
        return res.status(500).json({message:"ERROR", cause: error.message});
    }
}