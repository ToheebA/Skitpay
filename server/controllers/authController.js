const User = require('../models/User');
const crypto = require('crypto')
const { sendVerificationEmail } = require('../utils/sendEmail')
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors/index');

const register = async (req, res) => {
    const { name, email, password, role, location } = req.body

    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const user = await User.create({ 
        name,
        email: req.body.email.toLowerCase(), 
        password,
        role,
        location,
        verificationToken,
        verificationTokenExpiry,
        isVerified: false
    })

    await sendVerificationEmail(email, verificationToken)

    res.status(StatusCodes.CREATED).json({
        msg: 'Registration successful! Please check your email to verify your account.'
    })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password');
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials');
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ 
        user: { 
            name: user.name, 
            role: user.role, 
            userId: user._id 
        }, 
        token 
    })
}

module.exports = {
    register,
    login,
}