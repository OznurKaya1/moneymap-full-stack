const API_URL = "http://localhost:8080/api/auth";

export async function signup(userInfo) {
  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfo),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return response.text();
}

export async function login(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  const user = await response.json();

  // Save logged in user
  localStorage.setItem("user", JSON.stringify(user));

  return user;
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem("user"));
}