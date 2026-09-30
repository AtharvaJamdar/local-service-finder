import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import MapView from "../components/MapView";
import ProviderSidebar from "../components/ProviderSidebar";
import { api } from "../services/api";
import { distanceInMeters, formatDistance } from "../utils/distance";
import { formatCurrency } from "../utils/format";
import "./Map.css";

// Maps one backend ServiceResponse onto the "provider" shape the
// MapView/ProviderSidebar/Booking flow already renders. provider.id is
// the *service* id — that's what /booking/:serviceId and the backend's
// booking endpoint actually need.
function toProviderShape(service) {
  return {
    id: service.id,
    serviceId: service.id,
    providerId: service.providerId,
    name: service.providerName || "Service provider",
    title: service.title,
    category: service.categoryName,
    rating: service.providerRatingAverage ?? 0,
    reviews: service.providerReviewCount ?? 0,
    phone: service.providerPhone,
    lat: service.providerLatitude,
    lng: service.providerLongitude,
    description: service.description,
    price: formatCurrency(service.price),
  };
}

const Map = () => {
  const { categoryId } = useParams();

  const [userPosition, setUserPosition] = useState(null);
  const [locationError, setLocationError] = useState(() =>
    !navigator.geolocation
      ? "Geolocation isn't supported by this browser."
      : null,
  );
  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const [rawServices, setRawServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await api.get(`/services/category/${categoryId}`);
        setRawServices(data);
      } catch (err) {
        setError(err.message || "Failed to load providers for this service.");
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, [categoryId]);

  const providers = useMemo(() => {
    const shaped = rawServices
      // A provider who hasn't set a location can't be plotted on the map.
      .filter((s) => s.providerLatitude != null && s.providerLongitude != null)
      .map(toProviderShape);

    return shaped
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
  }, [rawServices, userPosition]);

  return (
    <>
      <Navbar />
      <div className="map-page">
        <section className="map-pane">
          {locationError && (
            <div className="location-banner">{locationError}</div>
          )}
          {error && <div className="location-banner">{error}</div>}
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
          loading={loading}
        />
      </div>
    </>
  );
};

export default Map;
