import React from "react";
import { useNavigate } from "react-router-dom";
import {
  formatDateLabel,
  formatTimeLabel,
  statusInfo,
} from "../../utils/format";

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const { cssKey, label } = statusInfo(job.status);

  return (
    <div
      className={`job-card card job-card--${cssKey}`}
      onClick={() => navigate(`/provider/job/${job.id}`)}
    >
      <div className="job-card-top">
        <span className="job-customer">{job.customerName}</span>
        <span className={`job-status-badge job-status-badge--${cssKey}`}>
          {label}
        </span>
      </div>

      <p className="job-description">{job.serviceTitle}</p>

      <div className="job-card-footer">
        <span>{formatDateLabel(job.scheduledAt, "short")}</span>
        <span>{formatTimeLabel(job.scheduledAt)}</span>
      </div>
    </div>
  );
};

export default JobCard;
