require('dotenv').config();
require('./config/database').connect();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const distributorRoutes = require('./routes/distributorRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 🔥 ให้เซิร์ฟเวอร์ให้บริการไฟล์จากโฟลเดอร์ `uploads/`
app.use('/uploads', express.static('uploads'));

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/distributors', distributorRoutes);

const subcategoryRoutes = require('./routes/subcategoryRoutes');
app.use('/subcategories', subcategoryRoutes);

const contactRoutes = require('./routes/contactRoutes');
app.use('/api/contact', contactRoutes);

const brandRoutes = require('./routes/brandRoutes');
app.use('/api/brands', brandRoutes);

const cscodeRoutes = require('./routes/cscodeRoutes');
app.use('/api/cscodes', cscodeRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const newProductRoutes = require('./routes/newProductRoutes');
app.use('/api/newProducts', newProductRoutes);

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || 'เกิดข้อผิดพลาด'
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));





// 📌 โหลดตัวแปรแวดล้อมจากไฟล์ .env (ใช้เชื่อมต่อฐานข้อมูล & ตั้งค่าต่างๆ)
require('dotenv').config();

// 📌 เชื่อมต่อฐานข้อมูล MongoDB (กำหนดใน `config/database.js`)
require('./config/database').connect();

// 📌 Import Dependencies หลักที่ใช้ในระบบ
const express = require('express'); // ใช้สำหรับสร้าง API
const bodyParser = require('body-parser'); // ใช้ parse ข้อมูล JSON และ Form
const path = require('path'); // ใช้จัดการ Path ของไฟล์และโฟลเดอร์
const cors = require('cors'); // ใช้จัดการ CORS

const app = express(); // 📌 สร้าง Express App

// 🌟 ✅ เปิดใช้งาน CORS (แก้ปัญหา Frontend เรียก API ไม่ได้)
app.use(cors({
    origin: "http://localhost:5173", // ✅ อนุญาตเฉพาะ Frontend React (Vite)
    methods: ["GET", "POST", "PUT", "DELETE"], // ✅ อนุญาต Method ที่ต้องใช้
    allowedHeaders: ["Content-Type", "Authorization"] // ✅ อนุญาต Headers ที่ต้องใช้
}));

// 🌟 ✅ เปิดใช้งาน JSON และ Body Parser (รองรับ req.body)
app.use(express.json()); // ✅ ให้ Express อ่านข้อมูล JSON
app.use(express.urlencoded({ extended: true })); // ✅ รองรับข้อมูลแบบ Form
app.use(bodyParser.json()); // ✅ ใช้ Body Parser เพื่อ Parse JSON

// 🌟 ✅ เปิดให้เข้าถึงไฟล์ที่อัปโหลด (เช่น รูปสินค้า)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🌟 ✅ Import Routes (เชื่อม API กับ Controller)
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const distributorRoutes = require('./routes/distributorRoutes');
const subcategoryRoutes = require('./routes/subcategoryRoutes');
const contactRoutes = require('./routes/contactRoutes');
const brandRoutes = require('./routes/brandRoutes');
const cscodeRoutes = require('./routes/cscodeRoutes');
const userRoutes = require('./routes/userRoutes');
const newProductRoutes = require('./routes/newProductRoutes');
const { env } = require('process');

// 🌟 ✅ เชื่อม API Routes ให้ใช้งานได้ (กำหนด Endpoint ของแต่ละ Route)
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/distributors', distributorRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/cscodes', cscodeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/newProducts', newProductRoutes);

// 🌟 ✅ Middleware จัดการ Error ให้ Response JSON กลับไปหา Frontend
app.use((err, req, res, next) => {
    console.error("🔥 เกิดข้อผิดพลาด:", err); // ✅ Debug Error ใน Console
    res.status(err.status || 500).json({
        message: err.message || 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์'
    });
});

// 🌟 ✅ กำหนด PORT และเริ่มรันเซิร์ฟเวอร์
const PORT = process.env.PORT || 3000; // ✅ ใช้ PORT จาก .env หรือ Default เป็น 3000
app.listen(PORT, () => console.log(`🚀 Server is running on port: ${PORT}`));





env
VITE_API_URL=http://localhost:3000
