// import React, { useState } from "react";
// import "./CreateEvent.css";
// import { useNavigate } from "react-router-dom";
// import * as XLSX from "xlsx";
// import createEvent from "../api/createEventApi";

// function CreateEvent() {
//   const navigate = useNavigate();

//   const [eventName, setEventName] = useState("");
//   const [eventDate, setEventDate] = useState("");
//   const [eventTime, setEventTime] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [endTime, setEndTime] = useState("");
//   const [locationName, setLocationName] = useState("");
//   const [locationAddress, setLocationAddress] = useState("");
//   const [organiser2, setOrganiser2] = useState("");
//   const [participants, setParticipants] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const organiser1 = "Current User";

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const data = new Uint8Array(event.target.result);
//       const workbook = XLSX.read(data, { type: "array" });
//       const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
//       const excelRows = XLSX.utils.sheet_to_json(firstSheet);
//       setParticipants(excelRows);
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const handleCreateEvent = async () => {
//     setError("");
//     setLoading(true);
//     try {
//       const userId = localStorage.getItem("userId");
//       if (!userId) {
//         setError("Please login to create an event.");
//         return;
//       }
//       const startDateTime = `${eventDate}T${eventTime || "00:00"}:00`;
//       const endDateTime = endDate && endTime ? `${endDate}T${endTime}:00` : startDateTime;

//       const eventPayload = {
//         name: eventName,
//         start_time: startDateTime,
//         end_time: endDateTime,
//         location: { name: locationName, address: locationAddress },
//       };

//       await createEvent(eventPayload, userId);
//       navigate("/home");
//     } catch (e) {
//       setError(e.message || "Error creating event");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="create-event-wrapper">
//       <div className="create-event-container">
//         <header>
//           <h2 className="create-event-title">Create New Event</h2>
//           <p style={{color: 'var(--text-muted)', fontSize: '14px'}}>Fill in the details below to schedule your event.</p>
//         </header>

//         <h3 className="form-section-title">General Info</h3>
//         <div className="form-group">
//           <label>Event Name</label>
//           <input
//             type="text"
//             placeholder="E.g. Annual Gala 2024"
//             value={eventName}
//             onChange={(e) => setEventName(e.target.value)}
//           />
//         </div>

//         <h3 className="form-section-title">Date & Time</h3>
//         <div className="form-row">
//           <div className="form-group">
//             <label>Start Date *</label>
//             <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
//           </div>
//           <div className="form-group">
//             <label>Start Time *</label>
//             <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} required />
//           </div>
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label>End Date</label>
//             <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
//           </div>
//           <div className="form-group">
//             <label>End Time</label>
//             <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
//           </div>
//         </div>

//         <h3 className="form-section-title">Location</h3>
//         <div className="form-group">
//           <label>Venue Name *</label>
//           <input
//             type="text"
//             placeholder="e.g., Conference Room A"
//             value={locationName}
//             onChange={(e) => setLocationName(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label>Full Address *</label>
//           <input
//             type="text"
//             placeholder="Street, City, Postal Code"
//             value={locationAddress}
//             onChange={(e) => setLocationAddress(e.target.value)}
//             required
//           />
//         </div>

//         <h3 className="form-section-title">Team & Guests</h3>
//         <div className="form-row">
//           <div className="form-group">
//             <label>Primary Organizer</label>
//             <input type="text" value={organiser1} readOnly />
//           </div>
//           <div className="form-group">
//             <label>Co-Organizer</label>
//             <input type="text" value={organiser2} onChange={(e) => setOrganiser2(e.target.value)} />
//           </div>
//         </div>

//         <div className="form-group">
//           <label>Guest List (Excel)</label>
//           <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
//         </div>

//         {error && <div className="error-message">{error}</div>}

//         <div className="button-group">
//           <button className="cancel-btn" onClick={() => navigate("/home")}>
//             Cancel
//           </button>
//           <button className="submit-btn" onClick={handleCreateEvent} disabled={loading}>
//             {loading ? "Creating..." : "Create Event"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CreateEvent;

import React, { useState } from "react";
import "./CreateEvent.css";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import createEvent from "../api/createEventApi";

// --- 1. IMPORTURI PENTRU HARTĂ ---
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- 2. FIX ICONIȚĂ MARKER (Leaflet bug in React) ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- 3. COMPONENTA CARE ASCULTĂ CLICK-UL PE HARTĂ ---
function LocationPicker({ position, setPosition }) {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng); // Actualizăm poziția când dai click
            map.flyTo(e.latlng, map.getZoom()); // Opțional: Centrare animație pe click
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

function CreateEvent() {
  const navigate = useNavigate();

  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [locationName, setLocationName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  
  // --- STATE PENTRU COORDONATE (Default: Cluj-Napoca) ---
  const [mapCoordinates, setMapCoordinates] = useState({ lat: 46.7712, lng: 23.6236 });

  const [organiser2, setOrganiser2] = useState("");
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const organiser1 = "Current User";

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const excelRows = XLSX.utils.sheet_to_json(firstSheet);
      setParticipants(excelRows);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleCreateEvent = async () => {
    setError("");
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("Please login to create an event.");
        return;
      }
      const startDateTime = `${eventDate}T${eventTime || "00:00"}:00`;
      const endDateTime = endDate && endTime ? `${endDate}T${endTime}:00` : startDateTime;

      // --- CONSTRUIREA OBIECTULUI CU COORDONATE ---
      const eventPayload = {
        name: eventName,
        start_time: startDateTime,
        end_time: endDateTime,
        location: { 
            name: locationName, 
            address: locationAddress,
            // Trimitem coordonatele selectate pe hartă
            latitude: mapCoordinates.lat,
            longitude: mapCoordinates.lng
        },
      };

      await createEvent(eventPayload, userId);
      navigate("/home");
    } catch (e) {
      setError(e.message || "Error creating event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-wrapper">
      <div className="create-event-container">
        <header>
          <h2 className="create-event-title">Create New Event</h2>
          <p style={{color: 'var(--text-muted)', fontSize: '14px'}}>Fill in the details below to schedule your event.</p>
        </header>

        <h3 className="form-section-title">General Info</h3>
        <div className="form-group">
          <label>Event Name</label>
          <input
            type="text"
            placeholder="E.g. Annual Gala 2024"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </div>

        <h3 className="form-section-title">Date & Time</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Start Date *</label>
            <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Start Time *</label>
            <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label>End Time</label>
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
        </div>

        <h3 className="form-section-title">Location</h3>
        <div className="form-group">
          <label>Venue Name *</label>
          <input
            type="text"
            placeholder="e.g., Conference Room A"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Full Address (Text) *</label>
          <input
            type="text"
            placeholder="Street, City, Postal Code"
            value={locationAddress}
            onChange={(e) => setLocationAddress(e.target.value)}
            required
          />
        </div>

        {/* --- SECȚIUNEA NOUĂ PENTRU HARTĂ --- */}
        <div className="form-group">
            <label>Pinpoint Exact Location (Click on map)</label>
            <div style={{ height: "300px", width: "100%", border: "1px solid #ddd", borderRadius: "8px", marginTop: "5px", overflow: "hidden" }}>
                <MapContainer center={[46.7712, 23.6236]} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap contributors'
                    />
                    <LocationPicker position={mapCoordinates} setPosition={setMapCoordinates} />
                </MapContainer>
            </div>
            <p style={{fontSize: "12px", color: "gray", marginTop: "5px"}}>
                Selected Coordinates: {mapCoordinates.lat.toFixed(5)}, {mapCoordinates.lng.toFixed(5)}
            </p>
        </div>

        <h3 className="form-section-title">Team & Guests</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Primary Organizer</label>
            <input type="text" value={organiser1} readOnly />
          </div>
          <div className="form-group">
            <label>Co-Organizer</label>
            <input type="text" value={organiser2} onChange={(e) => setOrganiser2(e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label>Guest List (Excel)</label>
          <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="button-group">
          <button className="cancel-btn" onClick={() => navigate("/home")}>
            Cancel
          </button>
          <button className="submit-btn" onClick={handleCreateEvent} disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateEvent;