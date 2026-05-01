const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Avatar storage
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:           'blog-avatars',
    allowed_formats:  ['jpg', 'jpeg', 'png', 'webp'],
    transformation:   [{ width: 300, height: 300, crop: 'fill' }],
  },
});

// Post image storage
const postImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          'blog-posts',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation:  [{ width: 1200, height: 630, crop: 'fill' }],
  },
});

const uploadAvatar    = multer({ storage: avatarStorage });
const uploadPostImage = multer({ storage: postImageStorage });

module.exports = { cloudinary, uploadAvatar, uploadPostImage };