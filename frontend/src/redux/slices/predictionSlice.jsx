import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching all predictions
export const fetchAllPredictions = createAsyncThunk(
  'predictions/fetchAll',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      const response = await fetch('http://localhost:8000/api/predictions', {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching goal predictions
export const fetchGoalPredictions = createAsyncThunk(
  'predictions/fetchGoals',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      const response = await fetch('http://localhost:8000/api/predictions/goals', {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching anomalies
export const fetchAnomalies = createAsyncThunk(
  'predictions/fetchAnomalies',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      const response = await fetch('http://localhost:8000/api/predictions/anomalies', {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching trends
export const fetchTrends = createAsyncThunk(
  'predictions/fetchTrends',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      const response = await fetch('http://localhost:8000/api/predictions/trends', {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching insights
export const fetchInsights = createAsyncThunk(
  'predictions/fetchInsights',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      const response = await fetch('http://localhost:8000/api/predictions/insights', {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const predictionSlice = createSlice({
  name: 'predictions',
  initialState: {
    all: null,
    goals: null,
    anomalies: null,
    trends: null,
    insights: null,
    loading: false,
    error: null
  },
  reducers: {
    clearPredictionError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all predictions cases
      .addCase(fetchAllPredictions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPredictions.fulfilled, (state, action) => {
        state.loading = false;
        state.all = action.payload.predictions;
        state.goals = action.payload.predictions.goal_predictions;
        state.anomalies = action.payload.predictions.anomalies;
        state.trends = action.payload.predictions.trends;
        state.insights = action.payload.predictions.insights;
      })
      .addCase(fetchAllPredictions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch predictions';
      })
      
      // Fetch goal predictions cases
      .addCase(fetchGoalPredictions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoalPredictions.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = action.payload;
      })
      .addCase(fetchGoalPredictions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch goal predictions';
      })
      
      // Fetch anomalies cases
      .addCase(fetchAnomalies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnomalies.fulfilled, (state, action) => {
        state.loading = false;
        state.anomalies = action.payload;
      })
      .addCase(fetchAnomalies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch anomalies';
      })
      
      // Fetch trends cases
      .addCase(fetchTrends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.trends = action.payload;
      })
      .addCase(fetchTrends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch trends';
      })
      
      // Fetch insights cases
      .addCase(fetchInsights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.insights = action.payload;
      })
      .addCase(fetchInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch insights';
      });
  },
});

export const { clearPredictionError } = predictionSlice.actions;
export default predictionSlice.reducer;