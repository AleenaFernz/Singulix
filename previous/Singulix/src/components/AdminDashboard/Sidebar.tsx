import React from "react";
import "./Sidebar.css";
import { motion } from "framer-motion";

export type Section =
  | "overview"
  | "create-event"
  | "manage-events"
  | "registrations"
  | "monitoring"
  | "notifications";

interface SidebarProps {
  currentSection: Section;
  onSectionChange: (section: Section) => void;
  isUserMode: boolean;
  onModeToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSectionChange,
  isUserMode,
  onModeToggle,
}) => {
  const menuItems = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "create-event", label: "Create Event", icon: "➕" },
    { id: "manage-events", label: "Manage Events", icon: "📅" },
    { id: "registrations", label: "Registrations", icon: "👥" },
    { id: "monitoring", label: "Real-time Monitoring", icon: "📈" },
    { id: "notifications", label: "Email Notifications", icon: "📧" },
  ];

  return (
    <motion.div initial={{ x: -280 }} animate={{ x: 0 }} className="sidebar">
      <div className="sidebar-logo">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Singulix
        </motion.span>
      </div>

      <nav className="mt-6">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            onClick={() => onSectionChange(item.id as Section)}
            className={`sidebar-item ${
              currentSection === item.id ? "active" : ""
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </motion.button>
        ))}
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-0 w-full p-4 border-t border-gray-100"
      >
        <button
          onClick={onModeToggle}
          className="button button-secondary w-full flex items-center justify-center gap-2"
        >
          <span>{isUserMode ? "🔄" : "👤"}</span>
          {isUserMode ? "Switch to Admin Mode" : "Switch to User Mode"}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;