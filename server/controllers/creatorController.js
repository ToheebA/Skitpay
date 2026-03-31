const mongoose = require('mongoose')
const Creator_Profile = require('../models/Creator_Profile');
const Skit = require('../models/Skit');
const Subscription = require('../models/Subscription');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const createProfile =  async (req, res) => {
    req.body.user = req.user.userId;
    const profile = await Creator_Profile.create(req.body);
    res.status(StatusCodes.CREATED).json({ profile });
}

const getProfile =  async (req, res) => {
    const {
        user: { userId }
    } = req;

    const profile = await Creator_Profile.findOne({
        user: userId,
        isActive: true
    }).populate('user', 'name email location');

    if (!profile) {
        throw new NotFoundError(`No profile found for user ${userId}`);
    }
    res.status(StatusCodes.OK).json({ profile });
}

const updateProfile =  async (req, res) => {
    const {
        user: { userId }
    } = req;

    delete req.body.user;

    const profile = await Creator_Profile.findOneAndUpdate(
        { user: userId },
        req.body,
        { new: true, runValidators: true }
    )

    if (!profile) {
        throw new NotFoundError(`No profile found for user ${userId}`);
    }

    res.status(StatusCodes.OK).json({ profile });
}

const deactivateProfile = async (req, res) => {
    const {
        user: {userId }
    } = req;
    const profile = await Creator_Profile.findOne({
        user: userId,
        isActive: true
    });
    
    if (!profile) {
        throw new NotFoundError(`No active profile found for user ${userId}`);
    }

    const activeSubscriptions = await Subscription.countDocuments({
        creator: userId,
        status: 'active'
    })

    if (activeSubscriptions > 0) {
        const scheduledDate = new Date()
        scheduledDate.setDate(scheduledDate.getDate() + 30)

        await Creator_Profile.findOneAndUpdate(
            { user: userId },
            { scheduledDeletion: scheduledDate },
            { new: true }
        )
        return res.status(StatusCodes.OK).json({
            msg: `You have ${activeSubscriptions} active subscribers. Profile will be deactivated on ${scheduledDate.toDateString()}`
        })
    }

    await Creator_Profile.findOneAndUpdate(
        { user: userId },
        { isActive: false }
    )

    await Skit.updateMany(
        { createdBy: profile._id },
        { isActive: false }
    )

    res.status(StatusCodes.OK).json({
        msg: 'Profile deactivated successfully'
    })
}

const reactivateProfile = async (req, res) => {
    const {
        user: { userId }
    } = req;

    const profile = await Creator_Profile.findOneAndUpdate(
       { user: userId, isActive: false },
       { isActive: true, scheduledDeletion: null },
       { new: true }
    )

    if (!profile) {
        throw new NotFoundError(`No deactivated profile found for user ${userId}`);
    }

    await Skit.updateMany(
        { createdBy: profile._id, isActive: false },
        { isActive: true }
    )

    res.status(StatusCodes.OK).json({
        msg: 'Profile reactivated successfully'
    })
}

const uploadSkit =  async (req, res) => {
    const {
        user: { userId }
    } = req;

    if (!req.files || !req.files.video || !req.files.thumbnail) {
        throw new BadRequestError('Video and thumbnail are required');
    }
    const videoUrl = req.files.video[0].path;
    const thumbnailUrl = req.files.thumbnail[0].path;
    const profile = await Creator_Profile.findOne({ 
        user: userId, 
        isActive: true 
    });

    if (!profile) {
        throw new NotFoundError('No active profile found');
    };

    if (req.body.tags) {
        req.body.tags = req.body.tags.split(',').map(tag => tag.trim())
    }

    req.body.videoUrl = videoUrl;
    req.body.thumbnailUrl = thumbnailUrl;
    req.body.createdBy = profile._id;
    req.body.niche = profile.niche;
    const skit = await Skit.create(req.body);
    const io = req.app.get('io');
    const subscriptions = await Subscription.find({ 
        creator: userId, 
        status: 'active' 
    }).populate('fan', 'name');
    
    subscriptions.forEach(sub => {
        io.to(sub.fan._id.toString()).emit('notification', {
            type: 'new_skit',
            message: `Hello ${sub.fan.name}, new skit uploaded: ${skit.title}!`
        })
    })

    res.status(StatusCodes.CREATED).json({ skit });
}

