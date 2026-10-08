import { useEffect, useState } from "react";
import { api } from "../services/api";

export function useFetch(path, reloadKey = 0) {
  const key = `${path}:${reloadKey}`;
  const [result, setResult] = useState({ key: null, data: null, error: "" });

  useEffect(() => {
    let cancelled = false;
    api
      .get(path)
      .then((data) => {
        if (!cancelled) setResult({ key, data, error: "" });
      })
      .catch((err) => {
        if (!cancelled)
          setResult({
            key,
            data: null,
            error: err.message || "Something went wrong.",
          });
      });
    return () => {
      cancelled = true;
    };
  }, [path, key]);

  const ready = result.key === key;
  return {
    data: result.data, // keeps the old data visible while refetching
    error: ready ? result.error : "",
    loading: !ready,
  };
}

// const MOCK = {
//   "/admin/stats": {
//     totalUsers: 42,
//     totalProviders: 9,
//     pendingProviders: 2,
//   },
//   "/admin/providers/pending": [
//     {
//       providerId: 11,
//       userId: 31,
//       fullName: "Ramesh Patil",
//       email: "ramesh@example.com",
//       businessName: "Patil Electricals",
//       address: "Bhiwandi, Maharashtra",
//       status: "PENDING",
//     },
//     {
//       providerId: 12,
//       userId: 32,
//       fullName: "Sunita More",
//       email: "sunita@example.com",
//       businessName: "Sunita Home Cleaning",
//       address: "Thane, Maharashtra",
//       status: "PENDING",
//     },
//   ],
//   "/admin/users": [
//     {
//       id: 1,
//       fullName: "Admin",
//       email: "admin@lsf.com",
//       phone: null,
//       role: "ADMIN",
//       createdAt: "2026-09-01T10:00:00",
//     },
//     {
//       id: 2,
//       fullName: "Amit Shah",
//       email: "amit@example.com",
//       phone: "9876543210",
//       role: "CUSTOMER",
//       createdAt: "2026-09-12T14:30:00",
//     },
//     {
//       id: 3,
//       fullName: "Ramesh Patil",
//       email: "ramesh@example.com",
//       phone: "9123456780",
//       role: "PROVIDER",
//       createdAt: "2026-09-20T09:15:00",
//     },
//   ],
//   "/admin/bookings": [
//     {
//       id: 101,
//       customerName: "Amit Shah",
//       providerBusinessName: "Patil Electricals",
//       serviceTitle: "Wiring repair",
//       status: "COMPLETED",
//       isEmergency: false,
//       scheduledAt: "2026-09-25T11:00:00",
//       address: "Bhiwandi",
//       amount: 1200,
//       createdAt: "2026-09-22T08:00:00",
//     },
//     {
//       id: 102,
//       customerName: "Amit Shah",
//       providerBusinessName: "Sunita Home Cleaning",
//       serviceTitle: "Deep cleaning",
//       status: "PENDING",
//       isEmergency: true,
//       scheduledAt: "2026-10-05T09:00:00",
//       address: "Thane",
//       amount: 2500,
//       createdAt: "2026-10-02T18:20:00",
//     },
//   ],
// };

// export function useFetch(path) {
//   return { data: MOCK[path], error: "", loading: false };
// }
