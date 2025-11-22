import React, { useState } from "react";
import "./CreateEvent.css";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

function CreateEvent() {
  const navigate = useNavigate();

  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [organiser2, setOrganiser2] = useState("");
  const [participants, setParticipants] = useState([]);

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

  const handleCreateEvent = () => {
    const newEvent = {
      name: eventName,
      date: eventDate,
      description,
      location,
      organisers: [organiser1, organiser2],
      participants,
    };

    console.log("Created Event:", newEvent);
    navigate("/home");
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
        <label>Event Date</label>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
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

      <div className="button-group">
        <button className="event-button" onClick={handleCreateEvent}>
          Create Event
        </button>
        <button className="event-button cancel" onClick={() => navigate("/home")}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default CreateEvent;
