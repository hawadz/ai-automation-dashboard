import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BatchGenerator from "../BatchGenerator";
import DocumentSummarizer from "../DocumentSummarizer";
import TaskLogs from "../TaskLogs";
import "./dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [active, setActive] = useState("generator");
  const [darkMode, setDarkMode] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [stats, setStats] = useState({
    generated: 0,
    success_rate: 0,
    active_tasks: 0,
    avg_duration: "0s",
  });

  /* LOAD THEME */
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark-mode");
    }
  }, []);

  /* APPLY THEME */
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  /* FETCH DASHBOARD STATS */
  const fetchStats = () => {
    fetch("http://localhost:5000/api/dashboard-stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
      })
      .catch((err) => {
        console.error("Failed to fetch stats:", err);
      });
  };

  useEffect(() => {
    fetchStats();

    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (location.state?.target) {
      setActive(location.state.target);
    }
  }, [location.state]);

  /* CONTENT SWITCH */
  const renderContent = () => {
    switch (active) {
      case "generator":
        return (
          <BatchGenerator
            rerunData={location.state?.rerunData}
            previousOutput={location.state?.previousOutput}
          />
        );
      case "summarizer":
        return (
          <DocumentSummarizer
            rerunData={location.state?.rerunData}
            previousOutput={location.state?.previousOutput}
          />
        );
      case "logs":
        return <TaskLogs />;
      default:
        return <BatchGenerator />;
    }
  };

  return (
    <div className={`dashboard-layout ${collapsed ? "collapsed" : ""}`}>

      {/* FLOAT COLLAPSE BUTTON */}
      <button
        className="collapse-floating"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? "›" : "‹"}
      </button>

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div>
          <div className="logo" onClick={() => navigate("/")}>
            <div className="logo-circle">AI</div>
            {!collapsed && <span>Agate AI Suite</span>}
          </div>

          <div className="nav-section">

            <div
              className={`nav-item ${active === "generator" ? "active" : ""}`}
              onClick={() => setActive("generator")}
            >
              <img src="/icons/workflow.png" alt="" />
              {!collapsed && <span>Batch Generator</span>}
            </div>

            <div
              className={`nav-item ${active === "summarizer" ? "active" : ""}`}
              onClick={() => setActive("summarizer")}
            >
              <img src="/icons/summary.png" alt="" />
              {!collapsed && <span>Document Summarizer</span>}
            </div>

            <div
              className={`nav-item ${active === "logs" ? "active" : ""}`}
              onClick={() => setActive("logs")}
            >
              <img src="/icons/analytics.png" alt="" />
              {!collapsed && <span>Task Logs</span>}
            </div>

          </div>
        </div>

        {!collapsed && (
          <div className="theme-switch">

            <button
              className={`theme-option ${!darkMode ? "active" : ""}`}
              onClick={() => setDarkMode(false)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              Light
            </button>

            <button
              className={`theme-option ${darkMode ? "active" : ""}`}
              onClick={() => setDarkMode(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  d="M21 12.79A9 9 0 1111.21 3
                     7 7 0 0021 12.79z"
                  fill="currentColor"
                />
              </svg>
              Dark
            </button>

          </div>
        )}

      </aside>

      {/* MAIN AREA */}
      <main className="main-content">

        {/* KPI */}
        <div className="kpi-row">

          <div className="kpi-card">
            <h6>Generated Content</h6>
            <h3>{stats.generated}</h3>
            <span className="kpi-up">From database</span>
          </div>

          <div className="kpi-card">
            <h6>Success Rate</h6>
            <h3>{stats.success_rate}%</h3>
            <span className="kpi-up">Based on logs</span>
          </div>

          <div className="kpi-card">
            <h6>Active Tasks (Today)</h6>
            <h3>{stats.active_tasks}</h3>
            <span className="kpi-neutral">Today</span>
          </div>

          <div className="kpi-card">
            <h6>Avg Duration</h6>
            <h3>{stats.avg_duration}</h3>
            <span className="kpi-up">Measured runtime</span>
          </div>

        </div>

        <div className="content-card">
          {renderContent()}
        </div>

      </main>
    </div>
  );
}