import React from 'react';
import { useSelector } from 'react-redux';
import './AnomalyDetection.css';

const AnomalyDetection = () => {
  const anomalies = useSelector(state => state.predictions.anomalies);
  const loading = useSelector(state => state.predictions.loading);
  
  if (loading) {
    return (
      <div className="prediction-card">
        <div className="prediction-loading">Analyzing activity anomalies...</div>
      </div>
    );
  }
  
  if (!anomalies || !anomalies.anomalies || Object.keys(anomalies.anomalies).length === 0) {
    return (
      <div className="prediction-card">
        <div className="prediction-header">
          <h3>Anomaly Detection</h3>
        </div>
        <div className="prediction-empty">No unusual activity patterns detected.</div>
      </div>
    );
  }
  
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const getAnomalyDescription = (metric, data) => {
    const readableMetric = metric.replace('_', ' ');
    const direction = data.direction;
    const percent = Math.abs(Math.round((data.value / data.average - 1) * 100));
    
    return `${readableMetric} were ${direction === 'higher' ? 'above' : 'below'} average by ${percent}%`;
  };
  
  return (
    <div className="prediction-card">
      <div className="prediction-header">
        <h3>Anomaly Detection</h3>
      </div>
      
      <div className="prediction-description">
        {anomalies.description}
      </div>
      
      <div className="anomalies-list">
        {Object.keys(anomalies.anomalies).map(date => {
          const anomalyData = anomalies.anomalies[date];
          return (
            <div className="anomaly-item" key={date}>
              <div className="anomaly-date">{formatDate(date)}</div>
              <div className="anomaly-details">
                {Object.keys(anomalyData).map(metric => (
                  <div className="anomaly-metric" key={metric}>
                    <span className={`indicator ${anomalyData[metric].direction}`}></span>
                    <span className="description">
                      {getAnomalyDescription(metric, anomalyData[metric])}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnomalyDetection;