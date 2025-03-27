import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Header.css";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Admin Dashboard" }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="header flex items-center justify-between px-6 py-3"
    >
      {/* Left: Welcome Text */}
      <div className="header-title flex items-center gap-3 pl-4">
        <span className="text-xl">👋</span>
        <h2>Welcome back, <span className="text-blue-400">{user?.email?.split("@")[0]}</span></h2>
      </div>

      {/* Right: Actions */}
      <div className="header-actions flex items-center gap-4 pr-4">
        <button className="button button-secondary flex items-center gap-2 px-4 py-2">
          <span>🔔</span>
          <span className="badge badge-error text-xs">3</span>
        </button>
        <button className="button button-secondary px-4 py-2">
          <span>⚙️</span>
        </button>
        <button onClick={handleLogout} className="button button-primary px-4 py-2">
          Logout
        </button>
      </div>
    </motion.header>
  );
};

export default Header;
  