import React from 'react';
import Header from './Header';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <div className="main-content">
        <Header/>
        <main className="content-area">
          {children}
        </main>
        
      </div>
    </div>
  );
};

export default MainLayout;