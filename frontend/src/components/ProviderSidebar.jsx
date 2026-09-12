import React from "react";

const ProviderSidebar = ({
  providers,
  selectedProviderId,
  onSelectProvider,
}) => {
  return (
    <aside className="provider-sidebar">
      <div className="provider-sidebar-header">
        <h2>Provider details</h2>
        <p>{providers.length} nearby</p>
      </div>

      <ul className="provider-list">
        {providers.map((provider) => {
          const isActive = provider.id === selectedProviderId;
          return (
            <li key={provider.id}>
              <button
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
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default ProviderSidebar;
