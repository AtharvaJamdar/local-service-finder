export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

export const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";

export const matches = (query, ...fields) => {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return fields.some((f) =>
    String(f ?? "")
      .toLowerCase()
      .includes(q),
  );
};
