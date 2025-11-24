
export async function getParticipantsByEvent(eventId) {
    if (eventId === undefined || eventId === null) {
        throw new Error("'eventId' este obligatoriu");
    }
    const eid = Number(eventId);
    if (!Number.isFinite(eid)) {
        throw new Error("'eventId' trebuie să fie numeric");
    }

    const response = await fetch(`http://localhost:8081/event-users/event/participants/${eid}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        },
    });

    if (!response.ok) {
        let errBody;
        try {
            errBody = await response.json();
        } catch (e) {
            errBody = { message: response.statusText };
        }
        throw new Error(errBody.message || `Eroare la preluarea participanților pentru evenimentul ${eventId}`);
    }

    return response.json(); // expected: Array<EventUser>
}

export default getParticipantsByEvent;

export async function inviteParticipantToEvent(eventId, email) {
    if (!eventId) throw new Error("'eventId' este obligatoriu");
    if (!email) throw new Error("Emailul participantului este obligatoriu");

    const eid = Number(eventId);
    if (!Number.isFinite(eid)) {
        throw new Error("'eventId' trebuie să fie numeric");
    }

    // backend cere o LISTĂ de emailuri
    const emailList = [email.trim()];

    const response = await fetch(`http://localhost:8081/event-users/invite?idEvent=${eid}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify(emailList)
    });

    if (!response.ok) {
        let errBody;
        try { errBody = await response.json(); }
        catch (e) { errBody = { message: response.statusText }; }

        throw new Error(errBody.message || `Eroare la invitarea participantului ${email}`);
    }

    return response.text(); // backend returns a String
}


export async function deleteParticipantFromEvent(eventId, userId) {
    const eid = Number(eventId);
    const pid = Number(userId);

    const response = await fetch(`http://localhost:8081/event-users/${eid}/${pid}`, {
        method: "DELETE",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
         }
    });

    if (!response.ok) {
        let errBody;
        try { errBody = await response.json(); } 
        catch (e) { errBody = { message: response.statusText }; }
        throw new Error(errBody.message || `Eroare la ștergerea participantului ${userId}`);
    }

    return true;
}


export async function inviteUsersToEvent(eventId, emails) {
    if (!eventId) throw new Error("'eventId' este obligatoriu");
    const eid = Number(eventId);
    if (!Number.isFinite(eid)) throw new Error("'eventId' trebuie să fie numeric");
    let list = Array.isArray(emails) ? emails : [emails];
    list = list.map(e => e && e.trim()).filter(Boolean);
    if (list.length === 0) throw new Error("Trebuie să furnizezi cel puțin un email valid");

    const response = await fetch(`http://localhost:8081/event-users/invite?idEvent=${eid}` , {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
         },
        body: JSON.stringify({
            idEvent: eid,
            emails: list
        })
    });

    if (!response.ok) {
        let errBody;
        try { errBody = await response.json(); } catch (e) { errBody = { message: response.statusText }; }
        throw new Error(errBody.message || "Eroare la trimiterea invitațiilor");
    }

    // backend returns a plain confirmation string
    return response.text();
}

// Convenience wrapper: single email -> list of one for the same endpoint
export async function inviteSingleParticipant(eventId, email) {
    if (!email) throw new Error("Emailul participantului este obligatoriu");
    return inviteUsersToEvent(eventId, [email]);
}
