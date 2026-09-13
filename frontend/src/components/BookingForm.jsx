import React, { useEffect, useState } from "react";

const formatDayLabel = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

const BookingForm = ({ provider, onSubmit }) => {
  const [selectedDate, setSelectedDate] = useState(
    provider.availability[0]?.date ?? null,
  );
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation isn't supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation(
          `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`,
        ),
      () =>
        setLocationError(
          "Couldn't get your location. You can enter it manually.",
        ),
    );
  }, []);

  const dayData = provider.availability.find((a) => a.date === selectedDate);

  const handleDayChange = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !selectedDate ||
      !selectedSlot ||
      !location.trim() ||
      !description.trim()
    )
      return;

    onSubmit({
      providerId: provider.id,
      providerName: provider.name,
      date: selectedDate,
      slot: selectedSlot,
      location,
      description,
    });
  };

  return (
    <form className="booking-form card" onSubmit={handleSubmit}>
      <h2>Book {provider.name}</h2>

      <div className="form-group">
        <label className="form-label">Select a day</label>
        <div className="day-tabs">
          {provider.availability.map((a) => (
            <button
              type="button"
              key={a.date}
              className={`day-tab${a.date === selectedDate ? " day-tab--active" : ""}`}
              onClick={() => handleDayChange(a.date)}
            >
              {formatDayLabel(a.date)}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Select a free slot</label>
        <div className="slot-buttons">
          {dayData?.slots.length ? (
            dayData.slots.map((slot) => (
              <button
                type="button"
                key={slot}
                className={`slot-btn${slot === selectedSlot ? " slot-btn--active" : ""}`}
                onClick={() => setSelectedSlot(slot)}
              >
                {slot}
              </button>
            ))
          ) : (
            <p className="no-slots">No free slots this day.</p>
          )}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="location">
          Your location
        </label>
        <input
          id="location"
          className="form-input"
          value={location ?? ""}
          onChange={(e) => setLocation(e.target.value)}
          placeholder={locationError ?? "Fetching your location…"}
        />
        {locationError && <span className="form-error">{locationError}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="description">
          Describe the problem
        </label>
        <textarea
          id="description"
          className="form-input"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="E.g. Kitchen tap is leaking constantly…"
        />
      </div>

      <button type="submit" className="btn btn-primary form-submit">
        Confirm Booking
      </button>
    </form>
  );
};

export default BookingForm;
