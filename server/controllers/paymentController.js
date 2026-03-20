const User = require('../models/User');
const Creator_Profile = require('../models/Creator_Profile');
const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError } = require('../errors');

const initializePayment = async (req, res) => {
    const {
        user: { userId }
    } = req;

    const { creatorProfileId } = req.params;

    const creatorProfile = await Creator_Profile.findOne({
        _id: creatorProfileId,
        isActive: true
    })

    if (!creatorProfile) {
        throw new NotFoundError(`No active creator profile found with id ${creatorProfileId}`);
    }

    const subscriptionPrice = creatorProfile.subscriptionPrice;

    const fan = await User.findById(userId);

    if (!fan) {
        throw new NotFoundError(`No user found with id ${userId}`);
    }

    const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
            email: fan.email,
            amount: subscriptionPrice * 100,
            callback_url: process.env.PAYSTACK_CALLBACK_URL,
            metadata: {
                userId: userId,
                creatorProfileId: creatorProfileId
            }
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    )

    res.status(StatusCodes.OK).json({
        authorizationUrl: response.data.data.authorization_url,
        reference: response.data.data.reference
    })
}

const verifyPayment = async (req, res) => {
    res.status(StatusCodes.OK).json({ msg: 'Payment verified successfully' });
}

module.exports = {
    initializePayment,
    verifyPayment,
}