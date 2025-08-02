const express = require('express');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const User = require('../models/User');
const { authenticateUser, generateUserToken } = require('../middleware/auth');

const router = express.Router();

// Register user
router.post('/register', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('address').notEmpty().withMessage('Address is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array().map(err => err.msg)
            });
        }

        const { name, email, password, phone, address } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Create new user
        const user = new User({
            name,
            email,
            password,
            phone,
            address
        });

        await user.save();

        // Generate token
        const token = generateUserToken(user._id);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login user
router.post('/login', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array().map(err => err.msg)
            });
        }

        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateUserToken(user._id);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user profile
router.get('/profile', authenticateUser, async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/profile', authenticateUser, [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('phone').optional().notEmpty().withMessage('Phone number cannot be empty'),
    body('address').optional().notEmpty().withMessage('Address cannot be empty')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array().map(err => err.msg)
            });
        }

        const { name, phone, address } = req.body;
        const updates = {};

        if (name) updates.name = name;
        if (phone) updates.phone = phone;
        if (address) updates.address = address;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Forgot password
router.post('/forgot-password', [
    body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array().map(err => err.msg)
            });
        }

        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // In a real application, you would send an email here
        // For now, we'll just return the token
        res.json({
            message: 'Password reset instructions sent to your email',
            resetToken // Remove this in production
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Reset password
router.post('/reset-password/:token', [
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array().map(err => err.msg)
            });
        }

        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Update password and clear reset token
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 