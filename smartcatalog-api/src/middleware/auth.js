// ดึง Dependencies จาก package
const jwt = require('jsonwebtoken');

// ดึงโมเดลที่เกี่ยวข้องสินค้าจากโฟลเดอร์ models
const User = require('../models/userModel');

// การรับรองความถูกต้อง
const auth = (req, res, next) => {
    // ดึง token จาก header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'การเข้าถึงถูกปฏิเสธ ไม่มีการให้โทเค็น' });
    }

    try {
        // ตรวจสอบและถอดรหัส token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id; // เก็บข้อมูล user ที่ตรวจสอบแล้ว
        next();
    } catch (error) {
        return res.status(400).json({ message: 'กรุณาเข้าสู่ระบบ' });
    }
};

// การรับรองความถูกต้องสำหรับผู้ดูแลระบบ
const adminAuth = async (req, res, next) => {
    try {
        // ดึง token จาก header
        const token = req.header('Authorization').replace('Bearer ', '');

        // ตรวจสอบและถอดรหัส token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ตรวจสอบว่าผู้ใช้มีบทบาทเป็น admin หรือไม่
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
        }

        if (user.role !== 'admin') {
            return res.status(400).json({ message: 'ปฏิเสธการเข้าถึง เฉพาะผู้ดูแลระบบเท่านั้น' });
        }

        // ถ้าผ่านการตรวจสอบทั้งหมด ให้ไปยัง middleware ถัดไป
        req.userId = decoded.id;
        next();

    } catch (error) {
        return res.status(400).json({ message: 'กรุณาเข้าสู่ระบบ' })
    }
};

module.exports = {
    auth,
    adminAuth
}