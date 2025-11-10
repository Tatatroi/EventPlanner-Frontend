export async function registerUser(data) {
    const response = await fetch("http://localhost:8081/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        // încercăm să citim mesajul de eroare din body, dacă există
        let errBody;
        try {
            errBody = await response.json();
        } catch (e) {
            errBody = { message: response.statusText };
        }
        throw new Error(errBody.message || "Eroare la înregistrare");
    }

    return response.json();
}

