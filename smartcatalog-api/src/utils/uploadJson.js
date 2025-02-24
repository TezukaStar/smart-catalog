// ดึง Dependencies จาก package
const multer = require('multer');

// นำเข้าตัวกรองไฟล์ JSON
const { JsonFileFilter } = require('./fileFilter');

// เก็บไฟล์ JSON ในหน่วยความจำ (Buffer)
const storage = multer.memoryStorage();

const uploadJson = multer({ 
    storage, 
    fileFilter: JsonFileFilter 
}); // รองรับการอัปโหลดไฟล์เดียว

module.exports = uploadJson;