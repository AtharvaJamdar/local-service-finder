import React, { useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import { useFetch } from "../../hooks/useFetch";
import { formatCurrency, statusInfo } from "../../utils/format";
import { formatDateTime, matches } from "./adminHelpers";
import "./Admin.css";

const STATUS_BADGE = {
  PENDING: "adm-badge--amber",
  CONFIRMED: "adm-badge--blue",
  ON_THE_WAY: "adm-badge--blue",
  ARRIVED: "adm-badge--blue",
  COMPLETED: "adm-badge--green",
  REJECTED: "adm-badge--red",
  CANCELLED: "adm-badge--grey",
};

const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "ON_THE_WAY",
  "ARRIVED",
  "COMPLETED",
  "REJECTED",
  "CANCELLED",
];

const AdminBookings = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const { data, error } = useFetch("/admin/bookings");

  const visible = useMemo(
    () =>
      (data || [])
        .filter(
          (b) =>
            (status === "ALL" || b.status === status) &&
            matches(
              search,
              b.id,
              b.customerName,
              b.providerBusinessName,
              b.serviceTitle,
              b.address,
            ),
        )
        .sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
        ),
    [data, status, search],
  );

  return (
    <>
      <Navbar />
      <div className="container adm-page">
        <div className="section section-first">
          <div className="section-header">
            <h2 className="section-title">Bookings</h2>
            <p className="section-subtitle">
              Every booking across the platform.
            </p>
          </div>

          <div className="adm-toolbar">
            <input
              placeholder="Search by id, customer, provider, service or address…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="ALL">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {statusInfo(s).label}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="form-error">{error}</p>}
          {!data && !error && <p>Loading bookings…</p>}

          {data && (
            <>
              <p className="adm-count">{visible.length} booking(s)</p>
              {visible.length === 0 ? (
                <p className="adm-empty">No bookings match.</p>
              ) : (
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Provider</th>
                        <th>Service</th>
                        <th>Scheduled</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Emergency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visible.map((b) => (
                        <tr key={b.id}>
                          <td>#{b.id}</td>
                          <td>{b.customerName}</td>
                          <td>{b.providerBusinessName}</td>
                          <td>{b.serviceTitle}</td>
                          <td>{formatDateTime(b.scheduledAt)}</td>
                          <td>
                            <span
                              className={`adm-badge ${STATUS_BADGE[b.status] || "adm-badge--grey"}`}
                            >
                              {statusInfo(b.status).label}
                            </span>
                          </td>
                          <td>{formatCurrency(b.amount)}</td>
                          <td>{b.isEmergency ? "Yes" : "No"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminBookings;
