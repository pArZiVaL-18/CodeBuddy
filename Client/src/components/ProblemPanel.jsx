// import { useState } from "react";
// import { Tag, Clock, Info, Code, ChevronRight } from "lucide-react";
// import "./ProblemPanel.css";

// export default function ProblemPanel({ problem, darkMode }) {
//     const getDifficultyClass = (difficulty) => {
//         if (!difficulty) return "difficulty-medium";
//         return `difficulty-${difficulty.toLowerCase()}`;
//     };

//     const formatConstraint = (constraint) => {
//         // Handle mathematical notation and formatting
//         return constraint
//             .replace(/\b(\d+)\s*<=\s*/g, "$1 ≤ ")
//             .replace(/\s*<=\s*(\d+)/g, " ≤ $1")
//             .replace(/\b(\d+)\s*<\s*/g, "$1 < ")
//             .replace(/\s*<\s*(\d+)/g, " < $1")
//             .replace(/\^(\d+)/g, "^$1");
//     };

//     if (!problem) {
//         return (
//             <div className="problem-panel">
//                 <div className="problem-loading">
//                     <div className="loading-spinner"></div>
//                     <p>Loading problem details...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="problem-panel">
//             {/* Problem Header */}
//             <div className="problem-header">
//                 <div className="problem-title-section">
//                     <h1 className="problem-title">{problem.title}</h1>
//                     <span
//                         className={`difficulty-badge ${getDifficultyClass(
//                             problem.difficulty
//                         )}`}
//                     >
//                         {problem.difficulty || "Medium"}
//                     </span>
//                 </div>

//                 {problem.createdAt && (
//                     <div className="problem-meta">
//                         <Clock size={14} />
//                         <span className="meta-text">
//                             Added{" "}
//                             {new Date(problem.createdAt).toLocaleDateString()}
//                         </span>
//                     </div>
//                 )}
//             </div>

//             {/* Single Scrollable Content */}
//             <div className="problem-content">
//                 {/* Description Section */}
//                 <section className="content-section">
//                     <div className="problem-description">
//                         {problem.description || "No description available."}
//                     </div>
//                 </section>

//                 {/* Examples Section */}
//                 {((problem.examples && problem.examples.length > 0) ||
//                     (problem.sampleInput && problem.sampleOutput)) && (
//                     <section className="content-section">
//                         <div className="section-header">
//                             <Code size={18} />
//                             <h3 className="section-title">Examples</h3>
//                         </div>

//                         <div className="examples-container">
//                             {problem.examples && problem.examples.length > 0 ? (
//                                 // New examples format
//                                 problem.examples.map((example, index) => (
//                                     <div key={index} className="example-card">
//                                         <div className="example-header">
//                                             <h4 className="example-title">
//                                                 Example {index + 1}:
//                                             </h4>
//                                         </div>

//                                         {example.input && (
//                                             <div className="example-section">
//                                                 <div className="section-label">
//                                                     Input:
//                                                 </div>
//                                                 <div className="example-code">
//                                                     <pre>{example.input}</pre>
//                                                 </div>
//                                             </div>
//                                         )}

//                                         {example.output && (
//                                             <div className="example-section">
//                                                 <div className="section-label">
//                                                     Output:
//                                                 </div>
//                                                 <div className="example-code">
//                                                     <pre>{example.output}</pre>
//                                                 </div>
//                                             </div>
//                                         )}

//                                         {example.explanation && (
//                                             <div className="example-section">
//                                                 <div className="section-label">
//                                                     Explanation:
//                                                 </div>
//                                                 <div className="explanation-text">
//                                                     {example.explanation}
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                 ))
//                             ) : (
//                                 // Fallback to legacy format
//                                 <div className="example-card">
//                                     <div className="example-header">
//                                         <h4 className="example-title">
//                                             Example:
//                                         </h4>
//                                     </div>

//                                     <div className="example-section">
//                                         <div className="section-label">
//                                             Input:
//                                         </div>
//                                         <div className="example-code">
//                                             <pre>{problem.sampleInput}</pre>
//                                         </div>
//                                     </div>

//                                     <div className="example-section">
//                                         <div className="section-label">
//                                             Output:
//                                         </div>
//                                         <div className="example-code">
//                                             <pre>{problem.sampleOutput}</pre>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </section>
//                 )}

//                 {/* Constraints Section */}
//                 {problem.constraints && problem.constraints.length > 0 && (
//                     <section className="content-section">
//                         <div className="section-header">
//                             <ChevronRight size={18} />
//                             <h3 className="section-title">Constraints</h3>
//                         </div>

//                         <div className="constraints-container">
//                             <ul className="constraints-list">
//                                 {problem.constraints.map(
//                                     (constraint, index) => (
//                                         <li
//                                             key={index}
//                                             className="constraint-item"
//                                         >
//                                             {formatConstraint(constraint)}
//                                         </li>
//                                     )
//                                 )}
//                             </ul>
//                         </div>
//                     </section>
//                 )}

//                 {/* Tags Section */}
//                 {problem.tags && problem.tags.length > 0 && (
//                     <section className="content-section">
//                         <div className="section-header">
//                             <Tag size={18} />
//                             <h3 className="section-title">Tags</h3>
//                         </div>

//                         <div className="tags-container">
//                             {problem.tags.map((tag, index) => (
//                                 <span key={index} className="problem-tag">
//                                     {tag}
//                                 </span>
//                             ))}
//                         </div>
//                     </section>
//                 )}
//             </div>
//         </div>
//     );
// }

