// // import "../styles/leaderboard.css";

// // export default function Leaderboard() {
// //     const dummyData = [
// //         { rank: 1, name: "Sujal", problemsSolved: 15, score: 150 },
// //         { rank: 2, name: "Vaibhav", problemsSolved: 12, score: 120 },
// //         { rank: 3, name: "Chaitanya", problemsSolved: 10, score: 100 },
// //         { rank: 4, name: "Samruddhi", problemsSolved: 9, score: 90 },
// //         { rank: 5, name: "Shekhar", problemsSolved: 8, score: 80 },
// //         { rank: 5, name: "Roshan", problemsSolved: 7, score: 70 },
// //         { rank: 5, name: "Alok", problemsSolved: 6, score: 60 },
// //     ];

// //     const getRankIcon = (rank) => {
// //         if (rank === 1) return "🥇";
// //         if (rank === 2) return "🥈";
// //         if (rank === 3) return "🥉";
// //         return `#${rank}`;
// //     };

// //     const getRankClass = (rank) => {
// //         if (rank <= 3) return `rank-${rank}`;
// //         return "";
// //     };

// //     return (
// //         <div className="leaderboard-page">
// //             <div className="leaderboard-container">
// //                 {/* Header */}
// //                 <div className="leaderboard-header">
// //                     <h1 className="leaderboard-title">Leaderboard</h1>
// //                     <p className="leaderboard-subtitle">
// //                         Top performers in our coding community
// //                     </p>
// //                 </div>

// //                 {/* Leaderboard Table */}
// //                 <div className="leaderboard-card">
// //                     <div className="table-container">
// //                         <table className="leaderboard-table">
// //                             <thead>
// //                                 <tr>
// //                                     <th>Rank</th>
// //                                     <th>Name</th>
// //                                     <th>Problems Solved</th>
// //                                     <th>Score</th>
// //                                 </tr>
// //                             </thead>
// //                             <tbody>
// //                                 {dummyData.map((user) => (
// //                                     <tr
// //                                         key={user.rank}
// //                                         className={`table-row ${getRankClass(
// //                                             user.rank
// //                                         )}`}
// //                                     >
// //                                         <td>
// //                                             <div className="rank-cell">
// //                                                 <span className="rank-display">
// //                                                     {getRankIcon(user.rank)}
// //                                                 </span>
// //                                             </div>
// //                                         </td>
// //                                         <td>
// //                                             <div className="name-cell">
// //                                                 <div className="user-avatar">
// //                                                     {user.name.charAt(0)}
// //                                                 </div>
// //                                                 <span className="user-name">
// //                                                     {user.name}
// //                                                 </span>
// //                                             </div>
// //                                         </td>
// //                                         <td>
// //                                             <div className="problems-cell">
// //                                                 <span className="problems-count">
// //                                                     {user.problemsSolved}
// //                                                 </span>
// //                                                 <span className="problems-label">
// //                                                     problems
// //                                                 </span>
// //                                             </div>
// //                                         </td>
// //                                         <td>
// //                                             <div className="score-cell">
// //                                                 <span className="score-value">
// //                                                     {user.score}
// //                                                 </span>
// //                                                 <span className="score-label">
// //                                                     pts
// //                                                 </span>
// //                                             </div>
// //                                         </td>
// //                                     </tr>
// //                                 ))}
// //                             </tbody>
// //                         </table>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }
// // ----------------------------------------------------------------------------------------------------------------------

// import { useEffect, useState } from "react";
// import "../styles/leaderboard.css";

// export default function Leaderboard() {
//     const [leaders, setLeaders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchLeaderboard = async () => {
//             try {
//                 const res = await fetch(
//                     "http://localhost:8080/api/leaderboard"
//                 );
//                 if (!res.ok) throw new Error("Failed to fetch leaderboard");
//                 const data = await res.json();
//                 setLeaders(data);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchLeaderboard();
//     }, []);

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

//     if (loading) return <p className="loading">Loading leaderboard...</p>;
//     if (error) return <p className="error">Error: {error}</p>;

//     return (
//         <div className="leaderboard-container">
//             <h1 className="leaderboard-title">🏆 Leaderboard</h1>
//             <table className="leaderboard-table">
//                 <thead>
//                     <tr>
//                         <th>Rank</th>
//                         <th>User</th>
//                         <th>Problems Solved</th>
//                         <th>Score</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {leaders.map((user, index) => (
//                         <tr key={user._id}>
//                             <td className="rank-cell">
//                                 {getRankDisplay(index)}
//                             </td>
//                             <td>{user.name}</td>
//                             <td>{user.problemSolved}</td>
//                             <td>{user.score}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// }
// // -----------------------------------------------------------------------------------------------------------------------
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/leaderboard.css";

export default function Leaderboard() {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch(
                    "http://localhost:8080/api/leaderboard"
                );
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
                const res = await fetch(
                    "http://localhost:8080/api/leaderboard"
                );
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
                        <span className="footer-link">Coding Challenges</span>
                        <span className="separator">•</span>
                        <span className="footer-link">Practice Problems</span>
                        <span className="separator">•</span>
                        <span className="footer-link">Community</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
