import React, { useEffect } from "react";
import "./landing.css";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.2 }
    );

    reveals.forEach((el) => observer.observe(el));
  }, []);

  return (
    <div className="landing-wrapper">

      {/* NAVBAR */}
      <div className="landing-nav-wrapper">
        <div className="landing-nav">

          <div className="nav-logo">
            <div className="logo-badge">AI</div>
            <span className="logo-text">Agate AI Suite</span>
          </div>

          <div className="nav-menu">
            <span>Product</span>
            <span>Features</span>
            <span>Resources</span>
          </div>

          <div className="nav-actions">
            <button
              className="nav-primary"
              onClick={() => navigate("/dashboard")}
            >
              Launch Dashboard
            </button>
          </div>

        </div>
      </div>

      <section className="hero">

        {/* FLOATING ICONS */}
        <div className="floating-icon icon-1">
          <img src="/icons/icon-1.png" alt="automation" />
        </div>

        <div className="floating-icon icon-2">
          <img src="/icons/icon-2.png" alt="summary" />
        </div>

        <div className="floating-icon icon-3">
          <img src="/icons/icon-3.png" alt="analytics" />
        </div>

        <div className="floating-icon icon-4">
          <img src="/icons/icon-4.png" alt="workflow" />
        </div>

        {/* CENTER VISUAL CARD */}
        <div className="hero-visual">
          <div className="visual-card">
            <div className="visual-dot"></div>
            <div className="visual-dot"></div>
            <div className="visual-dot"></div>

            <div className="visual-line"></div>
            <div className="visual-line short"></div>

            <div className="visual-cta-bar"></div>
          </div>
        </div>

        {/* TEXT */}
        <div className="hero-content">
          <div className="hero-badge">
            AI Automation Suite for Game Studios
          </div>

          <h1>
            Smarter Content
            <br />
            Automation Pipeline
          </h1>

          <p>
            Centralize dialogue generation, document summarization,
            and AI execution logs in one secure and structured automation platform.
          </p>

          <button
            className="primary-cta"
            onClick={() => navigate("/dashboard")}
          >
            Try the Platform →
          </button>
        </div>

      </section>

      {/* STATS */}
      <section className="stats reveal">
        <div className="stat-card">
          <h2>75K+</h2>
          <p>Automated Content Generated</p>
        </div>

        <div className="stat-card">
          <h2>98%</h2>
          <p>Task Completion Accuracy</p>
        </div>

        <div className="stat-card">
          <h2>24/7</h2>
          <p>System Availability</p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features reveal">
        <h2>Built for Studio Teams</h2>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <img src="/icons/automation.png" alt="automation" />
            </div>
            <h4>Automated Content Generation</h4>
            <p>
              Generate multiple structured dialogue outputs in seconds.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <img src="/icons/analytics.png" alt="analytics" />
            </div>
            <h4>Execution Transparency</h4>
            <p>
              Track AI usage and task history for complete auditability.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <img src="/icons/security.png" alt="security" />
            </div>
            <h4>Secure & Structured</h4>
            <p>
              Built with API security and workflow integrity in mind.
            </p>
          </div>

        </div>
      </section>

      {/* CORE MODULES */}
      <section className="core-section reveal">

        <div className="core-wrapper">

          <div className="core-header">
            <span className="core-badge">Explore Features</span>
            <h2>
              Empower your workflow:
              <br />
              explore <span>all-in-one</span> platform.
            </h2>
            <p>
              Centralized AI content operations platform. Automate generation,
              monitor execution, and optimize production pipelines seamlessly.
            </p>
          </div>

          <div className="core-cards">

            <div className="core-box left">
              <div className="core-icon">
                <img src="/icons/workflow.png" alt="workflow" />
              </div>
              <h4>Batch Generator</h4>
              <p>
                Create multiple structured outputs in one secure request pipeline.
              </p>
            </div>

            <div className="core-box center">
              <div className="core-icon">
                <img src="/icons/summary.png" alt="summary" />
              </div>
              <h4>Document Intelligence</h4>
              <p>
                Extract insights and structured summaries from large datasets.
              </p>
            </div>

            <div className="core-box right">
              <div className="core-icon">
                <img src="/icons/dashboard.png" alt="logs" />
              </div>
              <h4>Execution Monitoring</h4>
              <p>
                Real-time logs, audit tracking, and execution transparency.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="cta-section reveal">
        <div className="cta-wrapper">

          <div className="cta-left">
            <span className="cta-badge">READY TO DIVE IN?</span>

            <h2>
              Boost your productivity.
              <br />
              Start using our app today.
            </h2>

            <p>
              Launch the automation dashboard and streamline
              AI content production with a secure workflow pipeline.
            </p>

            <ul className="cta-benefits">
              <li>✔ No coding required</li>
              <li>✔ Setup in minutes</li>
              <li>✔ 14-day free trial</li>
            </ul>

            <button
              className="cta-button"
              onClick={() => navigate("/dashboard")}
            >
              Get Started →
            </button>
          </div>

          <div className="cta-right">
            <div className="cta-mockup">
              <img src="/icons/dashboard-ai.png" alt="dashboard preview" />
            </div>
          </div>

        </div>
      </section>


      {/* FOOTER */}
      <footer className="footer">

        <div className="footer-top">

          <div className="footer-brand">
            <h4>Agate AI Suite</h4>
            <p>
              Professional automation tools designed for creative production teams.
            </p>
          </div>

          <div className="footer-col">
            <h5>Company</h5>
            <p>About</p>
            <p>Careers</p>
            <p>Blog</p>
            <p>Contact</p>
          </div>

          <div className="footer-col">
            <h5>Resources</h5>
            <p>Documentation</p>
            <p>Privacy Policy</p>
            <p>Security</p>
            <p>Terms</p>
          </div>

          <div className="footer-col newsletter">
            <h5>Newsletter</h5>
            <div className="newsletter-input">
              <input type="email" placeholder="Enter your email" />
              <button>Subscribe</button>
            </div>
            <p className="newsletter-desc">
              Get product updates and insights directly to your inbox.
            </p>
          </div>

        </div>

        <div className="footer-bottom">
          © 2026 Agate AI Automation System. All rights reserved.
        </div>

      </footer>

    </div>
  );
}