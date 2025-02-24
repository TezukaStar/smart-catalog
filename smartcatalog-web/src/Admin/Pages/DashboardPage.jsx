import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../Layouts/AdminLayout";
import StatsCards from "../Components/StatsCards";
import LatestProductsTable from "../Components/LatestProductsTable";

export default function DashboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // ตรวจสอบว่า token อยู่ใน localStorage หรือไม่
    const token = localStorage.getItem("token");
    if (!token) {
      // ถ้าไม่มี token, นำทางไปที่หน้า login
      navigate("/loginPage");
    }
  }, [navigate]);

  return (
    <AdminLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <StatsCards />
          <LatestProductsTable/>
        </div>
       
    </AdminLayout>
  );
}