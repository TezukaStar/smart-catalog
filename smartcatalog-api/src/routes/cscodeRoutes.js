// ดึง Dependencies จาก package
const express = require('express');
const router = express.Router();

// ดึง Middleware จาก โฟลเดอร์ middleware
const cache = require('../middleware/cache');
const auth = require('../middleware/auth');

// กำหนดตัวแปร
const authAdmin = auth.adminAuth;

// ดึงตัวควบคุม CSCode จาก ไฟล์ cscodeController.js
const cscodeController = require('../controllers/cscodeController');

// เชื่อมต่อเส้นทาง (Path) กับ ตัวควบคุม (Controller)
router.post('/', authAdmin, cscodeController.newCSCode);
router.post('/uploads/file/json', authAdmin, cscodeController.uploadFileJson);
router.get('/', cscodeController.getCSCodes);
router.get('/:id', cscodeController.getCSCodeById);    // Get CSCode by ID
router.put('/:id', cscodeController.updateCSCode);     // Update CSCode by ID
router.delete('/:id', cscodeController.deleteCSCode);

// ส่งออก Module
module.exports = router;