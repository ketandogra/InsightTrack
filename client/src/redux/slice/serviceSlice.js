import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define an async thunk to fetch category data
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const response = await axios.get(
      "http://localhost:8000/api/service/categories"
    );
    return response.data;
  }
);

// Define an async thunk to fetch single service data
export const fetchService = createAsyncThunk(
  "categories/fetchService",
  async (id, { rejectWithValue }) => {
    const response = await axios.get(`http://localhost:8000/api/service/${id}`);
    return response.data;
  }
);

// Define an async thunk to fetch single service data
export const fetchAllServices = createAsyncThunk(
  "categories/fetchAllServices",
  async () => {
    const response = await axios.get('http://localhost:8000/api/service/all');
    return response.data;
  }
);

// Define an async thunk to edit existing service data
export const editService = createAsyncThunk(
  "categories/editService",
  async ({ updatedServiceData, id }, { rejectWithValue }) => {
    const response = await axios.put(
      `http://localhost:8000/api/service/update-service/${id}`,
      updatedServiceData
    );
    return response.data;
  }
);

// Define an async thunk to update planned maintenance  service data
export const plannedMaintenance = createAsyncThunk(
  "categories/plannedMaintenance",
  async ({ maintenanceFormData, id }, { rejectWithValue }) => {
    const response = await axios.put(
      `http://localhost:8000/api/service/planned-activity/${id}`,
      maintenanceFormData
    );
    return response.data;
  }
);

// Create an async thunk to add a monitor service
export const addMonitorService = createAsyncThunk(
  "categories/addMonitorService",
  async (serviceData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/service/create",
        serviceData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create a category slice
const categorySlice = createSlice({
  name: "categories",
  initialState: {
    data: [], // Initial state for category data
    loading: "idle", // Loading state
    error: null,
    service: [],
    services: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = "fulfilled";

        state.data = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })
      .addCase(addMonitorService.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(addMonitorService.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        const { category } = action.payload;

        state.data = [...category];
      })

      .addCase(addMonitorService.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      .addCase(fetchService.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(fetchService.fulfilled, (state, action) => {
        state.loading = "fullfilled";
        state.service = action.payload;
      })
      .addCase(fetchService.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      .addCase(editService.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(editService.fulfilled, (state, action) => {
        state.loading = "fullfilled";
        state.service = action.payload.data;
      
      })
      .addCase(editService.rejected, (state, action) => {
        state.loading = "rejected";
        state.error = action.error.message;
      })

      .addCase(fetchAllServices.fulfilled, (state, action) => {
    
        console.log(action.payload);
        state.services = action.payload;
        
      })

  },
});

export default categorySlice.reducer;
