import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchActivityByDate } from '../../redux/slices/activitySlice';
import './ActivityFilter.css';

const ActivityFilter = () => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState('');
  const [searchFeedback, setSearchFeedback] = useState('');
  
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSearchFeedback('');
  };
  
  const handleSearch = () => {
    if (!selectedDate) {
      setSearchFeedback('Please select a date');
      return;
    }
    
    dispatch(fetchActivityByDate(selectedDate))
      .unwrap()
      .then(() => {
        setSearchFeedback('');
      })
      .catch(() => {
        setSearchFeedback('No activity found for this date');
      });
  };
  
  return (
    <div className="activity-filter">
      <div className="filter-header">
        <h3>Find Activity by Date</h3>
      </div>
      
      <div className="search-container">
        <div className="input-group">
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="date-input"
          />
          <button 
            className="search-btn"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
        
        {searchFeedback && (
          <div className="search-feedback">{searchFeedback}</div>
        )}
      </div>
    </div>
  );
};

export default ActivityFilter;