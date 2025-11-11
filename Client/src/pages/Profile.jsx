// // import "../styles/profile.css";

// // export default function Profile() {
// //     const user = {
// //         name: "Sujal Dawande",
// //         email: "sujaldawande@gmail.com",
// //         problemsSolved: 15,
// //         rank: 1,
// //         score: 150,
// //     };

// //     return (
// //         <div className="profile-page">
// //             <div className="profile-container">
// //                 {/* Profile Header */}
// //                 <div className="profile-header">
// //                     <div className="avatar">
// //                         <div className="avatar-placeholder">
// //                             {user.name.charAt(0)}
// //                         </div>
// //                     </div>
// //                     <div className="profile-info">
// //                         <h1 className="profile-name">{user.name}</h1>
// //                         <p className="profile-email">{user.email}</p>
// //                     </div>
// //                 </div>

// //                 {/* Stats Cards */}
// //                 <div className="stats-grid">
// //                     <div className="stat-card">
// //                         <div className="stat-icon problems-icon">
// //                             <svg
// //                                 width="24"
// //                                 height="24"
// //                                 viewBox="0 0 24 24"
// //                                 fill="none"
// //                                 stroke="currentColor"
// //                             >
// //                                 <path d="M9 12l2 2 4-4" />
// //                                 <circle cx="12" cy="12" r="9" />
// //                             </svg>
// //                         </div>
// //                         <div className="stat-info">
// //                             <div className="stat-number">
// //                                 {user.problemsSolved}
// //                             </div>
// //                             <div className="stat-label">Problems Solved</div>
// //                         </div>
// //                     </div>

// //                     <div className="stat-card">
// //                         <div className="stat-icon rank-icon">
// //                             <svg
// //                                 width="24"
// //                                 height="24"
// //                                 viewBox="0 0 24 24"
// //                                 fill="none"
// //                                 stroke="currentColor"
// //                             >
// //                                 <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
// //                                 <path d="M14 15h1.5a2.5 2.5 0 0 0 0-5H14" />
// //                                 <path d="M6 9h8" />
// //                                 <path d="M14 15H6" />
// //                                 <path d="M9 9v6" />
// //                             </svg>
// //                         </div>
// //                         <div className="stat-info">
// //                             <div className="stat-number">#{user.rank}</div>
// //                             <div className="stat-label">Current Rank</div>
// //                         </div>
// //                     </div>

// //                     <div className="stat-card">
// //                         <div className="stat-icon score-icon">
// //                             <svg
// //                                 width="24"
// //                                 height="24"
// //                                 viewBox="0 0 24 24"
// //                                 fill="none"
// //                                 stroke="currentColor"
// //                             >
// //                                 <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
// //                             </svg>
// //                         </div>
// //                         <div className="stat-info">
// //                             <div className="stat-number">{user.score}</div>
// //                             <div className="stat-label">Total Score</div>
// //                         </div>
// //                     </div>
// //                 </div>

// //                 {/* Achievement Section */}
// //                 <div className="achievements-section">
// //                     <h2 className="section-title">Achievements</h2>
// //                     <div className="achievements-grid">
// //                         <div className="achievement-badge">
// //                             <div className="badge-icon">🏆</div>
// //                             <span>Top Performer</span>
// //                         </div>
// //                         <div className="achievement-badge">
// //                             <div className="badge-icon">🔥</div>
// //                             <span>Problem Solver</span>
// //                         </div>
// //                         <div className="achievement-badge">
// //                             <div className="badge-icon">⭐</div>
// //                             <span>Rising Star</span>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }

// import { useEffect, useState } from "react";
// import "../styles/profile.css";

// const BASE_URL =
//     import.meta.env.VITE_API_URL || "http://localhost:8080/api/auth";
// const USE_COOKIES = false;

// export default function Profile() {
//     const [user, setUser] = useState(null);
//     const [err, setErr] = useState("");
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         let abort = false;

//         async function loadMe() {
//             setLoading(true);
//             setErr("");

