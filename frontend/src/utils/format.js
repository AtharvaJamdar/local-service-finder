// Shared helpers for turning backend data (ISO datetimes, BookingStatus
// enum values) into the strings/labels/css-keys the existing UI expects.

// "2026-09-20" + "9:00 AM" -> "2026-09-20T09:00:00" (LocalDateTime the
// backend's @Future-validated BookingRequest.scheduledAt expects).
// export function toIsoDateTime(dateStr, slotLabel) {
//   if (!dateStr || !slotLabel) return null;

//   const match = slotLabel.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
//   if (!match) return null;

//   let [, hours, minutes, meridiem] = match;
//   hours = Number(hours);
//   if (meridiem.toUpperCase() === "PM" && hours !== 12) hours += 12;
//   if (meridiem.toUpperCase() === "AM" && hours === 12) hours = 0;

//   const hh = String(hours).padStart(2, "0");
//   return `${dateStr}T${hh}:${minutes}:00`;
// }

// export function formatDateLabel(isoDateTime, style = "long") {
//   if (!isoDateTime) return "";
//   const date = new Date(isoDateTime);
//   return date.toLocaleDateString("en-IN", {
//     weekday: style,
//     day: "numeric",
//     month: style,
//   });
// }

// export function formatTimeLabel(isoDateTime) {
//   if (!isoDateTime) return "";
//   const date = new Date(isoDateTime);
//   return date.toLocaleTimeString("en-IN", {
//     hour: "numeric",
//     minute: "2-digit",
//   });
// }

// export function formatCurrency(amount) {
//   if (amount === null || amount === undefined) return "—";
//   return `₹${Number(amount).toLocaleString("en-IN")}`;
// }

// // Maps the backend BookingStatus enum onto the css-key/label pairs the
// // existing Dashboard.css / JobDetail.css / Tracking.css already style.
// export const BOOKING_STATUS_MAP = {
//   PENDING: { cssKey: "requested", label: "New request" },
//   CONFIRMED: { cssKey: "accepted", label: "Accepted" },
//   ON_THE_WAY: { cssKey: "on_the_way", label: "On the way" },
//   ARRIVED: { cssKey: "arrived", label: "Arrived" },
//   COMPLETED: { cssKey: "completed", label: "Completed" },
//   REJECTED: { cssKey: "declined", label: "Declined" },
//   CANCELLED: { cssKey: "declined", label: "Cancelled" },
// };

// export function statusInfo(status) {
//   return BOOKING_STATUS_MAP[status] || { cssKey: "requested", label: status };
// }

// Shared helpers for turning backend data (ISO datetimes, BookingStatus
// enum values) into the strings/labels/css-keys the existing UI expects.

// Accepts "9:00 AM", "14:00" or "14:00:00" plus a date like "2026-09-20"
// and returns "2026-09-20T09:00:00" (LocalDateTime for BookingRequest.scheduledAt).
export function toIsoDateTime(dateStr, slotLabel) {
  if (!dateStr || !slotLabel) return null;

  const match = String(slotLabel)
    .trim()
    .match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/i);
  if (!match) return null;

  const minutes = match[2];
  const meridiem = match[3];
  let hours = Number(match[1]);

  if (meridiem) {
    const m = meridiem.toUpperCase();
    if (m === "PM" && hours !== 12) hours += 12;
    if (m === "AM" && hours === 12) hours = 0;
  }

  const hh = String(hours).padStart(2, "0");
  return `${dateStr}T${hh}:${minutes}:00`;
}

// "14:00" or "14:00:00" -> "2:00 PM" (display only)
export function formatSlotLabel(slotTime) {
  if (!slotTime) return "";
  const parts = String(slotTime).split(":");
  const hours = Number(parts[0]);
  const minutes = parts[1];
  if (Number.isNaN(hours) || minutes === undefined) return String(slotTime);

  const meridiem = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${h12}:${minutes} ${meridiem}`;
}

export function formatDateLabel(isoDateTime, style = "long") {
  if (!isoDateTime) return "";
  const date = new Date(isoDateTime);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    weekday: style,
    day: "numeric",
    month: style,
  });
}

export function formatTimeLabel(isoDateTime) {
  if (!isoDateTime) return "";
  const date = new Date(isoDateTime);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return "—";
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

// Maps the backend BookingStatus enum onto the css-key/label pairs the
// existing Dashboard.css / JobDetail.css / Tracking.css already style.
export const BOOKING_STATUS_MAP = {
  PENDING: { cssKey: "requested", label: "New request" },
  CONFIRMED: { cssKey: "accepted", label: "Accepted" },
  ON_THE_WAY: { cssKey: "on_the_way", label: "On the way" },
  ARRIVED: { cssKey: "arrived", label: "Arrived" },
  COMPLETED: { cssKey: "completed", label: "Completed" },
  REJECTED: { cssKey: "declined", label: "Declined" },
  CANCELLED: { cssKey: "declined", label: "Cancelled" },
};

export function statusInfo(status) {
  return BOOKING_STATUS_MAP[status] || { cssKey: "requested", label: status };
}
