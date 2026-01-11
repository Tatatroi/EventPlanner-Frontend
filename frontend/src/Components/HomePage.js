import React, { useState, useEffect } from "react";
import "./HomePage.css";
// import profileImg from "../Assets/profilepicture.png";
import { useNavigate } from "react-router-dom";
import EventList from "../api/eventList";
import { deleteEvent } from "../api/deleteEventApi";

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

  const handleDeleteFromDashboard = async (e, idToDelete) => {
      e.stopPropagation();
      
      if (window.confirm("Are you sure you want to delete this event?")) {
          try {
              await deleteEvent(idToDelete);
              
              setAllEvents(prevEvents => prevEvents.filter(event => event.eventId !== idToDelete));
              
          } catch (err) {
              console.error("Could not delete", err);
              alert("Failed to delete event.");
          }
      }
    };

    const getNextEventDate = () => {
    const now = new Date();
    // Filtrăm doar evenimentele din viitor
    const futureEvents = allEvents.filter(e => {
        // Verificăm ambele formate de dată (snake_case și camelCase)
        const dateStr = e.start_time || e.startTime;
        return dateStr && new Date(dateStr) > now;
    });

    if (futureEvents.length === 0) return "No upcoming events";

    // Le sortăm cronologic (cel mai apropiat primul)
    futureEvents.sort((a, b) => {
        const dateA = new Date(a.start_time || a.startTime);
        const dateB = new Date(b.start_time || b.startTime);
        return dateA - dateB;
    });

    const nextEvent = futureEvents[0];
    const dateObj = new Date(nextEvent.start_time || nextEvent.startTime);
    
    // Formatăm data frumos (ex: 15 Oct)
    return dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) + 
           " - " + (nextEvent.name || "Event");
  };

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
        {/* --- DASHBOARD ANALYITCS --- */}
         <div className="stats-container">
            <div className="stat-card blue">
                <div className="stat-value">{organizerEvents.length}</div>
                <div className="stat-label">Events Hosted</div>
                <div className="stat-icon">🎤</div>
            </div>
            <div className="stat-card green">
                <div className="stat-value">{attendeeEvents.length}</div>
                <div className="stat-label">Attending</div>
                <div className="stat-icon">🎉</div>
            </div>
            <div className="stat-card purple">
                <div className="stat-value small">{getNextEventDate()}</div>
                <div className="stat-label">Next Up</div>
                <div className="stat-icon">⏳</div>
            </div>
        </div>

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
                
                {/* 3. MODIFICARE AICI: Header cu Badge si Buton Delete */}
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                    <span className="event-badge">Organizer</span>
                    
                    {/* Butonul Coș de Gunoi */}
                    <button 
                        onClick={(e) => handleDeleteFromDashboard(e, eventUser.eventId)}
                        title="Delete Event"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            color: '#dc3545', // Culoare Roșie
                            padding: '0 5px'
                        }}
                    >
                        <svg 
                className="delete-icon-svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
                    </button>
                </div>

                <div className="event-info">
                   {/* Dacă ai un nume real al evenimentului în obiectul eventUser, folosește-l aici. 
                       Momentan am lăsat ID-ul cum aveai tu. */}
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