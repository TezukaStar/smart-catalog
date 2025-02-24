import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoADD from "../../assets/Image/addProduct.png";

export default function AddProductSelection() {
  const [productType, setProductType] = useState("สินค้า"); // ✅ ค่าเริ่มต้นเป็น "สินค้า"
  const navigate = useNavigate();

  // ✅ กดปุ่ม → เปลี่ยนสีปุ่มทันที + ไปหน้าที่ต้องการ
  const handleSelection = (type) => {
    setProductType(type); // ✅ เปลี่ยนสีปุ่มก่อน
    setTimeout(() => {
      if (type === "สินค้า") {
        navigate("/add-product");
      } else if (type === "โปรโมชั่นแพ็กเกจ") {
        navigate("/add-promotion");
      }
    }, 50); // ✅ ดีเลย์เล็กน้อยให้ React อัปเดตก่อนเปลี่ยนหน้า
  };

  return (
    <div className="w-full max-w-full mx-auto rounded-t-2xl shadow-2xl bg-white overflow-hidden">
      {/* ส่วนหัว */}
      <div className="w-full bg-[#007bff] text-white p-5 flex items-center gap-4 justify-start">
        <img
          src={LogoADD}
          alt="เพิ่มข้อมูลสินค้า"
          className="h-12 w-auto object-cover cursor-pointer"
        />
        <h2 className="text-2xl sm:text-3xl font-bold">เพิ่มข้อมูลสินค้า</h2>
      </div>

      {/* ส่วนเลือกประเภทสินค้า */}
      <div className="bg-gray-100 p-6 shadow-md w-full">
        <h3 className="font-semibold text-black mb-4 text-xl sm:text-2xl">
          ประเภทสินค้า
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          {["สินค้า", "โปรโมชั่นแพ็กเกจ"].map((type) => (
            <button
              key={type}
              onClick={() => handleSelection(type)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg border transition-all w-full text-center justify-center shadow-md text-lg sm:text-xl ${
                productType === type
                  ? "bg-white text-blue-600 font-bold border-blue-600"
                  : "bg-gray-200 text-gray-700 border-gray-300"
              }`}
            >
              <div
                className={`w-5 h-5 flex items-center justify-center border rounded-full ${
                  productType === type
                    ? "bg-blue-600 border-blue-600"
                    : "border-gray-500 bg-gray-500"
                }`}
              >
                <div
                  className={`${
                    productType === type
                      ? "w-2.5 h-2.5 bg-white rounded-full"
                      : "w-2.5 h-2.5 bg-white rounded-full"
                  }`}
                ></div>
              </div>
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
