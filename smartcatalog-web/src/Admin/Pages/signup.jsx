import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import VerifyOTP from "../Components/VerifyOTP";

export default function Signup() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [otpSent, setOtpSent] = useState(false);
    const [email, setEmail] = useState("");

    // ✅ ฟังก์ชันสมัครสมาชิก
    const onSubmit = async (data) => {
        const formattedData = {
            name: `${data.firstName} ${data.lastName}`,
            companyName: data.companyName || "N/A",
            password: data.password,
            email: data.email,
            address: data.address || "N/A",
            phoneNumber: data.phoneNumber || "0000000000",
            taxNumber: data.taxNumber || "0000000000000"
        };

        console.log("🔍 ส่งข้อมูลไป API:", formattedData);

        try {
            const res = await axios.post("http://localhost:3000/api/auth/register", formattedData, {
                headers: { "Content-Type": "application/json" }
            });
            Swal.fire("สำเร็จ!", res.data.message, "success");
            setOtpSent(true);
            setEmail(data.email);
        } catch (error) {
            console.error("❌ Error Response:", error.response?.data);
            Swal.fire("เกิดข้อผิดพลาด!", error.response?.data?.message || "สมัครสมาชิกไม่สำเร็จ", "error");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">สมัครสมาชิก</h2>

                {!otpSent ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* First Name & Last Name */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700">ชื่อ</label>
                                <input type="text" {...register("firstName", { required: "กรุณากรอกชื่อ" })}
                                    className="w-full p-3 border rounded-lg" />
                                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700">นามสกุล</label>
                                <input type="text" {...register("lastName", { required: "กรุณากรอกนามสกุล" })}
                                    className="w-full p-3 border rounded-lg" />
                                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                            </div>
                        </div>

                        {/* Other Fields */}
                        <div>
                            <label className="block text-gray-700">ชื่อบริษัท</label>
                            <input type="text" {...register("companyName")}
                                className="w-full p-3 border rounded-lg" />
                        </div>

                        <div>
                            <label className="block text-gray-700">รหัสผ่าน</label>
                            <input type="password" {...register("password", { required: "กรุณากรอกรหัสผ่าน" })}
                                className="w-full p-3 border rounded-lg" />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700">อีเมล</label>
                            <input type="email" {...register("email", { required: "กรุณากรอกอีเมล" })}
                                className="w-full p-3 border rounded-lg" />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700">ที่อยู่</label>
                            <input type="text" {...register("address")}
                                className="w-full p-3 border rounded-lg" />
                        </div>

                        <div>
                            <label className="block text-gray-700">หมายเลขโทรศัพท์</label>
                            <input type="tel" {...register("phoneNumber")}
                                className="w-full p-3 border rounded-lg" />
                        </div>

                        <div>
                            <label className="block text-gray-700">เลขประจำตัวผู้เสียภาษี</label>
                            <input type="text" {...register("taxNumber")}
                                className="w-full p-3 border rounded-lg" />
                        </div>

                        <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all">
                            สมัครสมาชิก
                        </button>
                    </form>
                ) : (
                    <VerifyOTP email={email} />
                )}
            </div>
        </div>
    );
}
