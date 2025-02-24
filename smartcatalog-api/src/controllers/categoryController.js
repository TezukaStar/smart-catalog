// ดึง Dependencies จาก package
const fs = require('fs');
const multer = require('multer');
const path = require('path');

// ดึงโมเดลที่เกี่ยวข้องสินค้าจากโฟลเดอร์ models
const Category = require('../models/categoryModel');

// สร้าเส้นทางไปยังโฟลเดอร์ uploads
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// การตั้งค่า Multer เพื่อเก็บไฟล์ในหน่วยความจำ
const upload = multer({ storage: multer.memoryStorage() }).single('file');

// ดูข้อมูลหมวดหมู่สินค้าทั้งหมด
const getCategories = async (req, res) => {
    try {
        // เรียกดูข้อมูลหมวดหมู่สินค้าทั้งหมด
        const categories = await Category.find();
        return res.status(200).json({
            count: categories.length,
            categories
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// เพิ่มข้อมูลหมวดหมู่สินค้า
const addCategory = async (req, res) => {
    // รับข้อมูล name จาก request body
    const { code, name } = req.body;

    try {
        // ตรวจสอบว่ามีชื่อหมวดหมู่สินค้านี้ในระบบหรือไม่
        const category = await Category.findOne({ name: name });
        if (category) {
            return res.status(400).json({ message: 'ชื่อหมวดหมู่สินค้านี้มีในระบบแล้ว' });
        }

        // เพิ่มข้อมูลหมวดหมู่สินค้าลงในระบบ
        const addCategory = new Category({ name: name });

        // บันทึกหมวดหมู่สินค้า
        const saveCategory = addCategory.save();
        return res.status(201).json({
            message: 'เพิ่มข้อมูลหมวดหมู่สินค้าเรียบร้อยแล้ว',
            addCategory
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// ดูข้อมูลหมวดหมู่สินค้าผ่าน Id
const getCategory = async (req, res) => {
    // รับข้อมูล id จาก request params
    const { id } = req.params;

    try {
        // ตรวจสอบว่ามีหมวดหมู่สินค้าชิ้นนี้หริอไม่
        const category = await Category.findById(id);
        if (!category) {
            return res.status(400).json({ message: 'ไม่พบหมวดหมู่สินค้านี้ในระบบ' });
        }
        return res.status(200).json(category);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// ลบหมวดหมู่สินค้า
const deleteCategory = async (req, res) => {
    // รับข้อมูล id จาก request params
    const { id } = req.params;

    try {
        // ตรวจสอบว่ามีหมวดหมู่สินค้าชิ้นนี้หริอไม่
        const category = await Category.findById(id);
        if (!category) {
            return res.status(400).json({ message: 'ไม่พบหมวดหมู่สินค้านี้ในระบบ' });
        }

        // ลบข้อมูลหมวดหมู่สินค้า
        const deleteCategory = await Category.findByIdAndDelete(id);
        return res.status(200).json({
            message: 'ลบข้อมูลหมวดหมู่สินค้านี้เรียบร้อยแล้ว',
            deleteCategory
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// แก้ไขข้อมูลหมวดหมู่สินค้า
const updateCategory = async (req, res) => {
    // รับข้อมูล id จาก request params
    const { id } = req.params;
    // รับข้อมูล name จาก request body
    const { name } = req.body;

    try {
        // ตรวจสอบว่ามีหมวดหมู่สินค้าชิ้นนี้หริอไม่
        const category = await Category.findById(id);
        if (!category) {
            return res.status(400).json({ message: 'ไม่พบหมวดหมู่สินค้านี้ในระบบ' });
        }

        // ตรวจสอบว่ามีชื่อหมวดหมู่สินค้านี้ในระบบหรือไม่
        const findCategoryName = await Category.findOne({ name: name });
        if (findCategoryName) {
            return res.status(400).json({ message: 'ชื่อหมวดหมู่สินค้านี้มีในระบบแล้ว' });
        }

        // แก้ไขข้อมูลหมวดหมู่สินค้า
        const updateCategory = await Category.findByIdAndUpdate(
            id,
            { name: name },
            { new: true, runValidators: true }
        );
        return res.status(200).json({
            message: 'แก้ไขข้อมูลหมวดหมู่สินค้าเรียบร้อยแล้ว',
            updateCategory
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// ระบบอัปโหลดข้อมูลผ่านไฟล์ .json
const uploadFile = async (req, res) => {
    // ใช้ multer สำหรับการอัปโหลดไฟล์
    upload(req, res, async (error) => {
        if (error) {
            return res.status(404).json({ message: 'ระบบเกิดข้อผิดพลาด' });
        }

        // ตรวจสอบว่าไฟล์ถูกส่งมาหรือไม่
        if (!req.file) {
            return res.status(400).json({ message: 'กรุณาอัปโหลดไฟล์ .json' });
        }

        // ตรวจสอบประเภทของไฟล์
        if (req.file.mimetype !== 'application/json') {
            return res.status(400).json({ message: 'อนุญาตเฉพาะไฟล์ .json เท่านั้น' });
        }

        try {
            // อ่านข้อมูลจากไฟล์ในหน่วยความจำ
            const fileContent = req.file.buffer.toString('utf-8');

            // แปลงข้อมูลให้เป็น JSON
            const parsedData = JSON.parse(fileContent);

            // ตรวจสอบข้อมูลในไฟล์ (optional)
            if (!Array.isArray(parsedData) || parsedData.length === 0) {
                return res.status(400).json({ message: 'ไฟล์ไม่มีข้อมูลสินค้า หรือรูปแบบข้อมูลไม่ถูกต้อง' });
            }

            // ดึงข้อมูลหมวดหมู่จากฐานข้อมูล
            const existingCategories = await Category.find({}, { name: 1 });
            const existingName = existingCategories.map(category => category.name);

            // ตรวจสอบความถูกต้องของข้อมูล
            const emptyDatas = [];
            const duplicateEntries = [];
            const newEntries = [];
            parsedData.forEach(item => {
                // ตรวจสอบว่ามีการใส่ข้อมูลหรือไม่
                if (!item.name) {
                    emptyDatas.push(item);
                }
                // ตรวจสอบว่ามีชื่อหมวดหมู่สินค้าซ้ำหรือไม่
                else if (existingName.includes(item.name)) {
                    duplicateEntries.push(item);
                }
                // ดำเนินการตามปกติ
                else {
                    newEntries.push(item);
                }
            });

            // ตรวจสอบว่าข้อมูลทั้งหมดซ้ำกับใน Database
            if (newEntries.length === 0) {
                return res.status(400).json({ message: 'ข้อมูลหมวดหมู่สินค้าของคุณทั้งหมดมีอยู่ในระบบแล้ว' });
            }

            // นำเข้าข้อมูลใหม่ทั้งหมด
            const addedCategories = await Category.insertMany(newEntries);

            return res.status(200).json({
                message: 'เพิ่มหมวดหมู่สินค้าลงในระบบแล้ว',
                totalAdded: `มีข้อมูลที่ถูกเพิ่มเข้าไปจำนวน: ${newEntries.length} ตัว`,
                addedCategories,
                totalDuplicateEntries: `มีข้อมูลที่ซ้ำกับในระบบจำนวน: ${duplicateEntries.length} ตัว`,
                duplicateEntries,
                totalEmptyDatas: `มีข้อมูลที่ใส่ข้อมูลไม่ครบจำนวน: ${emptyDatas.length} ตัว`,
                emptyDatas
            })

        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    });
};

// ส่งออกตัว module
module.exports = {
    getCategories,
    addCategory,
    getCategory,
    deleteCategory,
    updateCategory,
    uploadFile
}