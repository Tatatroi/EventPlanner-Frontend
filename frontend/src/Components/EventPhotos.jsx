import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EventPhotos.css";

function EventPhotos() {
  const { id } = useParams(); // event ID
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load all photos for the event
  useEffect(() => {
    fetch(`http://localhost:8081/api/photos/event/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPhotos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);


  // Upload a photo
  const handleUpload = (e) => {
    e.preventDefault();
    console.log("Handle Upload click")
    if (!file){ 
        console.log("No file selected");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);
    console.log("File appended to FormData:", file);
    const idEv = Number(id);
    formData.append("eventId", idEv);
    
    // Adaugă userId din localStorage
    const userId = localStorage.getItem("userId");
    if (userId) {
      formData.append("userId", userId);
      console.log("Adding userId to FormData:", userId);
    } else {
      console.error("No userId found in localStorage");
      alert("Nu ești autentificat. Te rog să te loghezi.");
      return;
    }

    console.log("Uploading photo - eventId:", idEv, "userId:", userId, "file:", file);

    // Construiește headers cu token-ul dacă există
    const token = localStorage.getItem("authToken");
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      console.log("Using auth token:", token.substring(0, 20) + "...");
    } else {
      console.warn("No auth token found in localStorage");
    }

    fetch("http://localhost:8081/api/photos/upload", {
      method: "POST",
      body: formData,
      credentials: "include",
      headers: headers
    })
      .then((res) => {
        console.log("Upload response status:", res.status);
        console.log("Upload response ok:", res.ok);
        if (!res.ok) {
          return res.text().then(text => {
            console.error("Upload failed - Response:", text);
            throw new Error(`Upload failed: ${text}`);
          });
        }
        return res.json();
      })
      .then((uploadedPhoto) => {
        console.log("Photo uploaded successfully:", uploadedPhoto);
        setPhotos((prev) => [...prev, uploadedPhoto]);
        setFile(null);
      })
      .catch((err) => {
        console.error("Upload error:", err);
        alert(`Upload failed: ${err.message}`);
      });
  };


  // Delete photo
  const deletePhoto = (photoId) => {
    const userId = localStorage.getItem("userId");
    console.log("userId to delete:", userId);

    if (!userId) {
      alert("Nu ești autentificat. Te rog să te loghezi.");
      return;
    }

    const token = localStorage.getItem("authToken");
    const headers = {
      "Content-Type": "application/json"
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    fetch(`http://localhost:8081/api/photos/${photoId}?userId=${userId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then((res) => {
        console.log("Delete response status:", res.status);
        if (res.status === 403) {
          alert("No permission to delete this photo.");
          return;
        }
        if (!res.ok) {
          return res.text().then(text => {
            console.log(res);
            console.error("Delete failed - Response:", text);
            throw new Error(`Delete failed: ${text}`);
          });
        }
        if (res.ok) {
          setPhotos((prev) => prev.filter((p) => p.idPhoto !== photoId));
          console.log("Photo deleted successfully");
        }
      })
      .catch((err) => {
        console.error("Delete error:", err);
        alert(`Delete failed: ${err.message}`);
      });
  };


  if (loading) return <p className="loading">Loading photos...</p>;


  return (
    <div className="photos-container">
      <h1 className="photos-title">Photos for Event {id}</h1>

      {/* Upload Section */}
      <form
        onSubmit={handleUpload}
        className="upload-section"
        encType="multipart/form-data"
        >
        <input
            type="file"
            onChange={(e) => {
            console.log("FILE:", e.target.files[0]);
            setFile(e.target.files[0]);
            }}
            accept="image/*"
        />
        <button type="submit" className="upload-btn">Upload</button>
        </form>


      {/* Photos Grid */}
      <div className="photos-grid">
        {photos.map((photo) => (
          <div key={photo.idPhoto} className="photo-item">
            <img
              src={`http://localhost:8081/api/photos/files/${photo.idPhoto}`}
              alt="Event"
              className="photo-img"
            />
            <button
              className="delete-photo-btn"
              onClick={() => deletePhoto(photo.idPhoto)}
            >
              Delete
            </button>
          </div>
        ))}

        {photos.length === 0 && (
          <p className="no-photos">No photos yet for this event.</p>
        )}
      </div>

      <button className="back-btn" onClick={() => navigate(`/event/${id}`)}>
        Back to Event
      </button>
    </div>
  );
}

export default EventPhotos;
