import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import MapView from "../components/MapView";
import TrackingStatus from "../components/TrackingStatus";
import { api } from "../services/api";
import "./Tracking.css";

// Poll the booking status so the customer sees provider updates
// (accepted / on the way / arrived) without refreshing the page.
const POLL_INTERVAL_MS = 8000;

const Tracking = () => {
  const { bookingId } = useParams();

  const [booking, setBooking] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    let cancelled = false;

    const loadBooking = async () => {
      try {
        const bookingData = await api.get(`/bookings/${bookingId}`);
        if (cancelled) return;
        setBooking(bookingData);

        // The booking response doesn't carry the provider's contact info
        // or map coordinates — those live on the service listing.
        const service = await api.get(`/services/${bookingData.serviceId}`);
        if (cancelled) return;
        setProvider({
          id: service.providerId,
          name: service.providerName,
          category: service.categoryName,
          phone: service.providerPhone,
          lat: service.providerLatitude,
          lng: service.providerLongitude,
        });
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load booking.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadBooking();
    const interval = setInterval(loadBooking, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [bookingId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ paddingTop: "24px" }}>
          <p>Loading booking…</p>
        </div>
      </>
    );
  }

  if (error || !booking || !provider) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ paddingTop: "24px" }}>
          <p>{error || "Booking not found."}</p>
        </div>
      </>
    );
  }

  const hasLocation = provider.lat != null && provider.lng != null;

  return (
    <>
      <Navbar />
      <div className="tracking-page">
        <section className="map-pane">
          {locationError && (
            <div className="location-banner">{locationError}</div>
          )}
          {hasLocation ? (
            <MapView
              userPosition={userPosition}
              providers={[provider]}
              selectedProviderId={provider.id}
              onSelectProvider={() => {}}
              showRoute
            />
          ) : (
            <div className="map-placeholder">
              <p>Provider location isn't available yet.</p>
            </div>
          )}
        </section>

        <TrackingStatus provider={provider} booking={booking} />
      </div>
    </>
  );
};

export default Tracking;
