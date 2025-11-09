import React, { useState, useEffect } from "react";
import "./MyProfile.css";
import profileImg from "../Assets/profilepicture.png";
import { useNavigate } from "react-router-dom";

function MyProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    bio: ""
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // load saved profile from localStorage (or replace with API call)
    const stored = localStorage.getItem("myProfile");
    if (stored) setProfile(JSON.parse(stored));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("myProfile", JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    // clear auth as needed, then navigate to login
    navigate("/");
  };

  return (
    <div className="myprofile-container">
      <aside className="profile-sidebar">
        <img src={profileImg} alt="Profile" className="profile-pic" />
        <h3>{profile.name || "Your Name"}</h3>
        <p className="profile-email">{profile.email || "your.email@example.com"}</p>
        <button className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </aside>

      <main className="profile-main">
        <h2>My Profile</h2>
        <form className="profile-form" onSubmit={handleSave}>
          <label>
            Name
            <input name="name" value={profile.name} onChange={handleChange} />
          </label>

          <label>
            Email
            <input
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
            />
          </label>

          <label>
            Phone
            <input name="phone" value={profile.phone} onChange={handleChange} />
          </label>

          <label>
            Bio
            <textarea name="bio" value={profile.bio} onChange={handleChange} />
          </label>

          <div className="form-actions">
            <button type="submit" className="save-button">
              Save Profile
            </button>
            <button
              type="button"
              className="back-button"
              onClick={() => navigate("/home")}
            >
              Back to Events
            </button>
          </div>

          {saved && <div className="saved-msg">Profile saved.</div>}
        </form>
      </main>
    </div>
  );
}

export default MyProfile;