//             try {
//                 const jwt = localStorage.getItem("jwt");
//                 const headers = { "Content-Type": "application/json" };

//                 if (!USE_COOKIES && jwt)
//                     headers.Authorization = `Bearer ${jwt}`;

//                 const res = await fetch(`${BASE_URL}/me`, {
//                     method: "GET",
//                     headers,
//                     credentials: USE_COOKIES ? "include" : "omit",
//                 });

//                 const data = await res.json().catch(() => ({}));
//                 // console.log("Profile data:", data);
//                 if (!res.ok) {
//                     const message =
//                         data?.message ||
//                         (res.status === 401
//                             ? "Not authenticated. Please log in."
//                             : "Failed to load profile");
//                     throw new Error(message);
//                 }

//                 const userDoc =
//                     data?.data?.data || data?.data || data?.user || null;
//                 console.log("User doc:", userDoc);
//                 if (!abort) setUser(userDoc);
//             } catch (e) {
//                 if (!abort) setErr(e.message || "Something went wrong");
//             } finally {
//                 if (!abort) setLoading(false);
//             }
//         }

//         loadMe();
//         return () => {
//             abort = true;
//         };
//     }, []);

//     if (loading) {
//         return (
//             <div className="profile-page">
//                 <div className="profile-container">Loading profile...</div>
//             </div>
//         );
//     }

//     if (err) {
//         return (
//             <div className="profile-page">
//                 <div className="profile-container">
//                     <p className="auth-error">{err}</p>
//                 </div>
//             </div>
//         );
//     }

//     if (!user) {
//         return (
//             <div className="profile-page">
//                 <div className="profile-container">
//                     <p>No user data found.</p>
//                 </div>
//             </div>
//         );
//     }

//     const initials = user.name ? user.name.charAt(0).toUpperCase() : "?";

//     return (
//         <div className="profile-page">
//             <div className="profile-container">
//                 <div className="profile-header">
//                     <div className="avatar">
//                         {user.photo ? (
//                             <img
//                                 src={
//                                     user.photo.startsWith("http")
//                                         ? user.photo
//                                         : `${
//                                               import.meta.env.VITE_FILES_URL ||
//                                               "http://localhost:8080"
//                                           }/img/users/${user.photo}`
//                                 }
//                                 alt={user.name}
//                             />
//                         ) : (
//                             <div className="avatar-placeholder">{initials}</div>
//                         )}
//                     </div>
//                     <div className="profile-info">
//                         <h1 className="profile-name">{user.name}</h1>
//                         <p className="profile-email">{user.email}</p>
//                     </div>
//                 </div>

//                 {/* Stats Grid */}
//                 <div className="stats-grid">
//                     <div className="stat-card">
//                         <div className="stat-info">
//                             <div className="stat-number">
//                                 {user.problemSolved || 0}
//                             </div>
//                             <div className="stat-label">Problems Solved</div>
//                         </div>
//                     </div>

//                     <div className="stat-card">
//                         <div className="stat-info">
//                             <div className="stat-number">{user.score || 0}</div>
//                             <div className="stat-label">Total Score</div>
//                         </div>
//                     </div>

//                     <div className="stat-card">
//                         <div className="stat-info">
//                             <div className="stat-number">
//                                 {user.rank ? `#${user.level}` : "N/A"}
//                             </div>
//                             <div className="stat-label">Current Rank</div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Optional: keep role and id */}
//                 <div className="stats-grid">
//                     <div className="stat-card">
//                         <div className="stat-info">
//                             <div className="stat-number">
//                                 {user.role || "user"}
//                             </div>
//                             <div className="stat-label">Role</div>
//                         </div>
//                     </div>
//                     {/* <div className="stat-card">
//                         <div className="stat-info">
//                             <div className="stat-number">{user._id}</div>
//                             <div className="stat-label">User ID</div>
//                         </div>
//                     </div> */}
//                 </div>
//             </div>
//         </div>
//     );
// }

// // ----------------------------------------------------------------------------------------------------------------

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";

const BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8080/api/auth";
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

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadMe();
    };

    const handleBackToDashboard = () => {
        navigate("/dashboard");
    };

    const handleLogout = () => {
        localStorage.removeItem("jwt");
        setUser(null);
        navigate("/login");
    };

    const handleEditProfile = () => {
        // Add edit profile functionality here
        console.log("Edit profile clicked");
    };

    if (loading) {
        return (
            <div className="profile-container">
                <div className="loading-wrapper">
                    <p className="loading">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (err) {
        return (
            <div className="profile-container">
                <div className="error-wrapper">
                    <p className="error">{err}</p>
                    <button className="retry-btn" onClick={() => loadMe()}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="profile-container">
                <div className="empty-state">
                    <div className="empty-icon">👤</div>
                    <h3>No Profile Data</h3>
                    <p>Unable to load your profile information.</p>
                    <button className="refresh-btn" onClick={handleRefresh}>
                        Reload Profile
                    </button>
                </div>
            </div>
        );
    }

    const initials = user.name ? user.name.charAt(0).toUpperCase() : "?";
    const memberSince = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "Unknown";

    return (
        <div className="profile-container">
            {/* Navigation Header */}
            <div className="navigation-header">
                <button className="back-button" onClick={handleBackToDashboard}>
                    <span className="back-icon">←</span>
                    <span className="back-text">Dashboard</span>
                </button>

                <div className="page-title">
                    <h1 className="profile-title">👤 Profile</h1>
                </div>
            </div>

            {/* Profile Content */}
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
                                        {initials}
                                    </div>
                                )}
                            </div>
                            <div className="avatar-badge">
                                {user.role === "admin" ? "👑" : "⭐"}
                            </div>
                        </div>

                        <div className="profile-info">
                            <h1 className="profile-name">
                                {user.name || "Unknown User"}
                            </h1>
                            <p className="profile-email">
                                {user.email || "No email provided"}
                            </p>
                            <div className="profile-meta">
                                <span className="member-since">
                                    Member since {memberSince}
                                </span>
                                <span className="user-role">
                                    {user.role || "user"}
                                </span>
                            </div>
                        </div>

                        <div className="profile-actions">
                            <button
                                className="edit-btn"
                                onClick={handleEditProfile}
                            >
                                <span className="edit-icon">✏</span>
                                Edit
                            </button>
                            <button
                                className="refresh-btn"
                                onClick={handleLogout}
                            >
                                Logout
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

                {/* Statistics Section */}
                <div className="stats-section">
                    <div className="section-header">
                        <h2 className="section-title">📊 Statistics</h2>
                        <div className="last-updated">
                            Last updated: {new Date().toLocaleTimeString()}
                        </div>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon problems-icon">🧩</div>
                            <div className="stat-info">
                                <div className="stat-number">
                                    {user.problemSolved || 0}
                                </div>
                                <div className="stat-label">
                                    Problems Solved
                                </div>
                                <div className="stat-progress">
                                    <div
                                        className="progress-bar"
                                        style={{
                                            width: `${Math.min(
                                                (user.problemSolved || 0) * 2,
                                                100
                                            )}%`,
                                        }}
                                    ></div>
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
                                <div className="stat-progress">
                                    <div
                                        className="progress-bar"
                                        style={{
                                            width: `${Math.min(
                                                (user.score || 0) / 10,
                                                100
                                            )}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon rank-icon">🏆</div>
                            <div className="stat-info">
                                <div className="stat-number">
                                    {user.level
                                        ? `Level ${user.level}`
                                        : "Beginner"}
                                </div>
                                <div className="stat-label">Current Level</div>
                                <div className="stat-progress">
                                    <div
                                        className="progress-bar"
                                        style={{
                                            width: `${(user.level || 1) * 20}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon activity-icon">📈</div>
                            <div className="stat-info">
                                <div className="stat-number">
                                    {user.role === "admin" ? "Admin" : "Active"}
                                </div>
                                <div className="stat-label">Status</div>
                                <div className="stat-progress">
                                    <div
                                        className="progress-bar"
                                        style={{ width: "100%" }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Achievements Section */}
                <div className="achievements-section">
                    <div className="section-header">
                        <h2 className="section-title">🏅 Achievements</h2>
                        <div className="achievements-count">
                            {getAchievementCount(user)} unlocked
                        </div>
                    </div>

                    <div className="achievements-grid">
                        <div
                            className={`achievement-badge ${
                                (user.problemSolved || 0) >= 1
                                    ? "unlocked"
                                    : "locked"
                            }`}
                        >
                            <div className="badge-icon">🌱</div>
                            <div className="badge-info">
                                <span className="badge-name">First Steps</span>
                                <span className="badge-desc">
                                    Solve your first problem
                                </span>
                            </div>
                        </div>

                        <div
                            className={`achievement-badge ${
                                (user.problemSolved || 0) >= 5
                                    ? "unlocked"
                                    : "locked"
                            }`}
                        >
                            <div className="badge-icon">🔥</div>
                            <div className="badge-info">
                                <span className="badge-name">
                                    Problem Solver
                                </span>
                                <span className="badge-desc">
                                    Solve 5 problems
                                </span>
                            </div>
                        </div>

                        <div
                            className={`achievement-badge ${
                                (user.problemSolved || 0) >= 10
                                    ? "unlocked"
                                    : "locked"
                            }`}
                        >
                            <div className="badge-icon">⭐</div>
                            <div className="badge-info">
                                <span className="badge-name">Rising Star</span>
                                <span className="badge-desc">
                                    Solve 10 problems
                                </span>
                            </div>
                        </div>

                        <div
                            className={`achievement-badge ${
                                (user.score || 0) >= 100 ? "unlocked" : "locked"
                            }`}
                        >
                            <div className="badge-icon">🏆</div>
                            <div className="badge-info">
                                <span className="badge-name">Century Club</span>
                                <span className="badge-desc">
                                    Reach 100 points
                                </span>
                            </div>
                        </div>

                        <div
                            className={`achievement-badge ${
                                user.role === "admin" ? "unlocked" : "locked"
                            }`}
                        >
                            <div className="badge-icon">👑</div>
                            <div className="badge-info">
                                <span className="badge-name">
                                    Administrator
                                </span>
                                <span className="badge-desc">
                                    Special role privilege
                                </span>
                            </div>
                        </div>

                        <div
                            className={`achievement-badge ${
                                isLongTimeMember(user.createdAt)
                                    ? "unlocked"
                                    : "locked"
                            }`}
                        >
                            <div className="badge-icon">🎯</div>
                            <div className="badge-info">
                                <span className="badge-name">Veteran</span>
                                <span className="badge-desc">
                                    Member for 30+ days
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Summary */}
                <div className="activity-section">
                    <div className="section-header">
                        <h2 className="section-title">📋 Account Details</h2>
                    </div>

                    <div className="activity-grid">
                        <div className="activity-card">
                            <div className="activity-label">User ID</div>
                            <div className="activity-value">
                                {user._id?.slice(-8) || "Unknown"}
                            </div>
                        </div>
                        <div className="activity-card">
                            <div className="activity-label">Account Type</div>
                            <div className="activity-value">
                                {user.role || "Standard"}
                            </div>
                        </div>
                        <div className="activity-card">
                            <div className="activity-label">Join Date</div>
                            <div className="activity-value">{memberSince}</div>
                        </div>
                        <div className="activity-card">
                            <div className="activity-label">Profile Status</div>
                            <div className="activity-value">Active</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper functions
function getAchievementCount(user) {
    let count = 0;
    if ((user.problemSolved || 0) >= 1) count++;
    if ((user.problemSolved || 0) >= 5) count++;
    if ((user.problemSolved || 0) >= 10) count++;
    if ((user.score || 0) >= 100) count++;
    if (user.role === "admin") count++;
    if (isLongTimeMember(user.createdAt)) count++;
    return count;
}

function isLongTimeMember(createdAt) {
    if (!createdAt) return false;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(createdAt) <= thirtyDaysAgo;
}
