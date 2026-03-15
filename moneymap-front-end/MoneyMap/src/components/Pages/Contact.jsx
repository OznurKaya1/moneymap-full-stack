import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { logout, getCurrentUser } from "../../services/authService";

export default function Contact() {
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState(""); // read-only user email
  const [name, setName] = useState("");   // editable name
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false); // success state

  // Populate email from logged-in user
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setEmail(user.email);  // always show logged-in email
      setName(user.name);    // prefill name but allow edits
    }
  }, []);

  // Logout user
  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  // Handle form submission
  const handleContactForm = (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter your name.");
      return;
    }

    if (!message) {
      setError("Please write your message.");
      return;
    }

    setError("");
    setSubmitted(true); // show thank-you message

    // Clear message only
    setMessage("");
  };

  // Success message view
  if (submitted) {
    return (
      <div className="contact-container">
        <h2>Thank you for your feedback!</h2>
        <p>We received your message and appreciate your input.</p>

        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          <button className="btn" onClick={() => navigate('/Dashboard')}>
            Go to Dashboard
          </button>
          <button className="btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-container">

      <p>
        Our team is here to help you with any questions or technical issues.
        You can reach us anytime at <strong>support@moneymap.com</strong>
        or by filling out the contact form below.
      </p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form className="contact-form" onSubmit={handleContactForm}>

        {/* Editable name */}
        <label htmlFor="username">Name</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Read-only email */}
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          readOnly
          style={{ backgroundColor: "#f0f0f0" }}
        />

        <label htmlFor="message" style={{ display: "block", marginTop: "25px" }}>
          Message:
        </label>
        <textarea
          id="message"
          name="message"
          rows="7"
          cols="30"
          placeholder="Write your feedback here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ border: "2px solid black" }}
        />

        <input type="submit" value="Submit" />
      </form>

      <div style={{ marginTop: "12px" }}>
        <button type="button" className="btn" onClick={() => navigate('/Dashboard')}>
          Dashboard
        </button>
        <button type="button" className="btn" onClick={handleLogout} style={{ marginLeft: "12px" }}>
          Logout
        </button>
      </div>
    </div>
  );
}