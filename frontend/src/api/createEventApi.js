export default async function createEvent(eventData, userId) {
    const response = await fetch(`http://localhost:8081/events?userId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
    });

    if (!response.ok) {
        let errBody;
        try {
            errBody = await response.json();
        } catch (e) {
            errBody = { message: response.statusText };
        }
        throw new Error(errBody.message || `Eroare la crearea evenimentului`);
    }

    return response.json();
}
