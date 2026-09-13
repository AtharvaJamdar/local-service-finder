import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ServiceCard from "../components/ServiceCard";

const services = [
  {
    title: "Electrician",
    description:
      "Get reliable electricians for wiring, repairs, installations and electrical maintenance.",
    image:
      "https://plus.unsplash.com/premium_photo-1661911309991-cc81afcce97d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Plumber",
    description:
      "Find skilled plumbers for pipe repairs, leaks, installations and other plumbing needs.",
    image:
      "https://plus.unsplash.com/premium_photo-1663045495725-89f23b57cfc5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "House Cleaning",
    description:
      "Book trusted professionals for home cleaning, deep cleaning and regular maintenance.",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80",
  },
  {
    title: "Carpenter",
    description:
      "Connect with skilled carpenters for furniture, repairs, installations and custom woodwork.",
    image:
      "https://images.unsplash.com/photo-1601058268499-e52658b8bb88?w=600&q=80",
  },
];

const Services = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="container">
        <div className="section section-first">
          <div className="section-header">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle">
              Find trusted professionals for your everyday needs.
            </p>
          </div>

          <div className="services-grid">
            {services.map((service) => (
              <ServiceCard
                key={service.title}
                title={service.title}
                description={service.description}
                image={service.image}
                onFindProvider={() => navigate(`/map/${service.title}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
