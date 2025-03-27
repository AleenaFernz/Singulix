import React, { useState } from "react";
import "./CreateEvent.css";

interface EventFormData {
  name: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  capacity: number;
  ticketTypes: {
    name: string;
    price: number;
    quantity: number;
  }[];
}

const CreateEvent: React.FC = () => {
  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    capacity: 0,
    ticketTypes: [{ name: "", price: 0, quantity: 0 }],
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTicketTypeChange = (
    index: number,
    field: "name" | "price" | "quantity",
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      ticketTypes: prev.ticketTypes.map((ticket, i) =>
        i === index ? { ...ticket, [field]: value } : ticket
      ),
    }));
  };

  const addTicketType = () => {
    setFormData((prev) => ({
      ...prev,
      ticketTypes: [...prev.ticketTypes, { name: "", price: 0, quantity: 0 }],
    }));
  };

  const removeTicketType = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ticketTypes: prev.ticketTypes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // TODO: Implement API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess("Event created successfully!");
      setFormData({
        name: "",
        description: "",
        date: "",
        time: "",
        venue: "",
        capacity: 0,
        ticketTypes: [{ name: "", price: 0, quantity: 0 }],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-event-container">
      <div className="create-event-header">
        <h2 className="create-event-title">Create New Event</h2>
      </div>

      <form className="create-event-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Event Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter event name"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="venue">
                Venue
              </label>
              <input
                type="text"
                id="venue"
                name="venue"
                required
                value={formData.venue}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter venue"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="date">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="time">
                Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                required
                value={formData.time}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="capacity">
                Capacity
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                required
                min="1"
                value={formData.capacity}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter maximum capacity"
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="form-input form-textarea"
              placeholder="Enter event description"
            />
          </div>
        </div>

        <div className="ticket-types">
          <div className="section-title">Ticket Types</div>
          {formData.ticketTypes.map((ticket, index) => (
            <div key={index} className="ticket-type">
              <div className="ticket-type-header">
                <h4 className="ticket-type-title">Ticket Type {index + 1}</h4>
                {formData.ticketTypes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTicketType(index)}
                    className="remove-ticket"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label
                    className="form-label"
                    htmlFor={`ticket-name-${index}`}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id={`ticket-name-${index}`}
                    value={ticket.name}
                    onChange={(e) =>
                      handleTicketTypeChange(index, "name", e.target.value)
                    }
                    className="form-input"
                    placeholder="Enter ticket type name"
                  />
                </div>

                <div className="form-group">
                  <label
                    className="form-label"
                    htmlFor={`ticket-price-${index}`}
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    id={`ticket-price-${index}`}
                    min="0"
                    step="0.01"
                    value={ticket.price}
                    onChange={(e) =>
                      handleTicketTypeChange(
                        index,
                        "price",
                        parseFloat(e.target.value)
                      )
                    }
                    className="form-input"
                    placeholder="Enter ticket price"
                  />
                </div>

                <div className="form-group">
                  <label
                    className="form-label"
                    htmlFor={`ticket-quantity-${index}`}
                  >
                    Quantity
                  </label>
                  <input
                    type="number"
                    id={`ticket-quantity-${index}`}
                    min="0"
                    value={ticket.quantity}
                    onChange={(e) =>
                      handleTicketTypeChange(
                        index,
                        "quantity",
                        parseInt(e.target.value)
                      )
                    }
                    className="form-input"
                    placeholder="Enter quantity available"
                  />
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={addTicketType} className="add-ticket">
            + Add Ticket Type
          </button>
        </div>

        {error && <div className="alert error">{error}</div>}

        {success && <div className="alert success">{success}</div>}

        <div className="form-actions">
          <button
            type="button"
            className="button cancel-button"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="button create-button"
          >
            {isLoading ? "Creating Event..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
