import React, { useState } from "react";
import "./CreateEvent.css";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import createEvent from "../api/createEventApi";

function CreateEvent() {
  const navigate = useNavigate();

  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [locationName, setLocationName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [organiser2, setOrganiser2] = useState("");
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // placeholder for current user
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
        setError("Nu ești autentificat. Te rog să te loghezi.");
        return;
      }

      // Construim start_time și end_time din date + time
      const startDateTime = `${eventDate}T${eventTime || "00:00"}:00`;
      const endDateTime = endDate && endTime ? `${endDate}T${endTime}:00` : startDateTime;

      const eventPayload = {
        name: eventName,
        start_time: startDateTime,
        end_time: endDateTime,
        location: {
          name: locationName,
          address: locationAddress,
        },
      };

      console.log("Creating Event:", eventPayload);
      const createdEvent = await createEvent(eventPayload, userId);
      console.log("Event created successfully:", createdEvent);
      
      navigate("/home");
    } catch (e) {
      console.error("Error creating event:", e);
      setError(e.message || "Eroare la crearea evenimentului");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-container">
      <h2 className="create-event-title">Create Event</h2>

      <div className="form-group">
        <label>Event Name</label>
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Start Date *</label>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Start Time *</label>
        <input
          type="time"
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>End Date (optional)</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>End Time (optional)</label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Location Name *</label>
        <input
          type="text"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          placeholder="e.g., Conference Room A"
          required
        />
      </div>

      <div className="form-group">
        <label>Location Address *</label>
        <input
          type="text"
          value={locationAddress}
          onChange={(e) => setLocationAddress(e.target.value)}
          placeholder="e.g., Str. Exemplu Nr. 1, București"
          required
        />
      </div>

      <div className="form-group">
        <label>Organiser 1</label>
        <input type="text" value={organiser1} readOnly />
      </div>

      <div className="form-group">
        <label>Organiser 2</label>
        <input
          type="text"
          value={organiser2}
          onChange={(e) => setOrganiser2(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Upload Participant List (Excel) — Optional</label>
        <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="button-group">
        <button className="event-button" onClick={handleCreateEvent} disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </button>
        <button className="event-button cancel" onClick={() => navigate("/home")} disabled={loading}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default CreateEvent;
