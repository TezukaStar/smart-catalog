// Require a mongoose
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Code is required.'],
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Category name is required.'],
        trim: true
    }
});

module.exports = mongoose.model('Category', categorySchema);