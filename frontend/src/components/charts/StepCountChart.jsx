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
    
    // Format the data based on chart view
    const getChartData = () => {
      if (chartView === 'daily') {
        // Daily view - show each day's data
        return activities.map(activity => ({
          date: new Date(activity.date).toLocaleDateString(),
          steps: activity.steps,
        }));
      } 
      else if (chartView === 'weekly') {
        // Weekly view - group by week
        const weeklyData = {};
        
        activities.forEach(activity => {
          const date = new Date(activity.date);
          // Get the week number (approximate by dividing day of year by 7)
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
          const weekKey = weekStart.toLocaleDateString();
          
          if (!weeklyData[weekKey]) {
            weeklyData[weekKey] = {
              date: `Week of ${weekKey}`,
              steps: 0,
              count: 0
            };
          }
          
          weeklyData[weekKey].steps += activity.steps;
          weeklyData[weekKey].count += 1;
        });
        
        // Calculate averages
        return Object.values(weeklyData).map(week => ({
          date: week.date,
          steps: Math.round(week.steps / week.count)
        }));
      }
      else if (chartView === 'monthly') {
        // Monthly view - group by month
        const monthlyData = {};
        
        activities.forEach(activity => {
          const date = new Date(activity.date);
          const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
          const monthName = date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
          
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
              date: monthName,
              steps: 0,
              count: 0
            };
          }
          
          monthlyData[monthKey].steps += activity.steps;
          monthlyData[monthKey].count += 1;
        });
        
        // Calculate averages
        return Object.values(monthlyData).map(month => ({
          date: month.date,
          steps: Math.round(month.steps / month.count)
        }));
      }
      
      // Default to daily
      return activities.map(activity => ({
        date: new Date(activity.date).toLocaleDateString(),
        steps: activity.steps,
      }));
    };
    
    const chartData = getChartData();
    
    // Update chart title based on view
    const getChartTitle = () => {
      switch(chartView) {
        case 'weekly': return 'Weekly Average Step Count';
        case 'monthly': return 'Monthly Average Step Count';
        default: return 'Daily Step Count';
      }
    };
    
    return (
      <div className="chart-container">
        <h3 className="chart-title">{getChartTitle()}</h3>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value.toLocaleString()} steps`, 'Steps']}
                labelFormatter={(label) => `${label}`}
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