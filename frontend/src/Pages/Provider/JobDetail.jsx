import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { api } from "../../services/api";
import {
  formatDateLabel,
  formatTimeLabel,
  formatCurrency,
  statusInfo,
} from "../../utils/format";
import "./JobDetail.css";

// The backend only allows these forward transitions, each triggered by the
// provider (see BookingService.ALLOWED_TRANSITIONS on the backend).
const STATUS_FLOW = [
  "PENDING",
  "CONFIRMED",
  "ON_THE_WAY",
  "ARRIVED",
  "COMPLETED",
];

const ProviderJobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadJob = async () => {
      try {
        const data = await api.get(`/bookings/${jobId}`);
        setJob(data);
      } catch (err) {
        setError(err.message || "Failed to load this job.");
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [jobId]);

  const updateStatus = async (status, afterUpdate) => {
    setUpdating(true);
    setError("");
    try {
      const updated = await api.patch(`/bookings/${jobId}/status`, { status });
      setJob(updated);
      if (afterUpdate) afterUpdate();
    } catch (err) {
      setError(err.message || "Failed to update this job.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ paddingTop: "24px" }}>
          <p>Loading job…</p>
        </div>
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ paddingTop: "24px" }}>
          <p>{error || "Job not found."}</p>
        </div>
      </>
    );
  }

  const { cssKey, label } = statusInfo(job.status);
  const currentIndex = STATUS_FLOW.indexOf(job.status);
  const isClosedOut = job.status === "REJECTED" || job.status === "CANCELLED";

  return (
    <>
      <Navbar />
      <div className="job-detail-page">
        <div className="job-detail-card card">
          <div className="job-detail-top">
            <h2>{job.customerName}</h2>
            <span className={`job-status-badge job-status-badge--${cssKey}`}>
              {label}
            </span>
          </div>

          <ul className="job-detail-meta">
            <li>
              <span>Service</span>
              <span>{job.serviceTitle}</span>
            </li>
            <li>
              <span>Day</span>
              <span>{formatDateLabel(job.scheduledAt, "short")}</span>
            </li>
            <li>
              <span>Slot</span>
              <span>{formatTimeLabel(job.scheduledAt)}</span>
            </li>
            <li>
              <span>Location</span>
              <span>{job.address}</span>
            </li>
            <li>
              <span>Amount</span>
              <span>{formatCurrency(job.amount)}</span>
            </li>
            <li>
              <span>Payment</span>
              <span>
                {job.paymentStatus === "PAID" ? "Paid" : "Not paid yet"}
              </span>
            </li>
          </ul>

          {error && <p className="form-error">{error}</p>}

          {!isClosedOut && (
            <ul className="job-stepper">
              {STATUS_FLOW.map((status, index) => (
                <li
                  key={status}
                  className={`job-step${index < currentIndex ? " job-step--done" : ""}${
                    index === currentIndex ? " job-step--active" : ""
                  }`}
                >
                  <span className="job-step-dot" />
                  <span className="job-step-label">
                    {statusInfo(status).label}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="job-detail-actions">
            {job.status === "PENDING" && (
              <>
                <button
                  className="btn btn-primary"
                  disabled={updating}
                  onClick={() => updateStatus("CONFIRMED")}
                >
                  Accept
                </button>
                <button
                  className="btn job-btn-decline"
                  disabled={updating}
                  onClick={() =>
                    updateStatus("REJECTED", () =>
                      navigate("/provider/dashboard"),
                    )
                  }
                >
                  Decline
                </button>
              </>
            )}

            {job.status === "CONFIRMED" && (
              <button
                className="btn btn-primary"
                disabled={updating}
                onClick={() => updateStatus("ON_THE_WAY")}
              >
                Start (On the way)
              </button>
            )}

            {job.status === "ON_THE_WAY" && (
              <button
                className="btn btn-primary"
                disabled={updating}
                onClick={() => updateStatus("ARRIVED")}
              >
                Mark Arrived
              </button>
            )}

            {job.status === "ARRIVED" && (
              <button
                className="btn btn-primary"
                disabled={updating}
                onClick={() => updateStatus("COMPLETED")}
              >
                Mark Complete
              </button>
            )}

            {job.status === "COMPLETED" && (
              <p className="job-completed-note">
                Job completed. Amount charged:{" "}
                <strong>{formatCurrency(job.amount)}</strong>
              </p>
            )}
          </div>

          <button
            type="button"
            className="btn job-back-btn"
            onClick={() => navigate("/provider/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </>
  );
};

export default ProviderJobDetail;
