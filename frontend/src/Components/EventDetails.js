import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchEventDetails, notifyGuests } from '../api/eventDetailsApi'; 
import { getAuthToken } from '../auth/UserDataFunction'; 
import { deleteEvent } from '../api/deleteEventApi';
import "./EventDetails.css";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const initialEventData = {
    name: "Loading...",
    description: "",
    startTime: "",
    endTime: "",
    location: {
        name: "Loading Location...",
        address: "",
        latitude: null, 
        longitude: null
    },
    organizer: null // Adăugat pentru siguranță
};

function EventDetails() {
    const navigate = useNavigate();
    const { id: eventId } = useParams(); 
    
    const [eventData, setEventData] = useState(initialEventData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [previewPhotos, setPreviewPhotos] = useState([]);
    const [userRole, setUserRole] = useState("");
    
    // Luăm ID-ul curent din localStorage
    const currentUserId = localStorage.getItem("userId");
    
    // State pentru cronometru
    const [timeLeft, setTimeLeft] = useState({});
    const [eventStatus, setEventStatus] = useState("LOADING"); 

    const handleEdit = () => {
        navigate(`/edit-event/${eventId}`);
    };

    useEffect(() => {
        if (!getAuthToken()) {
            navigate('/login');
            return;
        }

        const loadEvent = async () => {
            try {
                setLoading(true);
                const data = await fetchEventDetails(eventId);
                
                console.log("Debug Data:", data);

                setEventData({
                    ...data,
                    startTime: data.start_time || data.startTime, 
                    endTime: data.end_time || data.endTime,
                    location: data.location || { name: 'N/A', address: '', latitude: null, longitude: null }
                });

                const photosRes = await fetch(`http://localhost:8081/api/photos/event/${eventId}`);
                if (photosRes.ok) {
                    const photosData = await photosRes.json();
                    setPreviewPhotos(photosData.slice(0, 4));
                }

                if (currentUserId) {
                    const roleRes = await fetch(`http://localhost:8081/event-users/${eventId}/${currentUserId}`, {
                        headers: {
                            'Authorization': `Bearer ${getAuthToken()}` // Dacă ai nevoie de token
                        }
                    });
                    
                    if (roleRes.ok) {
                        const roleData = await roleRes.json();
                        // Backend-ul returnează un obiect care are câmpul "role"
                        console.log("Rolul meu la acest event:", roleData.role);
                        setUserRole(roleData.role); 
                    }
                }

                setError(null);
            } catch (err) {
                const errorMessage = err.message || "Failed to load event details.";
                setError(errorMessage);
                if (errorMessage.includes('401')) navigate('/login'); 
            } finally {
                setLoading(false);
            }
        };

        if (eventId) loadEvent();
    }, [eventId, navigate]); 


    useEffect(() => {
        const calculateTimeLeft = () => {
            if (!eventData.startTime) return;

            const now = new Date();
            const start = new Date(eventData.startTime);
            const end = eventData.endTime ? new Date(eventData.endTime) : new Date(start.getTime() + 2 * 60 * 60 * 1000);

            let status = "";
            let difference = 0;

            if (now > end) {
                status = "ENDED";
            } else if (now >= start && now <= end) {
                status = "ONGOING";
            } else {
                status = "FUTURE";
                difference = +start - +now;
            }

            setEventStatus(status);

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            } else {
                setTimeLeft({});
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [eventData]); 


    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this event? This cannot be undone.")) {
            try {
                await deleteEvent(eventId);
                alert("Event deleted successfully!");
                navigate('/home'); 
            } catch (err) {
                alert("Error deleting event: " + err.message);
            }
        }
    };

    const handleSendUpdate = async () => {
        if (!window.confirm("Send email update with the current agenda to all CONFIRMED guests?")) {
            return;
        }
        
        try {
            await notifyGuests(eventId);
            alert("Update emails sent successfully!");
        } catch (err) {
            alert("Could not send updates: " + err.message);
        }
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return "N/A";
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleString('en-US', { 
                month: 'short', day: 'numeric', year: 'numeric',
                hour: '2-digit', minute: '2-digit' 
            });
        } catch (e) { return dateTimeString; }
    };

    const { name, description, startTime, endTime, location } = eventData;
    const goToPhotos = () => navigate(`/event/${eventId}/photos`);
    const goToGallery = () => navigate(`/event/${eventId}/gallery`);

    const hasValidCoords = location && 
                           location.latitude !== 0 && location.latitude !== null &&
                           location.longitude !== 0 && location.longitude !== null;

    const mapCenter = hasValidCoords 
        ? [location.latitude, location.longitude] 
        : [46.7712, 23.6236]; 


    const isOrganizer = userRole && userRole.toLowerCase() === 'organizer';

    const renderStatusBadge = () => {
        if (eventStatus === "ENDED") return <div className="status-badge ended">Event Ended</div>;
        if (eventStatus === "ONGOING") return <div className="status-badge ongoing">Happening Now!</div>;
        if (eventStatus === "FUTURE" && timeLeft.days !== undefined) {
            return (
                <div className="status-badge future">
                    Starts in: <strong>{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</strong>
                </div>
            );
        }
        return null;
    };


    if (loading) return <div className="event-details-container loading">Loading...</div>;
    if (error) return <div className="event-details-container error-message">Error: {error}</div>;

    return (
        <div className="event-details-container">
            <div className="event-details-card">
                <header className="event-details-header">
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                        <div>
                            <h1 className="event-details-title">{name}</h1>
                            <span className="event-subtitle">ID: {eventId}</span>
                        </div>
                        {renderStatusBadge()}
                    </div>
                </header>

                <div className="detail-section">
                    <h2>About this Event</h2>
                    <p>{description || "No description provided."}</p>
                </div>
                
                <div className="details-grid">
                    <div className="time-location-block">
                        <h2>Date & Time</h2>
                        <p><strong>From:</strong> {startTime ? formatDateTime(startTime) : "Loading..."}</p>
                        <p><strong>To:</strong> {endTime ? formatDateTime(endTime) : formatDateTime(startTime)}</p>
                    </div>

                    <div className="time-location-block location-map-block">
                        <h2>Location</h2>
                        <p><strong>{location?.name || 'Venue TBD'}</strong></p>
                        <p>{location?.address}</p>
                        
                         {hasValidCoords && (
                            <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ display: 'inline-block', marginBottom: '10px', color: '#007bff', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}
                            >
                                Get Directions on Google Maps
                            </a>
                        )}

                        <div className="map-wrapper" style={{ height: "250px", width: "100%", marginTop: "5px", borderRadius: "8px", overflow: "hidden", border: "1px solid #ddd" }}>
                            {hasValidCoords ? (
                                <MapContainer center={mapCenter} zoom={15} style={{ height: "100%", width: "100%" }}>
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='© OpenStreetMap contributors'
                                    />
                                    <Marker position={mapCenter}>
                                        <Popup>{location.name}</Popup>
                                    </Marker>
                                </MapContainer>
                            ) : (
                                <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f9fa", color: "#6c757d", flexDirection: "column" }}>
                                    <p style={{marginBottom: "5px"}}>No map data available</p>
                                    <small>Address not geocoded yet.</small>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- SECȚIUNE PHOTO TEASER --- */}
                <div className="photo-teaser-section">
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
                        <h3>Event Gallery</h3>
                        {previewPhotos.length > 0 && (
                            <span style={{fontSize:'0.9rem', color:'#007bff', cursor:'pointer'}} onClick={goToGallery}>
                                View Album Gallery →
                            </span>
                        )}
                    </div>

                    {previewPhotos.length > 0 ? (
                        <div className="teaser-grid">
                            {previewPhotos.map(photo => (
                                <div key={photo.idPhoto} className="teaser-item" onClick={goToPhotos}>
                                    <img 
                                        src={`http://localhost:8081/api/photos/files/${photo.idPhoto}`} 
                                        alt="Event preview" 
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-gallery-teaser" onClick={goToPhotos}>
                            <p>No photos yet. Be the first to upload!</p>
                        </div>
                    )}
                </div>            

                {/* --- BUTOANELE DE ACȚIUNE --- */}
                <div className="action-buttons">
                    <button className="back-button" onClick={() => navigate("/home")}>← Back</button>
                    
                    {/* Butonul de Poze este public (pentru toți participanții) */}
                    <button className="invite-button" onClick={goToPhotos}>Gallery / Upload</button>

                    {/* --- ZONA PROTEJATĂ: Doar pentru Organizator --- */}
                    {isOrganizer && (
                        <>
                            <button className="invite-button" onClick={() => navigate(`/invite-people/${eventId}`)}>Invite Guests</button>
                            
                            <button 
                                className="invite-button" 
                                onClick={handleSendUpdate}
                                style={{ backgroundColor: '#28a745', marginLeft: '10px' }} // Verde
                                title="Send the description/agenda to all confirmed guests"
                            >
                                Send Agenda
                            </button>

                            <button 
                                className="invite-button" 
                                onClick={handleEdit}
                                style={{ backgroundColor: '#ffc107', color: '#000', marginLeft: '10px' }}
                            >
                                Edit Event
                            </button>
                            
                            <button 
                                className="delete-button" 
                                onClick={handleDelete}
                                style={{ backgroundColor: '#dc3545', color: 'white', marginLeft: 'auto', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Delete Event
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EventDetails;