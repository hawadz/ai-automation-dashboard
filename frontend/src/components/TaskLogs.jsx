import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './task-logs.css';

const TaskLogs = () => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 5;
  const [showFilter, setShowFilter] = useState(false);
  const dropdownRef = useRef(null);

  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    dateFrom: "",
    dateTo: "",
    sort: "newest"
  });

  const activeFiltersCount =
    (filters.type !== "all" ? 1 : 0) +
    (filters.status !== "all" ? 1 : 0) +
    (filters.dateFrom ? 1 : 0) +
    (filters.dateTo ? 1 : 0);

  const clearFilters = () => {
    setFilters({
      type: "all",
      status: "all",
      dateFrom: "",
      dateTo: "",
      sort: "newest"
    });
  };

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

  const openDeleteModal = (id) => {
    setSelectedLogId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/logs/${selectedLogId}`);
      fetchLogs();
    } catch (err) {
      console.error(err);
    } finally {
      setShowDeleteModal(false);
      setSelectedLogId(null);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest(".filter-btn")
      ) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const filteredLogs = logs
    .filter((log) => {

      const matchesType =
        filters.type === "all" ||
        log.task_type === filters.type;

      const matchesStatus =
        filters.status === "all" ||
        log.status === filters.status;

      const matchesSearch =
        searchTerm === "" ||
        JSON.stringify(log).toLowerCase().includes(searchTerm.toLowerCase());

      const logDate = new Date(log.timestamp);

      const matchesFrom =
        !filters.dateFrom || logDate >= new Date(filters.dateFrom);

      const matchesTo =
        !filters.dateTo || logDate <= new Date(filters.dateTo + "T23:59:59");

      return (
        matchesType &&
        matchesStatus &&
        matchesSearch &&
        matchesFrom &&
        matchesTo
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return filters.sort === "newest"
        ? dateB - dateA
        : dateA - dateB;
    });

  const indexOfLast = currentPage * logsPerPage;
  const indexOfFirst = indexOfLast - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  return (
    <div className="logs-wrapper">

      <div className="logs-header">
        <div>
          <h4>Automation Execution History</h4>
          <p>Monitor all AI task executions and system responses.</p>
        </div>

        <div className="logs-actions">

          <input
            type="text"
            placeholder="Search keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="logs-search"
          />

          <button
            className="filter-btn"
            onClick={() => setShowFilter(prev => !prev)}
          >
            Filter
            {activeFiltersCount > 0 && (
              <span className="filter-badge">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <button
            className="logs-refresh-btn"
            onClick={fetchLogs}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh Logs"}
          </button>

          <div
            className={`filter-dropdown ${showFilter ? "show" : ""}`}
            ref={dropdownRef}
          >

            <div className="filter-group">
              <label>Task Type</label>
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
              >
                <option value="all">All Types</option>
                <option value="generate">Generate</option>
                <option value="summarize">Summarize</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Status</label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="failure">Failed</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Date From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) =>
                  setFilters({ ...filters, dateFrom: e.target.value })
                }
              />
            </div>

            <div className="filter-group">
              <label>Date To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) =>
                  setFilters({ ...filters, dateTo: e.target.value })
                }
              />
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select
                value={filters.sort}
                onChange={(e) =>
                  setFilters({ ...filters, sort: e.target.value })
                }
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
            <div className="filter-footer">
              <button
                className="clear-btn"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>

        </div>
      </div>

      {error && <div className="logs-error">{error}</div>}

      {loading ? (
        <div className="logs-list skeleton-wrapper">
          <div className="skeleton-box skeleton-card"></div>
          <div className="skeleton-box skeleton-card"></div>
          <div className="skeleton-box skeleton-card"></div>
        </div>

      ) : logs.length === 0 ? (
        <div className="logs-empty">
          No tasks have been executed yet.
        </div>
      ) : (
        <div className="logs-list">
          {currentLogs.map((log) => (
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

              <div className="log-section">
                <div className="log-label">Input</div>
                <div className="log-json">
                  <pre>
                    {JSON.stringify(
                      log.task_type === "summarize" &&
                        log.input_parameters?.text
                        ? {
                          ...log.input_parameters,
                          text:
                            log.input_parameters.text.length > 100
                              ? log.input_parameters.text.slice(0, 100) + "..."
                              : log.input_parameters.text
                        }
                        : log.input_parameters,
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>

              {log.status === "success" && log.output_data && (
                <div className="log-section">
                  <div className="log-label output">Output</div>
                  <div className="log-json output-box">
                    <pre>
                      {JSON.stringify(log.output_data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              <div className="log-actions">
                <button
                  className="rerun-btn"
                  onClick={() => handleRerun(log)}
                >
                  Re-run
                </button>

                <button
                  className="delete-btn"
                  onClick={() => openDeleteModal(log.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Prev
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      )}

      {showDeleteModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">

            <div className="modal-icon">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#e33339"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            </div>

            <h5>Are you sure?</h5>
            <p>This log will be deleted permanently.</p>

            <div className="modal-actions">
              <button
                className="modal-btn cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>

              <button
                className="modal-btn danger"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default TaskLogs;