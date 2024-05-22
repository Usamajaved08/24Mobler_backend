import User from '../Models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import Product from '../Models/Product.js';


const registerUser = async (req, res) => {
    try {
        const { username, email, password, termsConditions } = req?.body;

        if (!username || !email || !password || typeof termsConditions !== 'boolean') {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }
        if (!termsConditions) {
            return res.status(400).json({ message: 'Terms and conditions must be agreed.' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered.' });
        }
        const newUser = new User({
            username,
            email,
            password,
            termsConditions
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully.', user: newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
const loginUser = async (req, res) => {
    try {
        const { email, password } = req?.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password.' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        const isMatch = await bcrypt.compare(password, user?.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '6h' }
        );
        const userWithoutPassword = { ...user.toObject() };
        delete userWithoutPassword.password;
        res.set("Authorization", `Bearer ${token}`);
        res.status(200).json({ success: 1, message: 'Login successful.', token, user: userWithoutPassword });

    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

const logoutUser = (req, res) => {
    try {
        res.set("Authorization", "");
        res.clearCookie("token");
        req.session.destroy();
        res.status(200).json({ success: 1, message: 'Logout successful' });
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({ success: 0, message: 'Internal server error.' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { userId, address, ...updateFields } = req.body;
        if (!userId) {
            return res.status(400).json({ success: 0, message: 'Please provide the user ID.' });
        }
        const updateObject = { ...updateFields };
        if (address) {
            updateObject.address = { ...address };
        }
        const updatedUser = await User.findByIdAndUpdate(userId, updateObject, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ success: 0, message: 'User not found.' });
        }
        res.status(200).json({ success: 1, message: 'User data updated successfully.', user: updatedUser });
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({ success: 0, message: 'Internal server error.' });
    }
};



export { registerUser, loginUser, logoutUser, updateUser };
