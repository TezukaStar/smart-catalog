// ดึง Dependencies จาก package
const uploadImages = require('../utils/uploadImages');
const uploadJson = require('../utils/uploadJson');
const path = require('path');
const fs = require('fs');

// ดึงโมเดลที่เกี่ยวข้องสินค้าจากโฟลเดอร์ models
const Product = require('../models/newProductModel');

// ดูข้อมูลทั้งหมด
const getProducts = async (req, res) => {
    try {
        // เรียกข้อมูลทั้งหมด
        const products = await Product.find();
        // ตรวจสอบว่ามีข้อมูลหรือไม่
        if (products.length === 0) return res.status(404).json({ message: 'ไม่พบสินค้า' });
        return res.status(200).json({ count: products.length, products });
    } catch (error) { return res.status(400).json({ message: error.message }) }
};

// เพิ่มข้อมูลสินค้า
const newProduct = async (req, res) => {
    uploadImages.array('images', 5)(req, res, async (error) => {
        if (error) return res.status(400).json({ message: error.message }); // ตรวจสอบข้อผิดพลาด
        // ข้อมูลที่จำเป็น 
        const requiredFields = ['brand', 'cscode', 'itemNumber', 'itemDescription', 'category'];
        // รับข้อมูลจาก body
        const { specifications, specICT, subcategory, ...productData } = req.body;
        // ตรวจสอบว่าข้อมูลครบถ้วนหรือไม่
        if (requiredFields.some(field => !productData[field]))
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลสินค้าครบถ้วน' });
        try {
            // ดึงชื่อไฟล์ที่อัปโหลด
            const imagePaths = req.files.map(file => ({ fileName: file.filename }));
            // สร้างสินค้าใหม่
            const newProduct = new Product({
                ...productData,
                subcategory: subcategory || null,
                specICT: specICT === 'true',
                specifications: specifications ? JSON.parse(specifications) : [],
                images: imagePaths
            });
            // บันทึกข้อมูล
            await newProduct.save();
            return res.status(201).json({ message: 'เพิ่มสินค้าใหม่เรียบร้อยแล้ว', newProduct });
        } catch (error) { return res.status(400).json({ message: error.message }); }
    });
};

// ดูข้อมูลสินค้าจาก Id
const getProduct = async (req, res) => {
    // รับข้อมูล id จาก request params
    const { id } = req.params;

    try {
        // ดูข้อมูลสินค้า
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'ไม่พบสินค้า' });
        return res.status(200).json(product);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// ลบข้อมูลสินค้า
const deleteProduct = async (req, res) => {
    // รับข้อมูล Id จาก request params
    const { id } = req.params;

    try {
        // ตรวจสอบว่ามีสินค้าหรือไม่
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'ไม่พบสินค้า' });

        // ลบสินค้า
        const deleteProduct = await Product.findByIdAndDelete(id);
        if (product.images.length > 0) {
            product.images.forEach((img) => {
                const imagePath = path.join(__dirname, '../uploads/products', img.fileName);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });
        }
        return res.status(200).json({ message: 'ลบสินค้าเรียบร้อยแล้ว', deleteProduct });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// แก้ไขข้อมูลสินค้า
