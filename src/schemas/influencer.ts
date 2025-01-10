import mongoose from "mongoose";

const schema = new mongoose.Schema({
    campaign_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true,
    },
    influencer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    approved: {
        type: Boolean,
        default: false,
    },
    media: {
        platform: {
            type: String,
            enum: ['TikTok', 'YouTube', 'Instagram'],
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        metadata: {
            title: { type: String },
            duration: { type: Number },
        },
    },
    likes: {
        type: Number,
        default: 0
    },
    metrics: {
        shares: {
            type: Number,
            default: 0
        },
        comments: {
            type: Number,
            default: 0
        },
        views: {
            type: Number,
            default: 0
        },
    },
    submissionDate: {
        type: Date,
        default: Date.now
    },
}, { 
    timestamps: true,
});

const InfluencerModel = mongoose.model('Influencer') 