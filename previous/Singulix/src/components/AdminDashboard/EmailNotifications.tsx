import React, { useState } from "react";
import "./EmailNotifications.css";

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
    <div className="email-notifications-container">
      <div className="email-notifications-header">
        <h2 className="section-title">Email Notifications</h2>
      </div>

      <div className="email-content">
        <div className="templates-section">
          <h3 className="subsection-title">Email Templates</h3>
          <div className="templates-grid">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`template-card ${
                  selectedTemplate === template.id ? "selected" : ""
                }`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <h4 className="template-name">{template.name}</h4>
                <p className="template-preview">{template.subject}</p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="email-form">
          <div className="form-group">
            <label className="form-label" htmlFor="subject">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              className="form-input"
              value={emailData.subject}
              onChange={(e) =>
                setEmailData({ ...emailData, subject: e.target.value })
              }
              placeholder="Enter email subject"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="recipients">
              Recipients
            </label>
            <input
              type="text"
              id="recipients"
              className="form-input"
              value={emailData.recipients}
              onChange={(e) =>
                setEmailData({ ...emailData, recipients: e.target.value })
              }
              placeholder="Enter recipient emails (comma-separated)"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="content">
              Content
            </label>
            <textarea
              id="content"
              className="form-input form-textarea"
              value={emailData.content}
              onChange={(e) =>
                setEmailData({ ...emailData, content: e.target.value })
              }
              rows={10}
              placeholder="Enter email content"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="button send-button">
              Send Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailNotifications;
