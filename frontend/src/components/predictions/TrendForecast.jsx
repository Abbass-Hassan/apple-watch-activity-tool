import React from 'react';
import { useSelector } from 'react-redux';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
    Legend, ResponsiveContainer, Cell 
  } from 'recharts';
import './TrendForecast.css';

const TrendForecast = () => {
  const trends = useSelector(state => state.predictions.trends);
  const loading = useSelector(state => state.predictions.loading);
  
  if (loading) {
    return (
      <div className="prediction-card">
        <div className="prediction-loading">Analyzing activity trends...</div>
      </div>
    );
  }
  
  if (!trends || !trends.trends) {
    return (
      <div className="prediction-card">
        <div className="prediction-header">
          <h3>Trend Forecast</h3>
        </div>
        <div className="prediction-empty">Not enough data to forecast trends.</div>
      </div>
    );
  }
  
  // Prepare data for chart
  const chartData = Object.keys(trends.forecasts).map(metric => {
    const readableMetric = metric.replace('_', ' ');
    const direction = trends.trends[metric].direction;
    const value = parseFloat(trends.forecasts[metric].toFixed(2));
    
    return {
      name: readableMetric.charAt(0).toUpperCase() + readableMetric.slice(1),
      forecast: value,
      direction
    };
  });
  
  // Get color for direction
  const getDirectionColor = (direction) => {
    switch (direction) {
      case 'increasing': return '#4CAF50';
      case 'decreasing': return '#F44336';
      default: return '#FFC107';
    }
  };
  
  // Format percentage change
  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };
  
  return (
    <div className="prediction-card">
      <div className="prediction-header">
        <h3>Trend Forecast</h3>
      </div>
      
      <div className="prediction-description">
        {trends.description}
      </div>
      
      <div className="trend-chart">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="forecast" 
              name="Forecast"
              fill="#8884d8"
              // Dynamic colors based on direction
              isAnimationActive={true}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getDirectionColor(entry.direction)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="trend-details">
        <h4>Trend Analysis</h4>
        <div className="trends-list">
          {Object.keys(trends.trends).map(metric => {
            const trend = trends.trends[metric];
            const readableMetric = metric.replace('_', ' ');
            
            return (
              <div className="trend-item" key={metric}>
                <div className="trend-metric">{readableMetric.charAt(0).toUpperCase() + readableMetric.slice(1)}</div>
                <div className="trend-values">
                  <div className={`trend-direction ${trend.direction}`}>
                    {trend.direction.charAt(0).toUpperCase() + trend.direction.slice(1)}
                  </div>
                  <div className="trend-change">
                    Change: <span className={trend.percentage_change >= 0 ? 'positive' : 'negative'}>
                      {formatPercentage(trend.percentage_change)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrendForecast;