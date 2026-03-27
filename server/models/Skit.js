const mongoose = require('mongoose');

const SkitSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title']
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        maxlength: 500
    },
    videoUrl: {
        type: String,
        required: [true, 'Please provide a video url']
    },
    thumbnailUrl: {
        type: String,
        required: [true, 'Please provide a thumbnail url']
    },
    niche: {
        type: String,
        enum: ['comedy', 'skits', 'music', 'dance', 
'fashion', 'food', 'lifestyle', 'education',
'gaming', 'sports', 'news', 'travel'],
        required: [true, 'Please provide a niche']
    },
    visibility: {
        type: String,
        enum: ['free', 'paid'],
        default: 'free'
    },
    tags: [String],
    likes: [{ type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    viewCount: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CreatorProfile',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Skit', SkitSchema);