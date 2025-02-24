// ดึงตัวควบคุม User จากไฟล์ usersController.js
const userController = require('../controllers/userController');

// ดึง middleware มาใช้งาน
const auth = require('../middleware/auth');

// ดึง Dependencies จาก package
const express = require('express');
const router = express.Router();

// กำหนดตัวแปร
const userAuth = auth.auth;
const adminAuth = auth.adminAuth;

// เชื่อมต่อเส้นทาง (Path) กับ ตัวควบคุม (Controller)
router.get('/', adminAuth, userController.getUsers);
router.get('/profile', userAuth, userController.getProfile);
router.put('/profile', userAuth, userController.editProfile);
router.post('/forgetPassword', userController.forgetPassword);
router.post('/resetPassword/:token', userController.resetPassword);

// ส่งออก Module
module.exports = router;