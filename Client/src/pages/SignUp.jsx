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
                setMsg("Account created successfully");
                localStorage.setItem("userEmail", form.email);
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
                    <h2>Create Account</h2>
                    <p>Join us and start your DSA journey</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {err && <div className="auth-error">{err}</div>}
                    {msg && <div className="auth-success">{msg}</div>}

                    <div className="input-group">
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

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
                            placeholder="Create a password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            minLength="6"
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            name="passwordConfirm"
                            placeholder="Confirm your password"
                            value={form.passwordConfirm}
                            onChange={handleChange}
                            required
                            minLength="6"
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
                            "Create Account"
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account?{" "}
                        <a onClick={() => navigate("/login")}>Sign in</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
