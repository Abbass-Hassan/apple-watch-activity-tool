import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivities } from '../../redux/slices/activitySlice';
import { fetchAllPredictions } from '../../redux/slices/predictionSlice';
import MainLayout from '../../components/layout/MainLayout';
import StepCountChart from '../../components/charts/StepCountChart';
import ActivityStatsChart from '../../components/charts/ActivityStatsChart';
import WeeklySummaryChart from '../../components/charts/WeeklySummaryChart';
import DateRangeFilter from '../../components/filters/DateRangeFilter';
import ChartViewSelector from '../../components/filters/ChartViewSelector';
import GoalPrediction from '../../components/predictions/GoalPrediction';
import AnomalyDetection from '../../components/predictions/AnomalyDetection';
import TrendForecast from '../../components/predictions/TrendForecast';
import InsightsDisplay from '../../components/predictions/InsightsDisplay';
import './Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const filters = useSelector(state => state.ui.filters);
  
  // Fetch activities and predictions when component mounts or filters change
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchActivities(filters));
      dispatch(fetchAllPredictions());
    }
  }, [dispatch, isAuthenticated, filters.startDate, filters.endDate]);
  
  return (
    <MainLayout title="Activity Dashboard">
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="main-section">
            <div className="charts-section">
              <StepCountChart />
              <div className="charts-row">
                <ActivityStatsChart />
                <WeeklySummaryChart />
              </div>
            </div>
            
            <div className="predictions-section">
              <h2 className="section-title">AI-Powered Predictions & Insights</h2>
              <div className="prediction-cards">
                <GoalPrediction />
                <AnomalyDetection />
                <TrendForecast />
                <InsightsDisplay />
              </div>
            </div>
          </div>
          
          <div className="sidebar-section">
            <DateRangeFilter />
            <ChartViewSelector />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;