import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar, { Section } from "./Sidebar";
import Header from "./Header";
import DashboardContent from "./DashboardContent";
import CreateEvent from "./CreateEvent";
import ManageEvents from "./ManageEvents";
import Registrations from "./Registrations";
import RealTimeMonitoring from "./RealTimeMonitoring";
import EmailNotifications from "./EmailNotifications";
import "./AdminDashboard.css";

const AdminDashboard: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>("overview");
  const [isUserMode, setIsUserMode] = useState(false);

  const handleSectionChange = (section: Section) => {
    setCurrentSection(section);
  };

  const handleModeToggle = () => {
    setIsUserMode(!isUserMode);
  };

  const renderContent = () => {
    switch (currentSection) {
      case "overview":
        return <DashboardContent />;
      case "create-event":
        return <CreateEvent />;
      case "manage-events":
        return <ManageEvents />;
      case "registrations":
        return <Registrations />;
      case "monitoring":
        return <RealTimeMonitoring />;
      case "notifications":
        return <EmailNotifications />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
        isUserMode={isUserMode}
        onModeToggle={handleModeToggle}
      />
      <div className="main-content-wrapper">
        <Header />
        <AnimatePresence mode="wait">
          <motion.main
            key={currentSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="main-content"
          >
            {renderContent()}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
