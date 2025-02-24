import { useState } from "react";
import PropTypes from "prop-types";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";

export default function AdminLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <div className="flex flex-col min-h-screen bg-gray-300 dark:bg-gray-300 w-full">
      {/* ✅ Header ด้านบน */}
      <Header toggleSidebar={toggleSidebar} />

      {/* ✅ Layout ของ Sidebar & Main Content */}
      <div className="flex pt-[80px]">
        {/* ✅ Sidebar */}
        <div className={`fixed left-0 top-[60px] w-64 h-[calc(100vh-60px)] ${isOpen ? "block" : "hidden"} md:block`}>
          <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
        </div>

        {/* ✅ Main Content */}
        <main className="flex-2 ml-0 md:ml-64 p-5 overflow-y-auto py-8">
          <div className="bg-gray-100 p-2 rounded-2xl shadow-lg w-full max-w-auto"> 
            {children} {/* ✅ Render หน้า AddProductPage ที่นี่ */}
          </div>
        </main>
      </div>
    </div>
  );
}

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
