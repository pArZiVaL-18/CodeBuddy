// import { useParams, useLocation } from "react-router-dom";
// import Editor from "@monaco-editor/react";
// import { useEffect, useState, useRef } from "react";
// import socket from "../socket";
// import ChatBox from "../components/ChatBox";
// import ProblemPanel from "../components/ProblemPanel";
// import { runCode } from "../api/judge0";
// import toast from "react-hot-toast";
// import {
//     Play,
//     RotateCcw,
//     Sun,
//     Moon,
//     Code2,
//     Users,
//     Copy,
//     MessageCircle,
//     X,
//     Maximize2,
//     Minimize2,
// } from "lucide-react";
// import "../styles/RoomPage.css";

// const languageOptions = [
//     { judge0Id: 63, monacoId: "javascript", label: "JavaScript" },
//     { judge0Id: 71, monacoId: "python", label: "Python" },
//     { judge0Id: 62, monacoId: "java", label: "Java" },
//     { judge0Id: 54, monacoId: "cpp", label: "C++" },
//     { judge0Id: 50, monacoId: "c", label: "C" },
//     { judge0Id: 51, monacoId: "csharp", label: "C#" },
//     { judge0Id: 60, monacoId: "go", label: "Go" },
//     { judge0Id: 68, monacoId: "php", label: "PHP" },
//     { judge0Id: 72, monacoId: "ruby", label: "Ruby" },
// ];

// const defaultCodes = {
//     63: `// Write your JavaScript code here\n\nfunction hello() {\n  console.log("Hello, world!");\n}\n\nhello();`,
//     71: `# Write your Python code here\n\ndef hello():\n    print("Hello, world!")\n\nhello()`,
//     62: `// Write your Java code here\n\npublic class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello, world!");\n    }\n}`,
//     54: `// Write your C++ code here\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, world!" << endl;\n    return 0;\n}`,
// };

// export default function RoomPage() {
//     const { roomId } = useParams();
//     const location = useLocation();
//     const queryParams = new URLSearchParams(location.search);
//     const problemId = queryParams.get("id");

//     // State management
//     const [darkMode, setDarkMode] = useState(true);
//     const [code, setCode] = useState("// Start coding together!");
//     const [output, setOutput] = useState("");
//     const [problem, setProblem] = useState(null);
//     const [users, setUsers] = useState([]);
//     const [typingUser, setTypingUser] = useState(null);
//     const [languageId, setLanguageId] = useState(71); // Default to Python
//     const [language, setLanguage] = useState("python");
//     const [isRunning, setIsRunning] = useState(false);
//     const [starterCodes, setStarterCodes] = useState({});
//     const [isChatOpen, setIsChatOpen] = useState(false);
//     const [isProblemMinimized, setIsProblemMinimized] = useState(false);

//     const editorRef = useRef(null);
//     const username = "User"; // This could come from auth context

//     // Socket connection and room management
//     useEffect(() => {
//         socket.emit("join-room", { roomId, username });

//         socket.on("room-users", (users) => {
//             setUsers(users);
//         });

//         socket.on("user-typing", (user) => {
//             setTypingUser(user);
//             setTimeout(() => setTypingUser(null), 1000);
//         });

//         socket.on("receive-code", (incomingCode) => {
//             setCode(incomingCode);
//         });

//         return () => {
//             socket.emit("leave-room", roomId);
//             socket.off("receive-code");
//             socket.off("room-users");
//             socket.off("user-typing");
//         };
//     }, [roomId, username]);

//     // Fetch problem data
//     useEffect(() => {
//         const fetchProblem = async () => {
//             try {
//                 const res = await fetch(
//                     `http://localhost:8080/api/problems/${problemId}`
//                 );
//                 const data = await res.json();
//                 setProblem(data);

//                 let processedStarterCodes = {};
//                 if (data.starterCode && Array.isArray(data.starterCode)) {
//                     data.starterCode.forEach((item) => {
//                         if (item.judge0Id && item.starterCode) {
//                             processedStarterCodes[item.judge0Id] =
//                                 item.starterCode;
//                         }
//                     });
//                 }

//                 setStarterCodes(processedStarterCodes);
//                 const initialCode =
//                     processedStarterCodes[languageId] ||
//                     defaultCodes[languageId] ||
//                     "// Start coding together!";
//                 setCode(initialCode);
//             } catch (err) {
//                 console.error("Failed to fetch problem:", err);
//                 setCode(
//                     defaultCodes[languageId] || "// Start coding together!"
//                 );
//             }
//         };

//         if (problemId) {
//             fetchProblem();
//         }
//     }, [problemId, languageId]);

//     // Editor change handler
//     const handleEditorChange = (value) => {
//         setCode(value);
//         socket.emit("code-change", { roomId, code: value });
//         socket.emit("typing", { roomId, username });
//     };

//     // Language change handler
//     const handleLanguageChange = (e) => {
//         const selectedLanguageId = Number(e.target.value);
//         setLanguageId(selectedLanguageId);

//         const selectedLanguage = languageOptions.find(
//             (lang) => lang.judge0Id === selectedLanguageId
//         );
//         setLanguage(selectedLanguage?.monacoId || "plaintext");

//         const newCode =
//             starterCodes[selectedLanguageId] ||
//             defaultCodes[selectedLanguageId] ||
//             "// Start coding together!";
//         setCode(newCode);
//         socket.emit("code-change", { roomId, code: newCode });
//     };

//     // Run code handler
//     const handleRun = async () => {
//         setIsRunning(true);
//         setOutput("Running your code...");

