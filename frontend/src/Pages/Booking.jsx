import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProviderDetails from "../components/ProviderDetails";
import BookingForm from "../components/BookingForm";
import BookingConfirmation from "../components/BookingConfirmation";
import { providers } from "../data/providers";
import "./Booking.css";

const Booking = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  const provider = providers.find((p) => p.id === Number(providerId));

  if (!provider) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ paddingTop: "24px" }}>
          <p>Provider not found. Go back and pick one from the map.</p>
        </div>
      </>
    );
  }

  const handleBookingSubmit = (bookingData) => {
    setBooking(bookingData);
  };

  const handleConfirmationClose = () => {
    navigate(`/tracking/${provider.id}`, { state: { booking } });
  };

  return (
    <>
      <Navbar />
      <div className="booking-page">
        <ProviderDetails provider={provider} />

        {booking ? (
          <BookingConfirmation
            booking={booking}
            onClose={handleConfirmationClose}
          />
        ) : (
          <BookingForm provider={provider} onSubmit={handleBookingSubmit} />
        )}
      </div>
    </>
  );
};

export default Booking;
