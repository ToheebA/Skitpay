const Creator_Profile = require('../models/Creator_Profile');
const Subscription = require('../models/Subscription');
const Skit = require('../models/Skit');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { UnauthenticatedError, NotFoundError, BadRequestError } = require('../errors');

const getAllSkits = async (req, res) => {
    const { sort, fields, niche, visibility, search } = req.query;
    const queryObject = { isActive: true };

    if (niche) queryObject.niche = niche
    if (visibility) queryObject.visibility = visibility
    if (search) {
        const users = await User.find({
            name: { $regex: search, $options: 'i' }
        })
        const userIds = users.map(u => u._id)

        const profiles = await Creator_Profile.find({
            user: { $in: userIds },
            isActive: true
        })
        const profileIds = profiles.map(p => p._id)
        queryObject.$or = [ 
            { title: { $regex: search, $options: 'i' } },
            { createdBy: { $in: profileIds } }
        ]
    }
    
    let result = Skit.find(queryObject);

    if (sort) {
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    } else {
        result = result.sort('-createdAt')
    }

    if (fields) {
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)
    } else {
        result = result.select('title thumbnailUrl niche visibility viewCount likes createdBy')
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);
    const skits = await result;
    const totalSkits = await Skit.countDocuments(queryObject)
    res.status(StatusCodes.OK).json({ skits, nbHits: totalSkits });
}

const getAllCreators = async (req, res) => {
    const { niche, sort, search } = req.query;
    const queryObject = {};
    queryObject.isActive = true;

    if (niche) {
        queryObject.niche = niche;
    }
    if (search) {
        const users = await User.find({
            name: { $regex: search, $options: 'i' }
        })
        const userIds = users.map(u => u._id)
        queryObject.user = { $in: userIds }
    }

    let result = Creator_Profile.find(queryObject).populate('user', 'name');

    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const creators = await result;
    const totalCreators = await Creator_Profile.countDocuments(queryObject)
    res.status(StatusCodes.OK).json({ creators, nbHits: totalCreators });
}

const getCreatorPublicProfile = async (req, res) => {
    const { id: creatorId } = req.params

    const profile = await Creator_Profile.findOne({
        _id: creatorId,
        isActive: true
    }).populate('user', 'name email')

    if (!profile) {
        throw new NotFoundError('Creator profile not found')
    }

    const skits = await Skit.find({
        createdBy: creatorId,
        isActive: true
    }).select('title thumbnailUrl visibility viewCount likes niche')

    const subscriberCount = await Subscription.countDocuments({
        creator: profile.user._id,
        status: 'active'
    })

    res.status(StatusCodes.OK).json({
        profile,
        skits,
        subscriberCount
    })
}

const getSkit = async (req, res) => {
    const {
        params: { id: skitId },
    } = req;
    const skit = await Skit.findOne({ _id: skitId, isActive: true });

    if (!skit) {
        throw new NotFoundError(`No skit found with id ${skitId}`);
    };

    if (skit.visibility === 'paid') {
        if (!req.user) {
            throw new UnauthenticatedError('Please log in to view this skit');
        }

        const creatorProfile = await Creator_Profile.findById(skit.createdBy);
        if (!creatorProfile) {
            throw new NotFoundError('Creator profile not found');
        }
        const subscription = await Subscription.findOne({ 
            fan: req.user.userId,
            creator: creatorProfile.user,
            status: 'active' 
        });

        if (!subscription) {
            const skitObject = skit.toObject();
            delete skitObject.videoUrl;
            return res.status(200).json({ skit: skitObject });
        } else {
            await Skit.findOneAndUpdate(
                { _id: skitId },
                { $inc: { viewCount: 1 } },
            )
            return res.status(StatusCodes.OK).json({ skit });
        }
    };

    if (skit.visibility === 'free') {
        await Skit.findOneAndUpdate(
            { _id: skitId },
            { $inc: { viewCount: 1 } },
        )
        return res.status(StatusCodes.OK).json({ skit });
    };
}

