// ดึงตัวควบคุม Contact จากไฟล์ distributorController.js
const contactController = require('../controllers/contactController');

// ดึง Dependencies จาก package
const express = require('express');
const router = express.Router();

// เชื่อมต่อเส้นทาง (Path) กับ ตัวควบคุม (Controller)
router.post('/', contactController.addContact);

// ส่งออก Module
module.exports = router;