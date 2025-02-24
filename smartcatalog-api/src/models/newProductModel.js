// ดึง Dependencies จาก package
const mongoose = require('mongoose');

// โครงร่างสินค้า
const productSchema = new mongoose.Schema({
    brand: { type: String, required: [true, 'จำเป็นต้องมียี่ห้อสินค้า'] },
    cscode: { type: String, required: [true, 'จำเป็นต้องมี CSCode'] },
    itemNumber: { type: String, required: [true, 'จำเป็นต้องมีหมายเลขสินค้า'], unique: true },
    vendorItemId: { type: String },
    itemDescription: { type: String, required: [true, 'จำเป็นต้องมีคำอธิบายสินค้า'] },
    price: { type: Number, required: false, default: null },
    category: { type: String, required: [true, 'จำเป็นต้องมีหมวดหมู่สินค้า'], enum: ['Network', 'IOT', 'Solar Cell'] },
    subcategory: { type: String, enum: ['Home', 'Factory'], default: null },
    specICT: { type: Boolean, required: [true, 'จำเป็นต้องกำหนดว่าเป็น ICT หรือไม่'], default: false },
    specifications: [{ name: { type: String }, description: { type: String } }],
    images: [{ fileName: { type: String } }],
    status: { type: String, required: [true, 'จำเป็นต้องระบุสถานะของสินค้า'], enum: ['มีสินค้า', 'สินค้าหมด', 'สินค้าใหม่', 'โปรโมชั่น'], default: 'มีสินค้า' }
});

// ส่งออกโมเดลสินค้า
module.exports = mongoose.model('NewProduct', productSchema);