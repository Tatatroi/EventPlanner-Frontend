import React, { useState, useEffect } from "react";
import "./HomePage.css";
import profileImg from "../Assets/profilepicture.png";
import { useNavigate } from "react-router-dom";
import EventList from "../api/eventList";

function HomePage() {
  const navigate = useNavigate();

  const [allEvents, setAllEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [errorEvents, setErrorEvents] = useState("");

  const onLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  const goToEvent = (id) => {
    navigate(`/event/${id}`);
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const userId = localStorage.getItem("userId");
      setLoadingEvents(true);
      setErrorEvents("");
      try {
        const events = await EventList(userId);
        if (!cancelled) {
          setAllEvents(Array.isArray(events) ? events : []);
        }
      } catch (e) {
        if (!cancelled) setErrorEvents(e.message || "Error loading events");
      } finally {
        if (!cancelled) setLoadingEvents(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const [myIndex, setMyIndex] = useState(0);
  const [attIndex, setAttIndex] = useState(0);

  const ITEMS_PER_PAGE = 3;

  const organizerEvents = allEvents.filter((e) => e.role === "Organizer");
  const attendeeEvents = allEvents.filter((e) => e.role === "attendee");

  const nextMyEvents = () => {
    if (myIndex + ITEMS_PER_PAGE < organizerEvents.length) {
      setMyIndex(myIndex + ITEMS_PER_PAGE);
    }
  };

  const prevMyEvents = () => {
    if (myIndex - ITEMS_PER_PAGE >= 0) {
      setMyIndex(myIndex - ITEMS_PER_PAGE);
    }
  };

  const nextAttending = () => {
    if (attIndex + ITEMS_PER_PAGE < attendeeEvents.length) {
      setAttIndex(attIndex + ITEMS_PER_PAGE);
    }
  };

  const prevAttending = () => {
    if (attIndex - ITEMS_PER_PAGE >= 0) {
      setAttIndex(attIndex - ITEMS_PER_PAGE);
    }
  };

  return (
    <div className="home-container">
      {/* --- SIDEBAR --- */}
      <aside className="sidebar">
        <div className="profile-section">
          <div className="user-avatar-placeholder">
            {/* Show the first letter of the email if no image */}
            {localStorage.getItem("email")?.charAt(0).toUpperCase() || "U"}
          </div>
          <h3 className="sidebar-title">{localStorage.getItem("email")}</h3>
          <p className="user-role-badge">Event Planner</p>
        </div>
        <ul className="menu">
          <li className="menu-item active" onClick={() => navigate("/home")}>
            Dashboard
          </li>
          <li className="menu-item" onClick={() => navigate("/create-event")}>
            Create New Event
    </li>
  </ul>

  <button className="logout-button" onClick={onLogout}>
    Log Out
  </button>
</aside>

      {/* --- MAIN CONTENT --- */}
      <main className="main-content">
        
        {/* --- MY EVENTS SECTION --- */}
        <div className="section-header">
          <h2 className="home-title">My Events</h2>
          <div className="nav-buttons">
            <button 
              className="arrow-button" 
              onClick={prevMyEvents} 
              disabled={myIndex === 0}
            >
              ←
            </button>
            <button 
              className="arrow-button" 
              onClick={nextMyEvents} 
              disabled={myIndex + ITEMS_PER_PAGE >= organizerEvents.length}
            >
              →
            </button>
          </div>
        </div>

        <div className="event-grid">
          {loadingEvents && allEvents.length === 0 && (
            <p className="loading-text">Loading events...</p>
          )}
          
          {errorEvents && (
            <p className="error-text" role="alert">{errorEvents}</p>
          )}

          {!loadingEvents && organizerEvents.length === 0 && !errorEvents && (
            <p className="empty-message">You haven't created any events yet.</p>
          )}

          {organizerEvents
            .slice(myIndex, myIndex + ITEMS_PER_PAGE)
            .map((eventUser) => (
              <div className="event-box" key={eventUser.eventId}>
                <div className="event-info">
                   <span className="event-badge">Organizer</span>
                   <p className="event-title">Event #{eventUser.eventId}</p>
                </div>
                <button className="event-button" onClick={() => goToEvent(eventUser.eventId)}>
                  View Details
                </button>
              </div>
            ))}
        </div>

        {/* --- ATTENDING SECTION --- */}
        <div className="section-header">
          <h2 className="home-title">Events I'm Attending</h2>
          <div className="nav-buttons">
            <button 
              className="arrow-button" 
              onClick={prevAttending} 
              disabled={attIndex === 0}
            >
              ←
            </button>
            <button 
              className="arrow-button" 
              onClick={nextAttending} 
              disabled={attIndex + ITEMS_PER_PAGE >= attendeeEvents.length}
            >
              →
            </button>
          </div>
        </div>

        <div className="event-grid">
          {!loadingEvents && attendeeEvents.length === 0 && !errorEvents && (
            <p className="empty-message">You aren't attending any events yet.</p>
          )}

          {attendeeEvents
            .slice(attIndex, attIndex + ITEMS_PER_PAGE)
            .map((eventUser) => (
              <div className="event-box" key={eventUser.eventId}>
                <div className="event-info">
                   <span className="event-badge attendee">Guest</span>
                   <p className="event-title">Event #{eventUser.eventId}</p>
                </div>
                <button className="event-button" onClick={() => goToEvent(eventUser.eventId)}>
                  View Details
                </button>
              </div>
            ))}
        </div>

      </main>
    </div>
  );
}

export default HomePage;