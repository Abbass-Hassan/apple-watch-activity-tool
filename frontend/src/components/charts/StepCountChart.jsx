import React from 'react';
import { useSelector } from 'react-redux';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ReferenceLine 
} from 'recharts';
import './StepCountChart.css';

const StepCountChart = () => {
  const activities = useSelector(state => state.activities.items);
  const loading = useSelector(state => state.activities.loading);
  const chartView = useSelector(state => state.ui.chartView);
  
  // Set goal line (default 10,000 steps)
  const goalLine = 10000;
  
  if (loading) {
    return (
      <div className="chart-container">
        <div className="chart-loading">Loading step data...</div>
      </div>
    );
  }
  
  if (!activities || activities.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-empty">No step data available. Please upload your activity data.</div>
      </div>
    );
  }
  
  // Format the data for the chart
  const chartData = activities.map(activity => ({
    date: new Date(activity.date).toLocaleDateString(),
    steps: activity.steps,
  }));
  
  return (
    <div className="chart-container">
      <h3 className="chart-title">Daily Step Count</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value.toLocaleString()} steps`, 'Steps']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <ReferenceLine y={goalLine} label="Goal" stroke="red" strokeDasharray="3 3" />
            <Line 
              type="monotone" 
              dataKey="steps" 
              stroke="#8884d8" 
              activeDot={{ r: 8 }}
              name="Steps"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StepCountChart;