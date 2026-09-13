import React from "react";

const formatDayLabel = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

const BookingConfirmation = ({ booking, onClose }) => {
  return (
    <div className="booking-confirmation card">
      <h2>Booking Confirmed 🎉</h2>
      <p>
        Your request has been sent to <strong>{booking.providerName}</strong>.
      </p>

      <ul className="confirmation-list">
        <li>
          <span>Day</span>
          <span>{formatDayLabel(booking.date)}</span>
        </li>
        <li>
          <span>Time</span>
          <span>{booking.slot}</span>
        </li>
        <li>
          <span>Location</span>
          <span>{booking.location}</span>
        </li>
        <li>
          <span>Problem</span>
          <span>{booking.description}</span>
        </li>
      </ul>

      <button type="button" className="btn btn-primary" onClick={onClose}>
        Done
      </button>
    </div>
  );
};

export default BookingConfirmation;
