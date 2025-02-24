// ดึง Dependencies จาก package
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); 

// นำเข้าพาธโฟลเดอร์อัปโหลดรูป
const productUploadDir = require('./productUploadDir');

// นำเข้าตัวกรองไฟล์รูปภาพ
const { ImageFileFilter } = require('./fileFilter');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, productUploadDir); // บันทึกไฟล์ลงใน /uploads/images
    },
    filename: (req, file, cb) => {
        // ใช้ UUID ร่วมกับวันที่ เพื่อให้ชื่อไฟล์ไม่ซ้ำ
        cb(null, uuidv4() + Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์ที่ไม่ซ้ำกัน
    }
});

const uploadImages = multer({ storage, fileFilter: ImageFileFilter }); // รองรับการอัปโหลดไฟล์เดียว

module.exports = uploadImages;