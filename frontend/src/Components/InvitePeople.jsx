
import "./InvitePeople.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getParticipantsByEvent,
  inviteSingleParticipant,
  deleteParticipantFromEvent,
} from "../api/participantsLists";

function ParticipantsList({ participants, onDelete }) {
  const getStatusText = (participant) => {
    const status = participant.invitationStatus;
    if (status === "accepted") return "Accepted";
    if (status === "pending") return "Pending";
    if (status === "declined") return "Declined";
    return "Unknown";
  };

  const getStatusClass = (participant) => {
    const status = participant.invitationStatus;
    if (status === "accepted") return "status-confirmed";
    if (status === "pending") return "status-pending";
    if (status === "declined") return "status-declined";
    return "status-unknown";
  };

  return (
    <div className="participants-container">
      {participants.map((p) => (
        <div key={p.id || `${p.userId}-${p.eventId}`} className="participant-card">
          <div className="participant-info">
            <span className="participant-email">{p.email}</span>
            <span className="participant-role">{p.role || "attendee"}</span>
          </div>
          <div className="participant-actions">
            <span className={`participant-status ${getStatusClass(p)}`}>
              {getStatusText(p)}
            </span>
            <button className="delete-btn" onClick={() => onDelete(p.id || p.userId)}>
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function InviteForm({ onInvite, loading }) {
  const [email, setEmail] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    await onInvite(email.trim());
    setEmail("");
  };
  return (
    <form onSubmit={submit} className="invite-form">
      <input
        type="email"
        className="invite-input"
        placeholder="Invite user by email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit" className="invite-button" disabled={loading}>
        {loading ? "Inviting..." : "Invite"}
      </button>
    </form>
  );
}

export default function InvitePeople() {
  const { id: idParam } = useParams(); 
  const id = Number(idParam);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadParticipants = async () => {
    if (!Number.isFinite(id)) return;
    setError("");
    setLoading(true);
    try {
      const data = await getParticipantsByEvent(id);
      console.log("Participants data received:", data);
      if (data && data.length > 0) {
        console.log("First participant structure:", data[0]);
      }
      setParticipants(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Nu am putut încărca participanții");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParticipants();
    
    // Auto-refresh la fiecare 10 secunde pentru a vedea statusul actualizat
    const interval = setInterval(() => {
      loadParticipants();
    }, 10000); // 10 secunde

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleInvite = async (email) => {
    setLoading(true);
    setError("");
    try {
      await inviteSingleParticipant(id, email);
      await loadParticipants();
    } catch (e) {
      setError(e.message || "Invitarea a eșuat");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (participantId) => {
    setLoading(true);
    setError("");
    try {
      const pid = Number(participantId);
      await deleteParticipantFromEvent(id, pid);
      setParticipants((prev) => prev.filter((p) => (p.id || p.userId) !== pid));
    } catch (e) {
      setError(e.message || "Ștergerea a eșuat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="invite-page-container">
      <div className="header-with-refresh">
        <h1 className="invite-page-title">Participants for event {String(id)}</h1>
        <button 
          className="refresh-btn" 
          onClick={loadParticipants}
          disabled={loading}
          title="Refresh participants"
        >
          Refresh list
        </button>
      </div>
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      <InviteForm onInvite={handleInvite} loading={loading} />
      {loading && participants.length === 0 ? (
        <p className="loading-message">Loading participants...</p>
      ) : participants.length === 0 ? (
        <p className="empty-message">No participants invited yet.</p>
      ) : (
        <ParticipantsList participants={participants} onDelete={handleDelete} />
      )}
    </div>
  );
}