import React from "react";
import { useNavigate } from "react-router-dom";

const ProviderSidebar = ({
  providers,
  selectedProviderId,
  onSelectProvider,
  loading = false,
}) => {
  const navigate = useNavigate();

  return (
    <aside className="provider-sidebar">
      <div className="provider-sidebar-header">
        <h2>Provider details</h2>
        <p>{loading ? "Loading…" : `${providers.length} nearby`}</p>
      </div>

      {!loading && providers.length === 0 && (
        <p className="job-section-empty">
          No providers found for this service yet.
        </p>
      )}

      <ul className="provider-list">
        {providers.map((provider) => {
          const isActive = provider.id === selectedProviderId;
          return (
            <li key={provider.id}>
              <div
                className={`provider-card card${isActive ? " provider-card--active" : ""}`}
                onClick={() => onSelectProvider(provider.id)}
              >
                <div className="provider-card-top">
                  <span className="provider-name">{provider.name}</span>
                  <span className="provider-rating">
                    {provider.rating.toFixed(1)}
                  </span>
                </div>

                <div className="provider-meta">
                  <span>{provider.category}</span>
                  <span className="dot" />
                  <span>{provider.reviews} reviews</span>
                </div>

                <div className="provider-footer">
                  <span className="provider-distance">
                    {provider.distanceLabel ?? "Calculating…"}
                  </span>
                  <span className="provider-phone">{provider.phone}</span>
                </div>

                <button
                  type="button"
                  className="btn btn-primary book-now-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/booking/${provider.id}`);
                  }}
                >
                  Book Now
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default ProviderSidebar;
