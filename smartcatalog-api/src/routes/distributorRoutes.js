// ดึงตัวควบคุม Distributor จากไฟล์ distributorController.js
const distributorController = require('../controllers/distributorController');

// ดึง Dependencies จาก package
const express = require('express');
const router = express.Router();

// เชื่อมต่อเส้นทาง (Path) กับ ตัวควบคุม (Controller)
router.get('/', distributorController.getDistributors);
router.post('/', distributorController.addDistributor);
router.get('/:id', distributorController.getDistributor);
router.delete('/:id', distributorController.deleteDistributor);
router.put('/:id', distributorController.updateDistributor);
router.post('/uploadFile', distributorController.uploadFile);

// ส่งออก Module
module.exports = router;