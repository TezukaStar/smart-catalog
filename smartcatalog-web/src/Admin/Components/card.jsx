import PropTypes from "prop-types";

// ✅ Card หลัก
const Card = ({ children, className }) => {
  return <div className={`bg-white p-4 shadow-md rounded-lg ${className}`}>{children}</div>;
};

// ✅ ส่วนหัวของ Card
const CardHeader = ({ children }) => {
  return <div className="border-b pb-2">{children}</div>;
};

// ✅ ชื่อหัวข้อของ Card
const CardTitle = ({ children }) => {
  return <h2 className="text-lg font-bold">{children}</h2>;
};

// ✅ เนื้อหาใน Card
const CardContent = ({ children }) => {
  return <div className="mt-2">{children}</div>;
};

// ✅ กำหนด PropTypes
Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
};

CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
};

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
};

export { Card, CardHeader, CardTitle, CardContent };
