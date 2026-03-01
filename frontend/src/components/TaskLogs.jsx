import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';
import './task-logs.css';

const TaskLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/logs');
      if (response.data.success) {
        setLogs(response.data.data);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError('Failed to fetch logs from server.');
    } finally {
      setLoading(false);
    }
  };

  const handleRerun = (log) => {
    navigate("/dashboard", {
      state: {
        rerunData: log.input_parameters,
        previousOutput: log.output_data,
        target: log.task_type === "summarize"
          ? "summarizer"
          : "generator"
      }
    });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="logs-wrapper">

      <div className="logs-header">
        <div>
          <h4>Automation Execution History</h4>
          <p>Monitor all AI task executions and system responses.</p>
        </div>

        <button
          className="logs-refresh-btn"
          onClick={fetchLogs}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh Logs"}
        </button>
      </div>

      {error && <div className="logs-error">{error}</div>}

      {loading ? (
        <div className="logs-loading">Loading logs...</div>
      ) : logs.length === 0 ? (
        <div className="logs-empty">
          No tasks have been executed yet.
        </div>
      ) : (
        <div className="logs-list">
          {logs.map((log) => (
            <div key={log.id} className="log-card">

              <div className="log-top">
                <div className="log-id">#{log.id}</div>

                <div className={`log-status ${log.status}`}>
                  {log.status.toUpperCase()}
                </div>
              </div>

              <div className="log-meta">
                <span className="log-type">
                  {log.task_type.toUpperCase()}
                </span>

                <span className="log-time">
                  {log.timestamp}
                </span>
              </div>

              {log.error_message && (
                <div className="log-error-msg">
                  {log.error_message}
                </div>
              )}

              <div className="log-input">
                <pre>
                  {JSON.stringify(
                    log.task_type === "summarize" && log.input_parameters.text
                      ? {
                        text:
                          log.input_parameters.text.slice(0, 100) + "..."
                      }
                      : log.input_parameters,
                    null,
                    2
                  )}
                </pre>
              </div>

              <div className="log-actions">
                <button
                  className="rerun-btn"
                  onClick={() => handleRerun(log)}
                >
                  Re-run
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default TaskLogs;