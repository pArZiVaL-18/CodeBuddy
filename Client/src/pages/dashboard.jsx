import { useEffect, useState } from "react";
import ProblemCard from "../components/ProblemCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/Dashboard.css";
import server from "../enviornment.js";

export default function Dashboard() {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [roomLink, setRoomLink] = useState("");
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [problemSolvedIds, setProblemSolvedIds] = useState([]);

    useEffect(() => {
        fetchProblems();
        fetchUserData();
    }, []);

    const handleJoinRoom = () => {
        const roomPath = roomLink.split("/room/")[1];
        if (roomPath) {
            navigate(
                `/room/${roomPath}?username=${encodeURIComponent(user.name)}`
            );
        } else {
            toast.error("Invalid room link. Please paste a valid URL.");
        }
    };

    const USE_COOKIES = false;

    const fetchUserData = async () => {
        try {
            const jwt = localStorage.getItem("jwt");
            const headers = { "Content-Type": "application/json" };

            if (!USE_COOKIES && jwt) headers.Authorization = `Bearer ${jwt}`;

            const res = await fetch(`${server}/api/auth/me`, {
                method: "GET",
                credentials: USE_COOKIES ? "include" : "omit",
                headers,
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            setUser(data.data.data);
            localStorage.setItem("myName", data.data.data.name);
            localStorage.setItem("myId", data.data.data._id);
            // console.log(localStorage.getItem("myName"));
            // console.log("User:", data.data.data);
        } catch (err) {
            console.error("Error fetching user data:", err);
        }
    };

    // OPTION A: Bearer tokens in headers
    // const USECOOKIES = false;

    // const fetchUserData = async () => {
    //     try {
    //         const jwt = localStorage.getItem("jwt");
    //         const headers = { "Content-Type": "application/json" };

    //         if (!USECOOKIES && jwt) {
    //             headers.Authorization = `Bearer ${jwt}`;
    //         }

    //         const res = await fetch("http://localhost:8080/api/auth/me", {
    //             method: "GET",
    //             credentials: USECOOKIES ? "include" : "omit",
    //             headers,
    //         });

    //         if (!res.ok) throw new Error(`HTTP error! status ${res.status}`);
    //         const data = await res.json();
    //         // console.log("User data:", data.data.data);
    //         const currentUser = data.data.data;
    //         if (!currentUser) throw new Error("No user data found");
    //         setUser(currentUser);
    //         console.log("User state:", currentUser);
    //     } catch (err) {
    //         setUser(null);
    //         setError(err.message);
    //         console.error(err);
    //         // If unauthorized, redirect to login
    //         navigate("/login");
    //     }
    // };

    // const fetchProblems = async () => {
    //     try {
    //         setLoading(true);
    //         setError(null);

    //         const response = await fetch("http://localhost:8080/api/problems", {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //         });

    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }

    //         const data = await response.json();
    //         const problemsList = data.problems || data.data || data;
    //         setProblems(problemsList);
    //     } catch (err) {
    //         console.error("Error fetching problems:", err);
    //         setError(err.message || "Failed to fetch problems");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const fetchProblems = async () => {
        try {
            // const jwt = localStorage.getItem("jwt");
            const headers = { "Content-Type": "application/json" };
            // if (!USECOOKIES && jwt) {
            //     headers.Authorization = `Bearer ${jwt}`;
            // }
            setLoading(true);
            setError(null);
            // const res = await fetch("http://localhost:8080/api/problems", {
            //     method: "GET",
            //     credentials: USE_COOKIES ? "include" : "omit",
            //     headers,
            // });
            const userId = localStorage.getItem("myId");
            // console.log("Fetching problems for user ID:", userId);
            const res = await fetch(`${server}/api/problems?userId=${userId}`, {
                method: "GET",
                credentials: "include",
                headers,
            });

            // if (!res.ok) throw new Error(`HTTP error! status ${res.status}`);
            // const data = await res.json();
            // setProblems(Array.isArray(data) ? data : data.data || []);

            // Extract both lists
            const resData = await res.json();
            const allProblems = Array.isArray(resData.problems)
                ? resData.problems
                : resData.data || [];

            const ids = Array.isArray(resData.solvedIds)
                ? resData.solvedIds
                : [];

            setProblems(allProblems);
            setProblemSolvedIds(ids);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError(err.message);
            setLoading(false);
            if (/401|403/.test(String(err))) {
                navigate("/login");
            }
        }
    };

    if (loading) return <div className="dashboard">Loading...</div>;
    if (error) return <div className="dashboard">Error: {error}</div>;

    const handleRetry = () => {
        fetchProblems();
    };

    if (!user) {
        return (
            <div className="dashboard">
                <div className="dashboard-container">
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <h2>Loading Dashboard</h2>
                        <p>
                            Please wait while we fetch the latest coding
                            challenges
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="dashboard-container">
                {/* Header Section */}
                <div className="dashboard-header">
                    <div className="header-content">
                        <div className="header-badge">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                            >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
                            </svg>
                            <span>CodeShare Platform</span>
                        </div>

                        <h1 className="dashboard-title">
                            Welcome Back! {user.name} 👋
                        </h1>
                        <p className="dashboard-subtitle">
                            Ready to solve some problems or join a collaborative
                            session?
                        </p>

                        {/* Quick Stats */}
                        <div className="header-stats">
                            <div className="quick-stat">
                                <div className="stat-number">
                                    {user.problemSolved || 0}
                                </div>
                                <div className="stat-label">Solved</div>
                            </div>
                            <div className="quick-stat">
                                <div className="stat-number">
                                    #{user.level || 0}
                                </div>
                                <div className="stat-label">Level</div>
                            </div>
                            <div className="quick-stat">
                                <div className="stat-number">
                                    {user.score || 0}
                                </div>
                                <div className="stat-label">Score</div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="header-actions">
                            <a href="#problems">
                                <button className="action-btn primary">
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
                                    </svg>
                                    Start Practice
                                </button>
                            </a>
                            <button
                                className="action-btn secondary"
                                onClick={() => navigate("/leaderboard")}
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                                View Leaderboard
                            </button>
                            <button
                                className="action-btn primary"
                                onClick={() => navigate("/profile")}
                            >
                                <span className="btn-icon">👤</span>
                                ME
                            </button>
                        </div>
                    </div>
                </div>
                {/* Join Room Section */}
                <div className="join-room-section">
                    <div className="join-room-card">
                        <h2 className="join-room-title">Join Room</h2>
                        <div className="join-room-form">
                            <input
                                type="text"
                                value={roomLink}
                                onChange={(e) => setRoomLink(e.target.value)}
                                placeholder="Paste room link here..."
                                className="room-link-input"
                                onKeyPress={(e) =>
                                    e.key === "Enter" && handleJoinRoom()
                                }
                            />
                            <button
                                onClick={handleJoinRoom}
                                className="join-room-btn"
                                disabled={!roomLink.trim()}
                            >
                                Join Room
                            </button>
                        </div>
                    </div>
                    {/* {showPrompt && (
                        <div className="username-modal">
                            <div className="modal-content">
                                <h3>Enter your username</h3>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                />
                                <button onClick={handleConfirmJoin}>
                                    Continue
                                </button>
                            </div>
                        </div>
                    )} */}
                </div>
                {/* Error State */}
                {error && (
                    <div className="error-card">
                        <div className="error-content">
                            <h3>Unable to load problems</h3>
                            <p>Error: {error}</p>
                            <button onClick={handleRetry} className="retry-btn">
                                Try Again
                            </button>
                        </div>
                    </div>
                )}
                {/* Problems Section */}
                <div className="problems-section" id="problems">
                    <div className="problems-header">
                        <h2 className="problems-title">Practice Problems</h2>
                        <div className="problems-count">
                            {problems.length} problem
                            {problems.length === 1 ? "" : "s"} Available
                        </div>
                    </div>

                    {problems.length > 0 ? (
                        <div className="problems-grid">
                            {problems.map((problem, index) => (
                                <ProblemCard
                                    key={problem.id || index}
                                    problem={problem}
                                    currentUser={user}
                                    solvedIds={problemSolvedIds}
                                />
                            ))}
                        </div>
                    ) : (
                        !loading && (
                            <div className="empty-state">
                                <div className="empty-icon">📝</div>
                                <h3>No Problems Available</h3>
                                <p>
                                    Problems will appear here once they're added
                                    to the database.
                                </p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import ProblemCard from "../components/ProblemCard";
// import "../styles/Dashboard.css";

// export default function Dashboard() {
//     const [problems, setProblems] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [roomLink, setRoomLink] = useState("");
//     const [user, setUser] = useState(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchProblems();
//         fetchUserData();
//     }, []);

//     const fetchUserData = async () => {
//         try {
//             const jwt = localStorage.getItem("jwt");
//             const headers = { "Content-Type": "application/json" };
//             if (jwt) headers.Authorization = `Bearer ${jwt}`;

//             const res = await fetch("http://localhost:8080/api/auth/me", {
//                 method: "GET",
//                 headers,
//             });

//             if (res.ok) {
//                 const data = await res.json();
//                 setUser(data.data.data);
//             }
//         } catch (err) {
//             console.error("Error fetching user:", err);
//             navigate("/login");
//         }
//     };

//     const fetchProblems = async () => {
//         try {
//             const res = await fetch("http://localhost:8080/api/problems");
//             if (res.ok) {
//                 const data = await res.json();
//                 setProblems(Array.isArray(data) ? data : data.data || []);
//             }
//         } catch (err) {
//             console.error("Error fetching problems:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleJoinRoom = () => {
//         const roomPath = roomLink.split("/room/")[1];
//         if (roomPath) {
//             navigate(`/room/${roomPath}`);
//         } else {
//             toast.error("Invalid room link. Please paste a valid URL.");
//         }
//     };

//     if (loading || !user) {
//         return (
//             <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//                     <p className="mt-4 text-gray-600">
//                         Loading your dashboard...
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-slate-50">
//             {/* Header Navigation */}
//             <header className="bg-white shadow-sm border-b border-gray-200">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="flex justify-between items-center h-16">
//                         {/* Left side - Platform name */}
//                         <div className="flex items-center">
//                             <h1 className="text-xl font-bold text-gray-900">
//                                 CodeBuddy
//                             </h1>
//                         </div>

//                         {/* Right side - Navigation */}
//                         <div className="flex items-center space-x-4">
//                             {/* Leaderboard Button */}
//                             <button
//                                 onClick={() => navigate("/leaderboard")}
//                                 className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
//                             >
//                                 <svg
//                                     className="w-4 h-4 mr-2"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                 >
//                                     <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         strokeWidth="2"
//                                         d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
//                                     />
//                                 </svg>
//                                 Leaderboard
//                             </button>

//                             {/* Logo - Profile Link */}
//                             <button
//                                 onClick={() => navigate("/profile")}
//                                 className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
//                             >
//                                 <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
//                                     <span className="text-white font-semibold text-sm">
//                                         CB
//                                     </span>
//                                 </div>
//                                 <div className="hidden sm:block text-left">
//                                     <p className="text-sm font-medium text-gray-900">
//                                         {user.name}
//                                     </p>
//                                     <p className="text-xs text-gray-500">
//                                         View Profile
//                                     </p>
//                                 </div>
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </header>

//             {/* Main Content */}
//             <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 {/* Welcome Section */}
//                 <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 mb-8 text-white">
//                     <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//                         <div>
//                             <h2 className="text-3xl font-bold mb-2">
//                                 Welcome back, {user.name}! 👋
//                             </h2>
//                             <p className="text-blue-100 text-lg">
//                                 Ready to solve problems or collaborate with
//                                 friends?
//                             </p>
//                         </div>

//                         {/* Quick Stats */}
//                         <div className="mt-6 md:mt-0 flex space-x-8">
//                             <div className="text-center">
//                                 <div className="text-2xl font-bold">
//                                     {user.problemSolved || 0}
//                                 </div>
//                                 <div className="text-blue-200 text-sm">
//                                     Problems Solved
//                                 </div>
//                             </div>
//                             <div className="text-center">
//                                 <div className="text-2xl font-bold">
//                                     #{user.level || 1}
//                                 </div>
//                                 <div className="text-blue-200 text-sm">
//                                     Current Level
//                                 </div>
//                             </div>
//                             <div className="text-center">
//                                 <div className="text-2xl font-bold">
//                                     {user.score || 0}
//                                 </div>
//                                 <div className="text-blue-200 text-sm">
//                                     Total Score
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Solve with Friend Section */}
//                 <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
//                     <div className="flex items-center mb-6">
//                         <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
//                             <svg
//                                 className="w-6 h-6 text-emerald-600"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                             >
//                                 <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth="2"
//                                     d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
//                                 />
//                             </svg>
//                         </div>
//                         <div>
//                             <h3 className="text-2xl font-bold text-gray-900">
//                                 Solve with Friend
//                             </h3>
//                             <p className="text-gray-600 mt-1">
//                                 Join a collaborative coding session by pasting
//                                 the room link
//                             </p>
//                         </div>
//                     </div>

//                     <div className="flex flex-col sm:flex-row gap-4">
//                         <input
//                             type="text"
//                             value={roomLink}
//                             onChange={(e) => setRoomLink(e.target.value)}
//                             placeholder="Paste collaboration room link here..."
//                             className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
//                             onKeyPress={(e) =>
//                                 e.key === "Enter" && handleJoinRoom()
//                             }
//                         />
//                         <button
//                             onClick={handleJoinRoom}
//                             disabled={!roomLink.trim()}
//                             className="px-8 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
//                         >
//                             Join Room
//                         </button>
//                     </div>
//                 </div>

//                 {/* Problems Section */}
//                 <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
//                     <div className="p-8 border-b border-gray-200">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <h3 className="text-2xl font-bold text-gray-900">
//                                     Practice Problems
//                                 </h3>
//                                 <p className="text-gray-600 mt-1">
//                                     Choose from our collection of coding
//                                     challenges
//                                 </p>
//                             </div>
//                             <div className="bg-blue-50 px-4 py-2 rounded-full">
//                                 <span className="text-blue-600 font-semibold">
//                                     {problems.length} Problems
//                                 </span>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="p-8">
//                         {problems.length > 0 ? (
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                                 {problems.map((problem, index) => (
//                                     <ProblemCard
//                                         key={problem.id || index}
//                                         problem={problem}
//                                     />
//                                 ))}
//                             </div>
//                         ) : (
//                             <div className="text-center py-12">
//                                 <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                                     <svg
//                                         className="w-12 h-12 text-gray-400"
//                                         fill="none"
//                                         stroke="currentColor"
//                                         viewBox="0 0 24 24"
//                                     >
//                                         <path
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                             strokeWidth="2"
//                                             d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                                         />
//                                     </svg>
//                                 </div>
//                                 <h4 className="text-xl font-semibold text-gray-900 mb-2">
//                                     No Problems Available
//                                 </h4>
//                                 <p className="text-gray-600">
//                                     Problems will appear here once they're added
//                                     to the platform.
//                                 </p>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// }

// // Enhanced Problem Card Component
// function ProblemCard({ problem }) {
//   const navigate = useNavigate();

//   const getDifficultyColor = (difficulty) => {
//     switch (difficulty?.toLowerCase()) {
//       case 'easy': return 'text-emerald-600 bg-emerald-50';
//       case 'medium': return 'text-orange-600 bg-orange-50';
//       case 'hard': return 'text-red-600 bg-red-50';
//       default: return 'text-gray-600 bg-gray-50';
//     }
//   };

//   return (
//     <div>
//     <div
//       onClick={() => navigate(/problem/${problem.id})}
//       className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 cursor-pointer transition-all group"
//     >
//       <div className="flex items-start justify-between mb-4">
//         <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
//           {problem.title || Problem #${problem.id}}
//         </h4>
//         <div className={px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(problem.difficulty)}}>
//           {problem.difficulty || 'Medium'}
//         </div>
//       </div>

//       <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//         {problem.description || 'Test your coding skills with this programming challenge.'}
//       </p>

//       <div className="flex items-center justify-between">
//         <div className="flex flex-wrap gap-2">
//           {problem.tags?.slice(0, 2).map((tag, index) => (
//             <span key={index} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-lg">
//               {tag}
//             </span>
//           ))}
//           {problem.tags?.length > 2 && (
//             <span className="text-gray-400 text-xs">+{problem.tags.length - 2}</span>
//           )}
//         </div>

//         <div className="flex items-center text-gray-400">
//           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
//           </svg>
//         </div>
//       </div>
//     </div>
//   );
// };
