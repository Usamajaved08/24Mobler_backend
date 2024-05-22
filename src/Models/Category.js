import mongoose from 'mongoose';
const { Schema } = mongoose;

const categorychema = new Schema({
    categoryType: {
        type: String,
        required: true,
        unique: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
}, { timestamps: true });

const Category = mongoose.model('Category', categorychema);
export default Category;