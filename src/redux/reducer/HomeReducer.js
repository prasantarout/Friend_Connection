import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  status: '',
  allFeedList: {},
};

const HomeSlice = createSlice({
  name: 'Home',
  initialState,
  reducers: {
    getAllFeedRequest(state, action) {
      state.status = action.type;
    },
    getAllFeedSuccess(state, action) {
      state.allFeedList = action.payload;
      state.status = action.type;
    },
    getAllFeedFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    clearAllFeedListRequest(state, action) {
      state.status = action.type;
    },
    clearAllFeedListSuccess(state, action) {
      state.allFeedList = action.payload;
      state.status = action.type;
    },
  },
});

export const {
  getAllFeedRequest,
  getAllFeedSuccess,
  getAllFeedFailure,
  clearAllFeedListRequest,
  clearAllFeedListSuccess,
} = HomeSlice.actions;

export default HomeSlice.reducer;
