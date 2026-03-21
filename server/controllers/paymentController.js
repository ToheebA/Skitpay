const User = require('../models/User');
const Creator_Profile = require('../models/Creator_Profile');
const Subscription = require('../models/Subscription');
const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors');

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
    const { reference } = req.params;

    const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    )

    if (response.data.data.status !== 'success') {
        throw new BadRequestError('Payment verification failed');
    }
    const existingSubscription = await Subscription.findOne({
        fan: response.data.data.metadata.userId,
        creator: response.data.data.metadata.creatorProfileId,
        status: 'active'
    });
    if (existingSubscription) {
        throw new BadRequestError('You are already subscribed to this creator');
    }
        const startDate = new Date();
        const endDate = new Date();
        const creatorProfile = await Creator_Profile.findById(
            response.data.data.metadata.creatorProfileId
        );
        if (!creatorProfile) {
            throw new NotFoundError(`No creator profile found with id ${response.data.data.metadata.creatorProfileId}`);
        }
        const { userId } = response.data.data.metadata;
        const subscription = await Subscription.create({
        fan: userId,
        creator: creatorProfile.user,
        amount: response.data.data.amount / 100,
        status: 'active',
        startDate: startDate,
        endDate: endDate.setDate(endDate.getDate() + 30)
    })
    res.status(StatusCodes.OK).json({ msg: 'Payment verified successfully', subscription });
}

module.exports = {
    initializePayment,
    verifyPayment,
}