const updateProduct = async (req, res) => {
    uploadImages.array('images', 5)(req, res, async (error) => {
        if (error) return res.status(400).json({ message: error.message }); // ตรวจสอบข้อผิดพลาด
        // รับข้อมูลจาก request params
        const { id } = req.params;
        // ตรวจสอบว่ามีสินค้าตาม id หรือไม่
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'ไม่พบสินค้า' });
        const { specifications, specICT, subcategory, ...productData } = req.body;

        try {
            // ตรวจสอบว่ามีการอัปโหลดรูปใหม่หรือไม่
            if (Array.isArray(req.files) && req.files.length > 0) {
                // ลบรูปเก่าทั้งหมดออกจากเซิร์ฟเวอร์ก่อน
                if (Array.isArray(product.images)) {
                    product.images.forEach((img) => {
                        if (img.fileName) {
                            const imagePath = path.join(__dirname, '../uploads/products/', img.fileName);

                            // ดีบั๊ก: ตรวจสอบเส้นทางไฟล์ที่ต้องการลบ
                            console.log(`กำลังลบไฟล์: ${imagePath}`);

                            // ตรวจสอบว่าไฟล์มีอยู่ในเซิร์ฟเวอร์หรือไม่
                            if (fs.existsSync(imagePath)) {
                                fs.unlinkSync(imagePath);
                                console.log(`ลบไฟล์สำเร็จ: ${imagePath}`);
                            } else {
                                console.log(`ไม่พบไฟล์ที่ต้องการลบ: ${imagePath}`);
                            }
                        }
                    });
                }

                // บันทึกชื่อไฟล์ของรูปใหม่
                product.images = req.files.map((file) => ({ fileName: file.filename }));
            } else {
                // ถ้าไม่มีการอัปโหลดรูปใหม่ ให้เก็บรูปเดิมไว้
                product.images = Array.isArray(product.images) ? product.images : [];
            }

            // อัปเดตข้อมูลสินค้า
            product.brand = productData.brand || product.brand;
            product.cscode = productData.cscode || product.cscode;
            product.itemNumber = productData.itemNumber || product.itemNumber;
            product.vendorItemId = productData.vendorItemId || product.vendorItemId;
            product.itemDescription = productData.itemDescription || product.itemDescription;
            product.price = productData.price !== undefined ? productData.price : product.price;
            product.category = productData.category || product.category;
            product.subcategory = subcategory || product.subcategory;
            product.specICT = specICT === 'true' ? true : product.specICT;
            product.specifications = specifications ? JSON.parse(specifications) : product.specifications;

            // บันทึกข้อมูลที่แก้ไขลงในฐานข้อมูล
            await product.save();

            return res.status(200).json({ message: 'อัปเดตข้อมูลสินค้าสำเร็จแล้ว', product });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    });
};

// ระบบอัปโหลดข้อมูลผ่านไฟล์ .json
const uploadFile = async (req, res) => {
    uploadJson.single('file')(req, res, async (error) => {
        if (error) return res.status(400).json({ message: 'เกิดข้อผิดพลาด' }); // ตรวจสอบข้อผิดพลาด
        if (!req.file) return res.status(400).json({ message: 'กรุณาอัปโหลดไฟล์ .json' }); // ตรวจสอบว่าไฟล์ถูกส่งมาหรือไม่
        // ตรวจสอบประเภทของไฟล์
        if (req.file.mimetype !== 'application/json')
            return res.status(400).json({ message: 'อนุญาตเฉพาะไฟล์ .json เท่านั้น' });

        try {
            const fileContent = req.file.buffer.toString('utf-8'); // อ่านข้อมูลจากไฟล์ในหน่วยความจำ
            const parsedDatas = JSON.parse(fileContent); // แปลงข้อมูลให้เป็น JSON
            // ตรวจสอบข้อมูลในไฟล์ (optional)
            if (!Array.isArray(parsedDatas) || parsedDatas.length === 0)
                return res.status(400).json({ message: 'ไฟล์ไม่มีข้อมูลสินค้า หรือรูปแบบข้อมูลไม่ถูกต้อง' });

            const addedProducts = await Product.insertMany(parsedDatas); // นำเข้าข้อมูลใหม่ทั้งหมด

            return res.status(200).json({ message: 'เพิ่มสินค้าลงในระบบแล้ว', total: parsedDatas.length, addedProducts });
        } catch (error) { res.status(400).json({ message: error.message }); }
    });
};

