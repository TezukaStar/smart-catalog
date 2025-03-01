// src/components/BrandSlider.jsx
import { motion } from "framer-motion";

// โลโก้แบรนด์ที่ต้องการแสดง
const brands = [
  { id: 1, src: "https://download.logo.wine/logo/TP-Link/TP-Link-Logo.wine.png", alt: "tp-link" },
  { id: 2, src: "https://logos-world.net/wp-content/uploads/2020/05/Huawei-Logo-2006.png", alt: "huawei" },
  { id: 3, src: "https://getlogo.net/wp-content/uploads/2019/12/ja-solar-logo-vector.png", alt: "js-solar" },
  { id: 4, src: "https://logos-world.net/wp-content/uploads/2023/01/Hikvision-Logo.png", alt: "HIKVISION" },
  { id: 5, src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Xiaomi_logo_%282021-%29.svg/1200px-Xiaomi_logo_%282021-%29.svg.png", alt: "Xiaomi" },
  { id: 6, src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ4EeyxMyAwUaUlvmDTlwNW9n05mzH56O0hA&s", alt: "longisolar " },
  { id: 7, src: "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/Jinko_Solar_logo.svg/1200px-Jinko_Solar_logo.svg.png", alt: "Jinko Solar" },
];

const BrandSlider = () => {
  return (
    <div className="hidden md:block overflow-hidden bg-white py-5 mx-5 md:mx-10 lg:mx-28">
      <motion.div
        className="flex items-center space-x-24 flex-nowrap"
        animate={{ x: ["0%", "-100%"] }} // เลื่อนซ้ายต่อเนื่อง
        transition={{
          repeat: Infinity,
          duration: 20, // เลื่อนช้า
          ease: "linear",
        }}
      >
        {/* ทำซ้ำให้ไม่มีช่องว่าง */}
        {[...brands, ...brands].map((brand, index) => (
          <img
            key={index}
            src={brand.src}
            alt={brand.alt}
            className="h-12 md:h-16 lg:h-20 w-auto object-contain flex-shrink-0"
          />
        ))}
      </motion.div>
    </div>
  );
};

export default BrandSlider;
