const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    fan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: () => {
            const date = new Date()
            date.setDate(date.getDate() + 30)
            return date
        }
    },
    status: {
        type: String,
        enum: ['active', 'cancelled'],
        default: 'active'
    },
    amount: {
        type: Number,
        required: [true, 'Please provide an amount'],
        min: 0
    }
}, { timestamps: true });

SubscriptionSchema.index(
    { fan: 1, creator: 1 }, 
    { unique: true }
)

module.exports = mongoose.model('Subscription', SubscriptionSchema);