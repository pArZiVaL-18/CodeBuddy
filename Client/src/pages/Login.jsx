import { useState } from "react";
import "../styles/Auth.css";
import { useNavigate } from "react-router-dom";

const BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8080/api/auth";

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
                credentials: "include", // allow cookie if server sets jwt cookie
                body: JSON.stringify({
                    email: form.email,
                    password: form.password,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");

            // Store JWT from body for SPA API calls
            if (data.token) {
                localStorage.setItem("jwt", data.token);
                console.log("Login successful, token stored.");
                setMsg("Logged in successfully");
                console.log(
                    "Navigating to dashboard...",
                    localStorage.getItem("jwt")
                );
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
            <div className="auth-box">
                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p>Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder=" "
                        />
                        <label>Email Address</label>
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            placeholder=" "
                        />
                        <label>Password</label>
                    </div>

                    {err && <p className="auth-error">{err}</p>}
                    {msg && <p className="auth-success">{msg}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="auth-button"
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
                        Don’t have an account? <a href="/signup">Create one</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
