const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const Plant = require('../models/Plant');
const { authenticateShop, authenticateUser } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = 'uploads/plants/';
        if (file.fieldname === 'model3d') {
            uploadPath = 'uploads/models/';
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|glb|gltf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files and 3D model files are allowed!'));
        }
    }
});

// Get all plants for a shop (shop dashboard)
router.get('/shop', authenticateShop, async (req, res) => {
    try {
        const plants = await Plant.find({ shop: req.shop._id }).populate('shop', 'shopName');
        res.json(plants);
    } catch (error) {
        console.error('Get shop plants error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all plants (public - for users to browse)
router.get('/', async (req, res) => {
    try {
        const { category, featured, search } = req.query;
        let query = { inStock: true };

        if (category) {
            query.category = category;
        }

        if (featured === 'true') {
            query.isFeatured = true;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const plants = await Plant.find(query)
            .populate('shop', 'shopName address')
            .sort({ createdAt: -1 });

        res.json(plants);
    } catch (error) {
        console.error('Get plants error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single plant by ID
router.get('/:plantId', async (req, res) => {
    try {
        const plant = await Plant.findById(req.params.plantId)
            .populate('shop', 'shopName address phone description');

        if (!plant) {
            return res.status(404).json({ message: 'Plant not found' });
        }

        res.json(plant);
    } catch (error) {
        console.error('Get plant error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add new plant (shop only)
router.post('/', authenticateShop, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'model3dHtml', maxCount: 1 },
    { name: 'model3dGlb', maxCount: 1 }
]), [
    body('name').trim().notEmpty().withMessage('Plant name is required'),
    body('category').isIn(['Indoor', 'Outdoor', 'Succulent', 'Herb', 'Flowering', 'Foliage']).withMessage('Valid category is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
    body('stockQuantity').optional().isInt({ min: 0 }).withMessage('Stock quantity must be a positive integer')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array().map(err => err.msg)
            });
        }

        if (!req.files || !req.files.image) {
            return res.status(400).json({ message: 'Plant image is required' });
        }

        const { name, category, description, price, stockQuantity } = req.body;

        const plantData = {
            name,
            category,
            description,
            price: parseFloat(price),
            stockQuantity: stockQuantity ? parseInt(stockQuantity) : 0,
            inStock: stockQuantity ? parseInt(stockQuantity) > 0 : true,
            shop: req.shop._id,
            image: req.files.image[0].path
        };

        if (req.files.model3dHtml) {
            plantData.model3dHtml = req.files.model3dHtml[0].path;
        }
        if (req.files.model3dGlb) {
            plantData.model3dGlb = req.files.model3dGlb[0].path;
        }

        const plant = new Plant(plantData);
        await plant.save();

        const populatedPlant = await Plant.findById(plant._id).populate('shop', 'shopName');

        res.status(201).json({
            message: 'Plant added successfully',
            plant: populatedPlant
        });
    } catch (error) {
        console.error('Add plant error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update plant (shop only)
router.put('/:plantId', authenticateShop, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'model3dHtml', maxCount: 1 },
    { name: 'model3dGlb', maxCount: 1 }
]), [
    body('name').optional().trim().notEmpty().withMessage('Plant name cannot be empty'),
    body('category').optional().isIn(['Indoor', 'Outdoor', 'Succulent', 'Herb', 'Flowering', 'Foliage']).withMessage('Valid category is required'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Valid price is required'),
    body('stockQuantity').optional().isInt({ min: 0 }).withMessage('Stock quantity must be a positive integer')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.array().map(err => err.msg)
            });
        }

        const plant = await Plant.findById(req.params.plantId);
        if (!plant) {
            return res.status(404).json({ message: 'Plant not found' });
        }

        // Check if the plant belongs to the authenticated shop
        if (plant.shop.toString() !== req.shop._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this plant' });
        }

        const updates = {};
        if (req.body.name) updates.name = req.body.name;
        if (req.body.category) updates.category = req.body.category;
        if (req.body.description) updates.description = req.body.description;
        if (req.body.price) updates.price = parseFloat(req.body.price);
        if (req.body.stockQuantity !== undefined) {
            updates.stockQuantity = parseInt(req.body.stockQuantity);
            updates.inStock = parseInt(req.body.stockQuantity) > 0;
        }

        if (req.files && req.files.image) {
            updates.image = req.files.image[0].path;
        }
        if (req.files && req.files.model3dHtml) {
            updates.model3dHtml = req.files.model3dHtml[0].path;
        }
        if (req.files && req.files.model3dGlb) {
            updates.model3dGlb = req.files.model3dGlb[0].path;
        }

        const updatedPlant = await Plant.findByIdAndUpdate(
            req.params.plantId,
            updates,
            { new: true, runValidators: true }
        ).populate('shop', 'shopName');

        res.json({
            message: 'Plant updated successfully',
            plant: updatedPlant
        });
    } catch (error) {
        console.error('Update plant error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete plant (shop only)
router.delete('/:plantId', authenticateShop, async (req, res) => {
    try {
        const plant = await Plant.findById(req.params.plantId);
        if (!plant) {
            return res.status(404).json({ message: 'Plant not found' });
        }

        // Check if the plant belongs to the authenticated shop
        if (plant.shop.toString() !== req.shop._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this plant' });
        }

        await Plant.findByIdAndDelete(req.params.plantId);

        res.json({ message: 'Plant deleted successfully' });
    } catch (error) {
        console.error('Delete plant error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Toggle featured status (shop only)
router.put('/:plantId/toggle-featured', authenticateShop, async (req, res) => {
    try {
        const plant = await Plant.findById(req.params.plantId);
        if (!plant) {
            return res.status(404).json({ message: 'Plant not found' });
        }

        // Check if the plant belongs to the authenticated shop
        if (plant.shop.toString() !== req.shop._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this plant' });
        }

        plant.isFeatured = !plant.isFeatured;
        await plant.save();

        res.json({
            message: `Plant ${plant.isFeatured ? 'marked as' : 'unmarked from'} featured`,
            plant
        });
    } catch (error) {
        console.error('Toggle featured error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all plants for a specific shop (public)
router.get('/by-shop/:shopId', async (req, res) => {
    try {
        const plants = await Plant.find({ shop: req.params.shopId, inStock: true });
        res.json(plants);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 