//         try {
//             const result = await runCode(languageId, code);
//             if (result.stdout) {
//                 setOutput(result.stdout);
//             } else if (result.stderr) {
//                 setOutput("Error:\n" + result.stderr);
//             } else if (result.compile_output) {
//                 setOutput("Compilation Error:\n" + result.compile_output);
//             } else {
//                 setOutput("No output generated");
//             }
//         } catch (error) {
//             setOutput("Failed to run code:\n" + error.message);
//         } finally {
//             setIsRunning(false);
//         }
//     };

//     // Reset code handler
//     const handleReset = () => {
//         const newCode =
//             starterCodes[languageId] ||
//             defaultCodes[languageId] ||
//             "// Start coding together!";
//         setCode(newCode);
//         socket.emit("code-change", { roomId, code: newCode });
//         setOutput("");
//     };

//     // Copy room link handler
//     const handleCopyRoomLink = () => {
//         const fullLink = `${window.location.origin}/room/${roomId}`;
//         console.log(fullLink, "  ", problemId);
//         console.log(`${fullLink}?id=${problemId}`);
//         navigator.clipboard
//             .writeText(`${fullLink}?id=${problemId}`)
//             .then(() => toast.success("Room link copied! 📋"))
//             .catch(() => toast.error("Failed to copy link 😞"));
//     };

//     return (
//         <div className={`room-page ${darkMode ? "dark" : "light"}`}>
//             {/* Header */}
//             <header className="room-header">
//                 <div className="header-left">
//                     <div className="logo">
//                         <Code2 className="logo-icon" size={24} />
//                         <span className="logo-text">CodeSolve</span>
//                     </div>

//                     <div className="room-info">
//                         <span className="room-id">Room: {roomId}</span>
//                         <button
//                             onClick={handleCopyRoomLink}
//                             className="copy-link-btn"
//                         >
//                             <Copy size={16} />
//                             Copy Link
//                         </button>
//                     </div>
//                 </div>

//                 <div className="header-center">
//                     <div className="users-info">
//                         <Users size={16} />
//                         <span className="users-count">
//                             {users.length} online
//                         </span>
//                         {typingUser && (
//                             <span className="typing-indicator">
//                                 {typingUser} is typing...
//                             </span>
//                         )}
//                     </div>
//                 </div>

//                 <div className="header-right">
//                     <button
//                         onClick={() => setIsChatOpen(!isChatOpen)}
//                         className={`chat-toggle ${isChatOpen ? "active" : ""}`}
//                         title="Toggle chat"
//                     >
//                         <MessageCircle size={20} />
//                     </button>

//                     <button
//                         onClick={() => setDarkMode(!darkMode)}
//                         className="theme-toggle"
//                         title={
//                             darkMode
//                                 ? "Switch to light mode"
//                                 : "Switch to dark mode"
//                         }
//                     >
//                         {darkMode ? <Sun size={20} /> : <Moon size={20} />}
//                     </button>
//                 </div>
//             </header>

//             {/* Main Content */}
//             <main className="room-main">
//                 {/* Problem Panel */}
//                 <aside
//                     className={`problem-sidebar ${
//                         isProblemMinimized ? "minimized" : ""
//                     }`}
//                 >
//                     <div className="problem-panel-header">
//                         <h3 className="panel-title">Problem</h3>
//                         <button
//                             onClick={() =>
//                                 setIsProblemMinimized(!isProblemMinimized)
//                             }
//                             className="minimize-btn"
//                             title={isProblemMinimized ? "Expand" : "Minimize"}
//                         >
//                             {isProblemMinimized ? (
//                                 <Maximize2 size={16} />
//                             ) : (
//                                 <Minimize2 size={16} />
//                             )}
//                         </button>
//                     </div>

//                     {!isProblemMinimized && (
//                         <ProblemPanel problem={problem} darkMode={darkMode} />
//                     )}
//                 </aside>

//                 {/* Editor Panel */}
//                 <section className="editor-panel">
//                     {/* Editor Header */}
//                     <div className="editor-header">
//                         <div className="editor-controls">
//                             <div className="language-selector">
//                                 <label
//                                     htmlFor="language"
//                                     className="language-label"
//                                 >
//                                     Language:
//                                 </label>
//                                 <select
//                                     id="language"
//                                     value={languageId}
//                                     onChange={handleLanguageChange}
//                                     className="language-select"
//                                 >
//                                     {languageOptions.map((lang) => (
//                                         <option
//                                             key={lang.judge0Id}
//                                             value={lang.judge0Id}
//                                         >
//                                             {lang.label}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </div>

//                         <div className="editor-actions">
//                             <button
//                                 onClick={handleReset}
//                                 className="action-btn reset-btn"
//                                 title="Reset to starter code"
//                             >
//                                 <RotateCcw size={16} />
//                                 Reset
//                             </button>

//                             <button
//                                 onClick={handleRun}
//                                 disabled={isRunning}
//                                 className="action-btn run-btn"
//                                 title="Run your code"
//                             >
//                                 <Play size={16} />
//                                 {isRunning ? "Running..." : "Run Code"}
//                             </button>
//                         </div>
//                     </div>

//                     {/* Code Editor */}
//                     <div className="editor-container">
//                         <Editor
//                             height="100%"
//                             language={language}
//                             value={code}
//                             onChange={handleEditorChange}
//                             theme={darkMode ? "vs-dark" : "vs-light"}
//                             options={{
//                                 minimap: { enabled: false },
//                                 fontSize: 14,
//                                 lineNumbers: "on",
//                                 roundedSelection: false,
//                                 scrollBeyondLastLine: false,
//                                 automaticLayout: true,
//                                 padding: { top: 16, bottom: 16 },
//                                 lineDecorationsWidth: 10,
//                                 lineNumbersMinChars: 3,
//                                 scrollbar: {
//                                     vertical: "auto",
//                                     horizontal: "auto",
//                                     verticalScrollbarSize: 12,
//                                     horizontalScrollbarSize: 12,
//                                 },
//                             }}
//                         />
//                     </div>