// ฟังก์ชันเปรียบเทียบ spec ของสินค้า
function compareSpecProducts(product1, product2, product3) {
    const comparison = {}; // สร้างอ็อบเจ็กต์สำหรับเก็บผลการเปรียบเทียบ
    // รวบรวมชื่อฟีเจอร์ทั้งหมดจากทั้งสองสินค้า
    const allSpecNames = new Set([
        ...product1.specifications.map((s) => s.name), // ดึงชื่อ Spec. จาก Product 1
        ...product2.specifications.map((s) => s.name), // ดึงชื่อ Spec. จาก Product 2
        ...product3.specifications.map((s) => s.name), // ดึงชื่อ Spec. จาก Product 3
    ]);
    // วนลูปเพื่อเปรียบเทียบฟีเจอร์ที่มีในทั้งสองสินค้า
    allSpecNames.forEach((specName) => {
        const specProduct1 = product1.specifications.find((s) => s.name === specName);
        const specProduct2 = product2.specifications.find((s) => s.name === specName);
        const specProduct3 = product3.specifications.find((s) => s.name === specName);

        // บันทึกผลการเปรียบเทียบ
        comparison[specName] = {
            // หากพบฟีเจอร์ใน Product 1 ให้แสดง description, ถ้าไม่พบให้แสดง 'N/A'
            product1: specProduct1 ? specProduct1.description : 'N/A',
            product2: specProduct2 ? specProduct2.description : 'N/A',
            product3: specProduct3 ? specProduct3.description : 'N/A'
        };
    });
    return comparison;
};

// เปรียบเทียบสินค้า
const compareProduct = async (req, res) => {
    // รับข้อมูล จาก request body
    const { productId1, productId2, productId3 } = req.body;

    try {
        // ตรวจสอบว่ามีสินค้าชิ้นนี้หรือไม่
        const product1 = await Product.findById(productId1);
        const product2 = await Product.findById(productId2);
        const product3 = await Product.findById(productId3);
        if (!product1 || !product2 || !product3) return res.status(404).json({ message: 'ไม่พบสินค้า' });
        const comparisonResult = compareSpecProducts(product1, product2, product3);
        return res.status(200).json(comparisonResult);
    } catch (error) { return res.status(400).json({ message: error.message }) }
};

// กรองสินค้าผ่าน
const filterProduct = async (req, res) => {
    // รับข้อมูลจาก request query
    const { brand, cscode, minPrice, maxPrice, category, specICT } = req.query;
    try {
        const filters = {}; // สร้างตัวกรองแบบ dynamic
        if (brand) filters.brand = brand; // กรองตาม brand
        if (cscode) filters.cscode = cscode; // กรองตาม cscode
        // กรองตามช่วงราคา
        if (minPrice && maxPrice) filters.price = {
            $gte: parseFloat(minPrice), // มากกว่าหรือเท่ากับ minPrice
            $lte: parseFloat(maxPrice), // น้อยกว่าหรือเท่ากับ maxPrice
        }
        if (category) filters.category = category // กรองตามหมวดหมู่
        if (specICT !== undefined) filters.specICT = specICT === 'true';
        const products = await Product.find(filters) // ค้นหาสินค้า
        if (!products) return res.status(404).json({ message: 'ไม่พบสินค้า' });
        return res.status(200).json({ count: products.length, products });
    } catch (error) { return res.status(400).json({ message: error.message }); }
};

// ค้นหาสินค้าด้วย keyword
const searchProduct = async (req, res) => {
    // รับข้อมูลจาก request query
    const { keyword } = req.query;

    try {
        // สร้าง Query Object ตาม keyword ที่ให้มา
        let query = {};
        // ปรับการค้นหาโดยไม่คำนึงถึงตัวพิมพ์เล็ก/ใหญ่
        query.itemDescription = { $regex: keyword, $options: 'i' };
        // ดำเนินการค้นหาข้อมูล
        const products = await Product.find(query);
        // ตรวจสอบว่ามีสินค้าหรือไม่
        if (products.length === 0) return res.status(404).json({ message: 'ไม่พบสินค้า' });
        return res.status(200).json({ count: products.length, products });
    } catch (error) { return res.status(400).json({ message: error.message }); }
};

// ส่งออก API
module.exports = {
    getProducts,
    newProduct,
    getProduct,
    deleteProduct,
    updateProduct,
    uploadFile,
    compareProduct,
    filterProduct,
    searchProduct
}