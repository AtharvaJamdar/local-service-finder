import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import JobCard from "../../components/Provider/JobCard";
import { api } from "../../services/api";
import { useAuth } from "../../context/useAuth";
import "./Dashboard.css";

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await api.get("/bookings/provider");
        setBookings(data);
      } catch (err) {
        setError(err.message || "Failed to load your jobs.");
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  const requested = bookings.filter((b) => b.status === "PENDING");
  const upcoming = bookings.filter((b) =>
    ["CONFIRMED", "ON_THE_WAY", "ARRIVED"].includes(b.status),
  );
  const completed = bookings.filter((b) => b.status === "COMPLETED");
  const closedOut = bookings.filter((b) =>
    ["REJECTED", "CANCELLED"].includes(b.status),
  );

  return (
    <>
      <Navbar />
      <div className="provider-dashboard-page">
        <div className="provider-dashboard-header">
          <div>
            <h1>Welcome{user ? `, ${user.name}` : ""}</h1>
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

        {loading && <p>Loading your jobs…</p>}
        {error && <p className="form-error">{error}</p>}

        {!loading && !error && (
          <>
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

            {closedOut.length > 0 && (
              <section className="job-section">
                <h2>Declined / Cancelled</h2>
                <div className="job-grid">
                  {closedOut.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ProviderDashboard;
