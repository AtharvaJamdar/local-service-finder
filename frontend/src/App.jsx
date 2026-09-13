import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Auth/login";
import Signup from "./Pages/Auth/signup";
import Services from "./Pages/Services";
import Map from "./Pages/Map";
import Booking from "./Pages/Booking";
import Tracking from "./Pages/Tracking";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/services" element={<Services />} />
      <Route path="/map/:category" element={<Map />} />
      <Route path="/booking/:providerId" element={<Booking />} />
      <Route path="/tracking/:providerId" element={<Tracking />} />
    </Routes>
  );
};

export default App;
