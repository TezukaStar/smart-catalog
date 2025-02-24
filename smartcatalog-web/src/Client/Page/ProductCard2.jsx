import { Repeat } from "lucide-react";
import PropTypes from "prop-types";

export default function ProductCard({ product }) {
  return (
    <div
      className="p-4 shadow-2xl rounded-xl bg-white border-2 border-gray-100 
      w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl
      h-[450px] sm:h-[400px] md:h-[380px] lg:h-[460px] 
      flex flex-col justify-between">
      {/* กรอบสินค้า ปรับขนาดให้ Responsive ตามหน้าจอ */}

      {/* แสดงแบรนด์สินค้า */}
      <p className="text-xs text-gray-500 font-semibold">
        {product.brand || "ไม่ระบุแบรนด์"}
      </p>

      {/* แสดงรูปสินค้า ถ้าไม่มีให้ใช้ default.jpg */}
      <img
        src={product.images?.[0]?.fileName ? `http://localhost:3000/uploads/products/${product.images[0].fileName}` : "/default.jpg"} 
        alt={product.name || "ไม่มีชื่อสินค้า"}
        className="w-full h-48 
        sm:h-36  /* ขนาดสำหรับมือถือ */
        md:h-34  /* ลดความสูงสำหรับ iPad */
        lg:h-44  /* ขนาดสำหรับ Desktop */
        object-contain"
      />

      {/* แสดงชื่อสินค้า */}
      <p className="text-sm font-semibold mt-2 text-center">
        {product.itemDescription || "ไม่มีชื่อสินค้า"}
      </p>

      {/* แสดงราคาสินค้า */}
      <p className="text-green-600 font-bold text-lg text-center">
        ฿{product.price ? product.price.toLocaleString() : "0"}
      </p>

      {/* ปุ่มเปรียบเทียบสินค้า */}
      <button
        className="w-full mt-2 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2"
        onClick={() => window.location.href = `/compare?product=${product.name}`}
      >
        <Repeat size={24} /> เปรียบเทียบ {/* เพิ่มขนาดไอคอน */}
      </button>
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    brand: PropTypes.string, // แบรนด์สินค้า
    name: PropTypes.string, // ชื่อสินค้า
    price: PropTypes.number, // ราคาสินค้า
    images: PropTypes.arrayOf(
      PropTypes.shape({
        fileName: PropTypes.string, // ไฟล์รูปภาพสินค้า
      })
    ),
  }),
};
