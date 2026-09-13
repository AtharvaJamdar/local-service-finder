import React from "react";

const ProviderDetails = ({ provider }) => {
  if (!provider) return null;

  return (
    <div className="provider-details card">
      <div className="provider-details-top">
        <h2>{provider.name}</h2>
        <span className="provider-rating">{provider.rating.toFixed(1)}</span>
      </div>

      <div className="provider-meta">
        <span>{provider.category}</span>
        <span className="dot" />
        <span>{provider.reviews} reviews</span>
      </div>

      <p className="provider-description">{provider.description}</p>

      <div className="provider-details-footer">
        <span className="provider-price">{provider.price}</span>
        <span className="provider-phone">{provider.phone}</span>
      </div>
    </div>
  );
};

export default ProviderDetails;
