const Creator_Profile = require('../models/Creator_Profile');
const Skit = require('../models/Skit');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const createProfile =  async (req, res) => {
    // console.log('req.user:', req.user);
    // res.json({ msg: 'test' });
    req.body.user = req.user.userId;
    const profile = await Creator_Profile.create(req.body);
    res.status(StatusCodes.CREATED).json({ profile });
}

const getProfile =  async (req, res) => {
    // console.log(req.user);
    const {
        user: { userId }
    } = req;

    const profile = await Creator_Profile.findOne({
        user: userId
    });

    if (!profile) {
        throw new NotFoundError(`No profile found for user ${userId}`);
    }

    res.status(StatusCodes.OK).json({ profile });
}

const updateProfile =  async (req, res) => {
    const {
        body: { bio, niche, socialLinks, subscriptionPrice },
        user: { userId }
    } = req;

    if (bio === '' || niche === '' || socialLinks === '' || subscriptionPrice === '') {
        throw new BadRequestError('Please fill in all the fields')
    }

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

const uploadSkit =  async (req, res) => {
    res.status(201).json({ message: 'Skit uploaded successfully' });
}

const getSkits =  async (req, res) => {
    res.status(200).json({ message: 'Skits retrieved successfully' });
}

const deleteSkit =  async (req, res) => {
    res.status(200).json({ message: 'Skit deleted successfully' });
}

module.exports = { 
    createProfile, 
    getProfile, 
    updateProfile, 
    uploadSkit, 
    getSkits, 
    deleteSkit 
}