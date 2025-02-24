// NavbarMobile.jsx
import { Link } from "react-router-dom";
import LogoADCM from "../../../../assets/Image/Logo01.png";
import { Search } from "lucide-react";
import LanguagMobile from "./LanguageDropdown-mobile"// Import ส่วนของเปลี่ยนภาษา

const NavbarMobile = () => {
  return (
    <div className="block md:hidden">
      {/* Logo และ Language Dropdown */}
      <div className="bg-gradient-to-r from-[#63a6dd] via-[#63a6dd] to-[#00C999] p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/Home" className="flex items-center gap-2 text-white flex-none">
            <img
              src={LogoADCM}
              alt="ADC Microsystems"
              className="h-10 w-auto object-cover cursor-pointer"
            />
          </Link>

          {/* Language Dropdown */}
          <LanguagMobile/>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-200 p-4">
        <div className="container mx-auto flex justify-center">
          <div className="flex w-full max-w-lg sm:max-w-xl">
            <input
              type="text"
              placeholder="ค้นหาสินค้า ประเภทสินค้า แบรนด์"
              className="flex-grow h-12 pl-5 rounded-l-full border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 text-xs"
            />
            <button
              type="button"
              className="bg-purple-600 hover:bg-purple-700 text-white h-12 px-6 flex items-center justify-center border-l border-black rounded-r-full"
            >
              <Search className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarMobile;
