import React, { useState } from "react";

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
  event: string;
  type: "crowd" | "security" | "technical";
  message: string;
  severity: "low" | "medium" | "high";
  timestamp: string;
}

const RealTimeMonitoring: React.FC = () => {
  const [crowdData] = useState<CrowdData[]>([
    {
      id: "1",
      event: "Summer Music Festival",
      venue: "Central Park",
      currentCount: 150,
      capacity: 200,
      status: "normal",
    },
    {
      id: "2",
      event: "Tech Conference 2024",
      venue: "Convention Center",
      currentCount: 95,
      capacity: 100,
      status: "warning",
    },
    {
      id: "3",
      event: "Food & Wine Expo",
      venue: "Exhibition Hall",
      currentCount: 280,
      capacity: 300,
      status: "normal",
    },
  ]);

  const [alerts] = useState<Alert[]>([
    {
      id: "1",
      event: "Tech Conference 2024",
      type: "crowd",
      message: "Venue capacity approaching limit",
      severity: "medium",
      timestamp: "2 minutes ago",
    },
    {
      id: "2",
      event: "Food & Wine Expo",
      type: "security",
      message: "Suspicious activity detected at entrance",
      severity: "high",
      timestamp: "5 minutes ago",
    },
    {
      id: "3",
      event: "Summer Music Festival",
      type: "technical",
      message: "Sound system malfunction",
      severity: "low",
      timestamp: "10 minutes ago",
    },
  ]);

  const getStatusColor = (status: CrowdData["status"]) => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getSeverityColor = (severity: Alert["severity"]) => {
    switch (severity) {
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Real-time Monitoring
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Crowd Data */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Live Crowd Data
            </h3>
            <div className="space-y-4">
              {crowdData.map((data) => (
                <div
                  key={data.id}
                  className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {data.event}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {data.venue}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        data.status
                      )}`}
                    >
                      {data.status}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                      <span>Current Count</span>
                      <span>
                        {data.currentCount}/{data.capacity}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{
                          width: `${
                            (data.currentCount / data.capacity) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Active Alerts
            </h3>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {alert.event}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {alert.message}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(
                        alert.severity
                      )}`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="mr-2">
                      {alert.type === "crowd" && "👥"}
                      {alert.type === "security" && "🔒"}
                      {alert.type === "technical" && "🔧"}
                    </span>
                    <span>{alert.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMonitoring;
