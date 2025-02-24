import { useState } from "react";
import AdminLayout from "../Layouts/AdminLayout";
import SearchProductList from "./SearchProductList";
import TypePage from "../Components/Type"

const AddPromotionPage = () => {
  const [promotionName, setPromotionName] = useState(""); // ชื่อโปรโมชั่น
  const [promotionPrice, setPromotionPrice] = useState(0); // ราคาของโปรโมชั่น
  const [image, setImage] = useState(null); // เก็บไฟล์รูปภาพ
  const token = localStorage.getItem("token") || ""; // ดึง token สำหรับ API

  // ✅ อัปโหลดรูปภาพ
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("❌ กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น!");
      return;
    }

    setImage(file); // บันทึกไฟล์รูปลงใน state
  };

  // ✅ เคลียร์รูปภาพ
  const handleClearImage = () => {
    setImage(null);
  };

  // ✅ ฟังก์ชันส่งข้อมูลไป API
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!promotionName.trim()) {
      alert("❌ กรุณากรอกชื่อโปรโมชั่น!");
      return;
    }

    const formData = new FormData();
    formData.append("name", promotionName);
    formData.append("price", promotionPrice || 0);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("http://localhost:3000/api/promotions", {
        headers: { Authorization: `Bearer ${token}` },
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "เกิดข้อผิดพลาดในการบันทึกโปรโมชั่น");
      }

      alert("✅ บันทึกโปรโมชั่นสำเร็จ!");
      setPromotionName("");
      setPromotionPrice(0);
      setImage(null);
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
      console.error("❌ บันทึกโปรโมชั่นล้มเหลว:", error);
    }
  };

  return (
    <AdminLayout>
      <TypePage/>
      <div className="w-full max-w-full mx-auto  shadow-2xl bg-white overflow-hidden">
        <h2 className="text-2xl font-bold mb-1 px-5 py-6">จัดเซตโปรโมชั่น</h2>
        <SearchProductList/>
        <form className="max-w-full mx-auto p-6 bg-white rounded shadow-lg" onSubmit={handleSubmit}>

          {/* ✅ ช่องกรอกชื่อโปรโมชั่น */}
          <div className="mb-4">
            <label className="font-semibold block mb-2">ชื่อโปรโมชั่น</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="ใส่ชื่อโปรโมชั่น..."
              value={promotionName}
              onChange={(e) => setPromotionName(e.target.value)}
            />
          </div>


          {/* ✅ ส่วนอัปโหลดรูป */}
          <h3 className="text-xl font-bold mt-6">📸 รูปสินค้า</h3>
          <div className="flex flex-col items-center gap-4 p-4 bg-gray-100 rounded-lg">
            <label className="w-48 h-48 border-2 border-dashed bg-white border-blue-400 flex items-center justify-center cursor-pointer rounded-lg overflow-hidden">
              {image ? (
                <img src={URL.createObjectURL(image)} className="w-full h-full object-cover" />
              ) : (
                <span className="text-9xl text-blue-500">+</span>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>

            {image && (
              <button type="button" onClick={handleClearImage} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                ล้างรูปที่อัปโหลด
              </button>
            )}
          </div>
          {/* ✅ ช่องกรอกราคาของโปรโมชั่น */}
          <div className="mt-6">
            <label className="font-semibold block mb-2">ราคาของโปรโมชั่น</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="ระบุราคาของโปรโมชั่น"
              value={promotionPrice}
              onChange={(e) => setPromotionPrice(e.target.value ? Number(e.target.value) : 0)}
              min="0"
            />
          </div>

          {/* ✅ ปุ่มบันทึกโปรโมชั่น */}
          <button type="submit" className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 w-full">
            บันทึกโปรโมชั่น
          </button>
        </form>
           
        </div>
    
    </AdminLayout>
  );
};

export default AddPromotionPage;
