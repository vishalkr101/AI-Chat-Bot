import { NextFunction, Request, Response } from "express";
import { ValidationChain, body, validationResult } from "express-validator";

export const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        for( let validation  of validations){
            const error = await validation.run(req);
            if(!error.isEmpty()) 
                break;
        }
        const errors = validationResult(req);
        if(errors.isEmpty()){
            return next()
        }
        return res.status(422).json({errors: errors.array()})
    }
}

export const loginValidators = [
    body("email").trim().isEmail().withMessage("Email is not correct"),
    body("password").trim().isLength({min: 6, max: 20}).withMessage("Password should be more than 6 characters")
]

export const signUpValidators = [
    body("name").notEmpty().withMessage("Name is Required"),
    ...loginValidators
]

export const chatCompletionValidator = [
    body("message").notEmpty().withMessage("message is Required"),
]