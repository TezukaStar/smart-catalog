const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    brand: { type: String, required: [true, 'Product brand is required.'], ref: 'Brand' },
    productId: { type: String, required: [true, 'Product Id is required.'], trim: true },
    name: { type: String, required: [true, 'Product name is required.'], trim: true },
    ict: { type: Boolean, default: false },
    price: { type: Number, required: false, min: 0, default: null },
    description: { type: String, required: false, trim: true },
    category: { type: String, required: [true, 'Product category is required.'], ref: 'Category' },
    features: [{
        name: { type: String, required: false, trim: true },
        description: { type: String, required: false, trim: true }
    }],
    images: [{
        fileName: { type: String, trim: true }
    }]
});

module.exports = mongoose.model('Product', productSchema);