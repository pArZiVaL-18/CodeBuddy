// -----------------------------------------------------------------------------------------------------------------------
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/leaderboard.css";
import server from "../enviornment";

export default function Leaderboard() {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch(`${server}/api/leaderboard`);
                if (!res.ok) throw new Error("Failed to fetch leaderboard");
                const data = await res.json();
                setLeaders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const getRankDisplay = (index) => {
        switch (index) {
            case 0:
                return "🥇";
            case 1:
                return "🥈";
            case 2:
                return "🥉";
            default:
                return index + 1;
        }
    };

    const handleRefresh = () => {
        setLoading(true);
        setError(null);
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch(`${server}/api/leaderboard`);
                if (!res.ok) throw new Error("Failed to fetch leaderboard");
                const data = await res.json();
                setLeaders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    };

    const handleBackToDashboard = () => {
        navigate("/dashboard"); // Navigate to dashboard
    };

    if (loading)
        return (
            <div className="leaderboard-container">
                <div className="loading-wrapper">
                    <p className="loading">Loading leaderboard...</p>
                </div>
            </div>
        );

    if (error)
        return (
            <div className="leaderboard-container">
                <div className="error-wrapper">
                    <p className="error">Error: {error}</p>
                    <button className="retry-btn" onClick={handleRefresh}>
                        Try Again
                    </button>
                </div>
            </div>
        );

    return (
        <div className="leaderboard-container">
            {/* Navigation Header */}
            <div className="navigation-header">
                <button className="back-button" onClick={handleBackToDashboard}>
                    <span className="back-icon">←</span>
                    <span className="back-text">Dashboard</span>
                </button>

                <div className="page-title">
                    <h1 className="leaderboard-title">🏆 Leaderboard</h1>
                </div>
            </div>

            {/* Header Section */}
            <div className="leaderboard-header">
                {/* <div className="header-content">
                    <p className="leaderboard-subtitle">
                        Top performers in our coding community
                    </p>
                </div> */}

                {/* Stats Cards */}
                <div className="stats-container">
                    <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-info">
                            <span className="stat-number">
                                {leaders.length}
                            </span>
                            <span className="stat-label">
                                Total Participants
                            </span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🧩</div>
                        <div className="stat-info">
                            <span className="stat-number">
                                {leaders.reduce(
                                    (sum, user) =>
                                        sum + (user.problemSolved || 0),
                                    0
                                )}
                            </span>
                            <span className="stat-label">Problems Solved</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⭐</div>
                        <div className="stat-info">
                            <span className="stat-number">
                                {leaders.reduce(
                                    (sum, user) => sum + (user.score || 0),
                                    0
                                )}
                            </span>
                            <span className="stat-label">Total Points</span>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="controls-container">
                    <button className="refresh-btn" onClick={handleRefresh}>
                        <span className="refresh-icon">🔄</span>
                        Refresh
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="leaderboard-content">
                {leaders.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📊</div>
                        <h3>No Data Available</h3>
                        <p>
                            Be the first to solve problems and appear on the
                            leaderboard!
                        </p>
                        <button className="refresh-btn" onClick={handleRefresh}>
                            Check Again
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Top 3 Podium */}
                        {leaders.length >= 3 && (
                            <div className="podium-container">
                                <div className="podium-title">
                                    🌟 Top Performers 🌟
                                </div>
                                <div className="podium">
                                    {/* Second Place */}
                                    <div className="podium-item second">
                                        <div className="podium-avatar">
                                            {leaders[1]?.name
                                                ?.charAt(0)
                                                ?.toUpperCase() || "U"}
                                        </div>
                                        <div className="podium-name">
                                            {leaders[1]?.name || "Unknown"}
                                        </div>
                                        <div className="podium-score">
                                            {leaders[1]?.score || 0} pts
                                        </div>
                                        <div className="podium-rank">🥈</div>
                                        <div className="podium-base silver">
                                            2
                                        </div>
                                    </div>

                                    {/* First Place */}
                                    <div className="podium-item first">
                                        <div className="podium-avatar">
                                            {leaders[0]?.name
                                                ?.charAt(0)
                                                ?.toUpperCase() || "U"}
                                        </div>
                                        <div className="podium-name">
                                            {leaders[0]?.name || "Unknown"}
                                        </div>
                                        <div className="podium-score">
                                            {leaders[0]?.score || 0} pts
                                        </div>
                                        <div className="podium-rank">🥇</div>
                                        <div className="podium-base gold">
                                            1
                                        </div>
                                    </div>

                                    {/* Third Place */}
                                    <div className="podium-item third">
                                        <div className="podium-avatar">
                                            {leaders[2]?.name
                                                ?.charAt(0)
                                                ?.toUpperCase() || "U"}
                                        </div>
                                        <div className="podium-name">
                                            {leaders[2]?.name || "Unknown"}
                                        </div>
                                        <div className="podium-score">
                                            {leaders[2]?.score || 0} pts
                                        </div>
                                        <div className="podium-rank">🥉</div>
                                        <div className="podium-base bronze">
                                            3
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Full Leaderboard Table */}
                        <div className="table-section">
                            <div className="table-header-section">
                                <h2 className="table-title">
                                    Complete Rankings
                                </h2>
                                <div className="last-updated">
                                    Last updated:{" "}
                                    {new Date().toLocaleTimeString()}
                                </div>
                            </div>

                            <table className="leaderboard-table">
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>User</th>
                                        <th>Problems Solved</th>
                                        <th>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaders.map((user, index) => (
                                        <tr key={user._id}>
                                            <td className="rank-cell">
                                                {getRankDisplay(index)}
                                            </td>
                                            <td className="user-cell">
                                                <div className="user-info">
                                                    <div className="user-avatar-small">
                                                        {user.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase() ||
                                                            "U"}
                                                    </div>
                                                    <span className="user-name">
                                                        {user.name ||
                                                            "Unknown User"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="problems-cell">
                                                <div className="cell-content">
                                                    <span className="main-number">
                                                        {user.problemSolved ||
                                                            0}
                                                    </span>
                                                    <span className="sub-text">
                                                        problems
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="score-cell">
                                                <div className="cell-content">
                                                    <span className="main-number">
                                                        {user.score || 0}
                                                    </span>
                                                    <span className="sub-text">
                                                        points
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            {/* Footer */}
            <div className="leaderboard-footer">
                <div className="footer-content">
                    <p>🎯 Keep solving problems to climb up the leaderboard!</p>
                    <div className="footer-links">
                        <a className="footer-link" href="/">
                            Go To Home
                        </a>
                        <span className="separator">•</span>
                        <a className="footer-link" href="/dashboard">
                            Practice Problems
                        </a>
                        <span className="separator">•</span>
                        <span className="footer-link">Community</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --------------------------------------------------------------------------------------------------------------------------------

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/leaderboard.css";
// import server from "../enviornment";

// export default function Leaderboard() {
//     const [leaders, setLeaders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchLeaderboard();
//     }, []);

//     const fetchLeaderboard = async () => {
//         try {
//             setLoading(true);
//             setError(null);
//             const res = await fetch(`${server}/api/leaderboard`);
//             if (!res.ok) throw new Error("Failed to fetch leaderboard");
//             const data = await res.json();
//             setLeaders(data);
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const getRankDisplay = (index) => {
//         switch (index) {
//             case 0:
//                 return "🥇";
//             case 1:
//                 return "🥈";
//             case 2:
//                 return "🥉";
//             default:
//                 return index + 1;
//         }
//     };

//     const handleBackToDashboard = () => {
//         navigate("/dashboard");
//     };

//     if (loading) {
//         return (
//             <div className="page-wrapper">
//                 <div className="loader-container">
//                     <div className="loader"></div>
//                     <p>Loading leaderboard...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="page-wrapper">
//                 <div className="error-container">
//                     <div className="error-icon">⚠️</div>
//                     <h2>Something went wrong</h2>
//                     <p>{error}</p>
//                     <button className="btn-primary" onClick={fetchLeaderboard}>
//                         Try Again
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="page-wrapper">
//             <div className="leaderboard-container">
//                 {/* Header */}
//                 <div className="header">
//                     <button
//                         className="btn-back"
//                         onClick={handleBackToDashboard}
//                     >
//                         ← Back
//                     </button>
//                     <h1 className="title">Leaderboard</h1>
//                     <button className="btn-refresh" onClick={fetchLeaderboard}>
//                         ↻ Refresh
//                     </button>
//                 </div>

//                 {/* Stats Bar */}
//                 <div className="stats-bar">
//                     <div className="stat-item">
//                         <span className="stat-value">{leaders.length}</span>
//                         <span className="stat-label">Users</span>
//                     </div>
//                     <div className="stat-divider"></div>
//                     <div className="stat-item">
//                         <span className="stat-value">
//                             {leaders.reduce(
//                                 (sum, u) => sum + (u.problemSolved || 0),
//                                 0
//                             )}
//                         </span>
//                         <span className="stat-label">Problems Solved</span>
//                     </div>
//                     <div className="stat-divider"></div>
//                     <div className="stat-item">
//                         <span className="stat-value">
//                             {leaders.reduce(
//                                 (sum, u) => sum + (u.score || 0),
//                                 0
//                             )}
//                         </span>
//                         <span className="stat-label">Total Points</span>
//                     </div>
//                 </div>

//                 {/* Top 3 Podium */}
//                 {leaders.length >= 3 && (
//                     <div className="podium">
//                         <div className="podium-card second-place">
//                             <div className="podium-rank">2nd</div>
//                             <div className="podium-avatar">
//                                 {leaders[1]?.name?.charAt(0)?.toUpperCase() ||
//                                     "?"}
//                             </div>
//                             <div className="podium-name">
//                                 {leaders[1]?.name || "Unknown"}
//                             </div>
//                             <div className="podium-stats">
//                                 <span className="podium-score">
//                                     {leaders[1]?.score || 0} pts
//                                 </span>
//                                 <span className="podium-problems">
//                                     {leaders[1]?.problemSolved || 0} solved
//                                 </span>
//                             </div>
//                         </div>

//                         <div className="podium-card first-place">
//                             <div className="crown">👑</div>
//                             <div className="podium-rank">1st</div>
//                             <div className="podium-avatar">
//                                 {leaders[0]?.name?.charAt(0)?.toUpperCase() ||
//                                     "?"}
//                             </div>
//                             <div className="podium-name">
//                                 {leaders[0]?.name || "Unknown"}
//                             </div>
//                             <div className="podium-stats">
//                                 <span className="podium-score">
//                                     {leaders[0]?.score || 0} pts
//                                 </span>
//                                 <span className="podium-problems">
//                                     {leaders[0]?.problemSolved || 0} solved
//                                 </span>
//                             </div>
//                         </div>

//                         <div className="podium-card third-place">
//                             <div className="podium-rank">3rd</div>
//                             <div className="podium-avatar">
//                                 {leaders[2]?.name?.charAt(0)?.toUpperCase() ||
//                                     "?"}
//                             </div>
//                             <div className="podium-name">
//                                 {leaders[2]?.name || "Unknown"}
//                             </div>
//                             <div className="podium-stats">
//                                 <span className="podium-score">
//                                     {leaders[2]?.score || 0} pts
//                                 </span>
//                                 <span className="podium-problems">
//                                     {leaders[2]?.problemSolved || 0} solved
//                                 </span>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Leaderboard Table */}
//                 <div className="table-wrapper">
//                     <table className="leaderboard-table">
//                         <thead>
//                             <tr>
//                                 <th>Rank</th>
//                                 <th>User</th>
//                                 <th>Solved</th>
//                                 <th>Score</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {leaders.map((user, index) => (
//                                 <tr
//                                     key={user.id || index}
//                                     className={index < 3 ? "top-three" : ""}
//                                 >
//                                     <td className="rank-col">
//                                         <span className="rank-badge">
//                                             {getRankDisplay(index)}
//                                         </span>
//                                     </td>
//                                     <td className="user-col">
//                                         <div className="user-info">
//                                             <div className="user-avatar">
//                                                 {user.name
//                                                     ?.charAt(0)
//                                                     ?.toUpperCase() || "?"}
//                                             </div>
//                                             <span className="user-name">
//                                                 {user.name || "Unknown"}
//                                             </span>
//                                         </div>
//                                     </td>
//                                     <td className="solved-col">
//                                         <span className="number">
//                                             {user.problemSolved || 0}
//                                         </span>
//                                     </td>
//                                     <td className="score-col">
//                                         <span className="score-number">
//                                             {user.score || 0}
//                                         </span>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 {leaders.length === 0 && (
//                     <div className="empty-state">
//                         <div className="empty-icon">🏆</div>
//                         <h3>No rankings yet</h3>
//                         <p>
//                             Start solving problems to appear on the leaderboard!
//                         </p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }
