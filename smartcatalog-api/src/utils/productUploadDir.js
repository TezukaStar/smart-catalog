// ดึง Dependencies จาก package
const path = require('path');

// กำหนดโฟลเดอร์สำหรับเก็บไฟล์ภาพ
const productUploadDir = path.join(__dirname, "../uploads/products");

module.exports = productUploadDir;