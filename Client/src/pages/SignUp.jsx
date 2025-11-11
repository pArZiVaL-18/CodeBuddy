// import { useState } from "react";
// import "../styles/Auth.css";

// export default function SignupPage() {
//     const [form, setForm] = useState({ name: "", email: "", password: "" });
//     const [loading, setLoading] = useState(false);

//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         console.log("Signup data:", form);
//         // Simulate API call
//         setTimeout(() => setLoading(false), 1000);
//     };

//     return (
//         <div className="auth-container">
//             <div className="auth-box">
//                 <div className="auth-header">
//                     <h2>Create Account</h2>
//                     <p>Join us today</p>
//                 </div>

//                 <form onSubmit={handleSubmit} className="auth-form">
//                     <div className="input-group">
//                         <input
//                             type="text"
//                             name="name"
//                             value={form.name}
//                             onChange={handleChange}
//                             required
//                             placeholder=" "
//                         />
//                         <label>Full Name</label>
//                         <div className="input-icon">
//                             <svg
//                                 width="20"
//                                 height="20"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke="currentColor"
//                             >
//                                 <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//                                 <circle cx="12" cy="7" r="4" />
//                             </svg>
//                         </div>
//                     </div>

//                     <div className="input-group">
//                         <input
//                             type="email"
//                             name="email"
//                             value={form.email}
//                             onChange={handleChange}
//                             required
//                             placeholder=" "
//                         />
//                         <label>Email Address</label>
//                         <div className="input-icon">
//                             <svg
//                                 width="20"
//                                 height="20"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke="currentColor"
//                             >
//                                 <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
//                                 <polyline points="22,6 12,13 2,6" />
//                             </svg>
//                         </div>
//                     </div>

//                     <div className="input-group">
//                         <input
//                             type="password"
//                             name="password"
//                             value={form.password}
//                             onChange={handleChange}
//                             required
//                             placeholder=" "
//                         />
//                         <label>Password</label>
//                         <div className="input-icon">
//                             <svg
//                                 width="20"
//                                 height="20"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke="currentColor"
//                             >
//                                 <rect
//                                     x="3"
//                                     y="11"
//                                     width="18"
//                                     height="11"
//                                     rx="2"
//                                     ry="2"
//                                 />
//                                 <circle cx="12" cy="16" r="1" />
//                                 <path d="M7 11V7a5 5 0 0 1 10 0v4" />
//                             </svg>
//                         </div>
//                     </div>

//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="auth-button"
//                     >
//                         {loading ? (
//                             <div className="loading-spinner"></div>
//                         ) : (
//                             "Create Account"
//                         )}
//                     </button>
//                 </form>

//                 <div className="auth-footer">
//                     <p>
//                         Already have an account? <a href="/login">Sign in</a>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// }

import { useState } from "react";
import "../styles/Auth.css";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:8080/api/auth";

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
            const res = await fetch(`http://localhost:8080/api/auth/signup`, {
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
