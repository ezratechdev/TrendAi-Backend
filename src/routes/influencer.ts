import express,  { Request, Response, Router } from "express";
import verifyTokenMiddleWare from "../functions/authenicator";
import { logger } from "../functions/logger";

// constants
const influencer_router: Router = express.Router();

/**
 *  Submit campaign content (e.g., a link to a TikTok post).
*/

async function submitContentRouter(req:Request, res:Response){
    // 
}

/**
 * CREATE A CAMPAIGN
 */
influencer_router.post('/submit-content', [
    verifyTokenMiddleWare
], submitContentRouter);

/**
 * GET ALL CAMPAIGNS
*/
influencer_router.get('/submit-content', [
    verifyTokenMiddleWare
], submitContentRouter)



// 
export default influencer_router;