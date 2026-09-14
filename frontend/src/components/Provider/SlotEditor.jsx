import React, { useState } from "react";

const SlotEditor = ({ availability, onChange }) => {
  const [newDate, setNewDate] = useState("");
  const [newSlot, setNewSlot] = useState("");

  const addSlotToDate = () => {
    if (!newDate || !newSlot.trim()) return;

    const existingDay = availability.find((a) => a.date === newDate);
    let updated;

    if (existingDay) {
      updated = availability.map((a) =>
        a.date === newDate ? { ...a, slots: [...a.slots, newSlot.trim()] } : a,
      );
    } else {
      updated = [...availability, { date: newDate, slots: [newSlot.trim()] }];
    }

    onChange(updated.sort((a, b) => (a.date > b.date ? 1 : -1)));
    setNewSlot("");
  };

  const removeSlot = (date, slot) => {
    const updated = availability
      .map((a) =>
        a.date === date
          ? { ...a, slots: a.slots.filter((s) => s !== slot) }
          : a,
      )
      .filter((a) => a.slots.length > 0);
    onChange(updated);
  };

  return (
    <div className="slot-editor">
      <div className="slot-editor-add">
        <input
          type="date"
          className="form-input"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />
        <input
          type="text"
          className="form-input"
          placeholder="e.g. 9:00 AM"
          value={newSlot}
          onChange={(e) => setNewSlot(e.target.value)}
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={addSlotToDate}
        >
          Add
        </button>
      </div>

      <div className="slot-editor-list">
        {availability.length === 0 && (
          <p className="no-slots">No availability added yet.</p>
        )}

        {availability.map((day) => (
          <div key={day.date} className="slot-editor-day">
            <span className="slot-editor-date">{day.date}</span>
            <div className="slot-editor-chips">
              {day.slots.map((slot) => (
                <span key={slot} className="slot-chip">
                  {slot}
                  <button
                    type="button"
                    onClick={() => removeSlot(day.date, slot)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlotEditor;
