import { Card, CardContent, CardHeader, CardTitle } from "./card";

const stats = [
  { title: "Total Views", value: "$3.456K", change: "0.43%" },
  { title: "Total Profit", value: "$45.2K", change: "4.35%" },
  { title: "Total Product", value: "2,450", change: "2.59%" },
  { title: "Total Users", value: "3,456", change: "-0.95%" },
];

const DashboardCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-gray-500">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className={`text-sm ${stat.change.includes("-") ? "text-red-500" : "text-green-500"}`}>
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardCards;
