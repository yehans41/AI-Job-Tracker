import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchJobs = async () => {
      try {
        const res = await axios.get('http://localhost:5050/api/jobs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setJobs(res.data);
      } catch (err) {
        setError('Failed to fetch jobs');
      }
    };

    fetchJobs();
  }, [navigate]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {jobs.length === 0 ? (
        <p>No jobs saved yet.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Position</th>
              <th>Company</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id}>
                <td>{job.position}</td>
                <td>{job.company}</td>
                <td>{job.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}