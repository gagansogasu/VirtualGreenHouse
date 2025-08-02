const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Indoor', 'Outdoor', 'Succulent', 'Herb', 'Flowering', 'Foliage', 'Indoor & Air-Purifying']
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    inStock: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        required: true
    },
    model3dHtml: {
        type: String // Relative path to the Plant3D HTML file, e.g., /Plant3D/croton.html
    },
    model3dGlb: {
        type: String // Relative path to the Plant3D GLB file, e.g., /Plant3D/croton_plant.glb
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    stockQuantity: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Plant', plantSchema); 