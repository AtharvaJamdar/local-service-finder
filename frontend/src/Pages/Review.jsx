import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { api } from "../services/api";
import "./Review.css";
import Navbar from "../components/Navbar";

// ---- Response mapping --------------------------------------------------
// Matches the backend ReviewResponse:
// { id, bookingId, customerId, customerName, providerId, rating, comment, createdAt }
const toList = (data) =>
  Array.isArray(data) ? data : Array.isArray(data?.content) ? data.content : [];

const normalize = (r) => ({
  id: r.id,
  name: r.customerName ?? "Customer",
  rating: Number(r.rating) || 0,
  text: r.comment ?? "",
  createdAt: r.createdAt ?? null,
});

const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString();
};

function Stars({ rating }) {
  const n = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span className="rv-stars" aria-label={`${n} out of 5 stars`}>
      {"★".repeat(n)}
      {"☆".repeat(5 - n)}
    </span>
  );
}

export default function Review() {
  const { bookingId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // ---- Booking (GET /bookings/{id}) -------------------------------------
  // The result is stored together with the id it was fetched for, so
  // "loading" is derived (result id !== current id) instead of being set
  // synchronously inside the effect.
  const [bookingResult, setBookingResult] = useState({
    id: null,
    data: null,
    error: "",
  });

  const bookingLoaded = bookingResult.id === bookingId;
  const loadingBooking = !bookingLoaded;
  const booking = bookingLoaded ? bookingResult.data : null;
  const bookingError = bookingLoaded ? bookingResult.error : "";

  useEffect(() => {
    let cancelled = false;
    api
      .get(`/bookings/${bookingId}`)
      .then((data) => {
        if (!cancelled) setBookingResult({ id: bookingId, data, error: "" });
      })
      .catch((err) => {
        if (!cancelled)
          setBookingResult({
            id: bookingId,
            data: null,
            error: err.message || "Couldn't load this booking.",
          });
      });
    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  const providerId = booking?.providerId ?? state?.providerId ?? null;
  const providerName =
    booking?.providerBusinessName ?? state?.providerName ?? "";

  // ---- Provider reviews (GET /providers/{id}/reviews — public) ----------
  const [reloadKey, setReloadKey] = useState(0);
  const listKey = providerId ? `${providerId}:${reloadKey}` : null;

  const [listResult, setListResult] = useState({
    key: null,
    items: [],
    error: "",
  });

  const loadingList = !!listKey && listResult.key !== listKey;
  const reviews = listResult.items;
  const listError = listResult.key === listKey ? listResult.error : "";

  useEffect(() => {
    if (!listKey) return;
    let cancelled = false;
    api
      .get(`/providers/${providerId}/reviews`)
      .then((data) => {
        if (!cancelled)
          setListResult({
            key: listKey,
            items: toList(data).map(normalize),
            error: "",
          });
      })
      .catch((err) => {
        if (!cancelled)
          setListResult({
            key: listKey,
            items: [],
            error: err.message || "Couldn't load reviews.",
          });
      });
    return () => {
      cancelled = true;
    };
  }, [listKey, providerId]);

  // ---- UI state ---------------------------------------------------------
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");

  const [draft, setDraft] = useState({ rating: 0, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const avg = useMemo(
    () =>
      reviews.length
        ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(
            1,
          )
        : null,
    [reviews],
  );

  const distribution = useMemo(
    () =>
      [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((r) => Math.round(r.rating) === star).length,
      })),
    [reviews],
  );

  const visible = useMemo(() => {
    let list = reviews.filter((r) =>
      r.text.toLowerCase().includes(search.toLowerCase()),
    );
    if (sort === "high") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "low") list = [...list].sort((a, b) => a.rating - b.rating);
    if (sort === "recent")
      list = [...list].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );
    return list;
  }, [reviews, search, sort]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!draft.rating) {
      setSubmitError("Please select a star rating.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      await api.post(`/bookings/${bookingId}/reviews`, {
        rating: draft.rating,
        comment: draft.comment.trim(),
      });
      setSubmitted(true);
      setReloadKey((k) => k + 1); // refetch the list
    } catch (err) {
      // e.g. booking not completed yet, or already reviewed
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const canReview = booking?.status === "COMPLETED";

  const renderFormArea = () => {
    if (submitted) {
      return (
        <div className="rv-banner rv-banner-success" role="status">
          <span>Thank you! Your review has been submitted.</span>
          <button
            type="button"
            className="rv-btn"
            onClick={() => navigate("/my-bookings")}
          >
            Back to My Bookings
          </button>
        </div>
      );
    }

    if (loadingBooking) {
      return <div className="rv-banner">Loading booking…</div>;
    }

    if (bookingError) {
      return (
        <div className="rv-banner" role="alert">
          {bookingError}
        </div>
      );
    }

    if (!canReview) {
      return (
        <div className="rv-banner">
          You can review this service once the provider marks the job as
          completed. <Link to="/my-bookings">Back to My Bookings</Link>
        </div>
      );
    }

    return (
      <form className="rv-form" onSubmit={submitReview}>
        <div className="rv-stars-input" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              type="button"
              key={s}
              className={s <= draft.rating ? "on" : ""}
              aria-label={`${s} star${s > 1 ? "s" : ""}`}
              onClick={() => setDraft((d) => ({ ...d, rating: s }))}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          placeholder="Share details about your experience..."
          rows={3}
          maxLength={1000}
          value={draft.comment}
          onChange={(e) => setDraft((d) => ({ ...d, comment: e.target.value }))}
        />
        {submitError && (
          <div className="rv-form-error" role="alert">
            {submitError}
          </div>
        )}
        <button className="rv-btn" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    );
  };

  return (
    <div className="rv-page">
      <Navbar />

      <section className="rv-hero">
        <h1>Rate Your Experience</h1>
        <p>
          {providerName
            ? `How was your service with ${providerName}?`
            : "Your feedback helps others find trusted professionals."}
        </p>
      </section>

      {!isAuthenticated && (
        <div className="rv-banner">
          Please <Link to="/login">log in</Link> to submit a review.
        </div>
      )}

      {renderFormArea()}

      {providerId && (
        <>
          {avg && (
            <div className="rv-stats">
              <strong>{avg}</strong> ★ average — based on {reviews.length}{" "}
              review{reviews.length === 1 ? "" : "s"}
              <div className="rv-dist">
                {distribution.map(({ star, count }) => (
                  <div className="rv-dist-row" key={star}>
                    <span>{star}★</span>
                    <div className="rv-dist-bar">
                      <div
                        className="rv-dist-fill"
                        style={{
                          width: `${reviews.length ? (count / reviews.length) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="rv-dist-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rv-filters">
            <input
              placeholder="Search reviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="recent">Most Recent</option>
              <option value="high">Highest Rated</option>
              <option value="low">Lowest Rated</option>
            </select>
          </div>

          <div className="rv-list">
            {loadingList ? (
              <div className="rv-empty">Loading reviews...</div>
            ) : listError ? (
              <div className="rv-empty rv-error">{listError}</div>
            ) : visible.length === 0 ? (
              <div className="rv-empty">No reviews yet.</div>
            ) : (
              visible.map((r) => (
                <div className="rv-card" key={r.id}>
                  <div className="rv-card-top">
                    <span className="rv-name">{r.name}</span>
                  </div>
                  <Stars rating={r.rating} />
                  {r.text && <p>{r.text}</p>}
                  <div className="rv-card-bottom">
                    <span>{formatDate(r.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      <footer className="rv-footer">© 2026 Local Service Finder</footer>
    </div>
  );
}
