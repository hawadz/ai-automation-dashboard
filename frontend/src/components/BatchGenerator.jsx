import React, { useState } from 'react';
import { Form, Button, Row, Col, Table, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import './batch-generator.css';

const BatchGenerator = () => {
  const [formData, setFormData] = useState({
    content_type: '',
    genre: '',
    tone: '',
    count: '',
    additional_context: ''
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/generate', formData);
      if (response.data.success) {
        setResults(response.data.data);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal terhubung ke server backend');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "generated_content.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
  return (
    <div className="batch-wrapper">

      <div className="batch-header">
        <h4>Batch Content Generator</h4>
        <p>Generate multiple structured AI outputs in one request.</p>
      </div>

      <div className="batch-card">

        <Form onSubmit={handleSubmit}>

          <div className="batch-grid">
            <Form.Group>
              <Form.Label>Content Type</Form.Label>
              <Form.Control
                type="text"
                name="content_type"
                value={formData.content_type}
                onChange={handleChange}
                placeholder="e.g. NPC dialogue lines"
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Genre</Form.Label>
              <Form.Control
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                placeholder="e.g. Fantasy, Sci-Fi"
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Tone</Form.Label>
              <Form.Control
                type="text"
                name="tone"
                value={formData.tone}
                onChange={handleChange}
                placeholder="e.g. Neutral, Dark, Humorous"
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Item Count</Form.Label>
              <Form.Control
                type="number"
                name="count"
                value={formData.count}
                onChange={handleChange}
                min="1"
                max="10"
                required
              />
            </Form.Group>
          </div>

          <Form.Group className="mt-3">
            <Form.Label>Additional Context</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="additional_context"
              value={formData.additional_context}
              onChange={handleChange}
              placeholder="Describe the character personality, background, etc..."
            />
          </Form.Group>

          <button className="batch-btn" disabled={loading}>
            {loading ? "Generating..." : "Generate Content →"}
          </button>

        </Form>

        {error && <div className="batch-error">{error}</div>}

      </div>

      {results.length > 0 && (
        <div className="batch-results">

          <div className="results-header">
            <h5>Generation Results</h5>
            <button className="export-btn" onClick={handleExport}>
              Export JSON
            </button>
          </div>

          {results.map((item, index) => (
            <div key={index} className="result-card">
              <span className="result-number">{index + 1}</span>
              <div
                contentEditable
                suppressContentEditableWarning
                className="result-content"
              >
                {item}
              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default BatchGenerator;