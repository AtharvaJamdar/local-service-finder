// Mock jobs assigned to the provider. Replace with a real API call once
// the backend has a bookings endpoint.
export const providerJobs = [
  {
    id: 101,
    customerName: "Aisha Khan",
    status: "requested",
    date: "2026-09-16",
    slot: "11:00 AM",
    location: "21.1985, 79.0689",
    description: "Kitchen tap has been leaking constantly for two days.",
    amount: null,
  },
  {
    id: 102,
    customerName: "Rohit Verma",
    status: "accepted",
    date: "2026-09-15",
    slot: "9:00 AM",
    location: "21.2050, 79.0700",
    description: "Need bathroom pipe fitting checked and resealed.",
    amount: null,
  },
  {
    id: 103,
    customerName: "Neha Sharma",
    status: "completed",
    date: "2026-09-10",
    slot: "4:00 PM",
    location: "21.1990, 79.0650",
    description: "Fixed water heater installation.",
    amount: "₹450",
  },
  {
    id: 104,
    customerName: "Vikram Desai",
    status: "requested",
    date: "2026-09-17",
    slot: "2:00 PM",
    location: "21.2100, 79.0620",
    description: "Ceiling fan making a loud grinding noise, needs inspection.",
    amount: null,
  },
  {
    id: 105,
    customerName: "Priya Nair",
    status: "on_the_way",
    date: "2026-09-18",
    slot: "10:00 AM",
    location: "21.1950, 79.0710",
    description: "Install a new wash basin in the guest bathroom.",
    amount: null,
  },
  {
    id: 106,
    customerName: "Arjun Mehta",
    status: "completed",
    date: "2026-09-08",
    slot: "1:00 PM",
    location: "21.2020, 79.0580",
    description: "Rewired faulty switchboard in the living room.",
    amount: "₹600",
  },
];

// Mutates the shared array in place so Dashboard/JobDetail stay in sync
// within the same session (no backend yet).
export function updateJobStatus(id, status) {
  const job = providerJobs.find((j) => j.id === id);
  if (job) job.status = status;
  return job;
}

export function updateJobAmount(id, amount) {
  const job = providerJobs.find((j) => j.id === id);
  if (job) job.amount = amount;
  return job;
}
