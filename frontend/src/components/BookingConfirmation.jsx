import React from "react";
import {
  formatDateLabel,
  formatTimeLabel,
  formatCurrency,
} from "../utils/format";

const BookingConfirmation = ({ booking, onClose }) => {
  return (
    <div className="booking-confirmation card">
      <h2>Booking Confirmed 🎉</h2>
      <p>
        Your request has been sent to{" "}
        <strong>{booking.providerBusinessName}</strong>.
      </p>

      <ul className="confirmation-list">
        <li>
          <span>Service</span>
          <span>{booking.serviceTitle}</span>
        </li>
        <li>
          <span>Day</span>
          <span>{formatDateLabel(booking.scheduledAt, "long")}</span>
        </li>
        <li>
          <span>Time</span>
          <span>{formatTimeLabel(booking.scheduledAt)}</span>
        </li>
        <li>
          <span>Location</span>
          <span>{booking.address}</span>
        </li>
        <li>
          <span>Amount</span>
          <span>{formatCurrency(booking.amount)}</span>
        </li>
      </ul>

      <button type="button" className="btn btn-primary" onClick={onClose}>
        Continue to Payment
      </button>
    </div>
  );
};

export default BookingConfirmation;
