// ฟังก์ชันตรวจสอบไฟล์ (อนุญาตเฉพาะรูปภาพ)
const ImageFileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("อนุญาตเฉพาะไฟล์รูปภาพเท่านั้น"), false);
    }
    cb(null, true);
};

// ฟังก์ชันตรวจสอบไฟล์ (อนุญาตเฉพาะ JSON)
const JsonFileFilter = (req, file, cb) => {
    if (file.mimetype !== "application/json") {
        return cb(new Error("อนุญาตเฉพาะไฟล์ JSON เท่านั้น"), false);
    }
    cb(null, true);
};

module.exports = { ImageFileFilter, JsonFileFilter };