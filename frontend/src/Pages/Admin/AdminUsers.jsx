import React, { useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import { useFetch } from "../../hooks/useFetch";
import { formatDate, matches } from "./adminHelpers";
import "./Admin.css";

const ROLE_BADGE = {
  CUSTOMER: "adm-badge--blue",
  PROVIDER: "adm-badge--green",
  ADMIN: "adm-badge--amber",
};

const AdminUsers = () => {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("ALL");

  const { data, error } = useFetch("/admin/users");

  const visible = useMemo(
    () =>
      (data || [])
        .filter(
          (u) =>
            (role === "ALL" || u.role === role) &&
            matches(search, u.fullName, u.email, u.phone),
        )
        .sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
        ),
    [data, role, search],
  );

  return (
    <>
      <Navbar />
      <div className="container adm-page">
        <div className="section section-first">
          <div className="section-header">
            <h2 className="section-title">Users</h2>
            <p className="section-subtitle">
              Everyone registered on the platform.
            </p>
          </div>

          <div className="adm-toolbar">
            <input
              placeholder="Search by name, email or phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="ALL">All roles</option>
              <option value="CUSTOMER">Customers</option>
              <option value="PROVIDER">Providers</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>

          {error && <p className="form-error">{error}</p>}
          {!data && !error && <p>Loading users…</p>}

          {data && (
            <>
              <p className="adm-count">{visible.length} user(s)</p>
              {visible.length === 0 ? (
                <p className="adm-empty">No users match.</p>
              ) : (
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visible.map((u) => (
                        <tr key={u.id}>
                          <td>{u.id}</td>
                          <td>{u.fullName}</td>
                          <td>{u.email}</td>
                          <td>{u.phone || "—"}</td>
                          <td>
                            <span
                              className={`adm-badge ${ROLE_BADGE[u.role] || "adm-badge--grey"}`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td>{formatDate(u.createdAt)}</td>
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

export default AdminUsers;
