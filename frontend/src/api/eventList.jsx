export default async function EventList(userId) {
    const response = await fetch(`http://localhost:8081/event-users/user/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        let errBody;
        try {
            errBody = await response.json();
        } catch (e) {
            errBody = { message: response.statusText };
        }
        throw new Error(errBody.message || `Eroare la preluarea eventurilor pentru userul ${userId}`);
    }

    return response.json();
}