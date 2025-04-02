import React from 'react';
import { useSelector } from 'react-redux';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend 
} from 'recharts';
import './ActivityStatsChart.css';

const ActivityStatsChart = () => {
  const activities = useSelector(state => state.activities.items);
  const loading = useSelector(state => state.activities.loading);
  
  if (loading) {
    return (
      <div className="chart-container">
        <div className="chart-loading">Loading activity statistics...</div>
      </div>
    );
  }
  
  if (!activities || activities.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-empty">No activity data available. Please upload your data.</div>
      </div>
    );
  }
  
  // Format the data for the chart
  const chartData = activities.map(activity => ({
    date: new Date(activity.date).toLocaleDateString(),
    distance: activity.distance_km,
    activeMinutes: activity.active_minutes
  }));
  
  return (
    <div className="chart-container">
      <h3 className="chart-title">Activity Statistics</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'Distance') return [`${value.toFixed(2)} km`, name];
                return [`${value} minutes`, name];
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="distance" name="Distance" fill="#8884d8" />
            <Bar yAxisId="right" dataKey="activeMinutes" name="Active Minutes" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityStatsChart;