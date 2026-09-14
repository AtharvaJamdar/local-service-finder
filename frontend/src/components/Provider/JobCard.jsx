import React from "react";
import { useNavigate } from "react-router-dom";

const STATUS_LABELS = {
  requested: "New request",
  accepted: "Accepted",
  on_the_way: "On the way",
  arrived: "Arrived",
  completed: "Completed",
  declined: "Declined",
};

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`job-card card job-card--${job.status}`}
      onClick={() => navigate(`/provider/job/${job.id}`)}
    >
      <div className="job-card-top">
        <span className="job-customer">{job.customerName}</span>
        <span className={`job-status-badge job-status-badge--${job.status}`}>
          {STATUS_LABELS[job.status]}
        </span>
      </div>

      <p className="job-description">{job.description}</p>

      <div className="job-card-footer">
        <span>{job.date}</span>
        <span>{job.slot}</span>
      </div>
    </div>
  );
};

export default JobCard;
