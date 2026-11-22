import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import MapView from "../components/MapView";
import ProviderSidebar from "../components/ProviderSidebar";
import { api } from "../services/api";
import { distanceInMeters, formatDistance } from "../utils/distance";
import { formatCurrency } from "../utils/format";
import "./Map.css";

// Only providers within this distance of the customer are shown.
// Keep it equal to the circle radius in components/MapView.jsx (5000).
const SEARCH_RADIUS_METERS = 5000;

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
    // Only present when the data came from /services/recommend
    score: service.recommendationScore ?? null,
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
  // "best" = smart recommendation order, "nearest" = plain distance order
  const [sortMode, setSortMode] = useState("best");

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
    // Wait until we know whether location is available or not, so we
    // only hit the API once with the right endpoint.
    if (!userPosition && !locationError) return;

    let cancelled = false;

    const loadServices = async () => {
      setLoading(true);
      setError("");
      try {
        // With a location -> smart recommendations (ranked by the backend).
        // Without one -> fall back to the plain category list.
        const path = userPosition
          ? `/services/recommend?lat=${userPosition.lat}&lng=${userPosition.lng}&categoryId=${categoryId}`
          : `/services/category/${categoryId}`;
        const data = await api.get(path);
        if (!cancelled) setRawServices(data);
      } catch (err) {
        if (!cancelled)
          setError(err.message || "Failed to load providers for this service.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadServices();

    return () => {
      cancelled = true;
    };
  }, [categoryId, userPosition, locationError]);

  // True only when the backend actually returned recommendation scores.
  const canRecommend = rawServices.some((s) => s.recommendationScore != null);

  const providers = useMemo(() => {
    const withDistance = rawServices
      // A provider who hasn't set a location can't be plotted on the map.
      .filter((s) => s.providerLatitude != null && s.providerLongitude != null)
      .map(toProviderShape)
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
      // Keep only providers inside the 5 km circle.
      .filter((p) => !userPosition || p.distanceMeters <= SEARCH_RADIUS_METERS);

    // The backend already returns recommendations best-first, so for
    // "best" mode we keep that order and just number the results.
    if (canRecommend && sortMode === "best") {
      return withDistance.map((provider, index) => ({
        ...provider,
        rank: index + 1,
      }));
    }

    return [...withDistance].sort(
      (a, b) => (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity),
    );
  }, [rawServices, userPosition, canRecommend, sortMode]);

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
          canRecommend={canRecommend}
          sortMode={sortMode}
          onSortChange={setSortMode}
        />
      </div>
    </>
  );
};

export default Map;
