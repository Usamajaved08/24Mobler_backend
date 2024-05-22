import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        trim: true,
    },
    city: {
        type: String,
        trim: true
    },
    postalCode: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        trim: true,
    }
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required.'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        trim: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address.']
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        trim: true,
        set: (val) => {
            return bcrypt.hashSync(val, 10);
        },
    },
    termsConditions: {
        type: Boolean,
        required: [true, 'You must agree to the terms and conditions.']
    },
    phone: {
        type: String,
        trim: true,
    },
    address: addressSchema,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true
});

let User;
try {
    // Check if the model has already been defined
    User = mongoose.model('User');
} catch (error) {
    // Define the model if it hasn't been defined yet
    User = mongoose.model('User', userSchema);
}

export default User;
