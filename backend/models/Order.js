const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    plant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plant',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    }
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Credit Card', 'Debit Card', 'PayPal', 'Cash on Delivery']
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema); 