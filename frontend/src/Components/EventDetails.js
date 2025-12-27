import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchEventDetails } from '../api/eventDetailsApi'; 
import { getAuthToken } from '../auth/UserDataFunction'; 
import "./EventDetails.css";

const initialEventData = {
    name: "Loading...",
    description: "",
    startTime: "",
    endTime: "",
    location: {
        name: "Loading Location...",
        address: "",
        latitude: 0,
        longitude: 0
    }
};

function EventDetails() {
    const navigate = useNavigate();
    const { id: eventId } = useParams(); 
    
    const [eventData, setEventData] = useState(initialEventData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!getAuthToken()) {
            navigate('/login');
            return;
        }

        const loadEvent = async () => {
            try {
                setLoading(true);
                const data = await fetchEventDetails(eventId);
                setEventData(data);
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

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return "N/A";
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } catch (e) {
            return dateTimeString;
        }
    };

    if (loading) return <div className="event-details-container loading">Loading event details...</div>;
    if (error) return <div className="event-details-container error-message">Error: {error}</div>;
    
    const { name, description, startTime, endTime, location } = eventData;

    return (
        <div className="event-details-container">
            <div className="event-details-card">
                <header className="event-details-header">
                    <h1 className="event-details-title">{name}</h1>
                    <span className="event-subtitle">ID: {eventId}</span>
                </header>

                <div className="detail-section">
                    <h2>About this Event</h2>
                    <p>{description || "No description provided for this event."}</p>
                </div>
                
                <div className="details-grid">
                    <div className="time-location-block">
                        <h2>Date & Time</h2>
                        <p><strong>From:</strong> {formatDateTime(startTime)}</p>
                        <p><strong>To:</strong> {formatDateTime(endTime)}</p>
                    </div>

                    <div className="time-location-block">
                        <h2>Location</h2>
                        <p><strong>{location?.name || 'Venue TBD'}</strong></p>
                        <p>{location?.address}</p>
                        <p style={{fontSize: '12px', color: 'var(--text-muted)'}}>
                            {location?.latitude}, {location?.longitude}
                        </p>
                    </div>
                </div>

                <div className="action-buttons">
                    <button className="back-button" onClick={() => navigate("/home")}>
                        ← Back
                    </button>
                    <button className="invite-button" onClick={() => navigate(`/invite-people/${eventId}`)}>
                        Invite Guests
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EventDetails;