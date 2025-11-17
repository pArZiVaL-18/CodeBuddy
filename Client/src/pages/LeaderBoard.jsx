import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LeaderBoard.css";
import server from "../enviornment";

export default function Leaderboard() {
    const [leaders, setLeaders] = useState([]);
    const [filteredLeaders, setFilteredLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const navigate = useNavigate();

    const getCurrentUserEmail = () => {
        // Try multiple possible storage locations
        return localStorage.getItem("userEmail");
    };

    const currentUserEmail = getCurrentUserEmail();

    const fetchLeaderboard = useCallback(async () => {
        try {
            const res = await fetch(`${server}/api/leaderboard`);
            if (!res.ok) throw new Error("Failed to fetch leaderboard");
            const data = await res.json();
            setLeaders(data);
            setFilteredLeaders(data);
            setLastUpdate(new Date());
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);

    useEffect(() => {
        if (!autoRefresh) return;
        const interval = setInterval(() => {
            fetchLeaderboard();
        }, 30000);
        return () => clearInterval(interval);
    }, [autoRefresh, fetchLeaderboard]);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredLeaders(leaders);
        } else {
            const filtered = leaders.filter((leader) =>
                leader.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredLeaders(filtered);
        }
    }, [searchQuery, leaders]);

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
        fetchLeaderboard();
    };

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const isCurrentUser = (leaderEmail) => {
        return leaderEmail === currentUserEmail;
    };

    if (loading && leaders.length === 0) {
        return (
            <div className="leaderboard-container">
                <div className="loading-wrapper">
                    <div className="loading">Loading leaderboard...</div>
                </div>
            </div>
        );
    }

    if (error && leaders.length === 0) {
        return (
            <div className="leaderboard-container">
                <div className="error-wrapper">
                    <div className="error">Error: {error}</div>
                    <button className="retry-btn" onClick={handleRefresh}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const top3 = leaders.slice(0, 3);

    return (
        <div className="leaderboard-container">
            {/* Header with Back Button and Title */}
            <div className="leaderboard-header-bar">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                    >
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    <span>Back</span>
                </button>
                <h1 className="leaderboard-main-title">
                    <span className="title-icon">🏆</span>
                    Leaderboard
                </h1>
            </div>

            {/* Stats Cards Row */}
            <div className="stats-cards">
                <div className="stat-card-item">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <div className="stat-number">{leaders.length}</div>
                        <div className="stat-label">Total Users</div>
                    </div>
                </div>
                <div className="stat-card-item">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-info">
                        <div className="stat-number">
                            {leaders.reduce(
                                (sum, l) => sum + l.problemSolved,
                                0
                            )}
                        </div>
                        <div className="stat-label">Problems Solved</div>
                    </div>
                </div>
                <div className="stat-card-item">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-info">
                        <div className="stat-number">
                            {leaders.length > 0 ? leaders[0].score : 0}
                        </div>
                        <div className="stat-label">Top Score</div>
                    </div>
                </div>
            </div>

            {/* Controls Section */}
            <div className="controls-section">
                <div className="search-wrapper">
                    <svg
                        className="search-icon"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            className="clear-search"
                            onClick={() => setSearchQuery("")}
                            aria-label="Clear search"
                        >
                            ✕
                        </button>
                    )}
                </div>
                <div className="control-buttons">
                    <button className="refresh-btn" onClick={handleRefresh}>
                        <span className="btn-icon">🔄</span>
                        Refresh
                    </button>
                    <button
                        className={`auto-refresh-btn ${
                            autoRefresh ? "active" : ""
                        }`}
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        title={
                            autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"
                        }
                    >
                        <span className="status-dot">
                            {autoRefresh ? "●" : "○"}
                        </span>
                        Auto-Refresh
                    </button>
                </div>
            </div>

            {/* Top 3 Podium */}
            {top3.length >= 3 && (
                <div className="podium-section">
                    <div className="section-header">
                        <h2 className="section-title">Top 3 Champions</h2>

                        <p className="section-subtitle">
                            Our top performers this season
                        </p>
                    </div>
                    <div className="podium">
                        {/* Second Place */}
                        <div className="podium-item second">
                            <div className="podium-rank-badge silver-badge">
                                <span className="rank-icon">🥈</span>
                            </div>
                            <div className="podium-avatar silver-avatar">
                                {getInitials(top3[1].name)}
                            </div>
                            <div className="podium-details">
                                <div className="podium-name">
                                    {top3[1].name}
                                </div>
                                <div className="podium-stats">
                                    <span className="stat-item">
                                        {top3[1].problemSolved} problems
                                    </span>
                                    <span className="stat-item">
                                        {top3[1].score} XP
                                    </span>
                                </div>
                            </div>
                            <div className="podium-base silver">2nd</div>
                        </div>

                        {/* First Place */}
                        <div className="podium-item first">
                            <div className="podium-rank-badge gold-badge">
                                <span className="rank-icon">🥇</span>
                            </div>
                            <div className="podium-avatar gold-avatar">
                                {getInitials(top3[0].name)}
                            </div>
                            <div className="podium-details">
                                <div className="podium-name">
                                    {top3[0].name}
                                </div>
                                <div className="podium-stats">
                                    <span className="stat-item">
                                        {top3[0].problemSolved} problems
                                    </span>
                                    <span className="stat-item">
                                        {top3[0].score} XP
                                    </span>
                                </div>
                            </div>
                            <div className="podium-base gold">1st</div>
                        </div>

                        {/* Third Place */}
                        <div className="podium-item third">
                            <div className="podium-rank-badge bronze-badge">
                                <span className="rank-icon">🥉</span>
                            </div>
                            <div className="podium-avatar bronze-avatar">
                                {getInitials(top3[2].name)}
                            </div>
                            <div className="podium-details">
                                <div className="podium-name">
                                    {top3[2].name}
                                </div>
                                <div className="podium-stats">
                                    <span className="stat-item">
                                        {top3[2].problemSolved} problems
                                    </span>
                                    <span className="stat-item">
                                        {top3[2].score} XP
                                    </span>
                                </div>
                            </div>
                            <div className="podium-base bronze">3rd</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Rankings Table */}
            <div className="rankings-section">
                <div className="section-header">
                    <div>
                        <h2 className="section-title">
                            All Rankings
                            {searchQuery && (
                                <span className="search-count">
                                    ({filteredLeaders.length})
                                </span>
                            )}
                        </h2>
                        <p className="last-updated">
                            Updated {lastUpdate.toLocaleTimeString()}
                        </p>
                    </div>
                </div>

                {filteredLeaders.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            {searchQuery ? "🔍" : "🏆"}
                        </div>
                        <h3>
                            {searchQuery ? "No users found" : "No rankings yet"}
                        </h3>
                        <p>
                            {searchQuery
                                ? "Try searching with a different name"
                                : "Be the first to solve problems and claim your spot!"}
                        </p>
                    </div>
                ) : (
                    <div className="rankings-table-wrapper">
                        <table className="rankings-table">
                            <thead>
                                <tr>
                                    <th className="rank-col">Rank</th>
                                    <th className="user-col">User</th>
                                    <th className="problems-col">Problems</th>
                                    <th className="score-col">Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeaders.map((leader, index) => (
                                    <tr
                                        key={leader._id}
                                        className={`ranking-row ${
                                            isCurrentUser(leader.email)
                                                ? "current-user"
                                                : ""
                                        }`}
                                    >
                                        <td className="rank-col">
                                            <div className="rank-badge">
                                                {getRankDisplay(index)}
                                            </div>
                                        </td>
                                        <td className="user-col">
                                            <div className="user-cell">
                                                <div className="user-avatar">
                                                    {getInitials(leader.name)}
                                                </div>
                                                <div className="user-details">
                                                    <div className="user-name">
                                                        {leader.name}
                                                        {isCurrentUser(
                                                            leader.email
                                                        ) && (
                                                            <span className="you-tag">
                                                                You
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="problems-col">
                                            <div className="table-stat">
                                                <span className="stat-value">
                                                    {leader.problemSolved}
                                                </span>
                                                <span className="stat-text">
                                                    solved
                                                </span>
                                            </div>
                                        </td>
                                        <td className="score-col">
                                            <div className="table-stat highlight">
                                                <span className="stat-value">
                                                    {leader.score}
                                                </span>
                                                <span className="stat-text">
                                                    XP
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="leaderboard-footer">
                <p>Keep solving problems to climb the ranks! 🚀</p>
                <div className="footer-links">
                    <a onClick={() => navigate("/dashboard")}>Dashboard</a>
                    <span>•</span>
                    <a onClick={() => navigate("/dashboard")}>Problems</a>
                    <span>•</span>
                    <a onClick={() => navigate("/")}>Home</a>
                </div>
            </div>
        </div>
    );
}
