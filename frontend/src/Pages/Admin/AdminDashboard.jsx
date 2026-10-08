import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { api } from "../../services/api";
import { useFetch } from "../../hooks/useFetch";
import "./Admin.css";

const AdminDashboard = () => {
  const [reload, setReload] = useState(0);
  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState("");

  const stats = useFetch("/admin/stats", reload);
  const pending = useFetch("/admin/providers/pending", reload);

  const approve = async (providerId) => {
    setBusyId(providerId);
    setActionError("");
    try {
      await api.patch(`/admin/providers/${providerId}/approve`);
      setReload((r) => r + 1); // refreshes both the stats and the pending list
    } catch (err) {
      setActionError(err.message || "Could not approve this provider.");
    } finally {
      setBusyId(null);
    }
  };

  const s = stats.data;

  return (
    <>
      <Navbar />
      <div className="container adm-page">
        <div className="section section-first">
          <div className="section-header">
            <h2 className="section-title">Admin Dashboard</h2>
            <p className="section-subtitle">
              Platform overview and provider approvals.
            </p>
          </div>

          {stats.error && <p className="form-error">{stats.error}</p>}
          {!s && !stats.error && <p>Loading stats…</p>}

          {s && (
            <div className="adm-stats">
              <div className="adm-stat">
                <span>Total users</span>
                <strong>{s.totalUsers}</strong>
              </div>
              <div className="adm-stat">
                <span>Total providers</span>
                <strong>{s.totalProviders}</strong>
              </div>
              <div
                className={`adm-stat ${s.pendingProviders > 0 ? "adm-stat--alert" : ""}`}
              >
                <span>Pending providers</span>
                <strong>{s.pendingProviders}</strong>
              </div>
            </div>
          )}

          <h3 className="adm-subhead">Pending providers</h3>
          {actionError && <p className="form-error">{actionError}</p>}
          {pending.error && <p className="form-error">{pending.error}</p>}
          {!pending.data && !pending.error && <p>Loading…</p>}

          {pending.data && pending.data.length === 0 && (
            <p className="adm-empty">No providers are waiting for approval.</p>
          )}

          {pending.data && pending.data.length > 0 && (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Business</th>
                    <th>Owner</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.data.map((p) => (
                    <tr key={p.providerId}>
                      <td>{p.businessName}</td>
                      <td>{p.fullName}</td>
                      <td>{p.email}</td>
                      <td className="wrap">{p.address || "—"}</td>
                      <td>
                        <button
                          type="button"
                          className="adm-btn"
                          disabled={busyId === p.providerId}
                          onClick={() => approve(p.providerId)}
                        >
                          {busyId === p.providerId ? "Approving…" : "Approve"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
