import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Code2 } from "lucide-react";
import ProblemCard from "../components/ProblemCard.jsx";
import toast from "react-hot-toast";
import "../styles/Dashboard.css";
import server from "../enviornment.js";

const USE_COOKIES = false;

export default function Dashboard() {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [roomLink, setRoomLink] = useState("");
    const [user, setUser] = useState(null);
    const [problemSolvedIds, setProblemSolvedIds] = useState([]);
    const [difficultyFilter, setDifficultyFilter] = useState("all");
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");

    // Ref for problems section
    const problemsRef = useRef(null);

    useEffect(() => {
        fetchProblems();
        fetchUserData();
    }, []);

    // Smooth scroll to problems section
    const scrollToProblems = () => {
        problemsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const handleJoinRoom = () => {
        const roomPath = roomLink.split("room/")[1];
        if (roomPath) {
            navigate(
                `/room/${roomPath}?username=${encodeURIComponent(user.name)}`
            );
        } else {
            toast.error("Invalid room link. Please paste a valid URL.");
        }
    };

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
        } catch (err) {
            console.error("Error fetching user data:", err);
        }
    };

    const fetchProblems = async () => {
        try {
            const jwt = localStorage.getItem("jwt");
            const headers = { "Content-Type": "application/json" };
            if (!USE_COOKIES && jwt) headers.Authorization = `Bearer ${jwt}`;

            setLoading(true);
            setError(null);

            const userId = localStorage.getItem("myId");
            console.log("Fetching problems for user ID:", userId);

            const res = await fetch(`${server}/api/problems?userId=${userId}`, {
                method: "GET",
                credentials: "include",
                headers,
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const resData = await res.json();

            const allProblems = Array.isArray(resData.problems)
                ? resData.problems
                : resData.data;
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

    const handleRetry = () => {
        fetchProblems();
    };

    // Filter problems by difficulty AND search query
    const filteredProblems = problems.filter((problem) => {
        // Filter by difficulty
        const matchesDifficulty =
            difficultyFilter === "all" ||
            problem.difficulty?.toLowerCase() === difficultyFilter;

        // Filter by search query (title, tags, description)
        const matchesSearch =
            searchQuery.trim() === "" ||
            problem.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            problem.description
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            problem.tags?.some((tag) =>
                tag.toLowerCase().includes(searchQuery.toLowerCase())
            );

        return matchesDifficulty && matchesSearch;
    });

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="loading-wrapper">
                    <div className="loading">Loading dashboard...</div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="dashboard-container">
                <div className="loading-wrapper">
                    <div className="loading">Loading user data...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* Navigation Bar */}
            <nav className="dashboard-nav">
                {/* <div className="nav-logo">CodeBuddy</div> */}
                <div className="logo">
                    <Code2 size={24} className="logo-icon" />
                    <span className="logo-text">CodeBuddy</span>
                </div>
                <div className="nav-links">
                    <button
                        onClick={() => navigate("/")}
                        className="nav-link nav-link-button"
                    >
                        Home
                    </button>
                    <button
                        onClick={() => navigate("/leaderboard")}
                        className="nav-link nav-link-button"
                    >
                        Leaderboard
                    </button>
                    <button
                        onClick={scrollToProblems}
                        className="nav-link nav-link-button"
                    >
                        Problems
                    </button>
                </div>
                <button
                    className="profile-btn"
                    onClick={() => navigate("/profile")}
                >
                    <span>👤</span>
                    <span>{user?.name || "Profile"}</span>
                </button>
            </nav>

            {/* Welcome Section */}
            <div className="welcome-section">
                <h1 className="welcome-title">
                    Welcome back, {user?.name || "Coder"}! 👋
                </h1>
                <p className="welcome-subtitle">
                    Ready to solve problems or collaborate with friends?
                </p>
            </div>

            {/* Statistics Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-info">
                        <div className="stat-number">
                            {user?.problemSolved || 0}
                        </div>
                        <div className="stat-label">Problems Solved</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-info">
                        <div className="stat-number">{user?.score || 0}</div>
                        <div className="stat-label">Total Score</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-info">
                        <div className="stat-number">
                            {user?.level ? `Level ${user.level}` : "Level 1"}
                        </div>
                        <div className="stat-label">Current Level</div>
                    </div>
                </div>
            </div>

            {/* Action Cards */}
            <div className="action-cards">
                <div className="action-card">
                    <div className="action-icon">👥</div>
                    <h3 className="action-title">Solve with Friend</h3>
                    <p className="action-description">
                        Join a collaborative coding session by pasting the room
                        link
                    </p>
                    <div className="room-input-group">
                        <input
                            type="text"
                            className="room-input"
                            placeholder="Paste room link here..."
                            value={roomLink}
                            onChange={(e) => setRoomLink(e.target.value)}
                            onKeyPress={(e) =>
                                e.key === "Enter" && handleJoinRoom()
                            }
                        />
                    </div>
                    <button
                        className="action-btn"
                        onClick={handleJoinRoom}
                        disabled={!roomLink.trim()}
                    >
                        <span>🚀</span>
                        Join Room
                    </button>
                </div>

                <div className="action-card">
                    <div className="action-icon">📚</div>
                    <h3 className="action-title">Practice Problems</h3>
                    <p className="action-description">
                        Choose from our collection of coding challenges
                    </p>
                    <button className="browse-btn" onClick={scrollToProblems}>
                        <span>📖</span>
                        Browse Problems
                    </button>
                </div>
            </div>

            {/* Problems Section */}
            <div className="problems-section" ref={problemsRef}>
                <div className="section-header">
                    <div className="section-title-row">
                        <div>
                            <h2 className="section-title">Featured Problems</h2>
                            <p className="section-subtitle">
                                {filteredProblems.length}{" "}
                                {filteredProblems.length === 1
                                    ? "problem"
                                    : "problems"}{" "}
                                available
                            </p>
                        </div>

                        {/* Search and Filter Row */}
                        <div className="search-filter-container">
                            {/* Search Bar */}
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
                                    placeholder="Search problems..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
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

                            {/* Difficulty Filter */}
                            <div className="difficulty-filter">
                                <button
                                    className={`filter-btn ${
                                        difficultyFilter === "all"
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() => setDifficultyFilter("all")}
                                >
                                    All
                                </button>
                                <button
                                    className={`filter-btn easy ${
                                        difficultyFilter === "easy"
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() => setDifficultyFilter("easy")}
                                >
                                    Easy
                                </button>
                                <button
                                    className={`filter-btn medium ${
                                        difficultyFilter === "medium"
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setDifficultyFilter("medium")
                                    }
                                >
                                    Medium
                                </button>
                                <button
                                    className={`filter-btn hard ${
                                        difficultyFilter === "hard"
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() => setDifficultyFilter("hard")}
                                >
                                    Hard
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {error ? (
                    <div className="empty-state">
                        <div className="empty-icon">⚠️</div>
                        <h3>Unable to load problems</h3>
                        <p>Error: {error}</p>
                        <button
                            onClick={handleRetry}
                            className="browse-btn"
                            style={{ marginTop: "1rem" }}
                        >
                            Try Again
                        </button>
                    </div>
                ) : filteredProblems.length > 0 ? (
                    <div className="problems-grid">
                        {filteredProblems.map((problem, index) => (
                            <ProblemCard
                                key={problem._id || index}
                                problem={problem}
                                currentUser={user}
                                solvedIds={problemSolvedIds}
                            />
                        ))}
                    </div>
                ) : difficultyFilter !== "all" || searchQuery ? (
                    <div className="empty-state">
                        <div className="empty-icon">🔍</div>
                        <h3>No problems found</h3>
                        <p>
                            {searchQuery
                                ? `No problems match "${searchQuery}"`
                                : `No ${difficultyFilter} problems found`}
                        </p>
                        <button
                            onClick={() => {
                                setDifficultyFilter("all");
                                setSearchQuery("");
                            }}
                            className="browse-btn"
                            style={{ marginTop: "1rem" }}
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    !loading && (
                        <div className="empty-state">
                            <div className="empty-icon">📝</div>
                            <h3>No Problems Available</h3>
                            <p>
                                Problems will appear here once they're added to
                                the database.
                            </p>
                        </div>
                    )
                )}
            </div>

            {/* Problems Section
            <div className="problems-section" ref={problemsRef}>
                <div className="section-header">
                    <div className="section-title-row">
                        <div>
                            <h2 className="section-title">Featured Problems</h2>
                            <p className="section-subtitle">
                                {filteredProblems.length}{" "}
                                {filteredProblems.length === 1
                                    ? "problem"
                                    : "problems"}{" "}
                                available
                            </p>
                        </div>

                        Difficulty Filter
                        <div className="difficulty-filter">
                            <button
                                className={`filter-btn ${
                                    difficultyFilter === "all" ? "active" : ""
                                }`}
                                onClick={() => setDifficultyFilter("all")}
                            >
                                All
                            </button>
                            <button
                                className={`filter-btn easy ${
                                    difficultyFilter === "easy" ? "active" : ""
                                }`}
                                onClick={() => setDifficultyFilter("easy")}
                            >
                                Easy
                            </button>
                            <button
                                className={`filter-btn medium ${
                                    difficultyFilter === "medium"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() => setDifficultyFilter("medium")}
                            >
                                Medium
                            </button>
                            <button
                                className={`filter-btn hard ${
                                    difficultyFilter === "hard" ? "active" : ""
                                }`}
                                onClick={() => setDifficultyFilter("hard")}
                            >
                                Hard
                            </button>
                        </div>
                    </div>
                </div>

                {error ? (
                    <div className="empty-state">
                        <div className="empty-icon">⚠️</div>
                        <h3>Unable to load problems</h3>
                        <p>Error: {error}</p>
                        <button
                            onClick={handleRetry}
                            className="browse-btn"
                            style={{ marginTop: "1rem" }}
                        >
                            Try Again
                        </button>
                    </div>
                ) : filteredProblems.length > 0 ? (
                    <div className="problems-grid">
                        {filteredProblems.map((problem, index) => (
                            <ProblemCard
                                key={problem._id || index}
                                problem={problem}
                                currentUser={user}
                                solvedIds={problemSolvedIds}
                            />
                        ))}
                    </div>
                ) : difficultyFilter !== "all" ? (
                    <div className="empty-state">
                        <div className="empty-icon">🔍</div>
                        <h3>No {difficultyFilter} problems found</h3>
                        <p>Try selecting a different difficulty level.</p>
                        <button
                            onClick={() => setDifficultyFilter("all")}
                            className="browse-btn"
                            style={{ marginTop: "1rem" }}
                        >
                            Show All Problems
                        </button>
                    </div>
                ) : (
                    !loading && (
                        <div className="empty-state">
                            <div className="empty-icon">📝</div>
                            <h3>No Problems Available</h3>
                            <p>
                                Problems will appear here once they're added to
                                the database.
                            </p>
                        </div>
                    )
                )}
            </div> */}
        </div>
    );
}

// -----------------------------------------------------------------------------------------------------

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import ProblemCard from "../components/ProblemCard";
// import toast from "react-hot-toast";
// import "../styles/Dashboard2.css";
// import server from "../enviornment.js";

// const USE_COOKIES = false;

// export default function Dashboard() {
//   const [problems, setProblems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [roomLink, setRoomLink] = useState("");
//   const [user, setUser] = useState(null);
//   const [problemSolvedIds, setProblemSolvedIds] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchProblems();
//     fetchUserData();
//   }, []);

//   // Your original handleJoinRoom logic
//   const handleJoinRoom = () => {
//     const roomPath = roomLink.split("room/")[1];
//     if (roomPath) {
//       navigate(`/room/${roomPath}?username=${encodeURIComponent(user.name)}`);
//     } else {
//       toast.error("Invalid room link. Please paste a valid URL.");
//     }
//   };

//     const USE_COOKIES = false;

//     const fetchUserData = async () => {
//         try {
//             const jwt = localStorage.getItem("jwt");
//             const headers = { "Content-Type": "application/json" };

//             if (!USE_COOKIES && jwt) headers.Authorization = `Bearer ${jwt}`;

//             const res = await fetch(`${server}/api/auth/me`, {
//                 method: "GET",
//                 credentials: USE_COOKIES ? "include" : "omit",
//                 headers,
//             });

//             if (!res.ok) {
//                 throw new Error(`HTTP error! status: ${res.status}`);
//             }

//             const data = await res.json();
//             setUser(data.data.data);
//             localStorage.setItem("myName", data.data.data.name);
//             localStorage.setItem("myId", data.data.data._id);
//             // console.log(localStorage.getItem("myName"));
//             // console.log("User:", data.data.data);
//         } catch (err) {
//             console.error("Error fetching user data:", err);
//         }
//     };

//   // Your original fetchProblems logic
//   const fetchProblems = async () => {
//     try {
//       const jwt = localStorage.getItem("jwt");
//       const headers = { "Content-Type": "application/json" };
//       if (!USE_COOKIES && jwt) headers.Authorization = `Bearer ${jwt}`;

//       setLoading(true);
//       setError(null);

//       const userId = localStorage.getItem("myId");
//       console.log("Fetching problems for user ID:", userId);

//       const res = await fetch(`${server}/api/problems?userId=${userId}`, {
//         method: "GET",
//         credentials: "include",
//         headers,
//       });

//       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

//       const resData = await res.json();

//       // Extract both lists
//       const allProblems = Array.isArray(resData.problems)
//         ? resData.problems
//         : resData.data;
//       const ids = Array.isArray(resData.solvedIds)
//         ? resData.solvedIds
//         : [];

//       setProblems(allProblems);
//       setProblemSolvedIds(ids);
//       setLoading(false);
//     } catch (err) {
//       console.error(err);
//       setError(err.message);
//       setLoading(false);
//       if (/401|403/.test(String(err))) {
//         navigate("/login");
//       }
//     }
//   };

//   const handleRetry = () => {
//     fetchProblems();
//   };

//   if (loading) {
//     return (
//       <div className="dashboard-container">
//         <div className="loading-wrapper">
//           <div className="loading">Loading dashboard...</div>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="dashboard-container">
//         <div className="loading-wrapper">
//           <div className="loading">Loading user data...</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-container">
//       {/* Navigation Bar */}
//       <nav className="dashboard-nav">
//         <div className="nav-logo">CodeBuddy</div>
//         <div className="nav-links">
//           <a href="/dashboard" className="nav-link active">
//             Dashboard
//           </a>
//           <a href="/leaderboard" className="nav-link">
//             Leaderboard
//           </a>
//           <a href="/problems" className="nav-link">
//             Problems
//           </a>
//         </div>
//         <button className="profile-btn" onClick={() => navigate("/profile")}>
//           <span>👤</span>
//           <span>{user?.name || "Profile"}</span>
//         </button>
//       </nav>

//       {/* Welcome Section */}
//       <div className="welcome-section">
//         <h1 className="welcome-title">
//           Welcome back, {user?.name || "Coder"}! 👋
//         </h1>
//         <p className="welcome-subtitle">
//           Ready to solve problems or collaborate with friends?
//         </p>
//       </div>

//       {/* Statistics Grid */}
//       <div className="stats-grid">
//         <div className="stat-card">
//           <div className="stat-icon">🎯</div>
//           <div className="stat-info">
//             <div className="stat-number">{user?.problemsSolved || 0}</div>
//             <div className="stat-label">Problems Solved</div>
//           </div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-icon">⭐</div>
//           <div className="stat-info">
//             <div className="stat-number">{user?.score || 0}</div>
//             <div className="stat-label">Total Score</div>
//           </div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-icon">🏆</div>
//           <div className="stat-info">
//             <div className="stat-number">
//               {user?.level ? `Level ${user.level}` : "Level 1"}
//             </div>
//             <div className="stat-label">Current Level</div>
//           </div>
//         </div>
//       </div>

//       {/* Action Cards */}
//       <div className="action-cards">
//         <div className="action-card">
//           <div className="action-icon">👥</div>
//           <h3 className="action-title">Solve with Friend</h3>
//           <p className="action-description">
//             Join a collaborative coding session by pasting the room link
//           </p>
//           <div className="room-input-group">
//             <input
//               type="text"
//               className="room-input"
//               placeholder="Paste room link here..."
//               value={roomLink}
//               onChange={(e) => setRoomLink(e.target.value)}
//               onKeyPress={(e) => e.key === "Enter" && handleJoinRoom()}
//             />
//           </div>
//           <button
//             className="action-btn"
//             onClick={handleJoinRoom}
//             disabled={!roomLink.trim()}
//           >
//             <span>🚀</span>
//             Join Room
//           </button>
//         </div>

//         <div className="action-card">
//           <div className="action-icon">📚</div>
//           <h3 className="action-title">Practice Problems</h3>
//           <p className="action-description">
//             Choose from our collection of coding challenges
//           </p>
//           <button className="browse-btn" onClick={() => navigate("/problems")}>
//             <span>📖</span>
//             Browse Problems
//           </button>
//         </div>
//       </div>

//       {/* Problems Section */}
//       <div className="problems-section">
//         <div className="section-header">
//           <h2 className="section-title">Featured Problems</h2>
//           <p className="section-subtitle">
//             {problems.length} {problems.length === 1 ? "problem" : "problems"} available
//           </p>
//         </div>

//         {error ? (
//           <div className="empty-state">
//             <div className="empty-icon">⚠️</div>
//             <h3>Unable to load problems</h3>
//             <p>Error: {error}</p>
//             <button onClick={handleRetry} className="browse-btn" style={{ marginTop: '1rem' }}>
//               Try Again
//             </button>
//           </div>
//         ) : problems.length > 0 ? (
//           <div className="problems-grid">
//             {problems.map((problem, index) => (
//               <ProblemCard
//                 key={problem._id || index}
//                 problem={problem}
//                 currentUser={user}
//                 solvedIds={problemSolvedIds}
//               />
//             ))}
//           </div>
//         ) : (
//           !loading && (
//             <div className="empty-state">
//               <div className="empty-icon">📝</div>
//               <h3>No Problems Available</h3>
//               <p>Problems will appear here once they're added to the database.</p>
//             </div>
//           )
//         )}
//       </div>
//     </div>
//   );
// }
