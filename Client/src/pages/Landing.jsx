import React, { useEffect, useRef, useState } from "react";
import "../styles/Landing.css";
import { useNavigate } from "react-router-dom";

const Landing = () => {
    const codeRef = useRef(null);
    const navigate = useNavigate();

    // State for subtitle text
    const [subtitleText, setSubtitleText] = useState("");
    const fullSubtitle =
        "with real-time collaboration, live code editing, and competitive programming";

    // NEW: Authentication check
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // NEW: Check if user is logged in on mount
    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        setIsLoggedIn(!!jwt);
    }, []);

    // Subtitle typing animation using state
    useEffect(() => {
        let index = 0;

        const startTyping = setTimeout(() => {
            const typeInterval = setInterval(() => {
                if (index <= fullSubtitle.length) {
                    setSubtitleText(fullSubtitle.slice(0, index));
                    index++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 50);

            return () => clearInterval(typeInterval);
        }, 1000);

        return () => clearTimeout(startTyping);
    }, []);

    // Code typing animation
    useEffect(() => {
        const codeBlock = codeRef.current;
        if (!codeBlock) return;

        const codeText = `// DSA Problem: Two Sum
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`;

        codeBlock.textContent = "";
        let index = 0;
        let intervalId = null;

        const timeout = setTimeout(() => {
            intervalId = setInterval(() => {
                if (index < codeText.length) {
                    codeBlock.textContent += codeText.charAt(index);
                    index++;
                    codeBlock.scrollTop = codeBlock.scrollHeight;
                } else {
                    clearInterval(intervalId);
                }
            }, 30);
        }, 2000);

        return () => {
            clearTimeout(timeout);
            if (intervalId) clearInterval(intervalId);
        };
    }, []);

    // Smooth scrolling and intersection observer
    useEffect(() => {
        const handleAnchorClick = (e) => {
            const href = e.target.getAttribute("href");
            if (href && href.startsWith("#")) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
            }
        };

        document.addEventListener("click", handleAnchorClick);

        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px",
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate-in");
                }
            });
        }, observerOptions);

        document.querySelectorAll("section").forEach((section) => {
            observer.observe(section);
        });

        return () => {
            document.removeEventListener("click", handleAnchorClick);
            observer.disconnect();
        };
    }, []);

    // Add this useState at the top with other state
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Add this useEffect for scroll-to-top button
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.pageYOffset > 400);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // Add this button before the closing </div> of codebuddy-app
    {
        showScrollTop && (
            <button
                className="scroll-to-top"
                onClick={scrollToTop}
                aria-label="Scroll to top"
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                >
                    <path d="M18 15l-6-6-6 6" />
                </svg>
            </button>
        );
    }

    const handleNavigation = () => {
        if (isLoggedIn) navigate("/dashboard");
        else navigate("/signup");
    };

    return (
        <div className="codebuddy-app">
            {/* Navigation */}
            <nav>
                <div className="nav-container">
                    <div className="logo">CodeBuddy</div>
                    <ul className="nav-links">
                        <li>
                            <a href="#features">Features</a>
                        </li>
                        <li>
                            <a href="#how-it-works">How It Works</a>
                        </li>
                    </ul>
                    {/* NEW: Dynamic nav button based on login status */}
                    {isLoggedIn ? (
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="nav-cta-button"
                        >
                            Dashboard
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate("/login")}
                            className="nav-cta-button"
                        >
                            Login
                        </button>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero" id="home">
                <div className="container">
                    <div className="hero-content">
                        <h1>Master Data Structures & Algorithms</h1>
                        <p className="hero-subtitle">{subtitleText}</p>
                        <button
                            onClick={handleNavigation}
                            className="hero-cta"
                            aria-label="Start coding now"
                        >
                            Start Coding Now
                        </button>
                    </div>

                    {/* Code Visual */}
                    <div className="code-visual-container">
                        <div className="code-visual">
                            <div className="code-header">
                                <div className="code-dots">
                                    <span className="dot red"></span>
                                    <span className="dot yellow"></span>
                                    <span className="dot green"></span>
                                </div>
                                <div className="code-title">solution.js</div>
                                <div className="code-language">JavaScript</div>
                            </div>
                            <div className="code-body">
                                <pre>
                                    <code ref={codeRef}></code>
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features" id="features">
                <div className="container">
                    <h2 className="section-title">Powerful Features</h2>
                    <p className="section-subtitle">
                        Everything you need to master algorithms and data
                        structures through collaborative coding
                    </p>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">💻</div>
                            <h3>Real-time Collaboration</h3>
                            <p>
                                Code together in real-time with Monaco Editor.
                                Share ideas, debug together, and solve DSA
                                problems collaboratively using WebSocket
                                technology.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">⚡</div>
                            <h3>Instant Code Execution</h3>
                            <p>
                                Run your code instantly with Judge0 API
                                supporting 60+ languages including C, Java,
                                Python. Get immediate feedback on your
                                solutions.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💬</div>
                            <h3>Interactive Chat</h3>
                            <p>
                                Discuss algorithms and approaches with
                                room-based chat. Get real-time help from peers
                                and mentors while solving problems.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🏆</div>
                            <h3>Leaderboard & XP</h3>
                            <p>
                                Track your progress and compete with others.
                                Earn XP for solving problems and climb the
                                leaderboard rankings.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📚</div>
                            <h3>Comprehensive Library</h3>
                            <p>
                                Access a comprehensive library of Data
                                Structures and Algorithms problems ranging from
                                easy to expert level with detailed solutions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works" id="how-it-works">
                <div className="container">
                    <h2 className="section-title">How It Works</h2>
                    <p className="section-subtitle">
                        Master DSA through collaborative learning in three
                        simple steps
                    </p>
                    <div className="steps-container">
                        <div className="step">
                            <div className="step-number">1</div>
                            <h3>Sign Up & Browse</h3>
                            <p>
                                Create your account, browse our DSA problem
                                library, and either solve alone or create a
                                collaboration room to invite friends.
                            </p>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <h3>Code & Collaborate</h3>
                            <p>
                                Use our Monaco Editor to write code in real-time
                                with others. Chat, discuss approaches, and run
                                your code instantly with Judge0 API.
                            </p>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <h3>Submit & Learn</h3>
                            <p>
                                Submit solutions, earn XP, climb the
                                leaderboard, and engage in community discussions
                                to learn different problem-solving approaches.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <h2>Ready to Master DSA?</h2>
                    <p>
                        Join thousands of students and professionals mastering
                        Data Structures & Algorithms through collaborative
                        learning. Practice, compete, and grow together.
                    </p>
                    <button
                        onClick={() => handleNavigation("/signup")}
                        className="cta-button"
                        aria-label="Get started for free"
                    >
                        <span>Get Started Free</span>
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer>
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h3>CodeBuddy</h3>
                            <p>
                                Master Data Structures & Algorithms through
                                collaborative learning and competitive
                                programming.
                            </p>
                        </div>
                        <div className="footer-section">
                            <h3>Quick Links</h3>
                            <a href="#features">Features</a>
                            <a href="#how-it-works">How It Works</a>
                        </div>
                        <div className="footer-section">
                            <h3>Connect with Us</h3>
                            <div className="social-links">
                                <a
                                    href="http://www.linkedin.com/in/sujaldawande25"
                                    aria-label="GitHub"
                                >
                                    SD
                                </a>
                                <a href="#" aria-label="Twitter">
                                    VG
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/roshan-malkar-8670b4218/"
                                    aria-label="LinkedIn"
                                >
                                    RM
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2024 CodeBuddy. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
