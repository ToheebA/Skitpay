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
    visibility: {
        type: String,
        enum: ['free', 'paid'],
        default: 'free'
    },
    price: {
        type: Number,
        default: 0,
        validate: {
            validator: function(value) {
                return this.visibility === 'paid' && value <= 0 ? false : true;
            },
            message: 'Please provide a price'

        }
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
    }
}, { timestamps: true });

module.exports = mongoose.model('Skit', SkitSchema);