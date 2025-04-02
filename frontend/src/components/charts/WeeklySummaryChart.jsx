import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, Legend, Tooltip 
} from 'recharts';
import './WeeklySummaryChart.css';

const WeeklySummaryChart = () => {
  const activities = useSelector(state => state.activities.items);
  const loading = useSelector(state => state.activities.loading);
  
  // Group activities by day of week and calculate averages
  const weeklyData = useMemo(() => {
    if (!activities || activities.length === 0) return [];
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayData = {};
    
    // Initialize with empty data
    days.forEach(day => {
      dayData[day] = { 
        day,
        steps: 0, 
        activeMinutes: 0,
        distance: 0,
        count: 0
      };
    });
    
    // Accumulate data
    activities.forEach(activity => {
      const date = new Date(activity.date);
      const day = days[date.getDay()];
      
      dayData[day].steps += activity.steps;
      dayData[day].activeMinutes += activity.active_minutes;
      dayData[day].distance += activity.distance_km;
      dayData[day].count += 1;
    });
    
    // Calculate averages
    return days.map(day => {
      const data = dayData[day];
      const count = data.count || 1; // Avoid division by zero
      
      return {
        day,
        steps: Math.round(data.steps / count),
        activeMinutes: Math.round(data.activeMinutes / count),
        distance: +(data.distance / count).toFixed(2)
      };
    });
  }, [activities]);
  
  if (loading) {
    return (
      <div className="chart-container">
        <div className="chart-loading">Loading weekly summary...</div>
      </div>
    );
  }
  
  if (!activities || activities.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-empty">No data available for weekly summary.</div>
      </div>
    );
  }
  
  return (
    <div className="chart-container">
      <h3 className="chart-title">Weekly Activity Patterns</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={weeklyData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
            <PolarGrid />
            <PolarAngleAxis dataKey="day" />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
            <Radar 
              name="Steps (×0.01)" 
              dataKey="steps" 
              stroke="#8884d8" 
              fill="#8884d8" 
              fillOpacity={0.6}
            />
            <Radar 
              name="Active Minutes" 
              dataKey="activeMinutes" 
              stroke="#82ca9d" 
              fill="#82ca9d" 
              fillOpacity={0.6}
            />
            <Radar 
              name="Distance (km)" 
              dataKey="distance" 
              stroke="#ff8042" 
              fill="#ff8042" 
              fillOpacity={0.6}
            />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-note">
        Note: Steps values are divided by 100 to fit the scale
      </div>
    </div>
  );
};

export default WeeklySummaryChart;