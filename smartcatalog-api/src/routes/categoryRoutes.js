const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const cache = require('../middleware/cache');

router.get('/', categoryController.getCategories);
router.post('/', categoryController.addCategory);
router.get('/:id', categoryController.getCategory);
router.delete('/:id', categoryController.deleteCategory);
router.put('/:id', categoryController.updateCategory);
router.post('/uploadFile', categoryController.uploadFile);

module.exports = router;