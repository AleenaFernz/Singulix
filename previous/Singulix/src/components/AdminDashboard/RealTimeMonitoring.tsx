import React, { useState } from "react";
import "./RealTimeMonitoring.css";

interface CrowdData {
  id: string;
  event: string;
  venue: string;
  currentCount: number;
  capacity: number;
  status: "normal" | "warning" | "critical";
}

interface Alert {
  id: string;
  message: string;
  severity: "high" | "medium" | "low";
  time: string;
}

const RealTimeMonitoring: React.FC = () => {
  const [crowdData] = useState<CrowdData[]>([
    {
      id: "1",
      event: "Summer Music Festival",
      venue: "Main Stage",
      currentCount: 450,
      capacity: 600,
      status: "normal",
    },
    {
      id: "2",
      event: "Tech Conference",
      venue: "Hall A",
      currentCount: 280,
      capacity: 300,
      status: "warning",
    },
    {
      id: "3",
      event: "Food Expo",
      venue: "Exhibition Center",
      currentCount: 950,
      capacity: 1000,
      status: "critical",
    },
  ]);

  const [alerts] = useState<Alert[]>([
    {
      id: "1",
      message: "Crowd density exceeding 90% at Food Expo",
      severity: "high",
      time: "2 minutes ago",
    },
    {
      id: "2",
      message: "Rapid crowd increase at Tech Conference",
      severity: "medium",
      time: "5 minutes ago",
    },
    {
      id: "3",
      message: "Normal flow at Summer Music Festival",
      severity: "low",
      time: "10 minutes ago",
    },
  ]);

  const getStatusClass = (status: CrowdData["status"]) => {
    return `status-${status}`;
  };

  const getCapacityFillClass = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return "fill-critical";
    if (percentage >= 75) return "fill-warning";
    return "fill-normal";
  };

  return (
    <div className="monitoring-container">
      <div className="monitoring-header">
        <h2 className="monitoring-title">Real-Time Monitoring</h2>
      </div>

      <div className="monitoring-grid">
        {crowdData.map((crowd) => (
          <div key={crowd.id} className="crowd-card">
            <div className="crowd-header">
              <h3 className="crowd-title">{crowd.event}</h3>
              <span className={`crowd-status ${getStatusClass(crowd.status)}`}>
                {crowd.status}
              </span>
            </div>

            <div className="crowd-stats">
              <div className="stat-item">
                <div className="stat-value">{crowd.currentCount}</div>
                <div className="stat-label">Current</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{crowd.capacity}</div>
                <div className="stat-label">Capacity</div>
              </div>
            </div>

            <div className="capacity-display">
              <div className="capacity-bar">
                <div
                  className={`capacity-fill ${getCapacityFillClass(
                    crowd.currentCount,
                    crowd.capacity
                  )}`}
                  style={{
                    width: `${(crowd.currentCount / crowd.capacity) * 100}%`,
                  }}
                />
              </div>
              <div className="capacity-text">
                <span>{crowd.venue}</span>
                <span>
                  {Math.round((crowd.currentCount / crowd.capacity) * 100)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="alerts-section">
        <div className="alerts-header">
          <h3 className="alerts-title">Recent Alerts</h3>
        </div>
        <div className="alerts-list">
          {alerts.map((alert) => (
            <div key={alert.id} className="alert-item">
              <div className={`alert-icon icon-${alert.severity}`}>
                {alert.severity === "high" && "⚠️"}
                {alert.severity === "medium" && "⚡"}
                {alert.severity === "low" && "ℹ️"}
              </div>
              <div className="alert-content">
                <div className="alert-message">{alert.message}</div>
                <div className="alert-time">{alert.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealTimeMonitoring;
