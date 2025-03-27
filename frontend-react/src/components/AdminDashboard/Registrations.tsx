import React, { useState } from "react";
import "./Registrations.css";

interface Registration {
  id: string;
  event: string;
  name: string;
  email: string;
  date: string;
  ticketType: string;
  status: "confirmed" | "pending" | "cancelled";
}

const Registrations: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const registrations: Registration[] = [
    {
      id: "1",
      event: "Summer Music Festival",
      name: "John Doe",
      email: "john@example.com",
      date: "2024-07-15",
      ticketType: "VIP",
      status: "confirmed",
    },
    {
      id: "2",
      event: "Tech Conference 2024",
      name: "Jane Smith",
      email: "jane@example.com",
      date: "2024-08-20",
      ticketType: "Standard",
      status: "pending",
    },
    {
      id: "3",
      event: "Food & Wine Expo",
      name: "Mike Johnson",
      email: "mike@example.com",
      date: "2024-09-10",
      ticketType: "Premium",
      status: "cancelled",
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusClass = (status: Registration["status"]) => {
    return `status-${status}`;
  };

  const handleExport = () => {
    // Handle export functionality
    console.log("Exporting data...");
  };

  return (
    <div className="registrations-container">
      <div className="registrations-header">
        <div className="header-left">
          <h2 className="registrations-title">Event Registrations</h2>
          <div className="header-actions">
            <input
              type="text"
              className="search-input"
              placeholder="Search registrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="button export-button">Export</button>
          </div>
        </div>
        <div className="header-right">
          <button className="header-button notifications-button">
            <span className="notification-icon">🔔</span>
            <span className="notification-count">3</span>
          </button>
          <button className="header-button settings-button">
            <span className="settings-icon">⚙️</span>
          </button>
          <button className="header-button logout-button">Logout</button>
        </div>
      </div>

      <div className="registrations-table-container">
        <table className="registrations-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Attendee</th>
              <th>Date</th>
              <th>Ticket Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((registration) => (
              <tr key={registration.id}>
                <td>{registration.event}</td>
                <td>
                  <div className="attendee-info">
                    <div className="attendee-avatar">
                      {getInitials(registration.name)}
                    </div>
                    <div className="attendee-details">
                      <div className="attendee-name">{registration.name}</div>
                      <div className="attendee-email">{registration.email}</div>
                    </div>
                  </div>
                </td>
                <td>{registration.date}</td>
                <td>
                  <span className="ticket-type">{registration.ticketType}</span>
                </td>
                <td>
                  <span
                    className={`payment-status status-${registration.status}`}
                  >
                    {registration.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="action-button view-button">View</button>
                    <button className="action-button edit-button">Edit</button>
                    <button className="action-button delete-button">
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div className="page-info">Showing 1-3 of 3 registrations</div>
        <div className="page-buttons">
          <button className="page-button" disabled>
            Previous
          </button>
          <button className="page-button" disabled>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Registrations;
