export default function saveAuthData({ token, userId, email })
{
  if (!token) return;

  localStorage.setItem("authToken", token);
  localStorage.setItem("userId", userId);
  localStorage.setItem("email", email);
}

export function getAuthToken() {
  return localStorage.getItem("authToken");
}

export function getUserId() {
  return localStorage.getItem("userId");
}

export function getUserEmail() {
  return localStorage.getItem("email");
}

