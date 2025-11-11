import { useState } from "react";
import "../styles/Auth.css";
import { useNavigate } from "react-router-dom";
import server from "../enviornment.js";

const BASE_URL = `${server}/api/auth`;

export default function SignupPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
    });
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErr("");
        setMsg("");
        try {
            console.log("Submitting signup data:", form);
            const res = await fetch(`${BASE_URL}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    passwordConfirm: form.passwordConfirm,
                }),
            });

            const data = await res.json();
            console.log("Signup response data:", data);
            if (!res.ok) throw new Error(data.message || "Signup failed");

            if (data.token) {
                localStorage.setItem("jwt", data.token);
                setMsg("Account created");
                // navigate to app or login
                navigate("/dashboard");
            }
        } catch (e) {
            console.error("Signup error:", e);
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="auth-header">
                    <h2>Create Account</h2>
                    <p>Join us today</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            placeholder=" "
                        />
                        <label>Full Name</label>
                    </div>

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
                            minLength={8}
                            placeholder=" "
                        />
                        <label>Password</label>
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            name="passwordConfirm"
                            value={form.passwordConfirm}
                            onChange={handleChange}
                            required
                            minLength={8}
                            placeholder=" "
                        />
                        <label>Confirm Password</label>
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
                            "Create Account"
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account? <a href="/login">Sign in</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
