import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '../../redux/slices/authSlice';
import './Header.css';

const Header = () => {  // Remove the title prop here
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(state => state.auth.user);
  
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="app-title">Apple Watch Activity Tool</h1>
      </div>
      
      <div className="header-nav">
        <button 
          className={`nav-btn ${isActive('/dashboard') ? 'active' : ''}`}
          onClick={() => navigate('/dashboard')}
        >
          <span>Dashboard</span>
        </button>
        
        <button 
          className={`nav-btn ${isActive('/upload') ? 'active' : ''}`}
          onClick={() => navigate('/upload')}
        >
          <span>Upload Data</span>
        </button>
      </div>
      
      <div className="header-actions">
        {user && (
          <div className="user-info">
            <div className="user-avatar">{user.name?.charAt(0) || 'U'}</div>
            <span className="user-name">{user.name}</span>
          </div>
        )}
        
        <button className="logout-btn" onClick={handleLogout}>
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;