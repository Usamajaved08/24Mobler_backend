import mongoose from 'mongoose';
const { Schema } = mongoose;

const reviewSchema = new Schema({
    posterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    posterName: {
        type: String,
        required: true,
    },
    reviewContent: {
        type: String,
        required: true,
    },
    reviewImages: [{
        type: String
    }],
    rating: {
        type: Number,
        required: true,
    },
    reviewForItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: null
    }
}, { timestamps: true });
const Review = mongoose.model('Review', reviewSchema);
export default Review;