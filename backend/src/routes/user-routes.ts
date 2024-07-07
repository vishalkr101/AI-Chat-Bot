import { Router } from "express";
import { getAllUsers, userSignUp, userLogin, verifyUser } from "../controllers/user-controllers.js";
import { signUpValidators, validate, loginValidators } from "../utils/validators.js";
import { verifyToken } from "../utils/token-manager.js";

const userRoutes = Router();

userRoutes.get("/",getAllUsers)
userRoutes.post("/signup", validate(signUpValidators) ,userSignUp)
userRoutes.post("/login", validate(loginValidators) ,userLogin)
userRoutes.get("/auth-status",verifyToken, verifyUser)

export default userRoutes;