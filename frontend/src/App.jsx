import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./Pages/Auth/login";
import Signup from "./Pages/Auth/signup";
import Services from "./Pages/Services";
import Map from "./Pages/Map";
import MyBookings from "./Pages/MyBookings";
import Booking from "./Pages/Booking";
import Payment from "./Pages/Payment";
import Tracking from "./Pages/Tracking";
import ProviderProfile from "./Pages/Provider/Profile";
import ProviderDashboard from "./Pages/Provider/Dashboard";
import ProviderJobDetail from "./Pages/Provider/JobDetail";
import ServiceCreation from "./Pages/Provider/ServiceCreation";
import Landing from "./Pages/Landing";
import Review from "./Pages/Review";

const customerOnly = (element) => (
  <ProtectedRoute roles={["CUSTOMER"]}>{element}</ProtectedRoute>
);
const providerOnly = (element) => (
  <ProtectedRoute roles={["PROVIDER"]}>{element}</ProtectedRoute>
);

const App = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/services" element={<Services />} />
      <Route path="/map/:categoryId" element={<Map />} />

      {/* Customer only */}
      <Route path="/my-bookings" element={customerOnly(<MyBookings />)} />
      <Route path="/booking/:serviceId" element={customerOnly(<Booking />)} />
      <Route path="/payment/:bookingId" element={customerOnly(<Payment />)} />
      <Route path="/tracking/:bookingId" element={customerOnly(<Tracking />)} />
      <Route path="/review/:bookingId" element={customerOnly(<Review />)} />

      {/* Provider only */}
      <Route
        path="/provider/profile"
        element={providerOnly(<ProviderProfile />)}
      />
      <Route
        path="/provider/dashboard"
        element={providerOnly(<ProviderDashboard />)}
      />
      <Route
        path="/provider/job/:jobId"
        element={providerOnly(<ProviderJobDetail />)}
      />
      <Route
        path="/provider/services"
        element={providerOnly(<ServiceCreation />)}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
