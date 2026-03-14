const mongoose = require('mongoose');

const CreatorProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    bio: {
        type: String,
        required: [true, 'Please provide a bio'],
        maxlength: 150
    },
    niche: {
        type: String,
        enum: ['comedy', 'skits', 'music', 'dance', 
'fashion', 'food', 'lifestyle', 'education',
'gaming', 'sports', 'news', 'travel'],
        required: [true, 'Please provide a niche']
    },
    socialLinks: {
        instagram: String,
        tiktok: String,
        facebook: String,
        snapchat: String,
    },
    subscriptionPrice: {
        type: Number,
        default: 0,
    }
}, {timestamps: true});

module.exports = mongoose.model('CreatorProfile', CreatorProfileSchema);