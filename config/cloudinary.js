let cloudinary;
let uploadAvatar;

const getCloudinary = () => {
  if (!cloudinary) {
    const cloudinaryLib = require('cloudinary').v2;
    const { CloudinaryStorage } = require('multer-storage-cloudinary');
    const multer = require('multer');

    cloudinaryLib.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key:    process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const avatarStorage = new CloudinaryStorage({
      cloudinary: cloudinaryLib,
      params: {
        folder:          'blog-avatars',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation:  [{ width: 300, height: 300, crop: 'fill' }],
      },
    });

    cloudinary   = cloudinaryLib;
    uploadAvatar = multer({ storage: avatarStorage });
  }

  return { cloudinary, uploadAvatar };
};

module.exports = { getCloudinary };