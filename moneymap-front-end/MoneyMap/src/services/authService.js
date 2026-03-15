const API_URL = "http://localhost:8080/api/auth";

// Signup and auto-login
export async function signup(userInfo) {
  //  Call signup endpoint
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

  // Auto-login after successful signup
  const loginResponse = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: userInfo.email, password: userInfo.password }),
  });

  if (!loginResponse.ok) {
    const error = await loginResponse.text();
    throw new Error(error);
  }

  const user = await loginResponse.json();

  // Save user in localStorage so app recognizes as logged in
  localStorage.setItem("user", JSON.stringify(user));

  return user;
}

// Login
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

// Get current logged-in user
export function getCurrentUser() {
  return JSON.parse(localStorage.getItem("user"));
}

// Logout
export function logout() {
  localStorage.removeItem("user");
}