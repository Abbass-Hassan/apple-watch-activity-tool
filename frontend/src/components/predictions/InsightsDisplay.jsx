import React from 'react';
import { useSelector } from 'react-redux';
import './InsightsDisplay.css';

const InsightsDisplay = () => {
  const insights = useSelector(state => state.predictions.insights);
  const loading = useSelector(state => state.predictions.loading);
  
  if (loading) {
    return (
      <div className="prediction-card">
        <div className="prediction-loading">Generating personalized insights...</div>
      </div>
    );
  }
  
  if (!insights || !insights.insights || insights.insights.length === 0) {
    return (
      <div className="prediction-card">
        <div className="prediction-header">
          <h3>Activity Insights</h3>
        </div>
        <div className="prediction-empty">
          Not enough data to generate personalized insights yet. 
          Continue tracking your activities to receive tailored recommendations.
        </div>
      </div>
    );
  }
  
  // Get icon for insight type
  const getInsightIcon = (type) => {
    switch (type) {
      case 'consistency': return '📊';
      case 'weekday_pattern': return '📅';
      case 'progress': return '📈';
      default: return '💡';
    }
  };
  
  return (
    <div className="prediction-card">
      <div className="prediction-header">
        <h3>Activity Insights</h3>
      </div>
      
      <div className="prediction-description">
        Based on your activity patterns, we've generated these personalized insights:
      </div>
      
      <div className="insights-list">
        {insights.insights.map((insight, index) => (
          <div className="insight-item" key={index}>
            <div className="insight-icon">{getInsightIcon(insight.type)}</div>
            <div className="insight-content">
              <div className="insight-message">{insight.message}</div>
              
              {insight.data && insight.type === 'progress' && (
                <div className="insight-data">
                  <div className="data-item">
                    <span className="label">Recent Average:</span>
                    <span className="value">{insight.data.recent_average.toFixed(1)}</span>
                  </div>
                  <div className="data-item">
                    <span className="label">Previous Average:</span>
                    <span className="value">{insight.data.previous_average.toFixed(1)}</span>
                  </div>
                  <div className="data-item">
                    <span className="label">Change:</span>
                    <span className={`value ${insight.data.change_percent >= 0 ? 'positive' : 'negative'}`}>
                      {insight.data.change_percent >= 0 ? '+' : ''}
                      {insight.data.change_percent.toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsDisplay;