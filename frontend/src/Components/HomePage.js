import React from "react";
import "./HomePage.css";
import profileImg from "../Assets/profilepicture.png";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const onLogout = () => {
    navigate("/");
  };

  return (
    <div className="home-container">
      
      <div className="sidebar">
        <div className="profile-section">
          <img src={profileImg} alt="Profile" className="profile-pic" />
          <h3 className="sidebar-title">My Profile</h3>
        </div>

        <ul className="menu">
          <li className="menu-item">Create My Event</li>
          <li className="menu-item">Manage My Events</li>
        </ul>

        <button className="logout-button" onClick={onLogout}>
          Log Out
        </button>
      </div>

      <div className="main-content">
        <h2 className="home-title">MY EVENTS</h2>

        <div className="event-grid">
          <div className="event-box">
            <p className="event-title">EVENT 1</p>
            <button className="event-button">SEE EVENT DETAILS</button>
          </div>

          <div className="event-box">
            <p className="event-title">EVENT 2</p>
            <button className="event-button">SEE EVENT DETAILS</button>
          </div>

          <div className="event-box">
            <p className="event-title">EVENT 3</p>
            <button className="event-button">SEE EVENT DETAILS</button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default HomePage;
