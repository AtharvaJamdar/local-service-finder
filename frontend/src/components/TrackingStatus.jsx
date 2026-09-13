import React from "react";

const STEPS = [
  { key: "confirmed", label: "Booking confirmed" },
  { key: "on_the_way", label: "Provider on the way" },
  { key: "arrived", label: "Provider arrived" },
];

const TrackingStatus = ({ provider, booking, status = "on_the_way" }) => {
  const currentIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="tracking-status card">
      <div className="tracking-status-badge">Provider on route</div>

      <h2>{provider.name}</h2>
      <p className="tracking-category">{provider.category}</p>

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

      {booking && (
        <ul className="tracking-details">
          <li>
            <span>Day</span>
            <span>{booking.date}</span>
          </li>
          <li>
            <span>Slot</span>
            <span>{booking.slot}</span>
          </li>
          <li>
            <span>Location</span>
            <span>{booking.location}</span>
          </li>
        </ul>
      )}

      <div className="tracking-contact">
        <span>{provider.phone}</span>
      </div>
    </div>
  );
};

export default TrackingStatus;
