import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDateFilter } from '../../redux/slices/uiSlice';
import './DateRangeFilter.css';

const DateRangeFilter = () => {
  const dispatch = useDispatch();
  const currentFilters = useSelector(state => state.ui.filters);
  
  const [startDate, setStartDate] = useState(currentFilters.startDate || '');
  const [endDate, setEndDate] = useState(currentFilters.endDate || '');

  const handleApplyFilter = () => {
    dispatch(setDateFilter({ startDate, endDate }));
  };

  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
    dispatch(setDateFilter({ startDate: null, endDate: null }));
  };

  const handleQuickFilter = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    const formattedStart = start.toISOString().split('T')[0];
    const formattedEnd = end.toISOString().split('T')[0];
    
    setStartDate(formattedStart);
    setEndDate(formattedEnd);
    
    dispatch(setDateFilter({ 
      startDate: formattedStart, 
      endDate: formattedEnd 
    }));
  };

  return (
    <div className="date-range-filter">
      <div className="filter-header">
        <h3>Date Range</h3>
      </div>
      
      <div className="filter-inputs">
        <div className="input-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      
      <div className="filter-actions">
        <button className="apply-btn" onClick={handleApplyFilter}>Apply Filter</button>
        <button className="clear-btn" onClick={handleClearFilter}>Clear</button>
      </div>
      
      <div className="quick-filters">
        <button onClick={() => handleQuickFilter(7)}>Last 7 Days</button>
        <button onClick={() => handleQuickFilter(30)}>Last 30 Days</button>
        <button onClick={() => handleQuickFilter(90)}>Last 3 Months</button>
      </div>
    </div>
  );
};

export default DateRangeFilter;