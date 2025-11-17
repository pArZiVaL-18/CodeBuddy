import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import server from "../enviornment.js";

const BASE_URL = import.meta.env.VITE_API_URL || `${server}/api/auth`;
const USE_COOKIES = false;

export default function Profile() {
    const [user, setUser] = useState(null);
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let abort = false;
        loadMe(abort);
        return () => {
            abort = true;
        };
    }, []);

    async function loadMe(abort = false) {
        setLoading(true);
        setErr("");

        try {
            const jwt = localStorage.getItem("jwt");
            const headers = { "Content-Type": "application/json" };

            if (!USE_COOKIES && jwt) headers.Authorization = `Bearer ${jwt}`;

            const res = await fetch(`${BASE_URL}/me`, {
                method: "GET",
                headers,
                credentials: USE_COOKIES ? "include" : "omit",
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                const message =
                    data?.message ||
                    (res.status === 401
                        ? "Not authenticated. Please log in."
                        : "Failed to load profile");
                throw new Error(message);
            }

            const userDoc =
                data?.data?.data || data?.data || data?.user || null;
            if (!abort) setUser(userDoc);
        } catch (e) {
            if (!abort) setErr(e.message || "Something went wrong");
        } finally {
            if (!abort) {
                setLoading(false);
                setRefreshing(false);
            }
        }
    }

    async function handleRefresh() {
        setRefreshing(true);
        await loadMe();
    }

    function handleLogout() {
        localStorage.removeItem("jwt");
        localStorage.removeItem("userEmail");
        setUser(null);
        navigate("/");
    }

    function handleEditProfile() {
        console.log("Edit profile clicked");
        // Add edit profile functionality here
    }

    const getInitials = (name) => {
        if (!name) return "?";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (date) => {
        if (!date) return "Unknown";
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Helper function to check if user is long-time member
    function isLongTimeMember(createdAt) {
        if (!createdAt) return false;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return new Date(createdAt) < thirtyDaysAgo;
    }

    // Helper function to count achievements
    function getAchievementCount(user) {
        let count = 0;
        if ((user?.problemSolved || 0) >= 1) count++;
        if ((user?.problemSolved || 0) >= 5) count++;
        if ((user?.problemSolved || 0) >= 10) count++;
        if ((user?.score || 0) >= 100) count++;
        if (user?.role === "admin") count++;
        if (isLongTimeMember(user?.createdAt)) count++;
        return count;
    }

    if (loading) {
        return (
            <div className="profile-container">
                <div className="loading-wrapper">
                    <div className="loading">Loading your profile...</div>
                </div>
            </div>
        );
    }

    if (err) {
        return (
            <div className="profile-container">
                <div className="error-wrapper">
                    <div className="error">{err}</div>
                    <button onClick={handleRefresh} className="retry-btn">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="profile-container">
                <div className="error-wrapper">
                    <div className="error">No profile data found</div>
                    <button
                        onClick={() => navigate("/login")}
                        className="retry-btn"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            {/* Navigation Header */}
            <div className="navigation-header">
                <button
                    className="back-button"
                    onClick={() => navigate("/dashboard")}
                >
                    <span className="back-icon">←</span>
                    <span>Dashboard</span>
                </button>
                <div className="page-title">
                    <h1 className="profile-title">My Profile</h1>
                </div>
                <button onClick={handleLogout} className="logout-btn">
                    <span className="logout-icon">🚪</span>
                    <span>Logout</span>
                </button>
            </div>

            <div className="profile-content">
                {/* Profile Header Card */}
                <div className="profile-header-card">
                    <div className="profile-header">
                        <div className="avatar-section">
                            <div className="avatar">
                                {user.photo ? (
                                    <img
                                        src={
                                            user.photo.startsWith("http")
                                                ? user.photo
                                                : `${
                                                      import.meta.env
                                                          .VITE_FILES_URL ||
                                                      "http://localhost:8080"
                                                  }/img/users/${user.photo}`
                                        }
                                        alt={user.name}
                                        className="avatar-img"
                                    />
                                ) : (
                                    <div className="avatar-placeholder">
                                        {getInitials(user.name)}
                                    </div>
                                )}
                            </div>
                            <div className="avatar-badge">
                                {user.role === "admin" ? "👑" : "✨"}
                            </div>
                        </div>

                        <div className="profile-info">
                            <h2 className="profile-name">
                                {user.name || "Unknown User"}
                            </h2>
                            <p className="profile-email">
                                {user.email || "No email provided"}
                            </p>

                            {user.bio && (
                                <div className="profile-bio">{user.bio}</div>
                            )}

                            <div className="profile-meta">
                                <span className="member-since">
                                    📅 Member since {formatDate(user.createdAt)}
                                </span>
                                {user.role && (
                                    <span className="user-role">
                                        {user.role === "admin" ? "👑" : "👤"}{" "}
                                        {user.role}
                                    </span>
                                )}
                            </div>

                            <div className="profile-actions">
                                <button
                                    className="edit-btn"
                                    onClick={handleEditProfile}
                                >
                                    <span className="edit-icon">✏️</span>
                                    Edit Profile
                                </button>
                                <button
                                    className="refresh-btn"
                                    onClick={handleRefresh}
                                    disabled={refreshing}
                                >
                                    <span
                                        className={`refresh-icon ${
                                            refreshing ? "spinning" : ""
                                        }`}
                                    >
                                        🔄
                                    </span>
                                    {refreshing ? "Refreshing..." : "Refresh"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Section */}
                <div className="stats-section">
                    <div className="section-header">
                        <h3 className="section-title">Statistics</h3>
                        <div className="last-updated">
                            Last updated: {new Date().toLocaleTimeString()}
                        </div>
                    </div>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon problems-icon">🎯</div>
                            <div className="stat-info">
                                <div className="stat-number">
                                    {user.problemSolved || 0}
                                </div>
                                <div className="stat-label">
                                    Problems Solved
                                </div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon score-icon">⭐</div>
                            <div className="stat-info">
                                <div className="stat-number">
                                    {user.score || 0}
                                </div>
                                <div className="stat-label">Total Score</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Achievements Section - Using Your Original Logic */}
                <div className="achievements-section">
                    <div className="section-header">
                        <h3 className="section-title">Achievements</h3>
                        <div className="achievements-count">
                            {getAchievementCount(user)} unlocked
                        </div>
                    </div>
                    <div className="achievements-grid">
                        {/* First Steps */}
                        <div
                            className={`achievement-badge ${
                                (user?.problemSolved || 0) >= 1
                                    ? "unlocked"
                                    : "locked"
                            }`}
                        >
                            <div className="badge-icon">🌟</div>
                            <div className="badge-info">
                                <span className="badge-name">First Steps</span>
                                <br />
                                <span className="badge-desc">
                                    Solve your first problem
                                </span>
                            </div>
                        </div>

                        {/* Problem Solver */}
                        <div
                            className={`achievement-badge ${
                                (user?.problemSolved || 0) >= 5
                                    ? "unlocked"
                                    : "locked"
                            }`}
                        >
                            <div className="badge-icon">🎯</div>
                            <div className="badge-info">
                                <span className="badge-name">
                                    Problem Solver
                                </span>
                                <br />
                                <span className="badge-desc">
                                    Solve 5 problems
                                </span>
                            </div>
                        </div>

                        {/* Century Club */}
                        <div
                            className={`achievement-badge ${
                                (user?.score || 0) >= 100
                                    ? "unlocked"
                                    : "locked"
                            }`}
                        >
                            <div className="badge-icon">💯</div>
                            <div className="badge-info">
                                <span className="badge-name">Century Club</span>
                                <br />
                                <span className="badge-desc">
                                    Reach 100 points
                                </span>
                            </div>
                        </div>

                        {/* Rising Star */}
                        <div
                            className={`achievement-badge ${
                                (user?.problemSolved || 0) >= 10
                                    ? "unlocked"
                                    : "locked"
                            }`}
                        >
                            <div className="badge-icon">⭐</div>
                            <div className="badge-info">
                                <span className="badge-name">Rising Star</span>
                                <br />
                                <span className="badge-desc">
                                    Solve 10 problems
                                </span>
                            </div>
                        </div>

                        {/* Administrator */}
                        <div
                            className={`achievement-badge ${
                                user?.role === "admin" ? "unlocked" : "locked"
                            }`}
                        >
                            <div className="badge-icon">👑</div>
                            <div className="badge-info">
                                <span className="badge-name">
                                    Administrator
                                </span>
                                <br />
                                <span className="badge-desc">
                                    Special role privilege
                                </span>
                            </div>
                        </div>

                        {/* Veteran */}
                        <div
                            className={`achievement-badge ${
                                isLongTimeMember(user?.createdAt)
                                    ? "unlocked"
                                    : "locked"
                            }`}
                        >
                            <div className="badge-icon">🏅</div>
                            <div className="badge-info">
                                <span className="badge-name">Veteran</span>
                                <br />
                                <span className="badge-desc">
                                    Member for 30+ days
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

