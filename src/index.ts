// Module imports
import express from "express";
import http from "http";
import mongoose from "mongoose";
import helmet from "helmet";
import dotenv from 'dotenv';
import cors from "cors";
// Packages
import { logger } from "./functions/logger";
import authenication_router from "./routes/authenication";
import brand_router from "./routes/brand";

/**
 * TODO - LOCK CORS APP LINK TO THE DOMAIN OF THE FRONTEND
 */

// Global project configurations
dotenv.config();

// Defining constants
const PORT = process.env.PORT || process.env.server_port;
const express_app = express();
const server = http.createServer(express_app);
var whitelist = ['http://example1.com', 'http://example2.com']
var corsOptions = {
  origin: function (origin:any, callback:any) {

    return callback(null, true);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
 


// Configuring middlewares
express_app.use(express.json());
express_app.use(express.urlencoded({ extended : true }));
express_app.use(helmet());
express_app.use(cors(corsOptions))

// Routes
express_app.use('/authenication', authenication_router);
express_app.use('/brand', brand_router);

// Status check route
express_app.get('/status', function(_,  res){
    res
    .status(200)
    .send(`System is up`);
})

// 404 error
express_app.use(function(_, res){
    return res.status(404)
    .json({
        message:'Endpoint not available',
    })
})

// Starting the server
mongoose.connect(process.env.mongo_db_url as any)
.then(function(){
    server.listen(PORT, function(){
        logger.info(`Server started at ${new Date().toUTCString()}`);
        if(process.env.environment == "development"){
            console.log(`Server is up on port ${process.env.server_port}`)
        }
    })
})
.catch(function(error){
    logger.error(`Could not connect to the database: error - /n${error}`);
})