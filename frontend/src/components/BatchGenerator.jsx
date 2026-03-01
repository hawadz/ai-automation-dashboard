import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Table, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import './batch-generator.css';

const BatchGenerator = ({ rerunData, previousOutput }) => {
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

  useEffect(() => {
    if (rerunData) {
      setFormData({
        content_type: rerunData.content_type || '',
        genre: rerunData.genre || '',
        tone: rerunData.tone || '',
        count: rerunData.count || '',
        additional_context: rerunData.additional_context || ''
      });
    }
  }, [rerunData]);

  useEffect(() => {
    if (previousOutput) {
      setResults(previousOutput);
    }
  }, [previousOutput]);

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
    if (!results.length) return;

    const exportData = {
      metadata: {
        generated_at: new Date().toISOString(),
        content_type: formData.content_type,
        genre: formData.genre,
        tone: formData.tone,
        count: formData.count,
        additional_context: formData.additional_context
      },
      results: results
    };

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(exportData, null, 2));

    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute(
      "download",
      "generated_content.json"
    );

    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleExportCSV = () => {
    if (!results.length) return;

    const metadataRows = [
      `Content Type,${formData.content_type}`,
      `Genre,${formData.genre}`,
      `Tone,${formData.tone}`,
      `Count,${formData.count}`,
      `Additional Context,"${formData.additional_context.replace(/"/g, '""')}"`
    ];

    const separator = [""];

    const resultRows = [
      "No,Content",
      ...results.map(
        (item, i) => `${i + 1},"${item.replace(/"/g, '""')}"`
      )
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [...metadataRows, ...separator, ...resultRows].join("\n");

    const encodedUri = encodeURI(csvContent);

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "generated_content.csv");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="batch-wrapper">

      <div className="batch-header">
        <h4>Batch Content Generator</h4>
        <p>Generate multiple structured AI outputs in one request.</p>
      </div>

      <div className={`batch-card ${loading ? "loading-blur" : ""}`}>

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

      {loading && (
        <div className="batch-results skeleton-wrapper">
          <div className="skeleton-box skeleton-card"></div>
          <div className="skeleton-box skeleton-card"></div>
          <div className="skeleton-box skeleton-card"></div>
        </div>
      )}

      {results.length > 0 && (
        <div className="batch-results fade-in">
          <div className="results-header">
            <h5>Generation Results</h5>

            <div className="export-actions">
              <button className="export-btn" onClick={handleExport}>
                Export JSON
              </button>

              <button className="export-btn secondary" onClick={handleExportCSV}>
                Export CSV
              </button>
            </div>
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