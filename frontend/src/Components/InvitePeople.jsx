import "./InvitePeople.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getParticipantsByEvent,
  inviteSingleParticipant,
  deleteParticipantFromEvent,
} from "../api/participantsLists";

function ParticipantsList({ participants, onDelete }) {
  const getStatusText = (status) => {
    if (status === "accepted") return "Accepted";
    if (status === "pending") return "Pending";
    if (status === "declined") return "Declined";
    return "Unknown";
  };

  const getStatusClass = (status) => {
    if (status === "accepted") return "status-confirmed";
    if (status === "pending") return "status-pending";
    if (status === "declined") return "status-declined";
    return "status-unknown";
  };

  return (
    <div className="participants-container">
      {participants.map((p) => {
        const pId = p.id || p.userId;
        return (
          <div key={pId} className="participant-card">
            <div className="participant-info">
              <span className="participant-email">{p.email}</span>
              <span className="participant-role">{p.role || "attendee"}</span>
            </div>
            <div className="participant-actions">
              <span className={`participant-status ${getStatusClass(p.invitationStatus)}`}>
                {getStatusText(p.invitationStatus)}
              </span>
              <button className="delete-btn" onClick={() => onDelete(pId)}>
                Remove
              </button>
            </div>
          </div>
        );
      })}
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
        placeholder="Enter guest email address..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit" className="invite-button" disabled={loading}>
        {loading ? "Sending..." : "Send Invite"}
      </button>
    </form>
  );
}

export default function InvitePeople() {
  const navigate = useNavigate();
  const { id: idParam } = useParams();
  const id = Number(idParam);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadParticipants = async () => {
    if (!Number.isFinite(id)) return;
    setError("");
    try {
      const data = await getParticipantsByEvent(id);
      setParticipants(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to load participants");
    }
  };

  useEffect(() => {
    setLoading(true);
    loadParticipants().finally(() => setLoading(false));

    const interval = setInterval(loadParticipants, 10000);
    return () => clearInterval(interval);
  }, [id]);

  const handleInvite = async (email) => {
    setLoading(true);
    try {
      await inviteSingleParticipant(id, email);
      await loadParticipants();
    } catch (e) {
      setError(e.message || "Invitation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (participantId) => {
    if (!window.confirm("Remove this participant?")) return;
    try {
      await deleteParticipantFromEvent(id, participantId);
      setParticipants((prev) => prev.filter((p) => (p.id || p.userId) !== participantId));
    } catch (e) {
      setError("Delete failed");
    }
  };

  return (
    <div className="invite-page-container">
      <div className="header-with-refresh">
        <div>
           <button className="delete-btn" onClick={() => navigate(-1)} style={{marginBottom: '8px', paddingLeft: 0}}>← Back to Event</button>
           <h1 className="invite-page-title">Guest List</h1>
        </div>
        <button className="refresh-btn" onClick={loadParticipants} disabled={loading}>
          {loading ? "Syncing..." : "Refresh List"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <InviteForm onInvite={handleInvite} loading={loading} />

      <div className="list-section">
        <h3 style={{fontSize: '14px', color: 'var(--text-muted)', marginBottom: '1rem'}}>
          INVITED PARTICIPANTS ({participants.length})
        </h3>
        {loading && participants.length === 0 ? (
          <p className="loading-message">Loading guest list...</p>
        ) : participants.length === 0 ? (
          <p className="empty-message">Your guest list is currently empty.</p>
        ) : (
          <ParticipantsList participants={participants} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}