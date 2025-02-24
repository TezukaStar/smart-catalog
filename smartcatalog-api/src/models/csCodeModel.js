// ดึง Dependencies จาก package
const mongoose = require('mongoose');

// โครงร่าง CSCode
const CSCodeSchema = new mongoose.Schema({
    code: { type: String, required: [true, 'จำเป็นต้องมี CSCode'], unqiue: [true, 'CSCode ไม่สามารถซ้ำกันได้'] },
    description: { type: String },
    createAt: { type: Date, default: Date.now }
});

// ส่งออกโมเดลสินค้า
module.exports = mongoose.model('CSCode', CSCodeSchema);