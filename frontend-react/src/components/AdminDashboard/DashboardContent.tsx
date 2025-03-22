import React from "react";

interface StatCard {
  title: string;
  value: string | number;
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
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Dashboard Overview
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
          >
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {stat.title}
            </h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p
                className={`ml-2 text-sm font-semibold ${
                  stat.trend === "up"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity and Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 text-sm"
                >
                  <div className="flex-shrink-0">
                    {activity.type === "registration" && "👤"}
                    {activity.type === "event" && "📅"}
                    {activity.type === "ticket" && "🎫"}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white">
                      {activity.type === "registration" && (
                        <>
                          <span className="font-medium">{activity.user}</span>{" "}
                          registered for{" "}
                          <span className="font-medium">{activity.event}</span>
                        </>
                      )}
                      {activity.type === "event" && (
                        <>
                          New event{" "}
                          <span className="font-medium">{activity.event}</span>{" "}
                          was {activity.action}
                        </>
                      )}
                      {activity.type === "ticket" && (
                        <>
                          <span className="font-medium">{activity.user}</span>{" "}
                          cancelled ticket for{" "}
                          <span className="font-medium">{activity.event}</span>
                        </>
                      )}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Upcoming Events
            </h3>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {event.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {event.date} • {event.venue}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {event.registrations}/{event.capacity}
                      </p>
                      <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{
                            width: `${
                              (event.registrations / event.capacity) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
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

export default DashboardContent;
