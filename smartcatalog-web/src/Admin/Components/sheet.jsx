
import PropTypes from "prop-types";

// ✅ `Sheet` คือโครงสร้างหลักของ Sidebar/Drawer
export const Sheet = ({ open, onOpenChange, children }) => {
  return (
    <div className={`fixed inset-0 z-50 flex ${open ? "visible" : "invisible"}`}>
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => onOpenChange(false)} />
      {children}
    </div>
  );
};

// ✅ `SheetTrigger` คือปุ่มกดเปิด Sidebar
export const SheetTrigger = ({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>;
};

// ✅ `SheetContent` คือเนื้อหาของ Sidebar
export const SheetContent = ({ children, className, side = "left" }) => {
  const position = side === "left" ? "left-0" : "right-0";
  return (
    <div
      className={`fixed top-0 h-full w-64 bg-white shadow-lg transition-transform transform ${
        position
      } ${className}`}
    >
      {children}
    </div>
  );
};

// ✅ PropTypes Validation
Sheet.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

SheetTrigger.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

SheetContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  side: PropTypes.oneOf(["left", "right"]),
};
