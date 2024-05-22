import Review from '../Models/Review.js';

const addNewReview = async (req, res) => {
    try {
        const { posterId, posterName, reviewContent, reviewImages, rating, reviewForItem } = req.body;
        const newReview = new Review({
            posterId,
            posterName,
            reviewContent,
            reviewImages,
            rating,
            reviewForItem
        });
        await newReview.save();
        res.status(201).json({ message: 'Review created successfully', review: newReview });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export { addNewReview };