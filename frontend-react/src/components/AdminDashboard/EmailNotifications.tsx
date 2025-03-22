import React, { useState } from "react";

const EmailNotifications: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState("welcome");
  const [emailData, setEmailData] = useState({
    subject: "",
    recipients: "",
    content: "",
  });

  const templates = [
    {
      id: "welcome",
      name: "Welcome Email",
      subject: "Welcome to Singulix!",
      content:
        "Dear {{name}},\n\nWelcome to Singulix! We're excited to have you on board...",
    },
    {
      id: "event_reminder",
      name: "Event Reminder",
      subject: "Reminder: {{event_name}} is coming soon!",
      content:
        "Dear {{name}},\n\nThis is a reminder that {{event_name}} is scheduled for {{event_date}}...",
    },
    {
      id: "ticket_confirmation",
      name: "Ticket Confirmation",
      subject: "Your Ticket Confirmation for {{event_name}}",
      content:
        "Dear {{name}},\n\nThank you for purchasing a ticket for {{event_name}}...",
    },
  ];

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setEmailData({
        subject: template.subject,
        recipients: "",
        content: template.content,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email sending
    console.log("Sending email:", emailData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Email Notifications
      </h1>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Email Templates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`p-4 rounded-lg border ${
                    selectedTemplate === template.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <h3 className="font-medium text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {template.subject}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={emailData.subject}
                onChange={(e) =>
                  setEmailData({ ...emailData, subject: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="recipients"
                className="block text-sm font-medium text-gray-700"
              >
                Recipients (comma-separated)
              </label>
              <input
                type="text"
                id="recipients"
                value={emailData.recipients}
                onChange={(e) =>
                  setEmailData({ ...emailData, recipients: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="john@example.com, jane@example.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                Content
              </label>
              <textarea
                id="content"
                value={emailData.content}
                onChange={(e) =>
                  setEmailData({ ...emailData, content: e.target.value })
                }
                rows={10}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Send Email
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailNotifications;
