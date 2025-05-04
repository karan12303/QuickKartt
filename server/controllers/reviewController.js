const Review = require('../models/reviewModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const mongoose = require('mongoose');

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { productId, rating, title, comment, photos } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user has already reviewed this product
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    // Check if user has purchased this product (for verified purchase badge)
    const userOrders = await Order.find({
      user: req.user._id,
      'orderItems.product': productId,
      status: 'delivered', // Only count delivered orders
    });

    const isVerifiedPurchase = userOrders.length > 0;

    // Create new review
    const review = new Review({
      user: req.user._id,
      product: productId,
      name: req.user.name,
      rating: Number(rating),
      title,
      comment,
      photos: photos || [],
      isVerifiedPurchase,
    });

    await review.save();

    // Update product rating
    const allProductReviews = await Review.find({ product: productId });
    
    product.numReviews = allProductReviews.length;
    product.rating =
      allProductReviews.reduce((acc, item) => item.rating + acc, 0) /
      allProductReviews.length;

    await product.save();

    res.status(201).json({
      message: 'Review added',
      review,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:id
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    const productId = req.params.id;

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is the owner of the review or an admin
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await review.remove();

    // Update product rating
    const product = await Product.findById(review.product);
    const allProductReviews = await Review.find({ product: review.product });

    if (allProductReviews.length > 0) {
      product.numReviews = allProductReviews.length;
      product.rating =
        allProductReviews.reduce((acc, item) => item.rating + acc, 0) /
        allProductReviews.length;
    } else {
      product.numReviews = 0;
      product.rating = 0;
    }

    await product.save();

    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Vote on review helpfulness
// @route   POST /api/reviews/:id/vote
// @access  Private
const voteReview = async (req, res) => {
  try {
    const { helpful } = req.body;
    const reviewId = req.params.id;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user has already voted
    const existingVote = review.voters.find(
      (voter) => voter.user.toString() === userId.toString()
    );

    if (existingVote) {
      // User is changing their vote
      if (existingVote.helpful !== helpful) {
        // Update vote counts
        if (existingVote.helpful) {
          review.helpfulVotes -= 1;
        } else {
          review.unhelpfulVotes -= 1;
        }

        if (helpful) {
          review.helpfulVotes += 1;
        } else {
          review.unhelpfulVotes += 1;
        }

        // Update voter's choice
        existingVote.helpful = helpful;
      } else {
        // User is removing their vote
        if (helpful) {
          review.helpfulVotes -= 1;
        } else {
          review.unhelpfulVotes -= 1;
        }

        // Remove voter from array
        review.voters = review.voters.filter(
          (voter) => voter.user.toString() !== userId.toString()
        );
      }
    } else {
      // New vote
      if (helpful) {
        review.helpfulVotes += 1;
      } else {
        review.unhelpfulVotes += 1;
      }

      // Add voter to array
      review.voters.push({
        user: userId,
        helpful,
      });
    }

    await review.save();

    res.json({
      message: 'Vote recorded',
      helpfulVotes: review.helpfulVotes,
      unhelpfulVotes: review.unhelpfulVotes,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Upload review photos
// @route   POST /api/reviews/upload
// @access  Private
const uploadReviewPhotos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // In a real implementation, you would upload files to a storage service
    // and return the URLs. For this example, we'll simulate it.
    const photoUrls = req.files.map(
      (file) => `/uploads/reviews/${file.filename}`
    );

    res.json({
      message: 'Photos uploaded successfully',
      photos: photoUrls,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  deleteReview,
  voteReview,
  uploadReviewPhotos,
};
