import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotMyPassword() {
    const [step, setStep] = useState(1); // Step 1: email | Step 2: new password
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Step 1 — verify email exists in the database
    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("Please enter your email.");
            return;
        }
        if (!email.includes("@") || !email.includes(".")) {
            setError("Please enter a valid email address.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("http://localhost:8080/api/auth/forgot-password/verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setStep(2); // Move to new password form
            } else if (response.status === 404) {
                setError("No account found with that email address.");
            } else {
                setError("Something went wrong. Please try again.");
            }
        } catch (err) {
            setError("Unable to connect to the server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Step 2 — submit new password to the database
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");

        if (!newPassword) {
            setError("Please enter a new password.");
            return;
        }
        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("http://localhost:8080/api/auth/forgot-password/reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newPassword }),
            });

            if (response.ok) {
                navigate("/login"); // Redirect to login after success
            } else if (response.status === 404) {
                setError("Account not found. Please start over.");
            } else {
                setError("Something went wrong. Please try again.");
            }
        } catch (err) {
            setError("Unable to connect to the server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-my-password">

            {/* ── STEP 1: Email ── */}
            {step === 1 && (
                <form className="container" onSubmit={handleVerifyEmail}>
                    <h2>Please enter your email to <strong>reset</strong> your password</h2>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? "Checking..." : "Submit"}
                    </button>
                </form>
            )}

            {/* ── STEP 2: New Password ── */}
            {step === 2 && (
                <form className="container" onSubmit={handleResetPassword}>
                    <h2>Enter your <strong>new password</strong></h2>
                    <p style={{ color: '#666', marginBottom: '1rem' }}>
                        Resetting password for: <strong>{email}</strong>
                    </p>

                    <label htmlFor="newPassword">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        required
                    />

                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter your new password"
                        required
                    />

                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? "Updating..." : "Reset Password"}
                    </button>

                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => { setStep(1); setError(""); }}
                        style={{ marginTop: '0.5rem' }}
                    >
                        ← Back
                    </button>
                </form>
            )}
        </div>
    );
}