//                     {/* Output Console */}
//                     <div className="output-console">
//                         <div className="console-header">
//                             <h3 className="console-title">Console Output</h3>
//                         </div>
//                         <div className="console-content">
//                             <pre className="console-output">
//                                 {output ||
//                                     "Output will appear here after running your code..."}
//                             </pre>
//                         </div>
//                     </div>
//                 </section>

//                 {/* Chat Panel */}
//                 <aside className={`chat-sidebar ${isChatOpen ? "open" : ""}`}>
//                     <div className="chat-panel-header">
//                         <h3 className="panel-title">Team Chat</h3>
//                         <button
//                             onClick={() => setIsChatOpen(false)}
//                             className="close-chat-btn"
//                             title="Close chat"
//                         >
//                             <X size={16} />
//                         </button>
//                     </div>

//                     <ChatBox
//                         roomId={roomId}
//                         username={username}
//                         darkMode={darkMode}
//                     />
//                 </aside>
//             </main>
//         </div>
//     );
// }

// ---------------------------------------------------------------------------------------------------------------------------

// import { useParams, useLocation } from "react-router-dom";
// import Editor from "@monaco-editor/react";
// import { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import socket from "../socket";
// import ChatBox from "../components/ChatBox";
// import ProblemPanel from "../components/ProblemPanel";
// import { runCode, submitCode } from "../api/judge0";
// import toast from "react-hot-toast";
// import {
//     Play,
//     RotateCcw,
//     Sun,
//     Moon,
//     Code2,
//     Users,
//     Copy,
//     MessageCircle,
//     X,
//     Maximize2,
//     Minimize2,
// } from "lucide-react";
// import "../styles/RoomPage.css";
// import { jwtDecode } from "jwt-decode";

// const languageOptions = [
//     { judge0Id: 63, monacoId: "javascript", label: "JavaScript" },
//     { judge0Id: 71, monacoId: "python", label: "Python" },
//     { judge0Id: 62, monacoId: "java", label: "Java" },
//     { judge0Id: 54, monacoId: "cpp", label: "C++" },
//     { judge0Id: 50, monacoId: "c", label: "C" },
//     { judge0Id: 51, monacoId: "csharp", label: "C#" },
//     { judge0Id: 60, monacoId: "go", label: "Go" },
//     { judge0Id: 68, monacoId: "php", label: "PHP" },
//     { judge0Id: 72, monacoId: "ruby", label: "Ruby" },
// ];

// const defaultCodes = {
//     63: `// Write your JavaScript code here\n\nfunction hello() {\n  console.log("Hello, world!");\n}\n\nhello();`,
//     71: `# Write your Python code here\n\ndef hello():\n    print("Hello, world!")\n\nhello()`,
//     62: `// Write your Java code here\n\npublic class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello, world!");\n    }\n}`,
//     54: `// Write your C++ code here\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, world!" << endl;\n    return 0;\n}`,
// };

// export default function RoomPage() {
//     const { roomId } = useParams();
//     const location = useLocation();
//     const queryParams = new URLSearchParams(location.search);
//     const problemId = queryParams.get("id");

//     // State
//     const [darkMode, setDarkMode] = useState(true);
//     const [code, setCode] = useState("// Start coding together!");
//     const [output, setOutput] = useState("");
//     const [problem, setProblem] = useState(null);
//     const [users, setUsers] = useState([]);
//     const [typingUser, setTypingUser] = useState(null);
//     const [languageId, setLanguageId] = useState(71);
//     const [language, setLanguage] = useState("python");
//     const [isRunning, setIsRunning] = useState(false);
//     const [starterCodes, setStarterCodes] = useState({});
//     const [isChatOpen, setIsChatOpen] = useState(false);
//     const [isProblemMinimized, setIsProblemMinimized] = useState(false);
//     // const [user, setUser] = useState({}); // Authenticated user info
//     const jwt = localStorage.getItem("jwt");
//     let userId = null;
//     if (jwt) {
//         const decoded = jwtDecode(jwt);
//         userId = decoded.id; // or whatever field you stored
//     }
//     console.log("Current User ID:", userId);

//     const editorRef = useRef(null);

//     // Instead of hardcoded "User", fetch from backend
//     const [username, setUsername] = useState("User");

//     // Fetch current user from backend (JWT cookie will be sent automatically)
//     useEffect(() => {
//         axios
//             .get("http://localhost:8080/api/auth/me", {
//                 withCredentials: true,
//             })
//             .then((res) => {
//                 console.log("Fetched user:", res.data);
//                 setUser(res.data);
//                 setUsername(res.data.name || "User");
//             })
//             .catch(() => {
//                 setUsername("User");
//             });
//     }, []);

//     // Socket connection
//     useEffect(() => {
//         if (!roomId || !username) return;

//         socket.emit("join-room", { roomId, username });

//         socket.on("room-users", (users) => {
//             setUsers(users);
//         });

//         socket.on("user-typing", (user) => {
//             setTypingUser(user);
//             setTimeout(() => setTypingUser(null), 1000);
//         });

//         socket.on("receive-code", (incomingCode) => {
//             setCode(incomingCode);
//         });

//         return () => {
//             socket.emit("leave-room", roomId);
//             socket.off("receive-code");
//             socket.off("room-users");
//             socket.off("user-typing");
//         };
//     }, [roomId, username]);

//     // Persist join in backend
//     // useEffect(() => {
//     //     if (!roomId) return;

