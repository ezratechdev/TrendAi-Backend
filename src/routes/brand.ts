import express,  { Request, Response, Router } from "express";
import brand_model from "../schemas/brand";
import verifyTokenMiddleWare from "../functions/authenicator";
import { logger } from "../functions/logger";


// constants
const brand_router: Router = express.Router();

/**
 *  Create a campaign
*/

async function createCampaign(req:Request, res:Response){
    if(!(req.body.name)){
        return res.status(200)
        .json({
            message:'All required fields were not passed',
        })
    }

    const { name } = req.body;

    // Create content
    const newCampaign = await brand_model.create({
        name,
        owner_id: req.body.user_token_data.id,
    });

    if(!newCampaign){
        logger.error(`Could not create a campaign for brand user with id ${req.body.user_token_data.id}`);
        return res.status(500)
        .json({
            message:'Server error. Could not create ',
        });
    }
    // send back campaign id
    return res.status(200)
    .json({
        message:'Campaign created',
        campaignID: newCampaign._id,
        newCampaign,
    })
}

brand_router.post('/create-campaign', [
    verifyTokenMiddleWare
], createCampaign);

/**
 * GET ALL CAMPAIGNS
*/

async function getCampaigns(req:Request, res:Response){

    if(!req.body.user_token_data.id){
        logger.error(`Could not create a campaign for brand user with id ${req.body.user_token_data.id}`);
        return res.status(500)
        .json({
            message:'Server error. Could not fetch campaign',
        });
    }

    // Get all campaigns
    const campaigns = await brand_model.find({
        owner_id: req.body.user_token_data.id,
    });

    // send back campaign id
    return res.status(200)
    .json({
        message:campaigns.length > 0 ? 'Campaigns fetched' : 'Could not get campaigns',
        campaigns,
        numberOfCampaigns: campaigns.length
    })
}

brand_router.get('/get-campaigns', [
    verifyTokenMiddleWare
], getCampaigns);


async function getCampaignInfluencers(req:Request, res:Response){

    if(!(req.body.user_token_data.id && req.body.campaignId)){
        logger.error(`Could not get for brand user with id ${req.body.user_token_data.id}`);
        return res.status(500)
        .json({
            message:'Server error. Could not fetch campaign',
        });
    }

    const { campaignId } = req.body;

    // Get campaign
    const campaign = await brand_model.findById(campaignId);

    if(!campaign){
        return res.status(400)
        .json({
            message:`Could not find campaign with id ${campaignId}`,
        });
    }

    // Check if owner id matches
    if(campaign?.owner_id == req.body.user_token_data.id){
        return res.status(404)
        .json({
            message:`You are not authorized to access this campaign`,
        });
    }

    // return influencers
    return res.status(200)
    .json({
        message: campaign.influencers.length > 0 ? 'Influencers found' : 'No influencers found for this campaign',
        influencers: campaign.influencers,
    })
}

brand_router.post('/get-influencers', [
    verifyTokenMiddleWare
], getCampaignInfluencers)


async function updateCampaignInfluencerStatus(req:Request, res:Response){

    if(!(req.body.user_token_data.id && req.body.campaignId && req.body.influencerId && req.body.status)){
        logger.error(`Could not get for brand user with id ${req.body.user_token_data.id}`);
        return res.status(500)
        .json({
            message:'Server error. Could not fetch campaign',
        });
    }

    const { campaignId, influencerId, status } = req.body;

    // 
    if(!(status == "Approve" || status == "Rejected")){
        logger.warn(`Suspicious attempt to update a campaign made from ${req.ip}`);
        return res.status(400)
        .json({
            message:'Invalid operation passed',
        })
    }

    // Get campaign
    const campaign = await brand_model.findById(campaignId);

    if(!campaign){
        return res.status(400)
        .json({
            message:`Could not find campaign with id ${campaignId}`,
        });
    }

    // Check if owner id matches
    if(campaign?.owner_id == req.body.user_token_data.id){
        return res.status(404)
        .json({
            message:`You are not authorized to access this campaign`,
        });
    }

    // update campaign
    const campaign_update = await brand_model.findByIdAndUpdate({
        _id:campaign._id,
        'influencers.influencer_id': influencerId,
    }, {
        $set: { 'influencers.$.submission.approved': status } 
    },{
       new:true, 
    });

    if(!campaign_update){
        return res.status(400)
        .json({
            message:'Could not update campaign',
        })
    }

    // return influencers
    return res.status(200)
    .json({
        message: `Influencer status marked as ${status}`,
    })
}

brand_router.post('/update-influencer', [
    verifyTokenMiddleWare
], updateCampaignInfluencerStatus)



// 
export default brand_router;