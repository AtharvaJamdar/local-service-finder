import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import MapView from "../components/MapView";
import TrackingStatus from "../components/TrackingStatus";
import { providers } from "../data/providers";
import "./Tracking.css";

const Tracking = () => {
  const { providerId } = useParams();
  const { state } = useLocation();
  const booking = state?.booking ?? null;

  const provider = providers.find((p) => p.id === Number(providerId));

  const [userPosition, setUserPosition] = useState(null);
  const [locationError, setLocationError] = useState(() =>
    !navigator.geolocation
      ? "Geolocation isn't supported by this browser."
      : null,
  );

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => setLocationError("Couldn't get your location. Check permissions."),
    );
  }, []);

  if (!provider) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ paddingTop: "24px" }}>
          <p>Provider not found.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="tracking-page">
        <section className="map-pane">
          {locationError && (
            <div className="location-banner">{locationError}</div>
          )}
          <MapView
            userPosition={userPosition}
            providers={[provider]}
            selectedProviderId={provider.id}
            onSelectProvider={() => {}}
            showRoute
          />
        </section>

        <TrackingStatus provider={provider} booking={booking} />
      </div>
    </>
  );
};

export default Tracking;
