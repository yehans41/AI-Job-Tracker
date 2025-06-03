// client/src/components/Navbar.jsx

import { Link, useNavigate } from 'react-router-dom';
import { isLoggedIn, logout } from '../api/auth';

export default function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();            // remove token
    navigate('/login');  // redirect to login page
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          AI Job Tracker
        </Link>

        <div>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {isLoggedIn() ? (
              // If logged in, show Logout
              <li className="nav-item">
                <button
                  className="btn btn-outline-light"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            ) : (
              // If not logged in, show Login / Register
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}


