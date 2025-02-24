// ดึงตัวควบคุม Category จากไฟล์ categoryController.js
const subcategory = require('../controllers/subcategoryController');

// ดึง Dependencies จาก package
const express = require('express');
const router = express.Router();

// เชื่อมต่อเส้นทาง (Path) กับ ตัวควบคุม (Controller)
router.get('/', subcategory.getSubcategories);
router.get('/category/:categoryId', subcategory.getSubcategoriesByCategory);
router.get('/:id', subcategory.getSubcategory);
router.post('/', subcategory.addSubcategory);
router.delete('/:id', subcategory.deleteSubcategory);
router.put('/:id', subcategory.updateSubcategory);
router.post('/uploadFile', subcategory.uploadFile);

// ส่งออก Module
module.exports = router;