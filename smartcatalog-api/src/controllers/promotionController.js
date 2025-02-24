// Require an order model
const Promotion = require('../models/promotionModel');
const Product = require('../models/newProductModel');

// Require a cart model
const Cart = require('../models/cartModel');

// ดึง Dependencies จาก package
const fs = require('fs');
const multer = require('multer');
const path = require('path');

// สร้าเส้นทางไปยังโฟลเดอร์ uploads
const uploadDir = path.join(__dirname, '..', 'uploads/promotion/');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ตั้งค่าการอัพโหลดไฟล์สินค้า
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // กำหนดโฟลเดอร์ที่ใช้เก็บรูปสินค้า
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // สร้างชื่อไฟล์ที่ไม่ซ้ำกันโดยใช้ไทม์สแตมป์และตัวเลขสุ่ม
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// กรองไฟล์ภาพ
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        // cb(new Error('อนุญาติให้ใช้งานเฉพาะไฟล์รูปภาพเท่านั้น!'), false);
        return res.status(400).json({ message: 'อนุญาตให้ใช้งานเฉพาะไฟล์รูปภาพเท่านั้น!' });
    }
};

// สร้างการจัดการการอัพโหลด
const upload = multer({
    storage,
    fileFilter
}).single('image');

// เพิ่มโปรโมชั่นใหม่
const addedPromotion = async (req, res) => {
    // ใช้งาน multer
    upload(req, res, async (error) => {
        if (error) return res.status(404).json({ message: 'ระบบเกิดข้อผิดพลาด' });

        // รับข้อมูลจาก request body
        const { name, price } = req.body;

        // ตรวจสอบว่ามีการใส่โปสเตอร์โปรโมชั่นหรือไม่
        if (!req.file) return res.status(400).json({ message: 'กรุณาใส่โปสเตอร์ของโปรโมชั่นนี้' });

        // รับข้อมูลจาก request file
        const poster = req.file.filename;

        try {
            // ดึงข้อมูลตะกร้าสินค้าจากฐานข้อมูล
            const cart = await Cart.findOne({ userId: req.userId }).populate('items.productId');
            if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'รถเข็นว่างเปล่า' });

            // ตรวจสอบว่ามีการชื่อหรือไม่
            if (!name) return res.status(400).json({ message: 'กรุณาระบุชื่อของโปรโมชั่นนี้' });

            // ตรวจสอบว่ามีการใส่ราคาหรือไม่
            if (!price) return res.status(400).json({ message: 'กรุณาระบุราคาของโปรโมชั่นนี้' });

            // สร้างรายการโปรโมชั่นขาย
            const promotionItems = cart.items.map(item => ({
                productId: item.productId._id,
                quantity: item.quantity,
            }));

            // เพิ่มรายการโปรโมชั่นขาย
            const addedPromotion = new Promotion({
                name: name,
                items: promotionItems,
                price: price,
                poster: poster
            });

            // บันทึกโปรโมชั่น
            await addedPromotion.save();

            // ลบรถเข็นออกจากระบบ
            await Cart.findOneAndDelete({ userId: req.userId });

            return res.status(200).json({ message: 'สร้างโปรโมชั่นสำเร็จ', addedPromotion });
        } catch (error) { return res.status(500).json({ message: error.message }); }
    });
};

// แสดงโปรโมชั่นทั้งหมด
const getPromotions = async (req, res) => {
    try {
        // เรียกดูข้อมูลโปรโมชั่นทั้งหมด
        const promotions = await Promotion.find().populate('items.productId');
        if (promotions.length === 0) return res.status(500).json({ message: 'ไม่พบโปรโมชั่น' });
        return res.status(200).json({ count: promotions.length, promotions });
    } catch (error) { return res.status(500).json({ message: error.message }); }
};