const getSkits =  async (req, res) => {
    const {
        user: { userId }
    } = req;
    const { visibility, sort } = req.query;
    const profile = await Creator_Profile.findOne({ 
        user: userId,
        isActive: true
    });

    if (!profile) {
        throw new NotFoundError('No active profile found');
    };

    const queryObject = { createdBy: profile._id, isActive: true };
    if (visibility) {
        queryObject.visibility = visibility;
    };
    
    let result = Skit.find(queryObject);

    if (sort) {
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    } else {
        result = result.sort('-createdAt')
    };

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);
    const skits = await result;

    res.status(StatusCodes.OK).json({ skits, count: skits.length });
}

const updateSkit = async (req, res) => {
    const {
        user: { userId }
    } = req;

    const profile = await Creator_Profile.findOne({ 
        user: userId,
        isActive: true
    });

    if (!profile) {
        throw new NotFoundError('No active profile');
    }

    if (req.files?.video) {
        req.body.videoUrl = req.files.video[0].path
    }
    if (req.files?.thumbnail) {
        req.body.thumbnailUrl = req.files.thumbnail[0].path
    }
    if (req.body.tags) {
        req.body.tags = req.body.tags.split(',').map(tag => tag.trim())
    }

    delete req.body.createdBy;
    const skit = await Skit.findOneAndUpdate(
        { _id: req.params.id, createdBy: profile._id },
        req.body,
        { new: true, runValidators: true }
    )

    if (!skit) {
        throw new NotFoundError(`No skit found with id ${req.params.id}`);
    }

    res.status(StatusCodes.OK).json({ skit });
}

const deleteSkit =  async (req, res) => {
    const {
        user: { userId }
    } = req;

    const profile = await Creator_Profile.findOne({ 
        user: userId,
        isActive: true
    });

    if (!profile) {
        throw new NotFoundError('No active profile');
    }

    const skit = await Skit.findOneAndDelete(
        { _id: req.params.id, createdBy: profile._id }
    )

    if (!skit) {
        throw new NotFoundError(`No skit found with id ${req.params.id}`);
    }
    res.status(StatusCodes.OK).json({ msg: 'Skit deleted successfully' });
}

const getCreatorStats = async (req, res) => {
    const { userId } = req.user
    const profile = await Creator_Profile.findOne({ user: userId })
    const subscribers = await Subscription.countDocuments({
        creator: userId,
        status: 'active'
    })

    const totalUploads = await Skit.countDocuments({
        createdBy: profile._id
    })

    const skits = await Skit.find({ createdBy: profile._id })
    const totalViews = skits.reduce((sum, skit) => sum + skit.viewCount, 0)
    const earnings = await Subscription.aggregate([
        { 
            $match: { 
                creator: new mongoose.Types.ObjectId(userId), 
                status: 'active' 
            } 
        },
        { 
            $group: { 
                _id: null, 
                total: { $sum: '$amount' } 
            } 
        }
    ])

    const matchTest = await Subscription.find({ 
        creator: userId, 
        status: 'active' 
    })

    res.status(StatusCodes.OK).json({
        subscribers,
        totalViews,
        totalEarnings: earnings[0]?.total || 0,
        totalUploads
    })
}

module.exports = { 
    createProfile, 
    getProfile, 
    updateProfile,
    deactivateProfile,
    reactivateProfile, 
    uploadSkit, 
    getSkits,
    updateSkit, 
    deleteSkit,
    getCreatorStats
}