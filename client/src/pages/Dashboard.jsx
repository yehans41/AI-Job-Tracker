// client/src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: 'saved',
    notes: '',
  });
  const navigate = useNavigate();

  // NEW: states for Cover Letter feature
  const [coverLetter, setCoverLetter] = useState('');
  const [loadingCover, setLoadingCover] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  // Fetch jobs on mount
  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchJobs = async () => {
      try {
        const res = await axios.get('http://localhost:5050/api/jobs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data);
      } catch (err) {
        setError('Failed to fetch jobs');
      }
    };

    fetchJobs();
  }, [navigate]);

  // DELETE handler
  const handleDelete = async (id) => {
    const token = getToken();
    try {
      await axios.delete(`http://localhost:5050/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs((prev) => prev.filter((job) => job.id !== id));
    } catch (err) {
      setError('Failed to delete job');
    }
  };

  // When “Edit” is clicked…
  const handleEditClick = (job) => {
    setEditingJob(job);
    setFormData({
      company: job.company || '',
      position: job.position || '',
      status: job.status || 'saved',
      notes: job.notes || '',
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    try {
      const res = await axios.put(
        `http://localhost:5050/api/jobs/${editingJob.id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setJobs((prev) =>
        prev.map((job) => (job.id === editingJob.id ? res.data : job))
      );
      setEditingJob(null);
    } catch (err) {
      setError('Failed to update job');
    }
  };

  const handleCancel = () => {
    setEditingJob(null);
    setError('');
  };

  // NEW: Generate Cover Letter handler (calls HF backend)
  const handleGenerateCoverLetter = async (jobId) => {
    const token = getToken();
    setLoadingCover(true);
    setCoverLetter('');
    setSelectedJobId(jobId);

    try {
      const res = await axios.post(
        'http://localhost:5050/api/ai/cover-letter',
        { jobId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCoverLetter(res.data.coverLetter);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to generate cover letter. Please try again.'
      );
    } finally {
      setLoadingCover(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Dashboard</h2>

      {/* --- Add Job Form --- */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Add New Job</h5>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const token = getToken();
              try {
                const res = await axios.post(
                  'http://localhost:5050/api/jobs',
                  {
                    company: e.target.company.value,
                    position: e.target.position.value,
                    status: e.target.status.value,
                    notes: e.target.notes.value,
                  },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                setJobs((prev) => [res.data, ...prev]);
                e.target.reset();
              } catch (err) {
                setError('Failed to add job');
              }
            }}
          >
            <div className="row g-3">
              <div className="col-md-4">
                <label htmlFor="company" className="form-label">
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="position" className="form-label">
                  Position
                </label>
                <input
                  id="position"
                  name="position"
                  type="text"
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="form-select"
                  defaultValue="saved"
                >
                  <option value="saved">Saved</option>
                  <option value="applied">Applied</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="col-12">
                <label htmlFor="notes" className="form-label">
                  Notes
                </label>
                <input
                  id="notes"
                  name="notes"
                  type="text"
                  className="form-control"
                />
              </div>
            </div>
            <button type="submit" className="btn btn-success mt-3">
              Add Job
            </button>
          </form>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* --- Edit Job Form (shown only when editingJob is truthy) --- */}
      {editingJob && (
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">Edit Job: {editingJob.position}</h5>
            <form onSubmit={handleEditSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="company" className="form-label">
                    Company
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    className="form-control"
                    value={formData.company}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="position" className="form-label">
                    Position
                  </label>
                  <input
                    id="position"
                    name="position"
                    type="text"
                    className="form-control"
                    value={formData.position}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="status" className="form-label">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="form-select"
                    value={formData.status}
                    onChange={handleEditChange}
                    required
                  >
                    <option value="saved">Saved</option>
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="notes" className="form-label">
                    Notes
                  </label>
                  <input
                    id="notes"
                    name="notes"
                    type="text"
                    className="form-control"
                    value={formData.notes}
                    onChange={handleEditChange}
                  />
                </div>
              </div>
              <div className="mt-4 d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Jobs Table --- */}
      {jobs.length === 0 ? (
        <p>No jobs saved yet.</p>
      ) : (
        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th>Position</th>
              <th>Company</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.position}</td>
                <td>{job.company}</td>
                <td>{job.status}</td>
                <td>{job.notes || '—'}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEditClick(job)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger me-2"
                    onClick={() => handleDelete(job.id)}
                  >
                    Delete
                  </button>
                  {/* NEW: Cover Letter Button */}
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => handleGenerateCoverLetter(job.id)}
                  >
                    {loadingCover && selectedJobId === job.id ? (
                      <span
                        className="spinner-border spinner-border-sm me-1"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : null}
                    Cover Letter
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* NEW: Cover Letter Output Card */}
      {coverLetter && (
        <div className="card mt-4 shadow-sm">
          <div className="card-header">
            <strong>Generated Cover Letter</strong>
          </div>
          <div className="card-body">
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
              {coverLetter}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
