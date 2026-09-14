import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import {
  providerJobs,
  updateJobStatus,
  updateJobAmount,
} from "../../data/providerJobs";
import "./JobDetail.css";

const STATUS_FLOW = [
  "requested",
  "accepted",
  "on_the_way",
  "arrived",
  "completed",
];

const STATUS_LABELS = {
  requested: "New request",
  accepted: "Accepted",
  on_the_way: "On the way",
  arrived: "Arrived",
  completed: "Completed",
  declined: "Declined",
};

const ProviderJobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const job = providerJobs.find((j) => j.id === Number(jobId));

  const [, forceUpdate] = useState(0);
  const [amount, setAmount] = useState(job?.amount ?? "");

  if (!job) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ paddingTop: "24px" }}>
          <p>Job not found.</p>
        </div>
      </>
    );
  }

  const refresh = () => forceUpdate((n) => n + 1);

  const handleAccept = () => {
    updateJobStatus(job.id, "accepted");
    refresh();
  };

  const handleDecline = () => {
    updateJobStatus(job.id, "declined");
    navigate("/provider/dashboard");
  };

  const handleStart = () => {
    updateJobStatus(job.id, "on_the_way");
    refresh();
  };

  const handleArrived = () => {
    updateJobStatus(job.id, "arrived");
    refresh();
  };

  const handleComplete = () => {
    if (!amount.trim()) return;
    updateJobAmount(job.id, amount.trim());
    updateJobStatus(job.id, "completed");
    refresh();
  };

  const currentIndex = STATUS_FLOW.indexOf(job.status);

  return (
    <>
      <Navbar />
      <div className="job-detail-page">
        <div className="job-detail-card card">
          <div className="job-detail-top">
            <h2>{job.customerName}</h2>
            <span
              className={`job-status-badge job-status-badge--${job.status}`}
            >
              {STATUS_LABELS[job.status]}
            </span>
          </div>

          <ul className="job-detail-meta">
            <li>
              <span>Day</span>
              <span>{job.date}</span>
            </li>
            <li>
              <span>Slot</span>
              <span>{job.slot}</span>
            </li>
            <li>
              <span>Location</span>
              <span>{job.location}</span>
            </li>
          </ul>

          <div className="job-detail-description">
            <h3>Problem description</h3>
            <p>{job.description}</p>
          </div>

          {job.status !== "declined" && (
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
                    {STATUS_LABELS[status]}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="job-detail-actions">
            {job.status === "requested" && (
              <>
                <button className="btn btn-primary" onClick={handleAccept}>
                  Accept
                </button>
                <button className="btn job-btn-decline" onClick={handleDecline}>
                  Decline
                </button>
              </>
            )}

            {job.status === "accepted" && (
              <button className="btn btn-primary" onClick={handleStart}>
                Start (On the way)
              </button>
            )}

            {job.status === "on_the_way" && (
              <button className="btn btn-primary" onClick={handleArrived}>
                Mark Arrived
              </button>
            )}

            {job.status === "arrived" && (
              <div className="job-amount-form">
                <label className="form-label" htmlFor="amount">
                  Amount to charge
                </label>
                <input
                  id="amount"
                  className="form-input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. ₹500"
                />
                <button className="btn btn-primary" onClick={handleComplete}>
                  Mark Complete
                </button>
              </div>
            )}

            {job.status === "completed" && (
              <p className="job-completed-note">
                Job completed. Amount charged: <strong>{job.amount}</strong>
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
