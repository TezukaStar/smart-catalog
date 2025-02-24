// ดึง Dependencies จาก package
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// ดึงโมเดลที่เกี่ยวข้องสินค้าจากโฟลเดอร์ models
const User = require('../models/userModel');

// เข้าสู่ระบบ
const login = async (req, res) => {
    // รับข้อมูลจาก request body
    const { email, password } = req.body;

    try {
        // ตรวจสอบว่าผู้ใช้มีอีเมลนี้ในฐานข้อมูลหรือไม่
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'ข้อมูลประจำตัวไม่ถูกต้อง' });
        // เปรียบเทียบรหัสผ่านที่กรอกกับรหัสผ่านในฐานข้อมูล
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'ข้อมูลประจำตัวไม่ถูกต้อง' });
        // ตรวจสอบว่า isVerified เป็น true หรือไม่
        if (!user.isVerified) return res.status(400).json({ message: 'บัญชีของคุณยังไม่ได้รับการยืนยัน' });
        // สร้าง JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '6h' });
        // ส่ง token กลับให้ผู้ใช้
        return res.status(200).json({ message: 'เข้าสู่ระบบสำเร็จ', token });
    } catch (error) { return res.status(500).json({ message: error.message }); }
};

// ฟังก์ชันสร้าง OTP Token
const generateOTPToken = (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000); // สร้าง OTP 6 หลัก
    const token = jwt.sign(
        { email, otp }, // เก็บ OTP และอีเมลใน token
        process.env.JWT_SECRET, // ใช้ secret key ของคุณ
        { expiresIn: '10m' } // กำหนดเวลาหมดอายุ (10 นาที)
    );
    return { token, otp };
};

// ฟังก์ชันส่ง OTP ทางอีเมล
const sendOTP = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // หรือใช้บริการส่งเมลที่ต้องการ
        auth: {
            user: 'nitipat1389@gmail.com', // อีเมลที่ใช้ส่ง
            pass: 'kinpybhddcwrioxa',   // รหัสผ่านของอีเมล
        },
    });

    const mailOptions = {
        from: 'nitipat1389@gmail.com',
        to: email,
        subject: 'รหัส OTP ของคุณสำหรับการยืนยันบัญชี',
        text: `รหัส OTP ของคุณคือ: ${otp} โปรดใช้รหัสนี้เพื่อยืนยันบัญชีของคุณ`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error('ส่งรหัส OTP ล้มเหลว');
    }
};

// ระบบสมัครสมาชิก
const register = async (req, res) => {
    // รับข้อมูลจาก request body
    const { name, companyName, password, email, address, phoneNumber, taxNumber } = req.body;
    try {
        const missingFields = []; // ตรวจสอบว่ามีการใส่ข้อมูลครบถ้วนหรือไม่

        if (!name) missingFields.push('ชื่อ');
        if (!companyName) missingFields.push('ชื่อบริษัท');
        if (!password) missingFields.push('รหัสผ่าน');
        if (!email) missingFields.push('อีเมล');
        if (!address) missingFields.push('ที่อยู่');
        if (!phoneNumber) missingFields.push('หมายเลขโทรศัพท์');
        if (!taxNumber) missingFields.push('เลขประจำตัวผู้เสียภาษี');

        // ถ้ามีฟิลด์ที่ไม่ได้กรอก ให้ส่ง error กลับ
        if (missingFields.length > 0) return res.status(400).json({ message: 'ขาดข้อมูลที่จำเป็น', missingFields });
        const existingUser = await User.findOne({ email }); // ตรวจสอบว่าอีเมลนี้มีผู้ใช้แล้วหรือไม่
        if (existingUser) return res.status(400).json({ message: 'อีเมลได้รับการลงทะเบียนเรียบร้อยแล้ว' });
        const { token, otp } = generateOTPToken(email); // สร้าง OTP Token
        await sendOTP(email, otp); // ส่ง OTP ไปยังอีเมล
        // สร้าง user ใหม่ในฐานข้อมูล แต่ยังไม่ยืนยัน OTP
        const newUser = new User({
            username: name,
            companyName,
            password,
            email,
            address,
            phoneNumber,
            taxNumber,
            otp: token,     // บันทึก OTP ลงในฐานข้อมูล
            isVerified: false, // ผู้ใช้ยังไม่ยืนยัน OTP
        });
        // บันทึกข้อมูลผู้ใช่
        await newUser.save();
        return res.status(200).json({ message: 'ลงทะเบียนผู้ใช้งานเรียบร้อยแล้ว กรุณาตรวจสอบอีเมลของคุณเพื่อรับรหัส OTP' });
    } catch (error) { return res.status(400).json({ message: error.message }); }
};

const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // ค้นหาผู้ใช้ในฐานข้อมูล
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
        // ตรวจสอบว่า OTP Token ยังมีอยู่หรือไม่
        if (!user.otp) return res.status(400).json({ message: 'OTP หมดอายุหรือถูกใช้ไปแล้ว' });
        // ตรวจสอบ OTP Token
        const decoded = jwt.verify(user.otp, process.env.JWT_SECRET); // ใช้ secret key เดียวกับที่ใช้ตอนสร้าง token
        if (decoded.otp !== parseInt(otp, 10)) return res.status(400).json({ message: 'รหัส OTP ไม่ถูกต้อง' });
        // ยืนยันตัวตน
        user.isVerified = true;
        user.otp = null; // ลบ OTP Token ออกจากฐานข้อมูล
        await user.save();

        return res.status(200).json({ message: 'ตรวจสอบบัญชีสำเร็จแล้ว' });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            // ลบผู้ใช้หาก OTP หมดอายุ
            await User.deleteOne({ email });
            return res.status(400).json({ message: 'รหัส OTP หมดอายุ กรุณาลงทะเบียนใหม่อีกครั้ง' });
        }

        return res.status(400).json({ message: error.message });
    }
};

// Export an api
module.exports = {
    login,
    register,
    verifyOTP,
}