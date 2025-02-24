import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import LogoADCM from "../../../../assets/Image/Logo-Login.png";

const LoginPage = ({ setIsOpen }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ✅ ตรวจสอบว่ามี Token อยู่แล้วหรือไม่
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      console.log("✅ พบ Token ใน sessionStorage:", token);
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const token = response.data.token;
        console.log("✅ Token ที่ได้รับ:", token);
        sessionStorage.setItem("token", token);
        setMessage("เข้าสู่ระบบสำเร็จ!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("❌ เกิดข้อผิดพลาด:", error.response?.data?.message || error);
      setMessage(error.response?.data?.message || "เข้าสู่ระบบล้มเหลว");
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <img src={LogoADCM} alt="Logo" className="w-40 h-40 object-contain" />
        </div>

        <h2 className="text-xl font-bold text-center mb-4">เข้าสู่ระบบ</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">อีเมล</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-0 block w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500"
              placeholder="กรอกอีเมล"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-0 block w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500"
              placeholder="กรอกรหัสผ่าน"
            />
          </div>
          
          {message && (
            <p className={`text-center text-sm ${message === "เข้าสู่ระบบสำเร็จ!" ? "text-green-500" : "text-red-500"}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all"
          >
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </div>
  );
};

// ✅ แก้ไข PropTypes ของ `setIsOpen` เป็นไม่บังคับ (เพราะอาจไม่ได้ใช้)
LoginPage.propTypes = {
  setIsOpen: PropTypes.func,
};

export default LoginPage;
