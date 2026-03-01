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
  const [isViewingPrevious, setIsViewingPrevious] = useState(false);
  const resultRef = useRef(null);

  useEffect(() => {
    if (rerunData?.text) {
      setText(rerunData.text);
    }

    if (previousOutput) {
      setSummary(previousOutput);
      setOldSummary(previousOutput);
      setIsViewingPrevious(true);
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
      setError("Please enter some text to summarize.");
      return;
    }

    if (summary) {
      setOldSummary(summary);
    }

    setLoading(true);
    setError(null);
    setIsViewingPrevious(false);

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

      <div className={`summarizer-card ${loading ? "loading-blur" : ""}`}>

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
              placeholder="Paste your long document text here..."
            />
          </Form.Group>

          <button className="summarizer-btn" disabled={loading}>
            {loading ? "Summarizing..." : "Summarize Document →"}
          </button>

        </Form>

        {error && <div className="summarizer-error">{error}</div>}

      </div>

      {isViewingPrevious && (
        <div className="previous-label">
          Viewing previous result
        </div>
      )}

      {isViewingPrevious && (
        <button
          className="regenerate-btn"
          onClick={handleSubmit}
        >
          Regenerate
        </button>
      )}

      {loading && (
        <div className="summary-results skeleton-wrapper">
          <div className="skeleton-box skeleton-tldr"></div>

          <div className="summary-grid">
            <div className="skeleton-box skeleton-card"></div>
            <div className="skeleton-box skeleton-card"></div>
          </div>
        </div>
      )}

      {summary && (
        <div className="summary-results fade-in" ref={resultRef}>

          {oldSummary && oldSummary !== summary ? (
            <div className="compare-grid">

              <div className="summary-card">
                <h6>Previous</h6>
                <div className="tldr-box">
                  <p>{oldSummary?.tldr}</p>
                </div>
              </div>

              <div className="summary-card">
                <h6>New</h6>
                <div className="tldr-box">
                  <p>{summary?.tldr}</p>
                </div>
              </div>

            </div>
          ) : (
            <>
              <div className="tldr-box">
                <h6>TL;DR</h6>
                <p>{summary.tldr}</p>
              </div>

              <div className="summary-grid">
                <div className="summary-card">
                  <h6>Key Points</h6>
                  <ul>
                    {summary.key_points?.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div className="summary-card">
                  <h6>Action Items</h6>
                  {summary.action_items?.length > 0 ? (
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

        </div>
      )}

    </div>
  );
};

export default DocumentSummarizer;