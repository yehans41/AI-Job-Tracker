import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken, logout } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5050/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          logout();
          navigate('/login');
        } else {
          setError('Failed to load profile.');
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card mx-auto shadow-sm" style={{ maxWidth: '500px' }}>
        <div className="card-body">
          <h3 className="card-title mb-4 text-center">Your Profile</h3>
          <dl className="row">
            <dt className="col-sm-4">User ID:</dt>
            <dd className="col-sm-8">{profile.id}</dd>

            <dt className="col-sm-4">Email:</dt>
            <dd className="col-sm-8">{profile.email}</dd>

            <dt className="col-sm-4">Member Since:</dt>
            <dd className="col-sm-8">
              {new Date(profile.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
