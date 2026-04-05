const User = require('../models/User');
const Creator_Profile = require('../models/Creator_Profile');
const Subscription = require('../models/Subscription');
const axios = require('axios');
const crypto = require('crypto');
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
    
    res.status(StatusCodes.OK).json({ 
        msg: 'Payment verified successfully',
        status: response.data.data.status,
        amount: response.data.data.amount / 100,
        reference: response.data.data.reference
    });
}

const webhookHandler = async (req, res) => {
    const hash = crypto.
        createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
        .update(req.body)
        .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
        throw new BadRequestError('Invalid signature');
    }

    const event = JSON.parse(req.body)

    if (event.event !== 'charge.success') {
        return res.status(StatusCodes.OK).send();
    }

    const { userId } = req.body.data.metadata;
    const creatorProfile = await Creator_Profile.findById(
        event.data.metadata.creatorProfileId
    );
    if (!creatorProfile) {
        throw new NotFoundError(`No creator profile found with id ${req.body.data.metadata.creatorProfileId}`);
    }

    const existingSubscription = await Subscription.findOne({
        fan: userId,
        creator: creatorProfile.user,
        status: 'active'
    });
    if (existingSubscription) {
        throw new BadRequestError('You are already subscribed to this creator');
    }

    const cancelledSubscription = await Subscription.findOne({
        fan: userId,
        creator: creatorProfile.user,
        status: 'cancelled'
    })
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);
    if (cancelledSubscription) {
        cancelledSubscription.status = 'active';
        cancelledSubscription.startDate = startDate;
        cancelledSubscription.endDate = endDate;
        cancelledSubscription.amount = req.body.data.amount / 100;
        await cancelledSubscription.save();
        return res.status(StatusCodes.OK).send();
    }

    const subscription = await Subscription.create({
        fan: userId,
        creator: creatorProfile.user,
        amount: req.body.data.amount / 100,
        status: 'active',
        startDate: startDate,
        endDate: endDate
    })

    res.status(StatusCodes.OK).send();
}

module.exports = {
    initializePayment,
    verifyPayment,
    webhookHandler
}