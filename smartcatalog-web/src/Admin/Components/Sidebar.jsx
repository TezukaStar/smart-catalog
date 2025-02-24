import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Home, PackagePlus, Users, Settings, ChevronDown } from "lucide-react";
import { useState } from "react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <>
      {/* ✅ Overlay สำหรับมือถือ */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* ✅ Sidebar คงที่และอยู่ติดกับ Header */}
      <div
        id="sidebar"
        className={`fixed md:fixed top-[80px] left-0 w-64 h-[calc(100vh-50px)] bg-gray-200 text-black text-2xl p-7 transition-transform duration-300 z-50 
          flex flex-col overflow-y-auto
          ${isOpen ? "translate-x-0" : "-translate-x-64"} md:translate-x-0`}
      >
        <nav className="space-y-7">
          <Link to="/dashboard" className="flex items-center gap-2 p-2 rounded hover:bg-blue-600">
            <Home size={25} /> หน้าแรก
          </Link>
          <Link to="/add-product" className="flex items-center gap-2 p-2 rounded hover:bg-gray-700">
            <PackagePlus size={20} /> เพิ่มสินค้า
          </Link>
          <div>
            <button
              onClick={() => setOpenDropdown(!openDropdown)}
              className="flex items-center gap-2 p-2 w-full rounded hover:bg-gray-700"
            >
              <Users size={20} /> จัดการผู้ใช้
              <ChevronDown
                size={16}
                className={`${openDropdown ? "rotate-180" : ""} transition-transform`}
              />
            </button>
            {openDropdown && (
              <div className="pl-6 space-y-2">
                <Link to="/Test" className="block p-2 rounded hover:bg-gray-700">
                  รายชื่อผู้ใช้
                </Link>
                <Link to="/Twse" className="block p-2 rounded hover:bg-gray-700">
                  เพิ่มผู้ใช้
                </Link>
                <Link to="/uuu" className="block p-2 rounded hover:bg-gray-700">
                  เพิ่มผู้ใช้5555
                </Link>
              </div>
            )}
          </div>
          <Link to="/settings" className="flex items-center gap-2 p-2 rounded hover:bg-gray-700">
            <Settings size={20} /> การตั้งค่า
          </Link>
        </nav>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default Sidebar;
