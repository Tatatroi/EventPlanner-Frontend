import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EventDetails.css";

function EventDetails() {
  const navigate = useNavigate();
  const { id } = useParams();                                   //event ID from URL

  const goBack = () => navigate("/home");

  return (
    <div className="event-details-container">
      <div className="event-details-card">
        <h1 className="event-details-title">Event {id} Details</h1>

        <p className="event-details-text">
          Aici vor aparea informatiile despre Event {id}:  
          description, date, location, participants, etc.
        </p>

        <button className="back-button" onClick={goBack}>
          Back to My Events
        </button>
      </div>
    </div>
  );
}

export default EventDetails;