//     //     axios
//     //         .post(
//     //             `http://localhost:8080/api/rooms/${roomId}/join`,
//     //             {},
//     //             { withCredentials: true }
//     //         )
//     //         .then((res) => {
//     //             console.log("Joined room in DB:", res.data);
//     //         })
//     //         .catch((err) => {
//     //             console.error("Failed to join room in DB:", err);
//     //         });
//     // }, [roomId]);

//     // Fetch problem data
//     useEffect(() => {
//         const fetchProblem = async () => {
//             try {
//                 const res = await fetch(
//                     `http://localhost:8080/api/problems/${problemId}`,
//                     { credentials: "include" }
//                 );
//                 const data = await res.json();
//                 setProblem(data);
//                 console.log("Fetched problem:", data);

//                 let processedStarterCodes = {};
//                 if (data.starterCode && Array.isArray(data.starterCode)) {
//                     data.starterCode.forEach((item) => {
//                         if (item.judge0Id && item.starterCode) {
//                             processedStarterCodes[item.judge0Id] =
//                                 item.starterCode;
//                         }
//                     });
//                 }

//                 setStarterCodes(processedStarterCodes);
//                 const initialCode =
//                     processedStarterCodes[languageId] ||
//                     defaultCodes[languageId] ||
//                     "// Start coding together!";
//                 setCode(initialCode);
//             } catch (err) {
//                 console.error("Failed to fetch problem:", err);
//                 setCode(
//                     defaultCodes[languageId] || "// Start coding together!"
//                 );
//             }
//         };

//         if (problemId) {
//             fetchProblem();
//         }
//     }, [problemId, languageId]);

//     // === Handlers ===
//     const handleEditorChange = (value) => {
//         setCode(value);
//         socket.emit("code-change", { roomId, code: value });
//         socket.emit("typing", { roomId, username });
//     };

//     const handleLanguageChange = (e) => {
//         const selectedLanguageId = Number(e.target.value);
//         setLanguageId(selectedLanguageId);

//         const selectedLanguage = languageOptions.find(
//             (lang) => lang.judge0Id === selectedLanguageId
//         );
//         setLanguage(selectedLanguage?.monacoId || "plaintext");

//         const newCode =
//             starterCodes[selectedLanguageId] ||
//             defaultCodes[selectedLanguageId] ||
//             "// Start coding together!";
//         setCode(newCode);
//         socket.emit("code-change", { roomId, code: newCode });
//     };

//     const handleRun = async () => {
//         setIsRunning(true);
//         setOutput("Running your code...");

//         try {
//             const result = await runCode(languageId, code);
//             if (result.stdout) {
//                 setOutput(result.stdout);
//             } else if (result.stderr) {
//                 setOutput("Error:\n" + result.stderr);
//             } else if (result.compile_output) {
//                 setOutput("Compilation Error:\n" + result.compile_output);
//             } else {
//                 setOutput("No output generated");
//             }
//         } catch (error) {
//             setOutput("Failed to run code:\n" + error.message);
//         } finally {
//             setIsRunning(false);
//         }
//     };

//     const handleSubmit = async () => {
//         setIsRunning(true);
//         setOutput("Submitting your code...");

//         try {
//             console.log("Problem ", problem);
//             console.log("Problem expected outputs:", problem.expectedOutputs);
//             // Assuming you already have problem.testCases from DB
//             const result = await submitCode(
//                 languageId,
//                 code,
//                 problem.expectedOutputs
//             );

//             console.log("Submission result:", result);
//             console.log("Problem expected outputs:", problem.expectedOutputs);
//             if (result.verdict === "Accepted") {
//                 setOutput(`✅ Accepted: All ${result.total} test cases passed`);

//                 // Save submission to DB
//                 await fetch("http://localhost:8080/api/submit", {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({
//                         userId: userId, // replace with auth user
//                         problemId: problem._id,
//                         code,
//                         language,
//                         status: result.verdict,
//                         output: JSON.stringify(result.results),
//                         runtime: result.runtime,
//                         memory: result.memory,
//                         testCasesPassed: result.passed,
//                         score:
//                             problem.difficulty === "Easy"
//                                 ? 10
//                                 : problem.difficulty === "Medium"
//                                 ? 20
//                                 : 30,
//                     }),
//                 });
//             } else {
//                 // Build a detailed feedback string
//                 let feedback = `${result.verdict}\n\n`;
//                 result.results.forEach((r) => {
//                     feedback += `Case ${r.case}:\n`;
//                     feedback += `Input: ${r.input}\n`;
//                     feedback += `Expected: ${r.expected}\n`;
//                     feedback += `Got: ${r.actual}\n`;
//                     feedback += `Status: ${r.status}\n\n`;
//                 });
//                 setOutput(feedback);
//             }
//         } catch (error) {
//             setOutput("Failed to submit code:\n" + error.message);
//         } finally {
//             setIsRunning(false);
//         }
//     };

//     const handleReset = () => {
//         const newCode =
//             starterCodes[languageId] ||
//             defaultCodes[languageId] ||
//             "// Start coding together!";
//         setCode(newCode);
//         socket.emit("code-change", { roomId, code: newCode });
//         setOutput("");
//     };

//     const handleCopyRoomLink = () => {
//         const fullLink = `${window.location.origin}/room/${roomId}?id=${problemId}`;
//         navigator.clipboard
//             .writeText(fullLink)
//             .then(() => toast.success("Room link copied! 📋"))
//             .catch(() => toast.error("Failed to copy link 😞"));
//     };

//     // === Render ===
//     return (
//         <div className={`room-page ${darkMode ? "dark" : "light"}`}>
//             {/* Header */}
//             <header className="room-header">
//                 <div className="header-left">
//                     <div className="logo">
//                         <Code2 className="logo-icon" size={24} />
//                         <span className="logo-text">CodeSolve</span>
//                     </div>

