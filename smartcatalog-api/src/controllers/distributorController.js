// ดึง Dependencies จาก package
const fs = require('fs');
const multer = require('multer');
const path = require('path');

// ดึงโมเดลที่เกี่ยวข้องสินค้าจากโฟลเดอร์ models
const Distributor = require('../models/distributorModel');

// ดูผู้จัดจำหน่ายทั้งหมด
const getDistributors = async (req, res) => {
    try {
        // เรียกดูข้อมูลผู้จัดจำหน่ายทั้งหมด
        const distributors = await Distributor.find();
        return res.status(200).json({
            count: distributors.length,
            distributors
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// เพิ่มผู้จัดจำหน่าย (Add Distributor)
const addDistributor = async (req, res) => {
    // รับข้อมูล name, email, address และ contactNumber
    const { name, email, address, contactNumber } = req.body;

    try {
        // ตรวจสอบว่ามีการใส่ชื่อของผู้จัดจำหน่ายหรือไม่
        if (!name || name === "") {
            return res.status(400).json({ message: 'กรุณาใส่ชื่อของผู้จัดจำหน่าย' });
        }

        // ตรวจสอบว่ามีการใส่อีเมล์ของผู้จัดจำหน่ายหรือไม่
        if (!email || email === "") {
            return res.status(400).json({ message: 'กรุณาใส่อีเมล์ของผู้จัดจำหน่าย' });
        }

        // ตรวจสอบว่ามีการใส่ที่อยู่ของผู้จัดจำหน่ายหรือไม่
        if (!address || address === "") {
            return res.status(400).json({ message: 'กรุณาใส่ที่อยู่ของผู้จัดจำหน่าย' });
        }

        // ตรวจสอบว่ามีการใส่หมายเลขติดต่อของผู้จัดจำหน่ายหรือไม่
        if (!contactNumber || contactNumber === "") {
            return res.status(400).json({ message: 'กรุณาใส่หมายเลขติดต่อของผู้จัดจำหน่าย' });
        }

        // ตรวจสอบว่าผู้ติดต่อคนนี้มีอยู่ในระบบแล้วหรือไม่
        const distributorName = await Distributor.findOne({ name: name });
        if (distributorName) {
            return res.status(400).json({ message: 'ผู้ติดต่อคนนี้มีอยู่ในระบบแล้ว' });
        }

        // เพิ่มข้อมูลผู้จัดจำหน่าย
        const addDistributor = new Distributor({
            name,
            email,
            address,
            contactNumber
        });

        // บันทึกข้อมูลผู้จัดจำหน่าย
        const savedDistributor = addDistributor.save();
        return res.status(201).json({
            message: 'เพิ่มผู้จัดจำหน่ายรายนี้เรียบร้อยแล้ว',
            addDistributor
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// ดูข้อมูลผู้จัดจำหน่ายผ่าน Id
const getDistributor = async (req, res) => {
    // รับข้อมูล id จาก request params
    const { id } = req.params;

    try {
        // เรียกข้อมูลผู้จัดจำหน่ายจาก id
        const distributor = await Distributor.findById(id);
        // ตรวจสอบว่ามีผู้จัดจำหน่ายรายนี้ในระบบหรือไม่
        if (!distributor) {
            return res.status(404).json({ message: 'ไม่พบผู้จัดจำหน่ายรายนี้ในระบบ' });
        }
        return res.status(200).json(distributor);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// ลบผู้จัดจำหน่าย
const deleteDistributor = async (req, res) => {
    // รับข้อมูล id จาก request params
    const { id } = req.params;

    try {
        // ตรวจสอบว่ามีผู้จัดจำหน่ายรายนี้ในระบบหรือไม่
        const distributor = await Distributor.findById(id);
        if (!distributor) {
            return res.status(404).json({ message: 'ไม่พบผู้จัดจำหน่ายรายนี้ในระบบ' });
        }

        // ลบข้อมูลผู้จัดจำหน่ายรายนี้
        const deleteDistributor = await Distributor.findByIdAndDelete(id);
        return res.status(200).json({
            message: 'ลบผู้จัดจำหน่ายรายนี้ออกจากระบบเรียบร้อยแล้ว',
            deleteDistributor
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// แก้ไขข้อมูลผู้จัดจำหน่าย
const updateDistributor = async (req, res) => {
    // รับข้อมูล id จาก request params
    const { id } = req.params;
    // รับข้อมูล name, email, address และ contactNumber จาก request body
    const { name, email, address, contactNumber } = req.body;

    try {
        // ตรวจสอบว่ามีผู้จัดจำหน่ายรายนี้ในระบบหรือไม่
        const distributor = await Distributor.findById(id);
        if (!distributor) {
            return res.status(404).json({ message: 'ไม่พบผู้จัดจำหน่ายรายนี้ในระบบ' });
        }

        // ตรวจสอบว่ามีชื่อของผู้จัดจำหน่ายรายนี้ในระบบหรือไม่
        const findDistributorName = await Distributor.findOne({ name: name });
        if (findDistributorName) {
            return res.status(400).json({ message: 'มีชื่อของผู้จัดจำหน่ายรายนี้ในระบบแล้ว' })
        }

        // ตรวจสอบว่ามีอีเมล์ของผู้จัดจำหน่ายรายนี้ในระบบหรือไม่
        const findDistributorEmail = await Distributor.findOne({ email: email });
        if (findDistributorEmail) {
            return res.status(400).json({ message: 'มีอีเมล์ของผู้จัดจำหน่ายรายนี้ในระบบแล้ว' });
        }

        // แก้ไขข้อมูลผู้จัดจำหน่าย
        const updateDistributor = await Distributor.findByIdAndUpdate(
            id,
            {
                name: name,
                email: email,
                address: address,
                contactNumber: contactNumber,

            },
            { new: true, runValidators: true }
        );
        return res.status(200).json({
            message: 'แก้ไขข้อมูลผู้จัดจำหน่ายรายนี้เรียบร้อยแล้ว',
            updateDistributor
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// สร้าเส้นทางไปยังโฟลเดอร์ uploads
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ตั้งค่าการอัพโหลดไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // กำหนดโฟลเดอร์ที่ใช้เก็บไฟล์
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

            // ดึงข้อมูลผู้จัดจำหน่ายจากฐานข้อมูล
            const existingDistributors = await Distributor.find({}, { name: 1, email: 1 });
            const existingName = existingDistributors.map(distributor => distributor.name);
            const existingEmail = existingDistributors.map(distributor => distributor.email);

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
            const addedDistributors = await Distributor.insertMany(newEntries);

            return res.status(200).json({
                message: 'เพิ่มหมวดหมู่สินค้าลงในระบบแล้ว',
                totalAdded: `มีข้อมูลที่ถูกเพิ่มเข้าไปจำนวน: ${newEntries.length} ตัว`,
                addedDistributors,
                totalDuplicateEntries: `มีข้อมูลที่ซ้ำกับในระบบจำนวน: ${duplicateEntries.length} ตัว`,
                duplicateEntries,
                totalEmptyDatas: `มีข้อมูลที่ใส่ข้อมูลไม่ครบจำนวน: ${emptyDatas.length} ตัว`,
                emptyDatas
            });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    });
}

// ส่งออก Module
module.exports = {
    getDistributors,
    addDistributor,
    getDistributor,
    deleteDistributor,
    updateDistributor,
    uploadFile
}