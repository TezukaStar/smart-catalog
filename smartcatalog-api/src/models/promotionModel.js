// Require a mongoose
const mongoose = require('mongoose');

// Promotion item schema
const promotionItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product ID is required']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required']
    }
});

// Promotion schema
const promotionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Promotion name is required'],
        trim: true
    },
    items: [promotionItemSchema],
    price: {
        type: Number,
        required: [true, 'Total Price is required']
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    poster: {
        type: String,
        required: [true, 'Promotion poster is required.']
    }
});

// Export a model
module.exports = mongoose.model('promotion', promotionSchema);