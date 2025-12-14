import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EventDetails.css";

function EventDetails() {
  const navigate = useNavigate();
  const { id } = useParams();                                  

  const goBack = () => navigate("/home");

  const goInvite = () => navigate(`/invite-people/${id}`)

  const goToPhotos = () => navigate(`/event/${id}/photos`);


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

        <button className="photos-button" onClick={goToPhotos}>
          Photos
        </button>

        <button className="invite-people-button" onClick={goInvite}>
          Invite People
        </button>
      </div>
    </div>
  );
}

export default EventDetails;
