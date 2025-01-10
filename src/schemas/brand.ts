import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    influencers: [{
        influencer_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        submission: {
            media: {
                platform: {
                    type: String,
                    enum: ['TikTok', 'YouTube', 'Instagram'],
                },
                url: {
                    type: String,
                },
                metadata: {
                    title: { type: String },
                    duration: { type: Number },
                },
            },
            approved: {
                type: Boolean,
                default: false,
            },
            metrics: {
                likes: { type: Number, default: 0 },
                shares: { type: Number, default: 0 },
                comments: { type: Number, default: 0 },
                views: { type: Number, default: 0 },
            },
            submissionDate: {
                type: Date,
            },
        },
    }],
    status: {
        type: String,
        enum: ['Active', 'Completed', 'Pending','Rejected'],
        default: 'Pending',
    },
    deadline: {
        type: Date,
        required: false,
    },
}, { 
    timestamps: true,
});

const brand_model = mongoose.model('Brand', schema)
export default brand_model;
