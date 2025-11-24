import saveAuthData from "../auth/UserDataFunction";

export async function loginUser(credentials) {
  const response = await fetch("http://localhost:8081/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    let errBody;
    try {
      errBody = await response.json();
    } catch (e) {
      errBody = { message: response.statusText };
    }
    throw new Error(errBody.message || "Eroare la autentificare");
  }

  const data = await response.json();

  saveAuthData(data);

  return data;
}




// export function saveAuthToken(token) {
//   if (!token) return;
//   try {
//     localStorage.setItem("authToken", token);
//   } catch (e) {
//     console.warn("Could not save auth token:", e);
//   }
// }

// export function getAuthToken() {
//   try {
//     return localStorage.getItem("authToken");
//   } catch (e) {
//     return null;
//   }
// }
