import React from "react";
import { Routes, Route } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";
import Overview from "./Overview";
import CreateEvent from "./CreateEvent";
import ManageEvents from "./ManageEvents";
import Registrations from "./Registrations";
import RealTimeMonitoring from "./RealTimeMonitoring";
import EmailNotifications from "./EmailNotifications";
import "./AdminDashboard.css";

const AdminDashboard: React.FC = () => {
  return (
    <div className="admin-dashboard">
      <HamburgerMenu />

      <main className="dashboard-content">
        <Routes>
          <Route path="overview" element={<Overview />} />
          <Route path="create-event" element={<CreateEvent />} />
          <Route path="manage-events" element={<ManageEvents />} />
          <Route path="registrations" element={<Registrations />} />
          <Route path="monitoring" element={<RealTimeMonitoring />} />
          <Route path="notifications" element={<EmailNotifications />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
