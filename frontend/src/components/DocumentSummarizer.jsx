import React, { useState } from 'react';
import { Form, Button, Spinner, Alert, Card, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import './document-summarizer.css';

const DocumentSummarizer = () => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Please enter some text to summarize.");
      return;
    }

    setLoading(true);
    setError(null);
    setSummary(null);

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

      {summary && (
        <div className="summary-results">

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

        </div>
      )}

    </div>
  );
};

export default DocumentSummarizer;