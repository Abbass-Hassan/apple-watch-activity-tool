import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setChartView } from '../../redux/slices/uiSlice';
import './ChartViewSelector.css';

const ChartViewSelector = () => {
  const dispatch = useDispatch();
  const currentView = useSelector(state => state.ui.chartView);
  
  const handleViewChange = (view) => {
    dispatch(setChartView(view));
  };
  
  return (
    <div className="chart-view-selector">
      <div className="selector-header">
        <h3>Chart View</h3>
      </div>
      
      <div className="view-options">
        <button 
          className={`view-option ${currentView === 'daily' ? 'active' : ''}`}
          onClick={() => handleViewChange('daily')}
        >
          Daily
        </button>
        
        <button 
          className={`view-option ${currentView === 'weekly' ? 'active' : ''}`}
          onClick={() => handleViewChange('weekly')}
        >
          Weekly
        </button>
        
        <button 
          className={`view-option ${currentView === 'monthly' ? 'active' : ''}`}
          onClick={() => handleViewChange('monthly')}
        >
          Monthly
        </button>
      </div>
    </div>
  );
};

export default ChartViewSelector;