import React from 'react';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Header from './Header';
import './MainLayout.css';

const MainLayout = ({ children, title = 'Dashboard' }) => {
  const sidebarOpen = useSelector(state => state.ui.sidebarOpen);
  
  return (
    <div className="app-container">
      <Sidebar />
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Header title={title} />
        <main className="content-area">
          {children}
        </main>
        <footer className="app-footer">
          <p>© 2025 Apple Watch Activity Tracker</p>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;