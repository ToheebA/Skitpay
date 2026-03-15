

const createProfile =  async (req, res) => {
    res.status(201).json({ message: 'Profile created successfully' });
}

const getProfile =  async (req, res) => {
    res.status(200).json({ message: 'Profile retrieved successfully' });
}

const updateProfile =  async (req, res) => {
    res.status(200).json({ message: 'Profile updated successfully' });
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