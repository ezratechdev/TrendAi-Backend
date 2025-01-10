// Module imports
import express from "express";
import http from "http";
import mongoose from "mongoose";
import helmet from "helmet";
import winston from "winston";
import dotenv from 'dotenv';

// Project configurations
dotenv.config();

// Defining constants
const PORT = process.env.PORT || process.env.server_port;
const express_app = express();
const server = http.createServer(express_app);
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });


// Configuring middlewares
express_app.use(express.json());
express_app.use(express.urlencoded({ extended : true }));
express_app.use(helmet());

// Status check route
express_app.get('/status', function(_,  res){
    res
    .status(200)
    .send(`System is up`);
})

// Starting the server
mongoose.connect(process.env.mongo_db_url as any)
.then(function(){
    server.listen(PORT, function(){
        // log thiss
        // Env 
        // Determine whether sserver is in production or not
        logger.info(`Server started at ${new Date().toUTCString()}`);
    })
})
.catch(function(error){
    logger.error(`Could not connect to the database: error - /n${error}`);
})