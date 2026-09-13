import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import MapView from "../components/MapView";
import ProviderSidebar from "../components/ProviderSidebar";
import { providers as providerData } from "../data/providers";
import { distanceInMeters, formatDistance } from "../utils/distance";
import "./Map.css";

const Map = () => {
  const { category } = useParams();

  const [userPosition, setUserPosition] = useState(null);
  const [locationError, setLocationError] = useState(() =>
    !navigator.geolocation
      ? "Geolocation isn't supported by this browser."
      : null,
  );
  const [selectedProviderId, setSelectedProviderId] = useState(null);

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

  const providers = useMemo(() => {
    const filtered = category
      ? providerData.filter(
          (p) => p.category.toLowerCase() === category.toLowerCase(),
        )
      : providerData;

    return filtered
      .map((provider) => {
        const distanceMeters = userPosition
          ? distanceInMeters(userPosition, provider)
          : null;
        return {
          ...provider,
          distanceMeters,
          distanceLabel: formatDistance(distanceMeters),
        };
      })
      .sort(
        (a, b) =>
          (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity),
      );
  }, [userPosition, category]);

  return (
    <>
      <Navbar />
      <div className="map-page">
        <section className="map-pane">
          {locationError && (
            <div className="location-banner">{locationError}</div>
          )}
          <MapView
            userPosition={userPosition}
            providers={providers}
            selectedProviderId={selectedProviderId}
            onSelectProvider={setSelectedProviderId}
          />
        </section>

        <ProviderSidebar
          providers={providers}
          selectedProviderId={selectedProviderId}
          onSelectProvider={setSelectedProviderId}
        />
      </div>
    </>
  );
};

export default Map;
