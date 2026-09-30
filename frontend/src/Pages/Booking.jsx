import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProviderDetails from "../components/ProviderDetails";
import BookingForm from "../components/BookingForm";
import BookingConfirmation from "../components/BookingConfirmation";
import { api } from "../services/api";
import { toIsoDateTime, formatCurrency } from "../utils/format";
import "./Booking.css";

const Booking = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const service = await api.get(`/services/${serviceId}`);
        // Availability is keyed by provider, not by service.
        const availability = await api.get(
          `/availability/provider/${service.providerId}`,
        );

        setProvider({
          id: service.id,
          serviceId: service.id,
          providerId: service.providerId,
          name: service.providerName || "Service provider",
          title: service.title,
          category: service.categoryName,
          rating: service.providerRatingAverage ?? 0,
          reviews: service.providerReviewCount ?? 0,
          phone: service.providerPhone,
          description: service.description,
          price: formatCurrency(service.price),
          availability,
        });
      } catch (err) {
        setLoadError(err.message || "Failed to load this service.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serviceId]);

  const handleBookingSubmit = async (formData) => {
    setSubmitError("");
    setSubmitting(true);
    try {
      const scheduledAt = toIsoDateTime(formData.date, formData.slot);
      // The backend's Booking entity has no separate "problem description"
      // column, so it's folded into the free-text address field alongside
      // the customer's location.
      const address = formData.description
        ? `${formData.location} — ${formData.description}`
        : formData.location;

      const response = await api.post("/bookings", {
        serviceId: Number(serviceId),
        scheduledAt,
        address,
        isEmergency: false,
      });

      setConfirmedBooking(response);
    } catch (err) {
      setSubmitError(err.message || "Failed to create booking.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmationClose = () => {
    navigate(`/payment/${confirmedBooking.id}`);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ paddingTop: "24px" }}>
          <p>Loading service…</p>
        </div>
      </>
    );
  }

  if (loadError || !provider) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ paddingTop: "24px" }}>
          <p>{loadError || "Service not found."}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="booking-page">
        <ProviderDetails provider={provider} />

        {submitError && <p className="form-error">{submitError}</p>}

        {confirmedBooking ? (
          <BookingConfirmation
            booking={confirmedBooking}
            onClose={handleConfirmationClose}
          />
        ) : (
          <BookingForm
            provider={provider}
            onSubmit={handleBookingSubmit}
            submitting={submitting}
          />
        )}
      </div>
    </>
  );
};

export default Booking;
