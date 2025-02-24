// Require a mongoose
const mongoose = require('mongoose');

// Cart item schema
const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NewProduct',
        required: [true, 'Product is required']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        default: 1
    }
});

// Cart schema
const cartSchema = mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    items: [cartItemSchema]
});

// Export a model
module.exports = mongoose.model('Cart', cartSchema);