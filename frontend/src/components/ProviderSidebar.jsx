import React from "react";
import { useNavigate } from "react-router-dom";

const ProviderSidebar = ({
  providers,
  selectedProviderId,
  onSelectProvider,
  loading = false,
  canRecommend = false,
  sortMode = "nearest",
  onSortChange,
}) => {
  const navigate = useNavigate();
  const showRanking = canRecommend && sortMode === "best";

  return (
    <aside className="provider-sidebar">
      <div className="provider-sidebar-header">
        <h2>Provider details</h2>
        <p>
          {loading
            ? "Loading…"
            : `${providers.length} ${showRanking ? "ranked" : "nearby"}`}
        </p>
      </div>

      {canRecommend && (
        <div className="sort-section">
          <div className="sort-toggle" role="group" aria-label="Sort providers">
            <button
              type="button"
              aria-pressed={sortMode === "best"}
              className={`sort-toggle-btn${sortMode === "best" ? " sort-toggle-btn--active" : ""}`}
              onClick={() => onSortChange?.("best")}
            >
              ★ Best match
            </button>
            <button
              type="button"
              aria-pressed={sortMode === "nearest"}
              className={`sort-toggle-btn${sortMode === "nearest" ? " sort-toggle-btn--active" : ""}`}
              onClick={() => onSortChange?.("nearest")}
            >
              Nearest
            </button>
          </div>
          {showRanking && (
            <p className="sort-hint">
              Ranked using distance, rating and price.
            </p>
          )}
        </div>
      )}

      {!loading && providers.length === 0 && (
        <p className="job-section-empty">
          No providers found for this service yet.
        </p>
      )}

      <ul className="provider-list">
        {providers.map((provider) => {
          const isActive = provider.id === selectedProviderId;
          const isTopPick = showRanking && provider.rank === 1;
          return (
            <li key={provider.id}>
              <div
                className={`provider-card card${isActive ? " provider-card--active" : ""}${isTopPick ? " provider-card--top" : ""}`}
                onClick={() => onSelectProvider(provider.id)}
              >
                {isTopPick && (
                  <span className="top-pick-tag">★ Best match for you</span>
                )}

                <div className="provider-card-top">
                  <span className="provider-name">
                    {showRanking && (
                      <span className="rank-badge">#{provider.rank}</span>
                    )}
                    {provider.name}
                  </span>
                  <span className="provider-rating">
                    {provider.reviews > 0 ? provider.rating.toFixed(1) : "New"}
                  </span>
                </div>

                <div className="provider-meta">
                  <span>{provider.category}</span>
                  <span className="dot" />
                  <span>{provider.reviews} reviews</span>
                  <span className="dot" />
                  <span>{provider.price}</span>
                </div>

                {showRanking && provider.score != null && (
                  <div
                    className="match-score"
                    title="Match score based on distance, rating and price"
                  >
                    <div className="match-score-label">
                      <span>Match score</span>
                      <strong>{Math.round(provider.score)}%</strong>
                    </div>
                    <div className="match-score-track">
                      <div
                        className="match-score-fill"
                        style={{
                          width: `${Math.min(100, Math.max(0, provider.score))}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

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
