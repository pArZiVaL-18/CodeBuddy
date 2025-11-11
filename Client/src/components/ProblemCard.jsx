// import { useNavigate } from "react-router-dom";
// import "./ProblemCard.css"; // 👈 Import the CSS

// export default function ProblemCard({ problem }) {
//     const navigate = useNavigate();

//     const handleSolo = () => {
//         // Using slug instead of _id for cleaner URLs
//         navigate(`/solve/${problem.slug}?id=${problem._id}`);
//     };

//     const handleWithFriend = () => {
//         // Using slug for room creation as well
//         const roomId = `${problem.slug}-${Math.floor(Math.random() * 10000)}`;
//         navigate(`/room/${roomId}?id=${problem._id}`);
//     };

//     const getDifficultyClass = (difficulty) => {
//         return `problem-difficulty difficulty-${difficulty.toLowerCase()}`;
//     };

//     return (
//         <div className="problem-card">
//             <div className="problem-header">
//                 <h3 className="problem-title">{problem.title}</h3>
//                 <span className={getDifficultyClass(problem.difficulty)}>
//                     {problem.difficulty}
//                 </span>
//             </div>

//             <p className="problem-description">{problem.description}</p>

//             {problem.tags && problem.tags.length > 0 && (
//                 <div className="problem-tags">
//                     {problem.tags.map((tag, index) => (
//                         <span key={index} className="tag">
//                             {tag}
//                         </span>
//                     ))}
//                 </div>
//             )}

//             <div className="problem-actions">
//                 <button className="btn btn-solo" onClick={handleSolo}>
//                     👨🏻‍💻 Solo
//                 </button>
//                 <button className="btn btn-friend" onClick={handleWithFriend}>
//                     👥 With Friend
//                 </button>
//             </div>
//         </div>
//     );
// }

import { useNavigate } from "react-router-dom";

import "./ProblemCard.css";
import toast from "react-hot-toast";
import { Check, CheckCircle } from "lucide-react";

export default function ProblemCard({ problem, currentUser, solvedIds }) {
    const navigate = useNavigate();

    const handleSolo = () => {
        navigate(`/solve/${problem.slug}?id=${problem._id}`);
    };

    // const handleSolveWithFriend = async () => {
    //     try {
    //         const response = await fetch("http://localhost:8080/api/rooms", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             credentials: "include", // ✅ important for cookies
    //             body: JSON.stringify({
    //                 problemId: problem._id, // only send problemId
    //             }),
    //         });

    //         if (!response.ok) {
    //             throw new Error("Failed to create room");
    //         }

    //         const data = await response.json();
    //         navigate(`/room/${data.data._id}`);
    //     } catch (err) {
    //         console.error("Failed to create room:", err);
    //     }
    // };

    const handleWithFriend = () => {
        const roomId = `${problem.slug}-${Math.floor(Math.random() * 10000)}`;
        navigate(
            `/room/${roomId}?id=${problem._id}&username=${currentUser.name}`
        );
    };

    const getDifficultyClass = (difficulty) => {
        return `difficulty-badge difficulty-${difficulty.toLowerCase()}`;
    };

    return (
        <div className="problem-card">
            <div className="problem-card-header">
                <div className="problem-title-section">
                    <h3 className="problem-title">{problem.title}</h3>
                    <span className={getDifficultyClass(problem.difficulty)}>
                        {problem.difficulty}
                    </span>
                    {solvedIds.includes(problem._id) && (
                        <CheckCircle color="green" size={20} />
                    )}
                </div>
            </div>

            <div className="problem-card-content">
                <p className="problem-description">{problem.description}</p>

                {problem.tags && problem.tags.length > 0 && (
                    <div className="problem-tags">
                        {problem.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="problem-tag">
                                {tag}
                            </span>
                        ))}
                        {problem.tags.length > 3 && (
                            <span className="problem-tag-more">
                                +{problem.tags.length - 3} more
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className="problem-card-actions">
                <button className="action-btn solo-btn" onClick={handleSolo}>
                    <span className="btn-icon">👤</span>
                    Solve Solo
                </button>

                <button
                    className="action-btn friend-btn"
                    onClick={handleWithFriend}
                >
                    <span className="btn-icon">👥</span>
                    With Friend
                </button>
            </div>
        </div>
    );
}
