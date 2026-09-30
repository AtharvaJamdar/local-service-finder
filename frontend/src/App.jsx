import React from "react";
import { Routes, Route } from "react-router-dom";
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

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/services" element={<Services />} />
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="/map/:categoryId" element={<Map />} />
      <Route path="/booking/:serviceId" element={<Booking />} />
      <Route path="/payment/:bookingId" element={<Payment />} />
      <Route path="/tracking/:bookingId" element={<Tracking />} />
      <Route path="/provider/profile" element={<ProviderProfile />} />
      <Route path="/provider/dashboard" element={<ProviderDashboard />} />
      <Route path="/provider/job/:jobId" element={<ProviderJobDetail />} />
      <Route path="/provider/services" element={<ServiceCreation />} />
    </Routes>
  );
};

export default App;