import { useState } from "react";
import { Tag, Clock, Info, Code2, CheckCircle2 } from "lucide-react";
import "./ProblemPanel.css";

export default function ProblemPanel({ problem, darkMode }) {
    const [activeTab, setActiveTab] = useState("description");

    const getDifficultyClass = (difficulty) => {
        if (!difficulty) return "difficulty-medium";
        return `difficulty-${difficulty.toLowerCase()}`;
    };

    const formatConstraint = (constraint) => {
        return constraint
            .replace(/\b(\d+)\s*<=\s*/g, "$1 ≤ ")
            .replace(/\s*<=\s*(\d+)/g, " ≤ $1")
            .replace(/\b(\d+)\s*<\s*/g, "$1 < ")
            .replace(/\s*<\s*(\d+)/g, " < $1")
            .replace(/\^(\d+)/g, "^$1");
    };

    if (!problem) {
        return (
            <div className="problem-panel-wrapper">
                <div className="problem-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading problem...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="problem-panel-wrapper">
            {/* Problem Header */}
            <div className="panel-header">
                <div className="problem-title-row">
                    <h1 className="problem-title">{problem.title}</h1>
                    <span
                        className={`difficulty-badge ${getDifficultyClass(
                            problem.difficulty
                        )}`}
                    >
                        {problem.difficulty || "Medium"}
                    </span>
                </div>

                {/* Problem Stats */}
                {(problem.acceptanceRate || problem.submissions) && (
                    <div className="problem-stats">
                        {problem.acceptanceRate && (
                            <div className="stat-item">
                                <CheckCircle2 size={14} />
                                <span className="stat-text">
                                    Accepted: {problem.acceptanceRate}%
                                </span>
                            </div>
                        )}
                        {problem.submissions && (
                            <div className="stat-item">
                                <Info size={14} />
                                <span className="stat-text">
                                    {problem.submissions} submissions
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Tags */}
                {problem.tags && problem.tags.length > 0 && (
                    <div className="problem-tags">
                        {problem.tags.map((tag, index) => (
                            <span key={index} className="tag-chip">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Tab Navigation */}
            <div className="tab-navigation">
                <button
                    className={`tab-button ${
                        activeTab === "description" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("description")}
                >
                    Description
                </button>
                <button
                    className={`tab-button ${
                        activeTab === "solutions" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("solutions")}
                >
                    Solutions
                </button>
                <button
                    className={`tab-button ${
                        activeTab === "submissions" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("submissions")}
                >
                    Submissions
                </button>
            </div>

            {/* Content Area */}
            <div className="panel-content">
                {activeTab === "description" && (
                    <>
                        {/* Problem Description */}
                        <div className="content-block">
                            <p className="problem-description">
                                {problem.description}
                            </p>
                        </div>

                        {/* Examples */}
                        {problem.examples && problem.examples.length > 0 && (
                            <div className="content-block">
                                {problem.examples.map((example, index) => (
                                    <div key={index} className="example-box">
                                        <div className="example-header">
                                            <strong>
                                                Example {index + 1}:
                                            </strong>
                                        </div>
                                        <div className="example-content">
                                            <div className="io-section">
                                                <span className="io-label">
                                                    Input:
                                                </span>
                                                <code className="io-value">
                                                    {example.input}
                                                </code>
                                            </div>
                                            <div className="io-section">
                                                <span className="io-label">
                                                    Output:
                                                </span>
                                                <code className="io-value">
                                                    {example.output}
                                                </code>
                                            </div>
                                            {example.explanation && (
                                                <div className="io-section">
                                                    <span className="io-label">
                                                        Explanation:
                                                    </span>
                                                    <p className="explanation">
                                                        {example.explanation}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Sample Input/Output (fallback if no examples array) */}
                        {(!problem.examples || problem.examples.length === 0) &&
                            (problem.sampleInput || problem.sampleOutput) && (
                                <div className="content-block">
                                    <div className="example-box">
                                        <div className="example-header">
                                            <strong>Example:</strong>
                                        </div>
                                        <div className="example-content">
                                            {problem.sampleInput && (
                                                <div className="io-section">
                                                    <span className="io-label">
                                                        Input:
                                                    </span>
                                                    <code className="io-value">
                                                        {problem.sampleInput}
                                                    </code>
                                                </div>
                                            )}
                                            {problem.sampleOutput && (
                                                <div className="io-section">
                                                    <span className="io-label">
                                                        Output:
                                                    </span>
                                                    <code className="io-value">
                                                        {problem.sampleOutput}
                                                    </code>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                        {/* Constraints */}
                        {problem.constraints &&
                            problem.constraints.length > 0 && (
                                <div className="content-block">
                                    <h3 className="block-title">
                                        Constraints:
                                    </h3>
                                    <ul className="constraints-list">
                                        {problem.constraints.map(
                                            (constraint, index) => (
                                                <li
                                                    key={index}
                                                    className="constraint-item"
                                                >
                                                    <code>
                                                        {formatConstraint(
                                                            constraint
                                                        )}
                                                    </code>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}
                    </>
                )}

                {activeTab === "solutions" && (
                    <div className="content-block">
                        <div className="placeholder-content">
                            <Info size={48} className="placeholder-icon" />
                            <h3>Solutions</h3>
                            <p>Community solutions will appear here.</p>
                        </div>
                    </div>
                )}

                {activeTab === "submissions" && (
                    <div className="content-block">
                        <div className="placeholder-content">
                            <Clock size={48} className="placeholder-icon" />
                            <h3>Submissions</h3>
                            <p>Your submission history will appear here.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
