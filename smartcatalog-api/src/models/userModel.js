// ดึง Dependencies จาก package
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// โครงร่างของแบบจำลองผู้ใช้
const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: [true, 'จำเป็นต้องมีชื่อผู้ใช้'], trim: true },
        companyName: { type: String, required: [true, 'จำเป็นต้องมีชื่อบริษัท'], trim: true },
        password: { type: String, required: [true, 'จำเป็นต้องมีรหัสผ่าน'], minlength: 6, /* ตั้งค่าความยาวขั้นต่ำของรหัสผ่าน */ },
        email: { type: String, required: [true, 'จำเป็นต้องมีอีเมล์'], unique: true, lowercase: true, trim: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email format"], /* ตรวจสอบรูปแบบอีเมล */ },
        phoneNumber: { type: String, required: [true, 'จำเป็นต้องมีหมายเลขโทรศัพท์'],
            match: [/^\d+$/, 'หมายเลขโทรศัพท์ไม่ถูกต้อง'], /* ตรวจสอบว่าเป็นตัวเลขเท่านั้น */ },
        address: { type: String, required: [true, 'จำเป็นต้องมีที่อยู่'], trim: true },
        taxNumber: { type: String, required: [true, 'จำเป็นต้องมีหมายเลขภาษี'], trim: true },
        role: { type: String, enum: ['user', 'admin'], /* จำกัดค่าที่สามารถเป็นได้ */ default: 'user', /* ตั้งค่าเริ่มต้นเป็น 'user' */},
        isVerified: { type: Boolean, default: false, /* ผู้ใช้ยังไม่ยืนยันตัวตน */ },
        otp: { type: String, /* เก็บ JWT Token ของ OTP */ },
        resetPasswordToken: { type: String, /* Token สำหรับการรีเซ็ตรหัสผ่าน */ default: null },
        resetPasswordExpires: { type: Date, /* วันหมดอายุของ Token */ default: null }
    },
    {
        timestamps: true, // เพิ่ม createdAt และ updatedAt อัตโนมัติ
    }
);

// เข้ารหัสรหัสผ่านก่อนบันทึก (middleware)
userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next(); // ถ้ารหัสผ่านไม่ได้ถูกแก้ไข ให้ข้ามไป
        const salt = await bcrypt.genSalt(10); // สร้าง salt
        this.password = await bcrypt.hash(this.password, salt); // เข้ารหัสรหัสผ่าน
        next();
    } catch (error) {
        next(error);
    }
});

// ฟังก์ชันสำหรับตรวจสอบรหัสผ่าน
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// ส่งออกโมเดล
module.exports = mongoose.model("User", userSchema);