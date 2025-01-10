import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./jwt";

export default function verifyTokenMiddleWare(req:Request, res:Response, next:NextFunction){
    if(!(req.headers && req.headers.authorization && req.headers.authorization.includes('Bearer'))){
        throw new Error(`Authorization token not found`);
    }
    const token = req.headers.authorization.split(" ")[1];
    if(!token) throw new Error(`Token not passed`);
    const tokenData:any = verifyToken(token);

    if(`${tokenData.operation}`.includes('signup') || `${tokenData.operation}`.includes('login')){
        req.body.user_token_data = tokenData;
        next();
    } else throw new Error(`User is not properly authenicated`);
}