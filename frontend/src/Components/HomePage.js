import React, { useState } from "react";
import "./HomePage.css";
import profileImg from "../Assets/profilepicture.png";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const onLogout = () => {
    navigate("/");
  };

  const goToEvent = (id) => {
    navigate(`/event/${id}`);
  };

  //de inlocuit cu backend data mai tarziu
  const myEvents = [
    { id: 1, title: "My Event 1" },
    { id: 2, title: "My Event 2" },
    { id: 3, title: "My Event 3" },
    { id: 4, title: "My Event 4" },
    { id: 5, title: "My Event 5" },
    { id: 6, title: "My Event 6" }
  ];

  const attendingEvents = [
    { id: 101, title: "Attending Event 1" },
    { id: 102, title: "Attending Event 2" },
    { id: 103, title: "Attending Event 3" },
    { id: 104, title: "Attending Event 4" }
  ];

  //index pentru butonul de navigare intre evenimente
  const [myIndex, setMyIndex] = useState(0);
  const [attIndex, setAttIndex] = useState(0);

  const ITEMS_PER_PAGE = 3;

  //navigare pt MY EVENTS
  const nextMyEvents = () => {
    if (myIndex + ITEMS_PER_PAGE < myEvents.length) {
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
    if (attIndex + ITEMS_PER_PAGE < attendingEvents.length) {
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

            {myIndex + ITEMS_PER_PAGE < myEvents.length && (
              <button className="arrow-button" onClick={nextMyEvents}>
                ▶
              </button>
            )}
          </div>
        </div>

        <div className="event-grid">
          {myEvents.slice(myIndex, myIndex + ITEMS_PER_PAGE).map((event) => (
            <div className="event-box" key={event.id}>
              <p className="event-title">{event.title}</p>
              <button className="event-button" onClick={() => goToEvent(event.id)}>
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

            {attIndex + ITEMS_PER_PAGE < attendingEvents.length && (
              <button className="arrow-button" onClick={nextAttending}>
                ▶
              </button>
            )}
          </div>
        </div>

        <div className="event-grid">
          {attendingEvents
            .slice(attIndex, attIndex + ITEMS_PER_PAGE)
            .map((event) => (
              <div className="event-box" key={event.id}>
                <p className="event-title">{event.title}</p>
                <button className="event-button" onClick={() => goToEvent(event.id)}>
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
