import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function VerifyOTP({ email }) {
    const [otp, setOtp] = useState("");

    const verifyOtp = async () => {
        if (!otp) {
            Swal.fire("แจ้งเตือน!", "กรุณากรอก OTP", "warning");
            return;
        }

        console.log("🔍 ส่ง OTP:", { email, otp });

        try {
            const res = await axios.post("http://localhost:3000/api/auth/verifyOTP", { email, otp });
            Swal.fire("สำเร็จ!", res.data.message, "success");
        } catch (error) {
            console.error("❌ Error Response:", error.response);
            Swal.fire("เกิดข้อผิดพลาด!", error.response?.data?.message || "OTP ไม่ถูกต้อง", "error");
        }
    };

    return (
        <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">ยืนยัน OTP</h2>
            <p className="text-gray-600 mb-4">กรุณาใส่รหัส OTP ที่ส่งไปยังอีเมลของคุณ</p>
            
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)}
                placeholder="กรอกรหัส OTP"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 mb-4" />
            
            <button onClick={verifyOtp}
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-all">
                ยืนยัน OTP
            </button>
        </div>
    );
}
