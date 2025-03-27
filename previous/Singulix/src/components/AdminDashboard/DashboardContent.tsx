import React from "react";
import "./DashboardContent.css";

interface StatCard {
  title: string;
  value: number | string;
  change: string;
  trend: "up" | "down";
}

const DashboardContent: React.FC = () => {
  const stats: StatCard[] = [
    {
      title: "Total Events",
      value: 12,
      change: "+2",
      trend: "up",
    },
    {
      title: "Active Registrations",
      value: 245,
      change: "+15%",
      trend: "up",
    },
    {
      title: "Revenue",
      value: "$12,450",
      change: "-3%",
      trend: "down",
    },
    {
      title: "Average Attendance",
      value: "85%",
      change: "+5%",
      trend: "up",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "registration",
      event: "Summer Music Festival",
      user: "John Doe",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "event",
      event: "Tech Conference 2024",
      action: "created",
      time: "5 hours ago",
    },
    {
      id: 3,
      type: "ticket",
      event: "Food & Wine Expo",
      action: "cancelled",
      user: "Jane Smith",
      time: "1 day ago",
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      name: "Summer Music Festival",
      date: "July 15, 2024",
      venue: "Central Park",
      registrations: 150,
      capacity: 200,
    },
    {
      id: 2,
      name: "Tech Conference 2024",
      date: "August 20, 2024",
      venue: "Convention Center",
      registrations: 85,
      capacity: 100,
    },
  ];

  return (
    <div className="dashboard-content">
      <div className="dashboard-overview">
        <div className="dashboard-header">
          <h2 className="welcome-text">Dashboard Overview</h2>
          <div className="header-actions">
            <div className="notification-badge">🔔 3</div>
            <div className="notification-badge">⚙️</div>
            <button className="notification-badge">Logout</button>
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={stat.title} className="stat-card">
              <h3 className="stat-title">{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
              <div
                className={`stat-change ${
                  stat.trend === "up" ? "positive" : "negative"
                }`}
              >
                {stat.change}
              </div>
            </div>
          ))}
        </div>

        <div className="content-sections">
          <div className="section-container">
            <h3 className="section-title">Recent Activity</h3>
            <div className="activity-list">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">
                    {activity.type === "registration" && "👤"}
                    {activity.type === "event" && "📅"}
                    {activity.type === "ticket" && "🎫"}
                  </div>
                  <div className="activity-content">
                    <p className="activity-title">
                      {activity.type === "registration" && (
                        <>
                          {activity.user} registered for {activity.event}
                        </>
                      )}
                      {activity.type === "event" && (
                        <>New event {activity.event} was created</>
                      )}
                      {activity.type === "ticket" && (
                        <>
                          {activity.user} cancelled ticket for {activity.event}
                        </>
                      )}
                    </p>
                    <p className="activity-time">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-container">
            <h3 className="section-title">Upcoming Events</h3>
            <div className="upcoming-events">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="event-card">
                  <h4 className="event-name">{event.name}</h4>
                  <p className="event-details">
                    {event.date} • {event.venue}
                  </p>
                  <div className="capacity-bar">
                    <div
                      className="capacity-fill"
                      style={{
                        width: `${
                          (event.registrations / event.capacity) * 100
                        }%`,
                      }}
                    />
                  </div>
                  <p className="event-details">
                    {event.registrations}/{event.capacity}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
