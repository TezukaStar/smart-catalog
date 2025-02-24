import TotalProducts from "../Components/StatsCards/TotalProducts";
import NetworkProducts from "../Components/StatsCards/NetworkProducts";
import IOTProducts from "../Components/StatsCards/IOTProducts";
import SolarCellProducts from "../Components/StatsCards/SolarCellProducts";

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <TotalProducts />
      <NetworkProducts />
      <IOTProducts />
      <SolarCellProducts />
    </div>
  );
}

