import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./HamburgerMenu.css";

interface MenuItem {
  icon: string;
  label: string;
  path: string;
}

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { icon: "📊", label: "Overview", path: "/admin/overview" },
    { icon: "➕", label: "Create Event", path: "/admin/create-event" },
    { icon: "📅", label: "Manage Events", path: "/admin/manage-events" },
    { icon: "👥", label: "Registrations", path: "/admin/registrations" },
    { icon: "📈", label: "Real-time Monitoring", path: "/admin/monitoring" },
    { icon: "📧", label: "Email Notifications", path: "/admin/notifications" },
  ];

  return (
    <div className={`hamburger-menu-container ${isOpen ? "open" : ""}`}>
      <button
        className="hamburger-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <div className="hamburger-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      <div className="menu-content">
        <div className="menu-header">
          <h1 className="menu-title">Singulix</h1>
        </div>

        <nav className="menu-items">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="menu-item"
              onClick={() => setIsOpen(false)}
            >
              <span className="menu-item-icon">{item.icon}</span>
              <span className="menu-item-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="menu-footer">
          <button className="switch-mode-button">
            <span className="mode-icon">👤</span>
            Switch to User Mode
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="menu-overlay" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default HamburgerMenu;
