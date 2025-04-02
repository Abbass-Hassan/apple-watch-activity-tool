import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../redux/slices/authSlice';
import { setSidebarOpen } from '../../redux/slices/uiSlice';
import './Sidebar.css';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector(state => state.ui.sidebarOpen);
  const user = useSelector(state => state.auth.user);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const toggleSidebar = () => {
    dispatch(setSidebarOpen(!isOpen));
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h2>Apple Watch Activity</h2>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isOpen ? '←' : '→'}
        </button>
      </div>
      
      {user && (
        <div className="user-info">
          <div className="user-avatar">{user.name.charAt(0)}</div>
          <div className="user-name">{user.name}</div>
        </div>
      )}
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <a href="#" onClick={() => navigate('/dashboard')}>
              <span className="icon">📊</span>
              <span className="text">Dashboard</span>
            </a>
          </li>
          <li>
            <a href="#" onClick={() => navigate('/activities')}>
              <span className="icon">🏃</span>
              <span className="text">Activities</span>
            </a>
          </li>
          <li>
            <a href="#" onClick={() => navigate('/predictions')}>
              <span className="icon">🔮</span>
              <span className="text">Predictions</span>
            </a>
          </li>
          <li>
            <a href="#" onClick={() => navigate('/upload')}>
              <span className="icon">📤</span>
              <span className="text">Upload Data</span>
            </a>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>
          <span className="icon">🚪</span>
          <span className="text">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;