import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    // Filter settings
    filters: {
      startDate: null,
      endDate: null,
      currentPage: 1
    },
    // Sidebar and navigation
    sidebarOpen: true,
    // Chart settings
    chartView: 'daily', // 'daily', 'weekly', 'monthly'
    // Loading states for sections that are not covered by other slices
    loadingStates: {
      dashboard: false
    },
    // Alert messages
    alert: {
      show: false,
      type: null, // 'success', 'error', 'info', 'warning'
      message: ''
    }
  },
  reducers: {
    // Filter actions
    setDateFilter: (state, action) => {
      const { startDate, endDate } = action.payload;
      state.filters.startDate = startDate;
      state.filters.endDate = endDate;
      // Reset to page 1 when filters change
      state.filters.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.filters.currentPage = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        startDate: null,
        endDate: null,
        currentPage: 1
      };
    },
    
    // UI state actions
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    
    // Chart view actions
    setChartView: (state, action) => {
      state.chartView = action.payload;
    },
    
    // Loading state actions
    setLoading: (state, action) => {
      const { section, isLoading } = action.payload;
      state.loadingStates[section] = isLoading;
    },
    
    // Alert actions
    showAlert: (state, action) => {
      const { type, message } = action.payload;
      state.alert = {
        show: true,
        type,
        message
      };
    },
    hideAlert: (state) => {
      state.alert.show = false;
    }
  },
});

export const {
  setDateFilter,
  setCurrentPage,
  resetFilters,
  toggleSidebar,
  setSidebarOpen,
  setChartView,
  setLoading,
  showAlert,
  hideAlert
} = uiSlice.actions;

export default uiSlice.reducer;