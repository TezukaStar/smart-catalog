import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Client/Page/Home";
import LoginPopup from "./Client/Component/Desktop/Login/Login";
import LoginPage from "./Client/Component/Desktop/Login/Loginpage";
import DashboardPage from "./Admin/Pages/DashboardPage";
import AddProductPage from "./Admin/Pages/AddProductPage";
import Addpromotion from "./Admin/Pages/AddPromotionPage";
import Test from "./Admin/Pages/AddProductPage";
import Twse from "./Admin/Pages/AddPromotionPage";
import Uuu from "./Admin/Pages/signup";
import EditProductPage from "./Admin/Pages/EditProductPage";

// ✅ Import Layouts


function App() {
  const [ setIsOpen] = useState(false);  // สร้าง state สำหรับควบคุมการเปิด/ปิด Modal

  return (
    <Router>
      <Routes>
        {/* ✅ Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login-popup" element={<LoginPopup setIsOpen={setIsOpen} />} />
        <Route path="/loginPage" element={<LoginPage />} />

        {/* ✅ Protected User Routes (ใช้ UserLayout ครอบ) */}
        
          <Route path="/home" element={<Home />} />
        

        {/* ✅ Protected Admin Routes (ใช้ AdminLayout ครอบ) */}
        
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/add-product" element={<AddProductPage />} />
          <Route path="/add-promotion" element={<Addpromotion />} />
          <Route path="/edit-product/:productId" element={<EditProductPage />} />
          <Route path="/test" element={<Test />} />
          <Route path="/twse" element={<Twse />} />
          <Route path="/uuu" element={<Uuu />} />
       
      </Routes>
    </Router>
  );
}

export default App;