//                     <div className="room-info">
//                         <span className="room-id">Room: {roomId}</span>
//                         <button
//                             onClick={handleCopyRoomLink}
//                             className="copy-link-btn"
//                         >
//                             <Copy size={16} />
//                             Copy Link
//                         </button>
//                     </div>
//                 </div>

//                 <div className="header-center">
//                     <div className="users-info">
//                         <Users size={16} />
//                         <span className="users-count">
//                             {users.length / 2} online
//                         </span>
//                         {typingUser && (
//                             <span className="typing-indicator">
//                                 {typingUser} is typing...
//                             </span>
//                         )}
//                     </div>
//                 </div>

//                 <div className="header-right">
//                     <button
//                         onClick={() => setIsChatOpen(!isChatOpen)}
//                         className={`chat-toggle ${isChatOpen ? "active" : ""}`}
//                         title="Toggle chat"
//                     >
//                         <MessageCircle size={20} />
//                     </button>

//                     <button
//                         onClick={() => setDarkMode(!darkMode)}
//                         className="theme-toggle"
//                         title={
//                             darkMode
//                                 ? "Switch to light mode"
//                                 : "Switch to dark mode"
//                         }
//                     >
//                         {darkMode ? <Sun size={20} /> : <Moon size={20} />}
//                     </button>
//                 </div>
//             </header>

//             {/* Main */}
//             <main className="room-main">
//                 {/* Problem Panel */}
//                 <aside
//                     className={`problem-sidebar ${
//                         isProblemMinimized ? "minimized" : ""
//                     }`}
//                 >
//                     <div className="problem-panel-header">
//                         <h3 className="panel-title">Problem</h3>
//                         <button
//                             onClick={() =>
//                                 setIsProblemMinimized(!isProblemMinimized)
//                             }
//                             className="minimize-btn"
//                             title={isProblemMinimized ? "Expand" : "Minimize"}
//                         >
//                             {isProblemMinimized ? (
//                                 <Maximize2 size={16} />
//                             ) : (
//                                 <Minimize2 size={16} />
//                             )}
//                         </button>
//                     </div>

//                     {!isProblemMinimized && (
//                         <ProblemPanel problem={problem} darkMode={darkMode} />
//                     )}
//                 </aside>

//                 {/* Editor Panel */}
//                 <section className="editor-panel">
//                     <div className="editor-header">
//                         <div className="editor-controls">
//                             <div className="language-selector">
//                                 <label
//                                     htmlFor="language"
//                                     className="language-label"
//                                 >
//                                     Language:
//                                 </label>
//                                 <select
//                                     id="language"
//                                     value={languageId}
//                                     onChange={handleLanguageChange}
//                                     className="language-select"
//                                 >
//                                     {languageOptions.map((lang) => (
//                                         <option
//                                             key={lang.judge0Id}
//                                             value={lang.judge0Id}
//                                         >
//                                             {lang.label}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </div>

//                         <div className="editor-actions">
//                             <button
//                                 onClick={handleReset}
//                                 className="action-btn reset-btn"
//                                 title="Reset to starter code"
//                             >
//                                 <RotateCcw size={16} />
//                                 Reset
//                             </button>

//                             <button
//                                 onClick={handleRun}
//                                 disabled={isRunning}
//                                 className="action-btn run-btn"
//                                 title="Run your code"
//                             >
//                                 <Play size={16} />
//                                 {isRunning ? "Running..." : "Run Code"}
//                             </button>

//                             <button
//                                 onClick={handleSubmit}
//                                 disabled={isRunning}
//                                 className="action-btn run-btn"
//                                 title="Run your code"
//                             >
//                                 <Play size={16} />
//                                 {isRunning ? "Running..." : "Submit Code"}
//                             </button>
//                         </div>
//                     </div>

//                     <div className="editor-container">
//                         <Editor
//                             height="100%"
//                             language={language}
//                             value={code}
//                             onChange={handleEditorChange}
//                             theme={darkMode ? "vs-dark" : "vs-light"}
//                             options={{
//                                 minimap: { enabled: false },
//                                 fontSize: 14,
//                                 lineNumbers: "on",
//                                 roundedSelection: false,
//                                 scrollBeyondLastLine: false,
//                                 automaticLayout: true,
//                                 padding: { top: 16, bottom: 16 },
//                                 lineDecorationsWidth: 10,
//                                 lineNumbersMinChars: 3,
//                                 scrollbar: {
//                                     vertical: "auto",
//                                     horizontal: "auto",
//                                     verticalScrollbarSize: 12,
//                                     horizontalScrollbarSize: 12,
//                                 },
//                             }}
//                         />
//                     </div>

//                     <div className="output-console">
//                         <div className="console-header">
//                             <h3 className="console-title">Console Output</h3>
//                         </div>
//                         <div className="console-content">
//                             <pre className="console-output">
//                                 {output ||
//                                     "Output will appear here after running your code..."}
//                             </pre>
//                         </div>
//                     </div>
//                 </section>

//                 {/* Chat Panel */}
//                 <aside className={`chat-sidebar ${isChatOpen ? "open" : ""}`}>
//                     <div className="chat-panel-header">
//                         <h3 className="panel-title">Team Chat</h3>
//                         <button
//                             onClick={() => setIsChatOpen(false)}
//                             className="close-chat-btn"
//                             title="Close chat"
//                         >
//                             <X size={16} />
//                         </button>
//                     </div>

//                     <ChatBox
//                         roomId={roomId}
//                         username={username}
//                         darkMode={darkMode}
//                     />
//                 </aside>
//             </main>
//         </div>
//     );
// }

