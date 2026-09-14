import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import JobCard from "../../components/Provider/JobCard";
import { providerJobs } from "../../data/providerJobs";
import { getCurrentProvider } from "../../data/providerAuth";
import "./Dashboard.css";

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const provider = getCurrentProvider();

  const requested = providerJobs.filter((j) => j.status === "requested");
  const upcoming = providerJobs.filter((j) =>
    ["accepted", "on_the_way", "arrived"].includes(j.status),
  );
  const completed = providerJobs.filter((j) => j.status === "completed");

  return (
    <>
      <Navbar />
      <div className="provider-dashboard-page">
        <div className="provider-dashboard-header">
          <div>
            <h1>Welcome{provider ? `, ${provider.name}` : ""}</h1>
            <p>Here's what's happening with your jobs today.</p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/provider/profile")}
          >
            Edit Profile
          </button>
        </div>

        <section className="job-section">
          <h2>New requests</h2>
          {requested.length === 0 ? (
            <p className="job-section-empty">No new requests right now.</p>
          ) : (
            <div className="job-grid">
              {requested.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </section>

        <section className="job-section">
          <h2>Upcoming</h2>
          {upcoming.length === 0 ? (
            <p className="job-section-empty">Nothing scheduled yet.</p>
          ) : (
            <div className="job-grid">
              {upcoming.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </section>

        <section className="job-section">
          <h2>Completed</h2>
          {completed.length === 0 ? (
            <p className="job-section-empty">No completed jobs yet.</p>
          ) : (
            <div className="job-grid">
              {completed.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default ProviderDashboard;