const likeSkit = async (req, res) => {
    const { id: skitId } = req.params;
    const { user: { userId } } = req;
    const skit = await Skit.findById(skitId);

    if (!skit) {
        throw new NotFoundError(`No skit found with id ${skitId}`);
    }

    let message;
    if (skit.likes.some(id => id.toString() === userId)) {
        await Skit.findByIdAndUpdate(
            skitId,
            { $pull: { likes: userId } },
            { new: true }
        )
        message = 'Skit unliked successfully';
    } else {
        await Skit.findByIdAndUpdate(
            skitId,
            { $addToSet: { likes: userId } },
            { new: true }
        )
        message = 'Skit liked successfully';
    }
    const updatedSkit = await Skit.findById(skitId);

    const io = req.app.get('io');
    const creatorProfile = await Creator_Profile.findById(skit.createdBy);
    if (creatorProfile.user.toString() !== userId && message === 'Skit liked successfully') {
        io.to(creatorProfile.user.toString()).emit('notification', {
        type: 'new_like',
        message: `Your skit ${skit.title} just got a new like!`
    })
    }

    res.status(StatusCodes.OK).json({ 
        msg: message,
        likes: updatedSkit.likes.length
    });
}

const activateSubscription = async (req, res) => {
    const {
        user: {userId}
    } = req;
    const { creatorProfileId } = req.params;
    const creatorProfile = await Creator_Profile.findOne({ 
        _id: creatorProfileId,
        isActive: true
     });
    if (!creatorProfile) {
        throw new NotFoundError('Creator profile not found');
    }
    const fan = await User.findById(userId);
    if (!fan) {
        throw new NotFoundError('User not found');
    }
    
    if (userId === creatorProfile.user.toString()) {
        throw new BadRequestError('You cannot subscribe to yourself');
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
    const io = req.app.get('io');

    if (cancelledSubscription) {
        cancelledSubscription.status = 'active';
        cancelledSubscription.startDate = startDate;
        cancelledSubscription.endDate = endDate;
        cancelledSubscription.amount = creatorProfile.subscriptionPrice;
        await cancelledSubscription.save();
        io.to(creatorProfile.user.toString()).emit('notification', {
            type: 'new_subscriber',
            message: `${fan.name} just resubscribed to you!`
        })
        return res.status(StatusCodes.OK).json({ msg: 'Subscription reactivated successfully', subscription: cancelledSubscription });
    }
    const subscriptionPrice = creatorProfile.subscriptionPrice;
    const subscription = await Subscription.create({
        fan: userId,
        creator: creatorProfile.user,
        amount: subscriptionPrice,
        startDate: startDate,
        endDate: endDate,
        status: 'active'
    })
    io.to(creatorProfile.user.toString()).emit('notification', {
        type: 'new_subscriber',
        message: `${fan.name} just subscribed to you!`
    })
    res.status(StatusCodes.CREATED).json({ msg: 'Subscription activated successfully', subscription });
}

const cancelSubscription = async (req, res) => {
    const {
        user: { userId }
    } = req;
    const { id: subscriptionId } = req.params;
    const subscription = await Subscription.findOne({
        _id: subscriptionId,
        fan: userId,
        status: 'active'
    });
    if (!subscription) {
        throw new NotFoundError('Active subscription not found');
    }
    subscription.status = 'cancelled';
    await subscription.save();
    res.status(StatusCodes.OK).json({ message: 'Subscription cancelled successfully' });
}

const getSubscriptions = async (req, res) => {
    const { userId } = req.user
    const subscriptions = await Subscription.find({
        fan: userId,
        status: 'active'
    }).populate('creator', 'name')

    const subscriptionsWithProfile = await Promise.all(
        subscriptions.map(async (sub) => {
            const profile = await Creator_Profile.findOne({
                user: sub.creator._id
            })
            return {
                ...sub.toObject(),
                creatorProfileId: profile?._id
            }
        })
    )

    res.status(StatusCodes.OK).json({ 
        subscriptions: subscriptionsWithProfile, 
        count: subscriptions.length })
}

module.exports = {
    getAllSkits,
    getAllCreators,
    getCreatorPublicProfile,
    getSkit,
    likeSkit,
    activateSubscription,
    cancelSubscription,
    getSubscriptions
}