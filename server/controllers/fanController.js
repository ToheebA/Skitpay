const getAllSkits = async (req, res) => {
    res.status(200).json({ message: 'All skits retrieved successfully' });
}

const getSkit = async (req, res) => {
    res.status(200).json({ message: 'Skit retrieved successfully' });
}

const likeSkit = async (req, res) => {
    res.status(200).json({ message: 'Skit liked successfully' });
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