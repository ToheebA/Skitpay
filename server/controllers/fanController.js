const Creator_Profile = require('../models/Creator_Profile');
const Subscription = require('../models/Subscription');
const Skit = require('../models/Skit');
const User = require('../models/User');
const { UnauthenticatedError } = require('../errors');

const getAllSkits = async (req, res) => {
    const { sort, niche, visibility } = req.query;
    const queryObject = { isActive: true };

    if (niche) {
        queryObject.niche = niche;
    };

    if (visibility) {
        queryObject.visibility = visibility;
    };
    
    let result = Skit.find(queryObject);

    if (sort) {
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    } else {
        result = result.sort('-createdAt')
    }

    result = result.select('title description niche thumbnailUrl visibility price createdBy likes viewCount createdAt');

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);
    const skits = await result;
    res.status(200).json({ skits, nbHits: skits.length });
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
            return res.status(200).json({ skit });
        }
    };

    if (skit.visibility === 'free') {
        await Skit.findOneAndUpdate(
            { _id: skitId },
            { $inc: { viewCount: 1 } },
        )
        return res.status(200).json({ skit });
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
    res.status(200).json({ 
        msg: message,
        likes: updatedSkit.likes.length
    });
}

const activateSubscription = async (req, res) => {
    res.status(200).json({ message: 'Subscription activated successfully' });
}

const cancelSubscription = async (req, res) => {
    res.status(200).json({ message: 'Subscription cancelled successfully' });
}

module.exports = {
    getAllSkits,
    getSkit,
    likeSkit,
    activateSubscription,
    cancelSubscription
}