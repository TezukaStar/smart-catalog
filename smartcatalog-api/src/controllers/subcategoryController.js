// ดึง Dependencies จาก package
const fs = require('fs');
const multer = require('multer');
const path = require('path');

// ดึงโมเดลที่เกี่ยวข้องสินค้าจากโฟลเดอร์ models
const Subcategory = require('../models/subcategoryModel');
const Category = require('../models/categoryModel');

// ดู Subcategory ทั้งหมด
const getSubcategories = async (req, res) => {
    try {
        // เรียกดูข้อมูล Subcategory ทั้งหมด
        const subcategories = await Subcategory.find().populate('category');
        return res.status(200).json(subcategories);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ดู Subcategory ทั้งหมดที่มี Category เดียวกัน
const getSubcategoriesByCategory = async (req, res) => {
    // รับข้อมูล categoryId จาก request params
    const { categoryId } = req.params;

    try {
        // ตรวจสอบว่ามี Category อยู่ในระบบหรือไม่
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'ไม่พบ Category นี้ในระบบ' });
        }

        // เรียกดูข้อมูล Subcategory ทั้งหมดที่มี categoryId เดียวกัน
        const subcategories = await Subcategory.find({ category: categoryId });
        return res.status(200).json(subcategories);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// ดูข้อมูล Subcategory จาก Id
const getSubcategory = async (req, res) => {
    // รับข้อมูล id จาก request params
    const { id } = req.params

    try {
        // เรียกดูข้อมูลจาก id
        const subcategory = await Subcategory.findById(id).populate('category');
        // ตรวจสอบว่ามี Subcategory นี้หรือไม่
        if (!subcategory) {
            return res.status(404).json({ message: 'ไม่พบ Subcategory นี้ในระบบ' });
        }
        return res.status(200).json(subcategory);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// เพิ่ม Subcategory
const addSubcategory = async (req, res) => {
    // รับข้อมูล name และ categoryId จาก request body
    const { name, categoryId } = req.body;

    try {
        // ตรวจสอบว่ามี Category อยู่ในระบบหรือไม่
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'ไม่พบ Category นี้ในระบบ' });
        }

        // ตรวจสอบว่ามีชื่อ Subcategory นี้ในระบบหรือไม่
        const subcategory = await Subcategory.findOne({ name: name });
        if (subcategory) {
            return res.status(400).json({ message: 'มีชื่อ Subcategory นี้ในระบบแล้ว' });
        }

        // เพิ่ม Subcategory ใหม่ลงในระบบ
        const addSubcategory = new Subcategory({
            name: name,
            category: categoryId
        });

        // บันทึก Subcategory
        const saveSubcategory = addSubcategory.save();
        return res.status(201).json({
            message: 'เพิ่ม Subcategory ใหม่ลงในระบบแล้ว',
            addSubcategory
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// ลบ Subcategory
const deleteSubcategory = async (req, res) => {
    // รับข้อมูล id จาก request params
    const { id } = req.params;

    try {
        // ตรวจสอบว่ามี Subcategory อยู่ในระบบหรือไม่
        const subcategory = await Subcategory.findById(id);
        if (!subcategory) {
            return res.status(404).json({ message: 'ไม่พบ Subcategory นี้ในระบบ' });
        }

        // ลบ Subcategory นี้ออกจากระบบ
        const deleteSubcategory = await Subcategory.findByIdAndDelete(id);
        return res.status(200).json({
            message: 'ลบ Subcategory ออกจากระบบแล้ว',
            deleteSubcategory
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// แก้ไข Subcategory
const updateSubcategory = async (req, res) => {
    // รับข้อมูล id จาก request params
    const { id } = req.params;

    // รับข้อมูล name และ categoryId จาก request body
    const { name, categoryId } = req.body;

    try {
        // ตรวจสอบว่ามี Subcategory นี้อยู่ในระบบหรือไม่
        const subcategory = await Subcategory.findById(id);
        if (!subcategory) {
            return res.status(404).json({ message: 'ไม่พบ Subcategory นี้ในระบบ ' });
        }

        // ตรวจสอบว่ามีชื่อ Subcategory อยู่ในระบบหรือไม่
        const subcategoryName = await Subcategory.findOne({ name: name });
        if (subcategoryName) {
            return res.status(404).json({ message: 'มีชื่อ Subcategory นี้ในระบบแล้ว' });
        }

        // ตรวจสอบว่ามี Category นี้มีในระบบหรือไม่
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'ไม่พบ Category นี้ในระบบ' });
        }

        // แก้ไขข้อมูล Subcategory นี้
        const updateSubcategory = await Subcategory.findByIdAndUpdate(
            id,
            { name, category: categoryId },
            { new: true, runVaildators: true }
        );
        return res.status(200).json({
            message: 'แก้ไขข้อมูล Subcategory นี้เรียบร้อยแล้ว',
            updateSubcategory
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// สร้างเส้นทางไปยังโฟลเดอร์ uploads
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ตั้งค่าการอัปโหลดไฟล์ข้อมูล
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // กำหนดโฟลเดอร์ที่ใช้เก็บข้อมูล
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // สร้างชื่อไฟล์ที่ไม่ซ้ำกันโดยใช้ไทม์สแตมป์และตัวเลขสุ่ม
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// การตั้งค่า Multer เพื่อเก็บไฟล์ในหน่วยความจำ
const upload = multer({ storage: multer.memoryStorage() }).single('file');

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

            // ดึงข้อมูลประเภทจากฐานข้อมูล
            const existingSubcategories = await Subcategory.find({}, { name: 1 });
            const existingName = existingSubcategories.map(subcategory => subcategory.name);

            // ดึงข้อมูลหมวดหมู่จากฐานข้อมูล
            const categories = await Category.find({}, { _id: 1 });
            const categoryId = categories.map(category => category._id.toString());

            // ตรวจสอบความถูกต้องของข้อมูล
            const emptyDatas = [];
            const duplicateEntries = [];
            const newEntries = [];
            const invalidDatas = [];
            parsedData.forEach(item => {
                // ตรวจสอบว่ามีการใส่ข้อมูลหรือไม่
                if (!item.name || !item.category) {
                    emptyDatas.push(item);
                }
                // ตรวจสอบว่ามีชื่อประเภทสินค้าซ้ำหรือไม่
                else if (existingName.includes(item.name)) {
                    duplicateEntries.push(item);
                }
                // ตรวจสอบว่ามีข้อมูลหมวดหมู่ในระบบหรือไม่
                else if (!categoryId.includes(item.category)) {
                    invalidDatas.push(item);
                }
                // ดำเนินการตามปกติ
                else {
                    newEntries.push(item);
                }
            });

            // ตรวจสอบว่าข้อมูลทั้งหมดซ้ำกับใน Database
            if (newEntries.length === 0) {
                return res.status(400).json({ message: 'ข้อมูลสินค้าของคุณทั้งหมดมีอยู่ในระบบแล้ว' });
            }

            // นำเข้าข้อมูลใหม่ทั้งหมด
            const addedSubcategories = await Subcategory.insertMany(newEntries);

            return res.status(200).json({
                message: 'เพิ่มประเภทสินค้าลงในระบบแล้ว',
                totalAdded: `มีข้อมูลที่ถูกเพิ่มเข้าไปจำนวน: ${newEntries.length} ตัว`,
                addedSubcategories,
                totalDuplicateEntries: `มีข้อมูลที่ซ้ำกับในระบบจำนวน: ${duplicateEntries.length} ตัว`,
                duplicateEntries,
                totalEmptyDatas: `มีข้อมูลที่ใส่ข้อมูลไม่ครบจำนวน: ${emptyDatas.length} ตัว`,
                emptyDatas,
                totalInvalidData: `มีข้อมูลที่ไม่ถูกต้องจำนวน: ${invalidDatas.length} ตัว`,
                invalidDatas
            });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    });
};

// ส่งออก Module
module.exports = {
    getSubcategories,
    getSubcategoriesByCategory,
    getSubcategory,
    addSubcategory,
    deleteSubcategory,
    updateSubcategory,
    uploadFile
}