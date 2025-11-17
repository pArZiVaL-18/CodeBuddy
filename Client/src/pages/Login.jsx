import { useState } from "react";
import "../styles/Auth.css";
import { useNavigate } from "react-router-dom";
import server from "../enviornment.js";

const BASE_URL = import.meta.env.VITE_API_URL || `${server}/api/auth`;

export default function LoginPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const [msg, setMsg] = useState("");

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErr("");
        setMsg("");

        try {
            const res = await fetch(`${BASE_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    email: form.email,
                    password: form.password,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");

            if (data.token) {
                localStorage.setItem("jwt", data.token);
                console.log("Login successful, token stored.");
                setMsg("Logged in successfully");
                console.log(
                    "Navigating to dashboard...",
                    localStorage.getItem("jwt")
                );
                localStorage.setItem("userEmail", form.email);
                navigate("/dashboard");
            }
        } catch (e) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            {/* Back to Home Button */}
            <button
                className="back-to-home"
                onClick={() => navigate("/")}
                aria-label="Back to home"
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span>Back to Home</span>
            </button>

            <div className="auth-box">
                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p>Sign in to continue your coding journey</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {err && <div className="auth-error">{err}</div>}
                    {msg && <div className="auth-success">{msg}</div>}

                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="loading-spinner"></div>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Don't have an account?{" "}
                        <a onClick={() => navigate("/signup")}>Create one</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
