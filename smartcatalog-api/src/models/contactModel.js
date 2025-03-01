// ดึง Dependencies จาก package
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone Number is required.'],
        trim: true
    },
    subject: {
        type: String,
        required: [true, 'Subject is required.'],
        trim: true
    },
    message: {
        type: String,
        required: [true, 'Message is required.'],
        trim: true
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);