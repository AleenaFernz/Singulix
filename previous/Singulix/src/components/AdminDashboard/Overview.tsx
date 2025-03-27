import React from "react";
import "./Overview.css";

const Overview: React.FC = () => {
  const stats = [
    { title: "Total Events", value: "24", trend: "+12%", icon: "📅" },
    { title: "Active Events", value: "8", trend: "+3%", icon: "🎯" },
    { title: "Total Registrations", value: "1,248", trend: "+28%", icon: "👥" },
    { title: "Revenue", value: "$12,450", trend: "+18%", icon: "💰" },
  ];

  const recentEvents = [
    {
      name: "Tech Conference 2024",
      date: "2024-03-15",
      registrations: 245,
      capacity: 300,
    },
    {
      name: "Music Festival",
      date: "2024-03-20",
      registrations: 890,
      capacity: 1000,
    },
    {
      name: "Art Exhibition",
      date: "2024-03-25",
      registrations: 120,
      capacity: 150,
    },
  ];

  return (
    <div className="overview-container">
      <div className="overview-header">
        <h1>Dashboard Overview</h1>
        <p className="text-secondary">
          Welcome back! Here's what's happening with your events.
        </p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <h3>{stat.title}</h3>
              <div className="stat-value">{stat.value}</div>
              <div
                className={`stat-trend ${
                  stat.trend.startsWith("+") ? "positive" : "negative"
                }`}
              >
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="overview-sections">
        <div className="section recent-events">
          <h2>Recent Events</h2>
          <div className="events-table-container">
            <table className="events-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Registrations</th>
                  <th>Capacity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.map((event, index) => (
                  <tr key={index}>
                    <td>{event.name}</td>
                    <td>{new Date(event.date).toLocaleDateString()}</td>
                    <td>{event.registrations}</td>
                    <td>{event.capacity}</td>
                    <td>
                      <div
                        className={`status-badge ${
                          event.registrations >= event.capacity
                            ? "status-badge-danger"
                            : event.registrations >= event.capacity * 0.8
                            ? "status-badge-warning"
                            : "status-badge-success"
                        }`}
                      >
                        {event.registrations >= event.capacity
                          ? "Full"
                          : event.registrations >= event.capacity * 0.8
                          ? "Filling Fast"
                          : "Available"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="section quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-button">
              <span className="action-icon">➕</span>
              Create New Event
            </button>
            <button className="action-button">
              <span className="action-icon">📊</span>
              View Reports
            </button>
            <button className="action-button">
              <span className="action-icon">📧</span>
              Send Notifications
            </button>
            <button className="action-button">
              <span className="action-icon">⚙️</span>
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
