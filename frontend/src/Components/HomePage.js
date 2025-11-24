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
    //    navigate(`/event/${localStorage.getItem("userId")}`);

  };

  // Fetch all events for the logged user
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const userId = localStorage.getItem("userId");
      console.log("Loading events for userId:", userId);
      setLoadingEvents(true);
      setErrorEvents("");
      try {
        const events = await EventList(userId);
        console.log("Events received from API:", events);
        if (!cancelled) {
          setAllEvents(Array.isArray(events) ? events : []);
          console.log("Events set to state:", Array.isArray(events) ? events : []);
        }
      } catch (e) {
        console.error("Error loading events:", e);
        if (!cancelled) setErrorEvents(e.message || "Eroare la încărcarea evenimentelor");
      } finally {
        if (!cancelled) setLoadingEvents(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  //index pentru butonul de navigare intre evenimente
  const [myIndex, setMyIndex] = useState(0);
  const [attIndex, setAttIndex] = useState(0);

  const ITEMS_PER_PAGE = 3;

  //navigare pt MY EVENTS
  const nextMyEvents = () => {
    const organizerEvents = allEvents.filter(e => e.role === 'Organizer');
    if (myIndex + ITEMS_PER_PAGE < organizerEvents.length) {
      setMyIndex(myIndex + ITEMS_PER_PAGE);
    }
  };

  const prevMyEvents = () => {
    if (myIndex - ITEMS_PER_PAGE >= 0) {
      setMyIndex(myIndex - ITEMS_PER_PAGE);
    }
  };

  //navigare pt ATTENDING EVENTS
  const nextAttending = () => {
    const attendeeEvents = allEvents.filter(e => e.role === 'attendee');
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

      <div className="sidebar">
        <div className="profile-section">
          <img src={profileImg} alt="Profile" className="profile-pic" />
          <h3 className="sidebar-title">My Profile</h3>
        </div>

        <ul className="menu">
          <li
            className="menu-item"
            onClick={() => navigate("/create-event")}
          >
          Create My Event
          </li>

          <li className="menu-item">Manage My Events</li>
        </ul>

        <button className="logout-button" onClick={onLogout}>
          Log Out
        </button>
      </div>

      <div className="main-content">

        {/* ------------------------ MY EVENTS ------------------------ */}
        <div className="section-header">
          <h2 className="home-title">MY EVENTS</h2>

          <div className="nav-buttons">
            {myIndex > 0 && (
              <button className="arrow-button" onClick={prevMyEvents}>
                ◀
              </button>
            )}

            {myIndex + ITEMS_PER_PAGE < allEvents.filter(e => e.role === 'Organizer').length && (
              <button className="arrow-button" onClick={nextMyEvents}>
                ▶
              </button>
            )}
          </div>
        </div>

        <div className="event-grid">
          {loadingEvents && allEvents.length === 0 && (
            <p>Loading your events...</p>
          )}
          {errorEvents && (
            <p style={{ color: "red" }} role="alert">{errorEvents}</p>
          )}
          {!loadingEvents && allEvents.filter(e => e.role === 'Organizer').length === 0 && !errorEvents && (
            <p className="empty-message">Nu ai încă evenimente create.</p>
          )}
          {allEvents
            .filter(eventUser => eventUser && eventUser.role === 'Organizer')
            .slice(myIndex, myIndex + ITEMS_PER_PAGE)
            .map((eventUser) => (
              <div className="event-box" key={eventUser.eventId}>
                <p className="event-title">Event ID: {eventUser.eventId} ({eventUser.role})</p>
                <button className="event-button" onClick={() => goToEvent(eventUser.eventId)}>
                  SEE EVENT DETAILS
                </button>
              </div>
            ))}
        </div>

        {/* -------------------- EVENTS I'M ATTENDING -------------------- */}
        <div className="section-header">
          <h2 className="home-title">EVENTS I'M ATTENDING</h2>

          <div className="nav-buttons">
            {attIndex > 0 && (
              <button className="arrow-button" onClick={prevAttending}>
                ◀
              </button>
            )}

            {attIndex + ITEMS_PER_PAGE < allEvents.filter(e => e.role === 'attendee').length && (
              <button className="arrow-button" onClick={nextAttending}>
                ▶
              </button>
            )}
          </div>
        </div>

        <div className="event-grid">
          {loadingEvents && allEvents.length === 0 && (
            <p>Loading events...</p>
          )}
          {errorEvents && (
            <p style={{ color: "red" }} role="alert">{errorEvents}</p>
          )}
          {!loadingEvents && allEvents.filter(e => e.role === 'attendee').length === 0 && !errorEvents && (
            <p className="empty-message">Nu participi la niciun eveniment.</p>
          )}
          {allEvents
            .filter(eventUser => eventUser && eventUser.role === 'attendee')
            .slice(attIndex, attIndex + ITEMS_PER_PAGE)
            .map((eventUser) => (
              <div className="event-box" key={eventUser.eventId}>
                <p className="event-title">Event ID: {eventUser.eventId} ({eventUser.role})</p>
                <button className="event-button" onClick={() => goToEvent(eventUser.eventId)}>
                  SEE EVENT DETAILS
                </button>
              </div>
            ))}
        </div>

      </div>
    </div>
  );
}

export default HomePage;
