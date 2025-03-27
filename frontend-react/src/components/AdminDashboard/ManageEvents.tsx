import React, { useState } from "react";
import "./ManageEvents.css";

interface Event {
  id: string;
  name: string;
  date: string;
  venue: string;
  capacity: number;
  registered: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
}

const ManageEvents: React.FC = () => {
  const [events] = useState<Event[]>([
    {
      id: "1",
      name: "Summer Music Festival",
      date: "2024-07-15",
      venue: "Central Park",
      capacity: 200,
      registered: 150,
      status: "upcoming",
    },
    {
      id: "2",
      name: "Tech Conference 2024",
      date: "2024-08-20",
      venue: "Convention Center",
      capacity: 100,
      registered: 85,
      status: "upcoming",
    },
    {
      id: "3",
      name: "Food & Wine Expo",
      date: "2024-09-10",
      venue: "Exhibition Hall",
      capacity: 300,
      registered: 250,
      status: "ongoing",
    },
  ]);

  const getStatusColor = (status: Event["status"]) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "ongoing":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="manage-events-container">
      <div className="manage-events-header">
        <h2 className="manage-events-title">Manage Events</h2>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search events..."
            className="search-input"
          />
          <select className="filter-select">
            <option value="">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="events-table-container">
        <table className="events-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Date</th>
              <th>Venue</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>
                  <div className="event-name">
                    {event.name}
                    <span className="event-registrations">
                      {event.registered}/{event.capacity} registered
                    </span>
                  </div>
                </td>
                <td>{event.date}</td>
                <td>{event.venue}</td>
                <td>
                  <div className="capacity-bar">
                    <div
                      className="capacity-fill"
                      style={{
                        width: `${(event.registered / event.capacity) * 100}%`,
                      }}
                    />
                  </div>
                </td>
                <td>
                  <span className={`event-status status-${event.status}`}>
                    {event.status}
                  </span>
                </td>
                <td>
                  <div className="event-actions">
                    <button className="action-button edit-button">Edit</button>
                    <button className="action-button delete-button">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageEvents;
