import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching activities
export const fetchActivities = createAsyncThunk(
  'activities/fetchActivities',
  async (filters = {}, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.startDate) queryParams.append('start_date', filters.startDate);
      if (filters.endDate) queryParams.append('end_date', filters.endDate);
      if (filters.page) queryParams.append('page', filters.page);
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      
      const response = await fetch(`http://localhost:8000/api/activities${queryString}`, {
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

// Async thunk for fetching activity by date
export const fetchActivityByDate = createAsyncThunk(
  'activities/fetchActivityByDate',
  async (date, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      const response = await fetch(`http://localhost:8000/api/activities/date?date=${date}`, {
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

// Async thunk for uploading CSV file
export const uploadActivityCSV = createAsyncThunk(
  'activities/uploadCSV',
  async (file, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('http://localhost:8000/api/activities/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
        body: formData,
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

const activitySlice = createSlice({
  name: 'activities',
  initialState: {
    items: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      perPage: 15,
      total: 0
    },
    currentActivity: null,
    loading: false,
    error: null,
    uploadStatus: {
      loading: false,
      success: false,
      error: null,
      lastUploadResult: null
    }
  },
  reducers: {
    clearActivityError: (state) => {
      state.error = null;
    },
    clearUploadStatus: (state) => {
      state.uploadStatus = {
        loading: false,
        success: false,
        error: null,
        lastUploadResult: null
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch activities cases
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = {
          currentPage: action.payload.current_page,
          totalPages: action.payload.last_page,
          perPage: action.payload.per_page,
          total: action.payload.total
        };
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch activities';
      })
      
      // Fetch activity by date cases
      .addCase(fetchActivityByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.currentActivity = action.payload;
      })
      .addCase(fetchActivityByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch activity for the selected date';
      })
      
      // Upload CSV cases
      .addCase(uploadActivityCSV.pending, (state) => {
        state.uploadStatus.loading = true;
        state.uploadStatus.success = false;
        state.uploadStatus.error = null;
      })
      .addCase(uploadActivityCSV.fulfilled, (state, action) => {
        state.uploadStatus.loading = false;
        state.uploadStatus.success = true;
        state.uploadStatus.lastUploadResult = action.payload;
      })
      .addCase(uploadActivityCSV.rejected, (state, action) => {
        state.uploadStatus.loading = false;
        state.uploadStatus.error = action.payload || 'Failed to upload CSV file';
      });
  },
});

export const { clearActivityError, clearUploadStatus } = activitySlice.actions;
export default activitySlice.reducer;