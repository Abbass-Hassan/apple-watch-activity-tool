import React from 'react';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './GoalPrediction.css';

const GoalPrediction = () => {
  const goalPredictions = useSelector(state => state.predictions.goals);
  const loading = useSelector(state => state.predictions.loading);
  
  if (loading) {
    return (
      <div className="prediction-card">
        <div className="prediction-loading">Loading goal predictions...</div>
      </div>
    );
  }
  
  if (!goalPredictions) {
    return (
      <div className="prediction-card">
        <div className="prediction-empty">No goal predictions available yet.</div>
      </div>
    );
  }
  
  // Create data for pie charts
  const createPieData = (prediction) => {
    const likelihood = prediction.likelihood;
    return [
      { name: 'Likely', value: likelihood, color: getColorForLikelihood(likelihood) },
      { name: 'Unlikely', value: 100 - likelihood, color: '#f5f5f5' }
    ];
  };
  
  // Get color based on likelihood percentage
  const getColorForLikelihood = (likelihood) => {
    if (likelihood >= 80) return '#4CAF50'; // Green
    if (likelihood >= 50) return '#FFC107'; // Yellow
    return '#F44336'; // Red
  };
  
  const { predictions } = goalPredictions;
  
  return (
    <div className="prediction-card">
      <div className="prediction-header">
        <h3>Goal Achievement Prediction</h3>
      </div>
      
      <div className="prediction-description">
        {goalPredictions.description}
      </div>
      
      <div className="goals-container">
        {predictions && Object.keys(predictions).map(metricKey => {
          const metric = predictions[metricKey];
          const pieData = createPieData(metric);
          const readableMetric = metricKey.replace('_', ' ');
          
          return (
            <div className="goal-item" key={metricKey}>
              <h4>{readableMetric.charAt(0).toUpperCase() + readableMetric.slice(1)}</h4>
              <div className="goal-chart">
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      startAngle={0}
                      endAngle={360}
                      innerRadius={35}
                      outerRadius={50}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ value }) => `${value}%`}
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="goal-details">
                <p><strong>Current Average:</strong> {metric.current_average.toFixed(0)}</p>
                <p><strong>Goal:</strong> {metric.goal}</p>
                <p className="trend">
                  Trend: 
                  <span className={`trend-${metric.trend}`}>
                    {metric.trend === 'improving' ? ' Improving ↗' : ' Stable or Declining →'}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalPrediction;