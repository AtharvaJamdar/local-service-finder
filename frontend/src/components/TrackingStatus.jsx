import React from "react";
import { useNavigate } from "react-router-dom";
import { formatDateLabel, formatTimeLabel, statusInfo } from "../utils/format";

const STEPS = [
  { key: "PENDING", label: "Booking placed" },
  { key: "CONFIRMED", label: "Booking confirmed" },
  { key: "ON_THE_WAY", label: "Provider on the way" },
  { key: "ARRIVED", label: "Provider arrived" },
  { key: "COMPLETED", label: "Job completed" },
];

const TrackingStatus = ({ provider, booking }) => {
  const navigate = useNavigate();
  const status = booking.status;
  const isTerminatedEarly = status === "REJECTED" || status === "CANCELLED";
  const currentIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="tracking-status card">
      <div className="tracking-status-badge">
        {isTerminatedEarly ? statusInfo(status).label : "Provider on route"}
      </div>

      <h2>{provider.name}</h2>
      <p className="tracking-category">{provider.category}</p>

      {isTerminatedEarly ? (
        <p className="job-section-empty">
          This booking was {statusInfo(status).label.toLowerCase()}.
        </p>
      ) : (
        <ul className="tracking-stepper">
          {STEPS.map((step, index) => {
            const isDone = index < currentIndex;
            const isActive = index === currentIndex;
            return (
              <li
                key={step.key}
                className={`tracking-step${isDone ? " tracking-step--done" : ""}${
                  isActive ? " tracking-step--active" : ""
                }`}
              >
                <span className="tracking-step-dot" />
                <span className="tracking-step-label">{step.label}</span>
              </li>
            );
          })}
        </ul>
      )}

      {booking && (
        <ul className="tracking-details">
          <li>
            <span>Service</span>
            <span>{booking.serviceTitle}</span>
          </li>
          <li>
            <span>Day</span>
            <span>{formatDateLabel(booking.scheduledAt, "short")}</span>
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
            <span>Payment</span>
            <span>
              {booking.paymentStatus === "PAID"
                ? "Paid"
                : booking.paymentStatus === "PENDING"
                  ? "Not paid yet"
                  : booking.paymentStatus}
            </span>
          </li>
        </ul>
      )}

      {booking.paymentStatus === "PENDING" && !isTerminatedEarly && (
        <button
          type="button"
          className="btn btn-primary"
          style={{ marginBottom: "12px" }}
          onClick={() => navigate(`/payment/${booking.id}`)}
        >
          Pay Now
        </button>
      )}

      <div className="tracking-contact">
        <span>{provider.phone}</span>
      </div>
    </div>
  );
};

export default TrackingStatus;
