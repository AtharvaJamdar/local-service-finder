import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Navbar from "../components/Navbar";
import "./Payment.css";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("idle"); // idle | processing | success | failed
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/bookings/${bookingId}`)
      .then((data) => {
        setBooking(data);
        if (data.paymentStatus === "PAID") setStatus("success");
      })
      .catch((err) => setError(err.message || "Couldn't load this booking."))
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handlePay = async () => {
    if (booking?.status !== "COMPLETED") {
      setError("You can pay once the provider marks the job as completed.");
      return;
    }
    setError("");
    setStatus("processing");

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setStatus("failed");
      setError("Payment couldn't load. Check your connection and try again.");
      return;
    }

    try {
      const order = await api.post(`/bookings/${bookingId}/payments/order`);

      const razorpay = new window.Razorpay({
        key: order.razorpayKeyId,
        amount: Math.round(order.amount * 100), // rupees -> paise
        currency: order.currency || "INR",
        order_id: order.razorpayOrderId,
        name: "Local Service Finder",
        description: booking?.serviceTitle,
        prefill: {
          name: booking?.customerName,
        },
        theme: { color: "#355872" },
        handler: async (response) => {
          try {
            const result = await api.post(
              `/bookings/${bookingId}/payments/verify`,
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              },
            );

            if (result.status === "PAID") {
              setStatus("success");
            } else {
              setStatus("failed");
              setError(
                `Payment status: ${result.status}. Contact support if this seems wrong.`,
              );
            }
          } catch (err) {
            setStatus("failed");
            setError(
              err.message ||
                "Payment went through but verification failed. Contact support.",
            );
          }
        },
        modal: {
          ondismiss: () => setStatus("idle"),
        },
      });

      razorpay.on("payment.failed", () => {
        setStatus("failed");
        setError("Payment failed. You can try again.");
      });

      razorpay.open();
    } catch (err) {
      setStatus("failed");
      setError(err.message || "Couldn't start payment. Try again in a moment.");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="payment-page">
          <p>Loading booking…</p>
        </div>
      </>
    );
  }

  if (!booking) {
    return (
      <>
        <Navbar />
        <div className="payment-page">
          <p>{error || "Booking not found."}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="payment-page">
        <div className="payment-card">
          <h1 className="payment-title">Payment</h1>

          <div className="payment-lines">
            <div className="payment-line">
              <span>Service</span>
              <span>{booking.serviceTitle}</span>
            </div>
            <div className="payment-line">
              <span>Provider</span>
              <span>{booking.providerBusinessName}</span>
            </div>
            <div className="payment-line">
              <span>Booked for</span>
              <span>{new Date(booking.scheduledAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="payment-total-row">
            <span>Total due</span>
            <span className="payment-total">₹{booking.amount}</span>
          </div>

          {status === "success" ? (
            <div className="payment-success">
              <p>Payment complete.</p>
              <button
                className="payment-btn"
                onClick={() => navigate(`/review/${bookingId}`)}
              >
                Leave a review
              </button>
              <button
                type="button"
                className="payment-secondary-link"
                onClick={() =>
                  navigate(`/review/${bookingId}`, {
                    state: {
                      providerId: booking.providerId,
                      providerName: booking.providerBusinessName,
                    },
                  })
                }
              >
                Track this booking instead
              </button>
            </div>
          ) : (
            <>
              {error && <p className="payment-error">{error}</p>}
              <button
                className="payment-btn"
                onClick={handlePay}
                disabled={status === "processing"}
              >
                {status === "processing"
                  ? "Processing…"
                  : `Pay ₹${booking.amount}`}
              </button>
              <button
                type="button"
                className="payment-secondary-link"
                onClick={() => navigate(`/tracking/${bookingId}`)}
              >
                Pay later, track booking
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
