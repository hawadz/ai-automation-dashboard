import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Spinner, Alert, Card, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import './document-summarizer.css';

const DocumentSummarizer = ({ rerunData, previousOutput }) => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState(null);
  const [oldSummary, setOldSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const resultRef = useRef(null);
  const [viewMode, setViewMode] = useState("current");

  useEffect(() => {
    if (rerunData?.text) {
      setText(rerunData.text);
    }

    if (previousOutput) {
      setSummary(previousOutput);
      setOldSummary(previousOutput);
    }
  }, [rerunData, previousOutput]);


  useEffect(() => {
    if (summary && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [summary]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      setText(event.target.result);
    };

    reader.readAsText(file);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!text.trim()) {
      setShowValidationModal(true);
      return;
    }

    if (summary) {
      setOldSummary(summary);
    }

    setViewMode("current");
    setLoading(true);
    setError(null);

    try {

      const response = await axios.post('http://127.0.0.1:5000/api/summarize', { text });

      if (response.data.success) {
        setSummary(response.data.data);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="summarizer-wrapper">

      <div className="summarizer-header">
        <h4>Document Summarizer</h4>
        <p>Extract key insights from long game design documents or lore.</p>
      </div>

      <div className="summarizer-card">

        <Form onSubmit={handleSubmit}>

          <Form.Group className="mb-3">
            <Form.Label>Upload .txt File (Optional)</Form.Label>
            <Form.Control
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Paste Document Text</Form.Label>
            <Form.Control
              as="textarea"
              rows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={loading}
            />
          </Form.Group>

          <div className="summarizer-actions">
            <button
              className="btn-primary-custom"
              disabled={loading}
            >
              {loading ? "Summarizing..." : "Summarize Document"}
            </button>
          </div>

        </Form>

      </div>

      {loading && (
        <div className="summary-results skeleton-wrapper">
          <div className="skeleton-box skeleton-tldr"></div>

          <div className="summary-grid">
            <div className="skeleton-box skeleton-card"></div>
            <div className="skeleton-box skeleton-card"></div>
          </div>
        </div>
      )}

      {summary && !loading && (
        <div className="summary-results fade-in" ref={resultRef}>

          {summary && (
            <div className="previous-actions">

              {oldSummary && oldSummary === summary && (
                <span className="status-chip">
                  Viewing previous result
                </span>
              )}

              <button
                className="btn-primary-custom btn-sm"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Summarizing..." : "Regenerate"}
              </button>

            </div>
          )}

          {/* ===== CURRENT VIEW ===== */}
          {viewMode === "current" && (
            <>
              <div className="tldr-box">
                <h6>Summary Overview</h6>
                <p>{summary?.tldr}</p>
              </div>

              <div className="summary-grid">
                <div className="summary-card">
                  <h6>Key Points</h6>
                  <ul>
                    {summary?.key_points?.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div className="summary-card">
                  <h6>Action Items</h6>
                  {summary?.action_items?.length > 0 ? (
                    <ul>
                      {summary.action_items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="empty-text">No action items found.</p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ===== PREVIOUS VIEW ===== */}
          {viewMode === "previous" && oldSummary && (
            <>
              <div className="tldr-box">
                <h6>Summary Overview</h6>
                <p>{oldSummary?.tldr}</p>
              </div>

              <div className="summary-grid">
                <div className="summary-card">
                  <h6>Key Points</h6>
                  <ul>
                    {oldSummary?.key_points?.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div className="summary-card">
                  <h6>Action Items</h6>
                  {oldSummary?.action_items?.length > 0 ? (
                    <ul>
                      {oldSummary.action_items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="empty-text">No action items found.</p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ===== COMPARE VIEW ===== */}
          {viewMode === "compare" && oldSummary && (
            <div className="compare-grid">

              {/* ===== NEW RESULT ===== */}
              <div className="summary-column">
                <h6 className="compare-title new">New Result</h6>

                <div className="tldr-box">
                  <h6>Summary Overview</h6>
                  <p>{summary?.tldr}</p>
                </div>

                <div className="summary-card">
                  <h6>Key Points</h6>
                  <ul>
                    {summary?.key_points?.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div className="summary-card">
                  <h6>Action Items</h6>
                  {summary?.action_items?.length > 0 ? (
                    <ul>
                      {summary.action_items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="empty-text">No action items found.</p>
                  )}
                </div>
              </div>

              {/* ===== PREVIOUS RESULT ===== */}
              <div className="summary-column">
                <h6 className="compare-title previous">Previous Result</h6>

                <div className="tldr-box">
                  <h6>Summary Overview</h6>
                  <p>{oldSummary?.tldr}</p>
                </div>

                <div className="summary-card">
                  <h6>Key Points</h6>
                  <ul>
                    {oldSummary?.key_points?.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div className="summary-card">
                  <h6>Action Items</h6>
                  {oldSummary?.action_items?.length > 0 ? (
                    <ul>
                      {oldSummary.action_items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="empty-text">No action items found.</p>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ===== BOTTOM TOGGLE ===== */}
          {oldSummary && summary && oldSummary !== summary && (
            <div className="bottom-toggle-wrapper">
              <div className="view-toggle">
                <button
                  className={viewMode === "current" ? "active" : ""}
                  onClick={() => setViewMode("current")}
                >
                  Current
                </button>
                <button
                  className={viewMode === "previous" ? "active" : ""}
                  onClick={() => setViewMode("previous")}
                >
                  Previous
                </button>
                <button
                  className={viewMode === "compare" ? "active" : ""}
                  onClick={() => setViewMode("compare")}
                >
                  Compare
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {
        showValidationModal && (
          <div className="custom-modal-overlay">
            <div className="custom-modal">

              <div className="modal-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M12 9v4" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 17h.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2" />
                </svg>
              </div>

              <h4>Text Required</h4>
              <p>Please enter or upload a document before summarizing.</p>

              <div className="modal-actions">
                <button
                  className="modal-btn cancel"
                  onClick={() => setShowValidationModal(false)}
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )
      }
    </div >
  );
};

export default DocumentSummarizer;