// ----------------------------------------------------------------------------------------------------------------------------------
// draft threee
import Editor from "@monaco-editor/react";
import { useState, useEffect, useRef } from "react";
import { runCode, submitCode } from "../api/judge0";
import { useParams, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ProblemPanel from "../components/ProblemPanel";
import socket from "../socket";
import {
    Play,
    Send,
    RotateCcw,
    Sun,
    Moon,
    Code2,
    Copy,
    MessageCircle,
    Users,
    X,
    Minus,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import "../styles/RoomPage.css";
import { useNavigate } from "react-router-dom";

const languageOptions = [
    { judge0Id: 63, monacoId: "javascript", label: "JavaScript" },
    { judge0Id: 71, monacoId: "python", label: "Python" },
    { judge0Id: 62, monacoId: "java", label: "Java" },
    { judge0Id: 54, monacoId: "cpp", label: "C++" },
    { judge0Id: 50, monacoId: "c", label: "C" },
    { judge0Id: 51, monacoId: "csharp", label: "C#" },
    { judge0Id: 60, monacoId: "go", label: "Go" },
    { judge0Id: 68, monacoId: "php", label: "PHP" },
    { judge0Id: 72, monacoId: "ruby", label: "Ruby" },
    { judge0Id: 83, monacoId: "swift", label: "Swift" },
];

const defaultCodes = {
    63: `// Write your JavaScript code here\n\nfunction hello() {\n  console.log("Hello, world!");\n}\n\nhello();`,
    71: `# Write your Python code here\n\ndef hello():\n    print("Hello, world!")\n\nhello()`,
    62: `// Write your Java code here\n\npublic class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello, world!");\n    }\n}`,
    54: `// Write your C++ code here\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, world!" << endl;\n    return 0;\n}`,
};

export default function ProblemPageWithChat() {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(true);
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [problem, setProblem] = useState(null);
    const [starterCodes, setStarterCodes] = useState({});
    const [isRunning, setIsRunning] = useState(false);
    const [languageId, setLanguageId] = useState(71);
    const [language, setLanguage] = useState("python");
    const [editorHeight, setEditorHeight] = useState(60);
    const [users, setUsers] = useState([]);
    const [typingUser, setTypingUser] = useState(null);

    // Chat-related state
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const [chatLog, setChatLog] = useState([]);
    const [chatPosition, setChatPosition] = useState({
        x: window.innerWidth - 450,
        y: 100,
    });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // const [username, setUsername] = useState(localStorage.getItem("username"));
    const dividerRef = useRef(null);
    const containerRef = useRef(null);
    const chatHeaderRef = useRef(null);
    const chatMessagesEndRef = useRef(null);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const problemId = queryParams.get("id");
    const username =
        queryParams.get("username") || localStorage.getItem("myName") || "User";

    console.log(localStorage.getItem("myName"));
    // console.log("Current User :", username);
    // const username = localStorage.getItem("username");
    // console.log("Username from localStorage:", username);

    // const usernameQuery = queryParams.get("username") || "User";
    // console.log("Current User :", usernameQuery);

    // setUsername(usernameQuery);

    const { roomId } = useParams();

    //     const location = useLocation();
    //     const queryParams = new URLSearchParams(location.search);
    //     const problemId = queryParams.get("id");

    let userId = null;
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
        const decoded = jwtDecode(jwt);
        userId = decoded.id;
    }

    // Fetch problem data
    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/api/problems/${problemId}`
                );
                const data = await res.json();
                setProblem(data);

                let processedStarterCodes = {};
                if (data.starterCode) {
                    if (Array.isArray(data.starterCode)) {
                        data.starterCode.forEach((item) => {
                            if (item.judge0Id && item.starterCode) {
                                processedStarterCodes[item.judge0Id] =
                                    item.starterCode;
                            }
                        });
                    }
                }

                setStarterCodes(processedStarterCodes);
                const initialCode =
                    processedStarterCodes[languageId] ||
                    defaultCodes[languageId] ||
                    "// Start coding here...";
                setCode(initialCode);
            } catch (err) {
                console.error("Failed to fetch problem:", err);
                setCode(defaultCodes[languageId] || "// Start coding here...");
            }
        };

        if (problemId) {
            fetchProblem();
        } else {
            setCode(defaultCodes[languageId] || "// Start coding here...");
        }
    }, [problemId, languageId]);

    // console.log("Current User ID:", userId);
    // console.log("Room ID:", roomId);
    // console.log("Username :", username);
    // console.log("users :", users);

    // Socket connection
    useEffect(() => {
        if (!roomId || !username) return;

        socket.connect();
        if (socket.connected) return;

        // Wait until the socket is connected
        socket.on("connect", () => {
            console.log("Socket connected with ID:", socket.id);
            socket.emit("join-room", { roomId, userId, username });
        });

        // socket.emit("join-room", { roomId, userId, username });
        // console.log("Joining room with socket ID:", socket.id);

        socket.on("room-users", (users) => {
            console.log("Room users updated:", users);

            setUsers(users);
        });

        socket.on("user-joined", ({ userId, username }) => {
            // console.log("User joined:", username);
            // setUsername(username);
            toast.success(`${username} joined the room!`, {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
            });
            // toast.info(`${username} joined the room!`, {
            //     position: "top-right",
            //     autoClose: 3000,
            //     theme: "colored",
            // });
        });

        socket.on("user-left", ({ username }) => {
            toast.success(`${username} left the room.`, {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
            });
        });

        socket.on("user-typing", (user) => {
            setTypingUser(user);
            setTimeout(() => setTypingUser(null), 1000);
        });

        socket.on("receive-code", (incomingCode) => {
            setCode(incomingCode);
        });

        socket.on("chat-message", (data) => {
            setChatLog((prev) => [...prev, data]);
        });

        return () => {
            socket.emit("leave-room", roomId);
            socket.off("receive-code");
            socket.off("room-users");
            socket.off("user-typing");
            socket.off("chat-message");
            socket.off("user-joined");
            socket.off("user-left");
            socket.disconnect();
        };
    }, [roomId]);

    const handleLanguageChange = (e) => {
        const selectedLanguageId = Number(e.target.value);
        setLanguageId(selectedLanguageId);
        const selectedLanguage = languageOptions.find(
            (lang) => lang.judge0Id === selectedLanguageId
        );
        setLanguage(selectedLanguage?.monacoId || "plaintext");
        const newCode =
            starterCodes[selectedLanguageId] ||
            defaultCodes[selectedLanguageId] ||
            "// Start coding here...";
        setCode(newCode);
    };

    const handleEditorChange = (value) => {
        setCode(value);
        socket.emit("code-change", { roomId, code: value, username });
        socket.emit("typing", { roomId, username });
    };

    const handleRun = async () => {
        setIsRunning(true);
        setOutput("Running your code...");
        try {
            const result = await runCode(languageId, code);
            if (result.stdout) {
                setOutput(result.stdout);
            } else if (result.stderr) {
                setOutput("Error:\n" + result.stderr);
            } else if (result.compile_output) {
                setOutput("Compilation Error:\n" + result.compile_output);
            } else {
                setOutput("No output generated");
            }
        } catch (error) {
            setOutput("Failed to run code:\n" + error.message);
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmit = async () => {
        setIsRunning(true);
        setOutput("Submitting your code...");
        try {
            const result = await submitCode(
                languageId,
                code,
                problem.expectedOutputs
            );
            if (result.verdict === "Accepted") {
                setOutput(`✅ Accepted: All ${result.total} test cases passed`);
                await fetch("http://localhost:8080/api/submit/collab", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userIds: users.map((u) => u.userId),
                        problemId: problem._id,
                        code,
                        language,
                        status: result.verdict,
                        output: JSON.stringify(result.results),
                        runtime: result.runtime,
                        memory: result.memory,
                        testCasesPassed: result.passed,
                        score:
                            problem.difficulty === "Easy"
                                ? 10
                                : problem.difficulty === "Medium"
                                ? 20
                                : 30,
                    }),
                });
            } else {
                let feedback = `${result.verdict}\n\n`;
                result.results.forEach((r) => {
                    feedback += `Case ${r.case}:\n`;
                    feedback += `Input: ${r.input}\n`;
                    feedback += `Expected: ${r.expected}\n`;
                    feedback += `Got: ${r.actual}\n`;
                    feedback += `Status: ${r.status}\n\n`;
                });
                setOutput(feedback);
            }
        } catch (error) {
            setOutput("Failed to submit code:\n" + error.message);
        } finally {
            setIsRunning(false);
        }
    };

    const handleReset = () => {
        // const newCode =
        //     starterCodes[languageId] ||
        //     defaultCodes[languageId] ||
        //     "// Start coding here...";
        // setCode(newCode);
        // setOutput("");
    };

    // Copy room link handler
    const handleCopyRoomLink = () => {
        const fullLink = `${window.location.origin}/room/${roomId}`;
        console.log(fullLink, "  ", problemId);
        console.log(`${fullLink}?id=${problemId}`);
        navigator.clipboard
            .writeText(`${fullLink}?id=${problemId}`)
            .then(() => toast.success("Room link copied! 📋"))
            .catch(() => toast.error("Failed to copy link 😞"));
    };

    // Resizable divider logic
    useEffect(() => {
        const divider = dividerRef.current;
        const container = containerRef.current;

        if (!divider || !container) return;

        let isDragging = false;

        const onMouseDown = () => {
            isDragging = true;
            document.body.style.cursor = "row-resize";
            document.body.style.userSelect = "none";
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;

            const containerRect = container.getBoundingClientRect();
            const newHeight =
                ((e.clientY - containerRect.top) / containerRect.height) * 100;

            if (newHeight >= 30 && newHeight <= 85) {
                setEditorHeight(newHeight);
            }
        };

        const onMouseUp = () => {
            isDragging = false;
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };

        divider.addEventListener("mousedown", onMouseDown);
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);

        return () => {
            divider.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };
    }, []);

    // Chat dragging logic
    const handleChatMouseDown = (e) => {
        if (
            e.target === chatHeaderRef.current ||
            chatHeaderRef.current.contains(e.target)
        ) {
            setIsDragging(true);
            setDragOffset({
                x: e.clientX - chatPosition.x,
                y: e.clientY - chatPosition.y,
            });
        }
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging) {
                const newX = e.clientX - dragOffset.x;
                const newY = e.clientY - dragOffset.y;

                // Boundary constraints
                const maxX = window.innerWidth - 420;
                const maxY = window.innerHeight - 600;

                setChatPosition({
                    x: Math.max(0, Math.min(newX, maxX)),
                    y: Math.max(0, Math.min(newY, maxY)),
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, dragOffset]);

    // Handle chat message send
    const handleSendMessage = () => {
        // e?.preventDefault();
        // if (!message.trim() || !isConnected) return;

        const message = chatInput.trim();
        if (!message.trim()) return;

        console.log("Sending message:", message);

        const payload = {
            roomId,
            message: message,
            sender: username || "Anonymous",
            timestamp: new Date().toISOString(),
        };

        socket.emit("chat-message", payload);

        // Add to local chat log with timestamp
        setChatLog((prev) => [
            ...prev,
            {
                ...payload,
                isOwn: true,
            },
        ]);

        setChatInput("");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    const handleLeaveRoom = () => {
        // Emit an event to notify server that user is leaving
        socket.emit("leave-room", roomId, username);

        // Disconnect the socket (optional, depends on whether you reuse it later)
        socket.disconnect();

        // Redirect the user back to home or problem list page
        navigate("/dashboard"); // or wherever you want
    };

    // Auto-scroll chat to bottom
    useEffect(() => {
        chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatLog]);

    return (
        <div className={`problem-page ${darkMode ? "dark" : "light"}`}>
            {/* Header */}
            <header className="problem-header">
                <div className="header-left">
                    <div className="logo">
                        <Code2 size={24} className="logo-icon" />
                        <span className="logo-text">CodeSolve</span>
                    </div>
                </div>

                <div className="room-info">
                    <span className="room-id">Room: {roomId}</span>{" "}
                    <button
                        onClick={handleCopyRoomLink}
                        className="copy-link-btn"
                    >
                        <Copy size={16} />
                        Copy Link
                    </button>
                    <button
                        onClick={handleLeaveRoom}
                        variant="destructive"
                        className="copy-link-btn"
                    >
                        Leave Room
                    </button>
                </div>

                <div className="header-center">
                    <div className="users-info">
                        <Users size={16} />
                        <span className="users-count">
                            {users.length} online
                        </span>
                        {typingUser && (
                            <span className="typing-indicator">
                                {typingUser} is typing...
                            </span>
                        )}
                    </div>
                </div>

                <div className="header-right">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="theme-toggle"
                    >
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="problem-main">
                {/* Left Panel - Problem Description */}
                <div className="problem-panel">
                    <ProblemPanel problem={problem} darkMode={darkMode} />
                </div>

                {/* Right Panel - Code Editor & Output */}
                <div className="code-panel" ref={containerRef}>
                    {/* Editor Section */}
                    <div
                        className="editor-section"
                        style={{ height: `${editorHeight}%` }}
                    >
                        {/* Editor Controls */}
                        <div className="editor-controls">
                            <select
                                value={languageId}
                                onChange={handleLanguageChange}
                                className="language-select"
                            >
                                {languageOptions.map((lang) => (
                                    <option
                                        key={lang.judge0Id}
                                        value={lang.judge0Id}
                                    >
                                        {lang.label}
                                    </option>
                                ))}
                            </select>

                            <div className="editor-actions">
                                <button
                                    onClick={handleReset}
                                    className="btn-reset"
                                    disabled={isRunning}
                                >
                                    <RotateCcw size={16} />
                                    Reset
                                </button>
                                <button
                                    onClick={handleRun}
                                    className="btn-run"
                                    disabled={isRunning}
                                >
                                    <Play size={16} />
                                    {isRunning ? "Running..." : "Run Code"}
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="btn-submit"
                                    disabled={isRunning}
                                >
                                    <Send size={16} />
                                    Submit
                                </button>
                            </div>
                        </div>

                        {/* Code Editor */}
                        <div className="editor-container">
                            <Editor
                                language={language}
                                value={code}
                                onChange={(value) => handleEditorChange(value)}
                                theme={darkMode ? "vs-dark" : "vs-light"}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    lineNumbers: "on",
                                    roundedSelection: false,
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    padding: { top: 16, bottom: 16 },
                                }}
                            />
                        </div>
                    </div>

                    {/* Resizable Divider */}
                    <div className="divider" ref={dividerRef}>
                        <div className="divider-line"></div>
                    </div>

                    {/* Output Section */}
                    <div
                        className="output-section"
                        style={{ height: `${100 - editorHeight}%` }}
                    >
                        <div className="output-header">
                            <h3 className="output-title">Console</h3>
                        </div>
                        <div className="output-content">
                            <pre className="output-text">
                                {output ||
                                    "Output will appear here after running your code..."}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Chat Button */}
            {!isChatOpen && (
                <button
                    className="floating-chat-btn"
                    onClick={() => setIsChatOpen(true)}
                    aria-label="Open chat"
                >
                    <MessageCircle size={24} />
                    {/* <span className="chat-badge"></span> */}
                </button>
            )}

            {/* Chat Modal */}
            {isChatOpen && (
                <>
                    <div
                        className="chat-overlay"
                        onClick={() => setIsChatOpen(false)}
                    />
                    <div
                        className="chat-modal"
                        style={{
                            left: `${chatPosition.x}px`,
                            top: `${chatPosition.y}px`,
                        }}
                    >
                        {/* Chat Header - Draggable */}
                        <div
                            className="chat-header"
                            ref={chatHeaderRef}
                            onMouseDown={handleChatMouseDown}
                            style={{ cursor: isDragging ? "grabbing" : "grab" }}
                        >
                            <div className="chat-header-left">
                                <MessageCircle size={18} />
                                <h3 className="chat-title">Chat Box</h3>
                            </div>
                            <div className="chat-header-actions">
                                <button
                                    className="chat-close-btn"
                                    onClick={() => setIsChatOpen(false)}
                                    aria-label="Close chat"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="chat-messages">
                            {chatLog.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`message ${
                                        msg.isOwn ? "own" : "other"
                                    }`}
                                >
                                    <div className="message-header">
                                        <span className="sender">
                                            {msg.isOwn ? "You" : msg.sender}
                                        </span>
                                        <span className="timestamp">
                                            {msg.time ||
                                                formatTime(msg.timestamp)}
                                        </span>
                                    </div>
                                    <div className="message-content">
                                        {msg.message}
                                    </div>
                                </div>
                            ))}
                            <div ref={chatMessagesEndRef} />
                        </div>

                        {/* Chat Input */}
                        <div className="chat-input-container">
                            <textarea
                                className="chat-input"
                                placeholder="Discuss about the solution logic here..."
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                rows={1}
                            />
                            <button
                                className="chat-send-btn"
                                onClick={handleSendMessage}
                                disabled={chatInput.trim() === ""}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>

                    {/* <YourRoutesOrLayout /> */}
                    <ToastContainer />
                </>
            )}
        </div>
    );
}
