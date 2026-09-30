import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../services/api";
import {
  formatDateLabel,
  formatTimeLabel,
  formatCurrency,
  statusInfo,
} from "../utils/format";
import "./MyBookings.css";

// Same allowed CUSTOMER -> CANCELLED transitions as BookingService on the
// backend (PENDING/CONFIRMED/ON_THE_WAY/ARRIVED -> CANCELLED).
const CANCELLABLE_STATUSES = ["PENDING", "CONFIRMED", "ON_THE_WAY", "ARRIVED"];

const BookingRow = ({ booking, onCancel, cancelling }) => {
  const navigate = useNavigate();
  const { cssKey, label } = statusInfo(booking.status);
  const canCancel = CANCELLABLE_STATUSES.includes(booking.status);
  const canPay =
    booking.paymentStatus === "PENDING" &&
    !["REJECTED", "CANCELLED"].includes(booking.status);

  return (
    <div className="mb-row card">
      <div className="mb-row-top">
        <div>
          <h3>{booking.serviceTitle}</h3>
          <p className="mb-provider">{booking.providerBusinessName}</p>
        </div>
        <span className={`job-status-badge job-status-badge--${cssKey}`}>
          {label}
        </span>
      </div>

      <ul className="mb-meta">
        <li>
          <span>Day</span>
          <span>{formatDateLabel(booking.scheduledAt, "short")}</span>
        </li>
        <li>
          <span>Time</span>
          <span>{formatTimeLabel(booking.scheduledAt)}</span>
        </li>
        <li>
          <span>Amount</span>
          <span>{formatCurrency(booking.amount)}</span>
        </li>
        <li>
          <span>Payment</span>
          <span>
            {booking.paymentStatus === "PAID" ? "Paid" : "Not paid yet"}
          </span>
        </li>
      </ul>

      <div className="mb-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate(`/tracking/${booking.id}`)}
        >
          Track
        </button>
        {canPay && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate(`/payment/${booking.id}`)}
          >
            Pay Now
          </button>
        )}
        {canCancel && (
          <button
            type="button"
            className="mb-cancel-btn"
            disabled={cancelling}
            onClick={() => onCancel(booking.id)}
          >
            {cancelling ? "Cancelling…" : "Cancel"}
          </button>
        )}
      </div>
    </div>
  );
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await api.get("/bookings/my");
        setBookings(data);
      } catch (err) {
        setError(err.message || "Failed to load your bookings.");
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;
    setCancellingId(bookingId);
    setError("");
    try {
      const updated = await api.patch(`/bookings/${bookingId}/status`, {
        status: "CANCELLED",
      });
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? updated : b)),
      );
    } catch (err) {
      setError(err.message || "Failed to cancel this booking.");
    } finally {
      setCancellingId(null);
    }
  };

  const active = bookings.filter((b) =>
    ["PENDING", "CONFIRMED", "ON_THE_WAY", "ARRIVED"].includes(b.status),
  );
  const completed = bookings.filter((b) => b.status === "COMPLETED");
  const closedOut = bookings.filter((b) =>
    ["REJECTED", "CANCELLED"].includes(b.status),
  );

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="section section-first">
          <div className="section-header">
            <h2 className="section-title">My Bookings</h2>
            <p className="section-subtitle">
              Everything you've booked, in one place.
            </p>
          </div>

          {loading && <p>Loading your bookings…</p>}
          {error && <p className="form-error">{error}</p>}

          {!loading && !error && bookings.length === 0 && (
            <p className="job-section-empty">
              You haven't booked anything yet.
            </p>
          )}

          {!loading && !error && bookings.length > 0 && (
            <>
              {active.length > 0 && (
                <section className="mb-section">
                  <h3>Active</h3>
                  <div className="mb-list">
                    {active.map((b) => (
                      <BookingRow
                        key={b.id}
                        booking={b}
                        onCancel={handleCancel}
                        cancelling={cancellingId === b.id}
                      />
                    ))}
                  </div>
                </section>
              )}

              {completed.length > 0 && (
                <section className="mb-section">
                  <h3>Completed</h3>
                  <div className="mb-list">
                    {completed.map((b) => (
                      <BookingRow
                        key={b.id}
                        booking={b}
                        onCancel={handleCancel}
                        cancelling={cancellingId === b.id}
                      />
                    ))}
                  </div>
                </section>
              )}

              {closedOut.length > 0 && (
                <section className="mb-section">
                  <h3>Declined / Cancelled</h3>
                  <div className="mb-list">
                    {closedOut.map((b) => (
                      <BookingRow
                        key={b.id}
                        booking={b}
                        onCancel={handleCancel}
                        cancelling={cancellingId === b.id}
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MyBookings;
