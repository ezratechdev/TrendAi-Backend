// Module imports
import express from "express";
import http from "http";
import mongoose from "mongoose";
import helmet from "helmet";
import dotenv from 'dotenv';

// Packages
import { logger } from "./functions/logger";
import authenication_router from "./routes/authenication";

// Project configurations
dotenv.config();

// Defining constants
const PORT = process.env.PORT || process.env.server_port;
const express_app = express();
const server = http.createServer(express_app);



// Configuring middlewares
express_app.use(express.json());
express_app.use(express.urlencoded({ extended : true }));
express_app.use(helmet());

// Routes
express_app.use('/authenication', authenication_router)

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