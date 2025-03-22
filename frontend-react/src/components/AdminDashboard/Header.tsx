import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
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
      className="header"
    >
      <div className="flex items-center justify-between w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="header-title flex items-center gap-3"
        >
          <span className="text-xl">👋</span>
          <h2>Welcome back, {user?.email?.split("@")[0]}</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="header-actions"
        >
          <button className="button button-secondary flex items-center gap-2">
            <span>🔔</span>
            <span className="badge badge-error text-xs">3</span>
          </button>
          <button className="button button-secondary">
            <span>⚙️</span>
          </button>
          <button onClick={handleLogout} className="button button-primary">
            Logout
          </button>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
