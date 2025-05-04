const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  createReview,
  getProductReviews,
  deleteReview,
  voteReview,
  uploadReviewPhotos,
} = require('../controllers/reviewController');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/reviews/');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  },
});

// Routes
router.post('/', protect, createReview);
router.get('/product/:id', getProductReviews);
router.delete('/:id', protect, deleteReview);
router.post('/:id/vote', protect, voteReview);
router.post(
  '/upload',
  protect,
  upload.array('photos', 5), // Allow up to 5 photos
  uploadReviewPhotos
);

module.exports = router;
