import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from './slice/serviceSlice';

const store = configureStore({
  reducer: {
    categories: categoryReducer,
  },
});

export default store;
