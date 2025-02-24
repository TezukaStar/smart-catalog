// ดึง Dependencies จาก package
const fs = require('fs');
const multer = require('multer');
const path = require('path');

// ดึงโมเดลที่เกี่ยวข้องสินค้าจากโฟลเดอร์ models
const Brand = require('../models/brandModel');

// แสดงแบรนด์สินค้าทั้งหมด
const getBrands = async (req, res) => {
    try {
        // เรียกข้อมูล Brand สินค้าทั้งหมด
        const brands = await Brand.find();
        // ตรวจสอบว่ามีข้อมูล Brand สินค้าหรือไม่
        if (brands.length === 0) return res.status(404).json({ message: 'ไม่พบข้อมูล Brand' });
        return res.status(200).json({ count: brands.length, brands });
    } catch (error) { return res.status(500).json({ message: error.message }); }
};

// แสดงรายละเอียดแบรนด์
const getBrandById = async (req, res) => {
    // รับ id จาก params
    const { id } = req.params;
    try {
        // ค้นหาแบรนด์
        const brand = await Brand.findById(id);
        if (!brand) return res.status(404).json({ message: 'ไม่พบแบรนด์' });
        return res.status(200).json(brand);
    } catch (error) { return res.status(400).json({ message: error.message }); }
};

// เพิ่มข้อมูลแบรนด์
const newBrand = async (req, res) => {
    // รับ name จาก body
    const { name } = req.body;
    try {
        // ค้นหาชื่อแบรนด์
        const brand = await Brand.find(name);
        if (brand) return res.status(400).json({ message: 'แบรนด์นี้มีอยู่ในระบบแล้ว' });
        // สร้างแบรนใหม่
        const newBrand = new Brand(name);
        // บันทึกข้อมูล
        const saveBrand = await newBrand.save();
        return res.status(200).json({ message: 'สร้างแบรนด์ใหม่เรียบร้อย', saveBrand });
    } catch (error) { return res.status(400).json({ message: error.message }); }
};

// แก้ไขแบรนด์สินค้า
const updateBrandById = async (req, res) => {
    // รับ id จาก params
    const { id } = req.params;
    // รับ name จาก body
    const { name } = req.body;
    try {
        // ค้นหาแบรนด์
        const brand = await Brand.findById(id);
        if (!brand) return res.status(404).json({ message: 'ไม่พบแบรนด์' });
        // อัปเดตข้อมูลแบรนด์
        brand.name = name || brand.name;
        // บันทึกข้อมูล
        const saveBrand = await brand.save();
        return res.status(200).json({ message: 'อัปเดตข้อมูลแบรนด์เรียบร้อยแล้ว', saveBrand });
    } catch (error) { return res.status(400).json({ message: error.message }); }
};

// ลบแบรนด์สินค้า
const removeBrandById = async (req, res) => {
    // รับ id จาก params
    const { id } = req.params;
    try {
        // ค้นหาแบรนด์
        const brand = await Brand.findById(id);
        if (!brand) return res.status(404).json({ message: 'ไม่พบแบรนด์' });
        const removeBrand = await Brand.findByIdAndDelete(id);
        return res.status(200).json({ message: 'ลบข้อมูลแบรนด์เรียบร้อยแล้ว', removeBrand });
    } catch (error) { return res.status(400).json({ message: error.message }); }
};

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

            // ดึงข้อมูลผู้จัดจำหน่ายจากฐานข้อมูล
            const existingBrands = await Brand.find({}, { name: 1, email: 1 });
            const existingName = existingBrands.map(brand => brand.name);
            const existingEmail = existingBrands.map(brand => brand.email);

            // ตรวจสอบความถูกต้องของข้อมูล
            const emptyDatas = [];
            const duplicateEntries = [];
            const newEntries = [];
            parsedData.forEach(item => {
                // ตรวจสอบว่ามีการใส่ข้อมูลหรือไม่
                if (!item.name) {
                    emptyDatas.push(item);
                }
                // ตรวจสอบว่ามีชื่อผู้จัดจำหน่ายสินค้าซ้ำหรือไม่
                else if (existingName.includes(item.name) || existingEmail.includes(item.email)) {
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
            const addedBrands = await Brand.insertMany(newEntries);

            return res.status(200).json({
                message: 'เพิ่มหมวดหมู่สินค้าลงในระบบแล้ว',
                totalAdded: `มีข้อมูลที่ถูกเพิ่มเข้าไปจำนวน: ${newEntries.length} ตัว`,
                addedBrands,
                totalDuplicateEntries: `มีข้อมูลที่ซ้ำกับในระบบจำนวน: ${duplicateEntries.length} ตัว`,
                duplicateEntries,
                totalEmptyDatas: `มีข้อมูลที่ใส่ข้อมูลไม่ครบจำนวน: ${emptyDatas.length} ตัว`,
                emptyDatas
            });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    });
};

module.exports = {
    getBrands,
    getBrandById,
    newBrand,
    updateBrandById,
    removeBrandById,
    uploadFile
}