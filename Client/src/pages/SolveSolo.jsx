// import Editor from "@monaco-editor/react";
// import { useState, useEffect } from "react";
// import { runCode, submitCode } from "../api/judge0";
// import { useLocation } from "react-router-dom";
// import ProblemPanel from "../components/ProblemPanel";
// import { Play, RotateCcw, Sun, Moon, Code2 } from "lucide-react";
// import { jwtDecode } from "jwt-decode";
// import "../styles/SolveSolo.css";

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
//     { judge0Id: 83, monacoId: "swift", label: "Swift" },
//     { judge0Id: 80, monacoId: "r", label: "R" },
//     { judge0Id: 46, monacoId: "bash", label: "Bash" },
//     { judge0Id: 82, monacoId: "sql", label: "SQL" },
// ];

// const defaultCodes = {
//     63: `// Write your JavaScript code here\n\nfunction hello() {\n  console.log("Hello, world!");\n}\n\nhello();`,
//     71: `# Write your Python code here\n\ndef hello():\n    print("Hello, world!")\n\nhello()`,
//     62: `// Write your Java code here\n\npublic class Solution {\n    public static void main(String[] args) {\n        System.out.println("Hello, world!");\n    }\n}`,
//     54: `// Write your C++ code here\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, world!" << endl;\n    return 0;\n}`,
//     50: `// Write your C code here\n\n#include <stdio.h>\n\nint main() {\n    printf("Hello, world!\\n");\n    return 0;\n}`,
//     51: `// Write your C# code here\n\nusing System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, world!");\n    }\n}`,
//     60: `// Write your Go code here\n\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, world!")\n}`,
//     68: `<?php\n// Write your PHP code here\n\necho "Hello, world!";\n?>`,
//     72: `# Write your Ruby code here\n\nputs "Hello, world!"`,
//     83: `// Write your Swift code here\n\nimport Foundation\n\nprint("Hello, world!")`,
//     80: `# Write your R code here\n\nprint("Hello, world!")`,
//     46: `#!/bin/bash\n# Write your Bash code here\n\necho "Hello, world!"`,
//     82: `-- Write your SQL code here\n\nSELECT 'Hello, world!' AS message;`,
// };

// export default function SolveSolo() {
//     const [darkMode, setDarkMode] = useState(true);
//     const [code, setCode] = useState("");
//     const [output, setOutput] = useState("");
//     const [problem, setProblem] = useState(null);
//     const [starterCodes, setStarterCodes] = useState({});
//     const [isRunning, setIsRunning] = useState(false);
//     const [languageId, setLanguageId] = useState(71); // Default to Python
//     const [language, setLanguage] = useState("python");
//     const jwt = localStorage.getItem("jwt");
//     let userId = null;
//     if (jwt) {
//         const decoded = jwtDecode(jwt);
//         userId = decoded.id; // or whatever field you stored
//     }
//     console.log("Current User ID:", userId);

//     const location = useLocation();
//     const queryParams = new URLSearchParams(location.search);
//     const problemId = queryParams.get("id");

//     useEffect(() => {
//         const fetchProblem = async () => {
//             try {
//                 const res = await fetch(
//                     `http://localhost:8080/api/problems/${problemId}`
//                 );
//                 const data = await res.json();
//                 setProblem(data);

//                 let processedStarterCodes = {};
//                 if (data.starterCode) {
//                     if (Array.isArray(data.starterCode)) {
//                         data.starterCode.forEach((item) => {
//                             if (item.judge0Id && item.starterCode) {
//                                 processedStarterCodes[item.judge0Id] =
//                                     item.starterCode;
//                             }
//                         });
//                     }
//                 } else if (data.starterCodes) {
//                     if (Array.isArray(data.starterCodes)) {
//                         data.starterCodes.forEach((item) => {
//                             if (item.judge0Id && item.starterCode) {
//                                 processedStarterCodes[item.judge0Id] =
//                                     item.starterCode;
//                             }
//                         });
//                     } else if (typeof data.starterCodes === "object") {
//                         processedStarterCodes = data.starterCodes;
//                     }
//                 }

//                 setStarterCodes(processedStarterCodes);
//                 const initialCode =
//                     processedStarterCodes[languageId] ||
//                     defaultCodes[languageId] ||
//                     "// Start coding here...";
//                 setCode(initialCode);
//             } catch (err) {
//                 console.error("Failed to fetch problem:", err);
//                 setCode(defaultCodes[languageId] || "// Start coding here...");
//             }
//         };

//         if (problemId) {
//             fetchProblem();
//         } else {
//             setCode(defaultCodes[languageId] || "// Start coding here...");
//         }
//     }, [problemId, languageId]);

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
//             "// Start coding here...";
//         setCode(newCode);
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
//             "// Start coding here...";
//         setCode(newCode);
//         setOutput("");
//     };

//     return (
//         <div className={`solve-solo ${darkMode ? "dark" : "light"}`}>
//             {/* Header */}
//             <header className="solve-header">
//                 <div className="header-left">
//                     <div className="logo">
//                         <Code2 className="logo-icon" size={24} />
//                         <span className="logo-text">CodeSolve</span>
//                     </div>
//                 </div>

//                 <div className="header-right">
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
//             <main className="solve-main">
//                 {/* Problem Panel */}
//                 <aside className="problem-sidebar">
//                     <ProblemPanel problem={problem} darkMode={darkMode} />
//                 </aside>

//                 {/* Code Editor Panel */}
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

//                     {/* Code Editor */}
//                     <div className="editor-container">
//                         <Editor
//                             height="100%"
//                             language={language}
//                             value={code}
//                             onChange={(value) => setCode(value)}
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
//             </main>
//         </div>
//     );
// }

// ------------------------------------------------------------------------------------------------------------------------

import Editor from "@monaco-editor/react";
import { useState, useEffect, useRef } from "react";
import { runCode, submitCode } from "../api/judge0";
import { useLocation } from "react-router-dom";
import ProblemPanel from "../components/ProblemPanel";
import { Play, Send, RotateCcw, Sun, Moon, Code2 } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import "../styles/SolveSolo.css";

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

export default function ProblemPage() {
    const [darkMode, setDarkMode] = useState(true);
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [problem, setProblem] = useState(null);
    const [starterCodes, setStarterCodes] = useState({});
    const [isRunning, setIsRunning] = useState(false);
    const [languageId, setLanguageId] = useState(71);
    const [language, setLanguage] = useState("python");
    const [editorHeight, setEditorHeight] = useState(60);

    const dividerRef = useRef(null);
    const containerRef = useRef(null);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const problemId = queryParams.get("id");

    let userId = null;
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
        const decoded = jwtDecode(jwt);
        userId = decoded.id;
    }

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

                console.log("Problem ", problem._id);
                console.log("userIds ", [userId]);
                await fetch("http://localhost:8080/api/submit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userIds: [userId],
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
        const newCode =
            starterCodes[languageId] ||
            defaultCodes[languageId] ||
            "// Start coding here...";
        setCode(newCode);
        setOutput("");
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
                                onChange={(value) => setCode(value)}
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
        </div>
    );
}
