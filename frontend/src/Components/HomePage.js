import React from "react";
import "./HomePage.css";

function HomePage({ onLogout }) {
  return (
    <div className="home-container">

      <div className="sidebar">
        <div className="profile-pic"></div>
        <h3>MY PROFILE</h3>

        <ul>
          <li>CREATE MY EVENT</li>
          <li>MANAGE MY EVENTS</li>
        </ul>

        <button className="logout-button" onClick={onLogout}>
          LOG OUT
        </button>
      </div>

      <div className="main-content">
        <h2>MY EVENTS</h2>

        <div className="event-box">
          <p className="event-title">EVENT 1</p>
          <button className="event-button">SEE EVENT DETAILS</button>
        </div>

        <div className="event-box">
          <p className="event-title">EVENT 2</p>
          <button className="event-button">SEE EVENT DETAILS</button>
        </div>
      </div>

    </div>
  );
}

export default HomePage;
