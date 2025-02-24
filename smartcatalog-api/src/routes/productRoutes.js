const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const cache = require('../middleware/cache');
const auth = require('../middleware/auth');

// กำหนดตัวแปร
const adminAuth = auth.adminAuth;

router.get('/', productController.getProducts);
router.post('/', adminAuth, productController.addProduct);
router.get('/search', productController.searchProductByName);
router.get('/filter', productController.filterProduct);
router.get('/compare', productController.compareProduct);
router.get('/noICT', productController.getProductNoIct);
router.get('/:id', productController.getProduct);
router.delete('/:id', adminAuth, productController.deleteProduct);
router.put('/:id', adminAuth, productController.updateProduct);
router.post('/uploadFile', adminAuth, productController.uploadFile);

module.exports = router;