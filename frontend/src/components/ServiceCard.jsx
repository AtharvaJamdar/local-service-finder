import React from "react";

const ServiceCard = ({ title, description, image, icon, onFindProvider }) => {
  const handleClick = () => {
    if (typeof onFindProvider === "function") {
      onFindProvider();
    }
  };

  return (
    <div className="service-card card">
      <div className="service-card-image-wrapper">
        {image ? (
          <img className="service-card-image" src={image} alt={title} />
        ) : (
          <div className="service-card-image service-card-image-fallback">
            {icon ? <span className="service-card-icon">{icon}</span> : null}
          </div>
        )}
      </div>

      <div className="service-card-content">
        {icon ? <span className="service-card-icon">{icon}</span> : null}
        <h3 className="service-card-title">{title}</h3>
        <p className="service-card-description">{description}</p>

        <button
          type="button"
          className="btn btn-primary service-card-button"
          onClick={handleClick}
        >
          Find Provider
          <span aria-hidden="true" className="service-card-button-arrow">
            →
          </span>
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
