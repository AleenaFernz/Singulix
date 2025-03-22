import React, { useState } from "react";

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
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Create New Event
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Event Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="venue"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Venue
            </label>
            <input
              type="text"
              id="venue"
              name="venue"
              required
              value={formData.venue}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="time"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Time
            </label>
            <input
              type="time"
              id="time"
              name="time"
              required
              value={formData.time}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="capacity"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Ticket Types
            </h3>
            <button
              type="button"
              onClick={addTicketType}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Ticket Type
            </button>
          </div>

          <div className="space-y-4">
            {formData.ticketTypes.map((ticket, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <label
                    htmlFor={`ticket-name-${index}`}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`ticket-price-${index}`}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="flex items-end space-x-4">
                  <div className="flex-1">
                    <label
                      htmlFor={`ticket-quantity-${index}`}
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  {formData.ticketTypes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTicketType(index)}
                      className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900 p-4">
            <div className="text-sm text-red-700 dark:text-red-200">
              {error}
            </div>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 dark:bg-green-900 p-4">
            <div className="text-sm text-green-700 dark:text-green-200">
              {success}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? "Creating Event..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
