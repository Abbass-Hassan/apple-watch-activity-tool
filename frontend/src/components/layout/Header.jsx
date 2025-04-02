import React from 'react';
import { useSelector } from 'react-redux';
import './Header.css';

const Header = ({ title }) => {
  const sidebarOpen = useSelector(state => state.ui.sidebarOpen);
  
  return (
    <header className={`app-header ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <h1>{title}</h1>
      <div className="header-actions">
        <button className="help-button">
          <span className="icon">❓</span>
          <span>Help</span>
        </button>
      </div>
    </header>
  );
};

export default Header;