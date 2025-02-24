import { Phone } from "lucide-react";
import LanguageDropdown from "./LanguageDropdown";

function Banners() {
  return (
    <div className="hidden sm:hidden md:flex bg-white w-full md:px-0 lg:px-0 xl:px-0 h-8 md:h-10 lg:h-10 xl:h-10 py-0 text-black">
      {/* Layout Wrapper */}
      <div className="w-full flex items-center justify-between text-sm font-medium h-full">
        {/* ด้านซ้าย = เบอร์โทร */}
        <div className="flex items-center gap-2 text-xs whitespace-nowrap pl-4 md:pl-4 lg:pl-4 xl:pl-24">
          <Phone />
          <span>ติดต่อสอบถาม โทร</span>
          <span>055-055-589</span>
          <span>089-359-6456</span>
        </div>

        {/* ด้านขวา = Dropdown เปลี่ยนภาษา */}
        <div className="ml-auto pr-0 md:pr-0 lg:pr-0 xl:pr-20  ">
          <LanguageDropdown />
        </div>
      </div>
    </div>
  );
}

export default Banners;
