// ดึง Dependencies จาก package
const mongoose = require('mongoose');

// Schema ผู้จัดจำหน่าย (Distributor)
const distributorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Distributor name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    },
    contactNumber: {
        type: String,
        required: [true, 'Contact number is required']
    }
});

// Export a model
module.exports = mongoose.model('Distributor', distributorSchema);