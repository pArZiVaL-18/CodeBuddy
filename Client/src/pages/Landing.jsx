import React, { useEffect, useRef } from "react";
import "../styles/CodeBuddy.css";
import { useNavigate } from "react-router-dom";

const CodeBuddy = () => {
    const subtitleRef = useRef(null);
    const Navigate = useNavigate();

    useEffect(() => {
        // Smooth scrolling for navigation links
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

        // Add animation on scroll
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

        // Observe all sections
        document.querySelectorAll("section").forEach((section) => {
            observer.observe(section);
        });

        // Add subtle parallax effect to hero background
        const handleScroll = () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector(".hero");
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        };

        window.addEventListener("scroll", handleScroll);

        // Add typing effect for hero subtitle
        const subtitle = subtitleRef.current;
        if (subtitle) {
            const text = subtitle.textContent;
            subtitle.textContent = "";
            let i = 0;

            setTimeout(() => {
                const typeWriter = setInterval(() => {
                    if (i < text.length) {
                        subtitle.textContent += text.charAt(i);
                        i++;
                    } else {
                        clearInterval(typeWriter);
                    }
                }, 50);
            }, 1000);
        }

        // Cleanup
        return () => {
            document.removeEventListener("click", handleAnchorClick);
            window.removeEventListener("scroll", handleScroll);
            observer.disconnect();
        };
    }, []);

    const handleFeatureCardHover = (e, isEntering) => {
        if (isEntering) {
            e.target.style.transform = "translateY(-10px) scale(1.02)";
        } else {
            e.target.style.transform = "translateY(0) scale(1)";
        }
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
                        <li>
                            <a href="#testimonials">Reviews</a>
                        </li>
                        <li>
                            <a href="#pricing">Pricing</a>
                        </li>
                    </ul>
                    <button
                        onClick={() => Navigate("/signup")}
                        className="nav-cta"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <h1>Practice DSA, Collaborate Live, Learn Together</h1>
                        <p className="hero-subtitle" ref={subtitleRef}>
                            Master Data Structures & Algorithms with real-time
                            collaboration, live code editing, and competitive
                            programming
                        </p>
                        <a href="#signup" className="hero-cta">
                            Join Now - It's Free
                        </a>
                    </div>
                </div>
                <div className="code-visual">
                    {`// DSA Problem: Two Sum
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
}`}
                </div>
            </section>

            {/* Features Section */}
            <section className="features" id="features">
                <div className="container">
                    <h2 className="section-title">
                        Powerful DSA Learning Platform
                    </h2>
                    <p className="section-subtitle">
                        Everything you need to master algorithms and data
                        structures through collaborative coding
                    </p>

                    <div className="features-grid">
                        <div
                            className="feature-card"
                            onMouseEnter={(e) =>
                                handleFeatureCardHover(e, true)
                            }
                            onMouseLeave={(e) =>
                                handleFeatureCardHover(e, false)
                            }
                        >
                            <div className="feature-icon">👥</div>
                            <h3>Real-time Code Collaboration</h3>
                            <p>
                                Code together in real-time with Monaco Editor.
                                Share ideas, debug together, and solve DSA
                                problems collaboratively using WebSocket
                                technology.
                            </p>
                        </div>

                        <div
                            className="feature-card"
                            onMouseEnter={(e) =>
                                handleFeatureCardHover(e, true)
                            }
                            onMouseLeave={(e) =>
                                handleFeatureCardHover(e, false)
                            }
                        >
                            <div className="feature-icon">⚡</div>
                            <h3>Instant Code Execution</h3>
                            <p>
                                Run your code instantly with Judge0 API
                                supporting 60+ languages including C, Java,
                                Python. Get immediate feedback on your
                                solutions.
                            </p>
                        </div>

                        <div
                            className="feature-card"
                            onMouseEnter={(e) =>
                                handleFeatureCardHover(e, true)
                            }
                            onMouseLeave={(e) =>
                                handleFeatureCardHover(e, false)
                            }
                        >
                            <div className="feature-icon">💬</div>
                            <h3>Live Chat System</h3>
                            <p>
                                Discuss algorithms and approaches with
                                room-based chat. Get real-time help from peers
                                and mentors while solving problems.
                            </p>
                        </div>

                        <div
                            className="feature-card"
                            onMouseEnter={(e) =>
                                handleFeatureCardHover(e, true)
                            }
                            onMouseLeave={(e) =>
                                handleFeatureCardHover(e, false)
                            }
                        >
                            <div className="feature-icon">🏆</div>
                            <h3>Competitive Leaderboard</h3>
                            <p>
                                Track your progress and compete with others.
                                Earn XP for solving problems and climb the
                                leaderboard rankings.
                            </p>
                        </div>

                        <div
                            className="feature-card"
                            onMouseEnter={(e) =>
                                handleFeatureCardHover(e, true)
                            }
                            onMouseLeave={(e) =>
                                handleFeatureCardHover(e, false)
                            }
                        >
                            <div className="feature-icon">📚</div>
                            <h3>Curated DSA Problems</h3>
                            <p>
                                Access a comprehensive library of Data
                                Structures and Algorithms problems ranging from
                                easy to expert level with detailed solutions.
                            </p>
                        </div>

                        {/* <div
                            className="feature-card"
                            onMouseEnter={(e) =>
                                handleFeatureCardHover(e, true)
                            }
                            onMouseLeave={(e) =>
                                handleFeatureCardHover(e, false)
                            }
                        >
                            <div className="feature-icon">🔍</div>
                            <h3>Discussion Forums</h3>
                            <p>
                                Engage in problem discussions, share different
                                approaches, upvote solutions, and learn from the
                                community's collective wisdom.
                            </p>
                        </div> */}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works" id="how-it-works">
                <div className="container">
                    <h2 className="section-title">How CodeBuddy Works</h2>
                    <p className="section-subtitle">
                        Master DSA through collaborative learning in three
                        simple steps
                    </p>

                    <div className="steps-container">
                        <div className="step">
                            <div className="step-number">1</div>
                            <h3>Sign Up & Join a Room</h3>
                            <p>
                                Create your account, browse our DSA problem
                                library, and either solve alone or create a
                                collaboration room to invite friends.
                            </p>
                        </div>

                        <div className="step">
                            <div className="step-number">2</div>
                            <h3>Code & Collaborate Live</h3>
                            <p>
                                Use our Monaco Editor to write code in real-time
                                with others. Chat, discuss approaches, and run
                                your code instantly with Judge0 API.
                            </p>
                        </div>

                        <div className="step">
                            <div className="step-number">3</div>
                            <h3>Learn & Compete</h3>
                            <p>
                                Submit solutions, earn XP, climb the
                                leaderboard, and engage in community discussions
                                to learn different problem-solving approaches.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials" id="testimonials">
                <div className="container">
                    <h2 className="section-title">
                        Loved by Developers Worldwide
                    </h2>
                    <p className="section-subtitle">
                        See what our community has to say about their CodeBuddy
                        experience
                    </p>

                    <div className="testimonials-grid">
                        <div className="testimonial-card">
                            <p className="testimonial-text">
                                "CodeBuddy revolutionized how I prepare for
                                coding interviews. The real-time collaboration
                                helped me understand different approaches to
                                solving algorithms problems."
                            </p>
                            <div className="testimonial-author">
                                <div className="author-avatar">AM</div>
                                <div className="author-info">
                                    <h4>Anika Miller</h4>
                                    <p>Software Engineer at Google</p>
                                </div>
                            </div>
                        </div>

                        <div className="testimonial-card">
                            <p className="testimonial-text">
                                "The live chat feature while solving DSA
                                problems is amazing. Being able to discuss
                                approaches with peers in real-time made learning
                                so much more effective."
                            </p>
                            <div className="testimonial-author">
                                <div className="author-avatar">RK</div>
                                <div className="author-info">
                                    <h4>Roshan Kumar</h4>
                                    <p>CS Student, IIT Delhi</p>
                                </div>
                            </div>
                        </div>

                        <div className="testimonial-card">
                            <p className="testimonial-text">
                                "The leaderboard system keeps me motivated to
                                solve more problems. The Monaco Editor with
                                instant code execution makes the whole
                                experience smooth and professional."
                            </p>
                            <div className="testimonial-author">
                                <div className="author-avatar">PG</div>
                                <div className="author-info">
                                    <h4>Priya Gupta</h4>
                                    <p>SDE at Microsoft</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section" id="signup">
                <div className="container">
                    <h2>Start Your DSA Journey Today</h2>
                    <p>
                        Join thousands of students and professionals mastering
                        Data Structures & Algorithms through collaborative
                        learning. Practice, compete, and grow together.
                    </p>
                    <a href="#" className="cta-button">
                        Get Started for Free
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer>
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h3>CodeBuddy</h3>
                            <p>
                                Your personal coding assistant that helps you
                                learn, collaborate, and build amazing projects.
                                Join our community of passionate developers.
                            </p>
                            <div className="social-links">
                                <a href="#">📘</a>
                                <a href="#">🐦</a>
                                <a href="#">💼</a>
                                <a href="#">📸</a>
                            </div>
                        </div>

                        <div className="footer-section">
                            <h3>Product</h3>
                            <p>
                                <a href="#">Features</a>
                            </p>
                            <p>
                                <a href="#">Pricing</a>
                            </p>
                            <p>
                                <a href="#">API</a>
                            </p>
                            <p>
                                <a href="#">Integrations</a>
                            </p>
                        </div>

                        <div className="footer-section">
                            <h3>Resources</h3>
                            <p>
                                <a href="#">Documentation</a>
                            </p>
                            <p>
                                <a href="#">Tutorials</a>
                            </p>
                            <p>
                                <a href="#">Blog</a>
                            </p>
                            <p>
                                <a href="#">Community</a>
                            </p>
                        </div>

                        <div className="footer-section">
                            <h3>Company</h3>
                            <p>
                                <a href="#">About</a>
                            </p>
                            <p>
                                <a href="#">Careers</a>
                            </p>
                            <p>
                                <a href="#">Privacy Policy</a>
                            </p>
                            <p>
                                <a href="#">Terms of Service</a>
                            </p>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>&copy; 2025 CodeBuddy. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CodeBuddy;