// แสดงรายละเอียดโปรโมชั่นโดยใช้ Id
const getPromontion = async (req, res) => {
    // รับข้อมูล Id จาก request params
    const { id } = req.params;

    try {
        // เรียกดูข้อมูลโปรโมชั่น
        const promotion = await Promotion.findById(id).populate('items.productId');;
        // ตรวจสอบว่ามีโปรโมชั่นนี้หรือไม่
        if (!promotion) {
            return res.status(400).json({ message: 'ไม่พบโปรโมชั่นนี้' });
        }
        return res.status(200).json(promotion);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// ลบโปรโมชั่น
const deletePromotion = async (req, res) => {
    // รับข้อมูล id จาก request params
    const { id } = req.params;

    try {
        // ตรวจสอบว่ามีโปรโมชั่นในระบบหรือไม่
        const findPromotion = await Promotion.findById(id);
        if (!findPromotion) return res.status(404).json({ message: 'ไม่พบโปรโมชั่นนี้ในระบบ' });

        // ลบโปรโมชั่นนี้ออกจากระบบ
        const deletePromotion = await Promotion.findByIdAndDelete(id);
        return res.status(200).json({ message: 'ลบโปรโมชั่นนี้ออกจากระบบแล้ว', deletePromotion });
    } catch (error) { return res.status(400).json({ message: error.message }); }
};

// แก้ไขโปรโมชั่น
const updatePromotion = async (req, res) => {
    // รับข้อมูล id จาก request params
    const { id } = req.params;
    // ใช้งาน multer (จัดการไฟล์โปสเตอร์)
    upload(req, res, async (error) => {
        if (error) return res.status(500).json({ message: 'ระบบเกิดข้อผิดพลาด' });
        // รับข้อมูลจาก request body
        const { name, price, products } = req.body;
        try {
            // ตรวจสอบว่ามีโปรโมชั่นในระบบหรือไม่
            const findPromotion = await Promotion.findById(id);
            if (!findPromotion) return res.status(404).json({ message: 'ไม่พบโปรโมชั่นนี้ในระบบ' });
            // ตรวจสอบข้อมูลใหม่ที่ส่งมา
            const updates = {};
            if (name) updates.name = name; if (price) updates.price = price;
            // จัดการโปสเตอร์ใหม่
            if (req.file) {
                // ลบโปสเตอร์เก่า
                const oldPosterPath = `path/to/poster/directory/${findPromotion.poster}`;
                if (fs.existsSync(oldPosterPath)) fs.unlinkSync(oldPosterPath);
                // เพิ่มโปสเตอร์ใหม่
                updates.poster = req.file.filename;
            }
            // ถ้ามีการส่งข้อมูลสินค้า (products) มาด้วย
            if (products) {
                // อัปเดตสินค้าภายในโปรโมชั่น
                const updatedItems = findPromotion.items;
                for (const product of products) {
                    const { productId, quantity } = product;
                    // ค้นหาสินค้าในรายการที่มีอยู่
                    const existingProductIndex = updatedItems.findIndex(
                        (item) => item.productId.toString() === productId
                    );
                    if (existingProductIndex !== -1) {
                        // ถ้ามีสินค้าในรายการแล้ว, อัปเดตจำนวน
                        let newQuantity = updatedItems[existingProductIndex].quantity + quantity;
                        // ถ้าค่าของ quantity หลังจากอัปเดตเป็นค่าต่ำกว่า 0, ตั้งเป็น 0
                        if (newQuantity < 0) newQuantity = 0;
                        // อัปเดตจำนวนสินค้า
                        updatedItems[existingProductIndex].quantity = newQuantity;
                        // ถ้าค่าของ quantity เป็น 0, ลบสินค้าจากรายการ
                        if (newQuantity === 0) updatedItems.splice(existingProductIndex, 1);
                    } else {
                        // ถ้าสินค้าใหม่ไม่อยู่ในรายการ, เพิ่มเข้าไป
                        if (quantity > 0) updatedItems.push({ productId, quantity });
                        else return res.status(400).json({ message: 'จำนวนสินค้าต้องมากกว่าศูนย์เมื่อเพิ่มสินค้าใหม่' });
                    }
                }
                // เพิ่มการอัปเดตสินค้าลงใน updates
                updates.items = updatedItems;
            }
            // อัปเดตข้อมูลโปรโมชั่นในฐานข้อมูล
            const updatedPromotion = await Promotion.findByIdAndUpdate(id, updates, { new: true });
            return res.status(200).json({ message: 'แก้ไขโปรโมชั่นสำเร็จ', updatedPromotion });
        } catch (error) { return res.status(400).json({ message: error.message }); }
    });
};

// เพิ่มสินค้าลงในโปรโมชั่น
const addProductToPromotion = async (req, res) => {
    // รับข้อมูล id จาก request params
    const { id } = req.params;

    try {
        // ตรวจสอบว่ามีโปรโมชั่นนี้ในระบบหรือไม่
        const findPromotion = await Promotion.findById(id);
        if (!findPromotion) return res.status(404).json({ message: 'ไม่พบโปรโมชั่นนี้ในระบบ' });
        // รับข้อมูลสินค้าใหม่จาก request body
        const { productId, quantity } = req.body;
        // ตรวจสอบว่ามีสินค้านี้ในระบบหรือไม่
        const findProduct = await Product.findById(productId);
        if (!findProduct) return res.status(400).json({ message: 'ไม่พบสินค้านี้ในระบบ' });
        // ตรวจสอบว่าสินค้านี้มีอยู่ในโปรโมชั่นแล้วหรือไม่
        const existingItem = findPromotion.items.find((item) => item.productId.toString() === productId);
        if (existingItem) {
            // หากสินค้านี้มีอยู่แล้ว ให้ปรับปรุงจำนวนและราคา
            existingItem.quantity = quantity || existingItem.quantity;
            existingItem.price = price || existingItem.price;
        } else {
            // หากสินค้านี้ยังไม่มีในโปรโมชั่น ให้เพิ่มสินค้าใหม่
            findPromotion.items.push({ productId: findProduct._id, quantity: quantity || 1});
        }
        // บันทึกการเปลี่ยนแปลง
        await findPromotion.save();
        return res.status(200).json({ message: 'เพิ่มสินค้าลงในโปรโมชั่นสำเร็จ', findPromotion });
    } catch (error) { return res.status(400).json({ message: error.message }); }
}

module.exports = {
    addedPromotion,
    getPromotions,
    getPromontion,
    deletePromotion,
    updatePromotion,
    addProductToPromotion
}