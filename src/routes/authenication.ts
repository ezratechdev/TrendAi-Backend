import express,  { Request, Response, Router } from "express";
import UserModel from "../schemas/user";
import bcrypt from "bcrypt";
import { logger } from "../functions/logger";
import { signToken } from "../functions/jwt";


// constants
const authenication_router: Router = express.Router();
/**
 * SIGNUP ROUTE
 * 
 */

async function signuphandler(req:Request, res:Response){
    if(!(req.body.email && req.body.username && req.body.password && req.body.role)){
        return res.status(404).json({
            message:'All required fields were not passed',
        })
    }

    // 
    const { email , password , username, role } = req.body;

    // check if user is already registered
    const UserExists = await UserModel.findOne({
        $or:[
            { email },
            { username },
        ],
     });

     if(UserExists){
        return res.status(400)
        .json({
            message:'User with similar username or email already exists',
        })
     }

    //  Create user
    const hashedPassword = await bcrypt.hash(password , await bcrypt.genSalt(10));

    const newUser = await UserModel.create({
        email,
        username,
        password:hashedPassword,
        role: role == "influencer" ? "Influencer" : "Brand",
    });

    if(!newUser){
        logger.error(`Server authenication error - could not create a user - email: ${email}, username: ${username}`);
        return res.status(500)
        .json({
            message:'Server error. Could not create a new user',
        });
    }

    // Send back user token
    const token = signToken({
        id: newUser._id,
        operation:role == "influencer" ? 'influencer-signup' : 'brand-signup',
    });

    return res.status(200)
    .json({
        message:'User created',
        token,
        operation:role == "influencer" ? 'influencer-signup' : 'brand-signup',
    });
}
authenication_router.post("/signup", signuphandler);


/**
 * LOGIN ROUTE
 * 
 */

async function loginhandler(req:Request, res:Response){
    if(!((req.body.email || req.body.username) && req.body.password)){
        return res.status(404).json({
            message:'All required fields were not passed',
        })
    }

    // 
    const { email , password , username } = req.body;

    // check if user is already registered
    const UserExists = await UserModel.findOne({
        $or:[
            { email },
            { username },
        ],
     });

     if(!UserExists){
        return res.status(400)
        .json({
            message:'User with details passed does not exists',
        });
     }

    //  check for password
    const passwordsMatch = await bcrypt.compare(password, UserExists.password)
    if(!passwordsMatch){
        return res.status(400)
        .json({
            message:'Incorrect password',
        });
    }

    // Send back user token
    const token = signToken({
        id: UserExists._id,
        operation:UserExists.role == "Influencer" ? 'influencer-login' : 'brand-login',
    });

    return res.status(200)
    .json({
        message:'User LoggedIn',
        token,
        operation:UserExists.role == "Influencer" ? 'influencer-login' : 'brand-login',
    });
}

authenication_router.post('/login', loginhandler);

// 
export default authenication_router;