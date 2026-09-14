import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Auth/login";
import Signup from "./Pages/Auth/signup";
import Services from "./Pages/Services";
import Map from "./Pages/Map";
import Booking from "./Pages/Booking";
import Tracking from "./Pages/Tracking";
import ProviderProfile from "./Pages/Provider/Profile";
import ProviderDashboard from "./Pages/Provider/Dashboard";
import ProviderJobDetail from "./Pages/Provider/JobDetail";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/services" element={<Services />} />
      <Route path="/map/:category" element={<Map />} />
      <Route path="/booking/:providerId" element={<Booking />} />
      <Route path="/tracking/:providerId" element={<Tracking />} />
      <Route path="/provider/profile" element={<ProviderProfile />} />
      <Route path="/provider/dashboard" element={<ProviderDashboard />} />
      <Route path="/provider/job/:jobId" element={<ProviderJobDetail />} />
    </Routes>
  );
};

export default App;
