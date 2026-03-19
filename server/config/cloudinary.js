const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const combinedStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        if (file.fieldname === 'video') {
            return {
                folder: 'skitpay_videos',
                resource_type: 'video',
                allowed_formats: ['mp4', 'mov', 'avi']
            }
        } else {
            return {
                folder: 'skitpay_thumbnails',
                resource_type: 'image',
                allowed_formats: ['jpg', 'jpeg', 'png']
            }
        }
    }
})

const multiUpload = multer({ storage: combinedStorage }).fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
])

module.exports = { multiUpload };