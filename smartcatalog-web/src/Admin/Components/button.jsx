import PropTypes from "prop-types";

const Button = ({ children, className, variant = "default", ...props }) => {
  const variants = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
    danger: "bg-red-500 text-white hover:bg-red-600",
    success: "bg-green-500 text-white hover:bg-green-600",
  };

  return (
    <button
      className={`px-4 py-2 rounded transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// ✅ เพิ่ม prop validation
Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(["default", "outline", "danger", "success"]),
};

export default Button;
