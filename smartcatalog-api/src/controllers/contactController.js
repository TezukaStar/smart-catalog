// ดึงโมเดลที่เกี่ยวข้องสินค้าจากโฟลเดอร์ models
const Contact = require('../models/contactModel');

// ดึง Dependencies จาก package
const nodemailer = require('nodemailer');

// เพิ่มข้อมูลติดต่อลง Database
const addContact = async (req, res) => {
    // รับข้อมูลจาก request body
    const { name, email, phone, subject, message } = req.body;

    try {
        // บันทึกข้อมูลลง Database
        const contact = new Contact({ name, email, phone, subject, message });
        await contact.save();

        // ส่งอีเมล์แจ้งเตือน
        sendEmailNotification(name, email, subject, message);

        return res.status(201).json({ message: 'ส่งแบบฟอร์มติดต่อเรียบร้อยแล้ว!' });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// ส่งอีเมลแจ้งเตือน
const sendEmailNotification = (name, email, subject, message) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'nitipat1389@gmail.com',
                pass: 'kinpybhddcwrioxa'
            }
        });

        const mailOptions = {
            from: 'nitipat1389@gmail.com',
            to: 'nitipat1389@gmail.com',
            subject: `New Contact Form Submission: ${subject}`,
            text: `
                Name: ${name} 
                Email: ${email}
                Subject: ${subject}
                Message: ${message}
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            }
            console.log('Email sent:', info);
        })
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = {
    addContact
}