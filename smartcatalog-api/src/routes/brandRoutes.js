// ดึงตัวควบคุม Brand จากไฟล์ brandController.js
const brandController = require('../controllers/brandController');

// ดึง Dependencies จาก package
const express = require('express');
const router = express.Router();

// เรียกใช้งาน middleware
const { adminAuth } = require('../middleware/auth');

// เชื่อมต่อเส้นทาง (Path) กับ ตัวควบคุม (Controller)
router.get('/', brandController.getBrands);
router.get('/:id', brandController.getBrandById);
router.post('/', adminAuth, brandController.newBrand);
router.put('/:id', adminAuth, brandController.updateBrandById);
router.delete('/:id', adminAuth, brandController.removeBrandById);
router.post('/uploadFile', adminAuth, brandController.uploadFile);

module.exports = router;