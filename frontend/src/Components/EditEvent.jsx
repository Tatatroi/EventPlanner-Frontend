import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchEventDetails, updateEvent } from "../api/eventDetailsApi";
import "./CreateEvent.css"; 

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
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

function LocationPicker({ setFormData }) {
    const map = useMapEvents({
        click(e) {
            setFormData(prev => ({
                ...prev,
                location: {
                    ...prev.location,
                    latitude: e.latlng.lat,
                    longitude: e.latlng.lng
                }
            }));
            map.flyTo(e.latlng, map.getZoom()); 
        },
    });
    return null;
}

function EditEvent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        startTime: "",
        endTime: "",
        location: {
            name: "",
            address: "",
            latitude: 46.7712, 
            longitude: 23.6236
        }
    });

    const formatForInput = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return date.toISOString().slice(0, 16);
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchEventDetails(id);
                
                setFormData({
                    name: data.name || "",
                    description: data.description || "",
                    startTime: formatForInput(data.start_time || data.startTime),
                    endTime: formatForInput(data.end_time || data.endTime),
                    location: data.location || { 
                        name: "", 
                        address: "", 
                        latitude: 46.7712, 
                        longitude: 23.6236 
                    }
                });
                setLoading(false);
            } catch (error) {
                alert("Error loading event: " + error.message);
                navigate(`/event/${id}`);
            }
        };
        loadData();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes("location.")) {
            const locField = name.split(".")[1];
            setFormData(prev => ({
                ...prev,
                location: { ...prev.location, [locField]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: formData.name,
                description: formData.description,
                start_time: formData.startTime, 
                end_time: formData.endTime,
                location: formData.location 
            };

            await updateEvent(id, payload);
            alert("Event updated successfully!");
            navigate(`/event/${id}`);
        } catch (error) {
            alert("Failed to update: " + error.message);
        }
    };

    if (loading) return <div className="loading-screen" style={{padding:'50px', textAlign:'center'}}>Loading event...</div>;

    const mapCenter = [
        formData.location.latitude || 46.7712, 
        formData.location.longitude || 23.6236
    ];

    return (
        <div className="create-event-wrapper"> 
            <div className="create-event-container">
            <h1>Edit Event #{id}</h1>
            
            <form onSubmit={handleSubmit} className="event-form">
                
                <div className="form-group">
                    <label>Event Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="form-input"
                        rows="4"
                        style={{ resize: "vertical", fontFamily: "inherit", padding: "10px", width: "100%", border: "1px solid #ccc", borderRadius: "5px" }}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Start Time</label>
                        <input
                            type="datetime-local"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>End Time</label>
                        <input
                            type="datetime-local"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <h3 className="form-section-title">Location Details</h3>

                <div className="form-group">
                    <label>Venue Name</label>
                    <input
                        type="text"
                        name="location.name"
                        value={formData.location.name}
                        onChange={handleChange}
                    />
                </div>
                
                <div className="form-group">
                    <label>Address</label>
                    <input
                        type="text"
                        name="location.address"
                        value={formData.location.address}
                        onChange={handleChange}
                    />
                </div>

                {/* --- HARTA PENTRU EDITARE --- */}
                <div className="form-group">
                    <label>Update Location on Map (Click to move pin)</label>
                    <div style={{ height: "300px", width: "100%", border: "1px solid #ddd", borderRadius: "8px", marginTop: "5px", overflow: "hidden" }}>
                        {!loading && (
                            <MapContainer center={mapCenter} zoom={15} style={{ height: "100%", width: "100%" }}>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; OpenStreetMap contributors'
                                />
                                <Marker position={mapCenter}></Marker>
                                <LocationPicker setFormData={setFormData} />
                            </MapContainer>
                        )}
                    </div>
                    <p style={{fontSize: "12px", color: "gray", marginTop: "5px"}}>
                        Current Coordinates: {formData.location.latitude?.toFixed(5)}, {formData.location.longitude?.toFixed(5)}
                    </p>
                </div>

                <div className="button-group" style={{marginTop: '20px'}}>
                    <button type="button" className="cancel-btn" onClick={() => navigate(`/event/${id}`)}>
                        Cancel
                    </button>
                    <button type="submit" className="submit-btn" style={{backgroundColor:'#ffc107', color:'black'}}>
                        Save Changes
                    </button>
                </div>
            </form>
            </div>
        </div>
    );
}

export default EditEvent;