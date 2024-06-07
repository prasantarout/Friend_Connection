import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  status: '',
  isLoading: true,
  pollListRequestRes: {},
  pollSubmitRes: {},
  pollUpdateRes: {},
  pollDeleteRes: {},
  pollVoteRequestRes: {},
  myOwnPollListRequestRes: {},
  deletePollRequestRes: {},
};

const PollSlice = createSlice({
  name: 'Poll',
  initialState,
  reducers: {
    //token

    //Signup page
    pollListRequest(state, action) {
      state.status = action.type;
    },
    pollListSuccess(state, action) {
      state.pollListRequestRes = action.payload;
      state.status = action.type;
    },
    pollListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    //Poll Vote
    pollVoteRequest(state, action) {
      state.status = action.type;
    },
    pollVoteSuccess(state, action) {
      state.pollVoteRequestRes = action.payload;
      state.status = action.type;
    },
    pollVoteFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //Signup page
    pollSubmitRequest(state, action) {
      state.status = action.type;
    },
    pollSubmitSuccess(state, action) {
      state.pollSubmitRes = action.payload;
      state.status = action.type;
    },
    pollSubmitFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //Signup page
    pollUpdateRequest(state, action) {
      state.status = action.type;
    },
    pollUpdateSuccess(state, action) {
      state.pollUpdateRes = action.payload;
      state.status = action.type;
    },
    pollUpdateFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    pollOwnRequest(state, action) {
      state.status = action.type;
    },
    pollOwnSuccess(state, action) {
      state.myOwnPollListRequestRes = action.payload;
      state.status = action.type;
    },
    pollOwnFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //Signup page
    pollDeleteRequest(state, action) {
      state.status = action.type;
    },
    pollDeleteSuccess(state, action) {
      state.pollDeleteRes = action.payload;
      state.status = action.type;
    },
    pollDeleteFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    deletePollRequest(state, action) {
      state.status = action.type;
    },
    deletePollSuccess(state, action) {
      state.deletePollRequestRes = action.payload;
      state.status = action.type;
    },
    deletePollFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
  },
});

export const {
  pollListRequest,
  pollListSuccess,
  pollListFailure,

  pollSubmitRequest,
  pollSubmitSuccess,
  pollSubmitFailure,

  pollUpdateRequest,
  pollUpdateSuccess,
  pollUpdateFailure,

  pollDeleteRequest,
  pollDeleteSuccess,
  pollDeleteFailure,

  pollVoteRequest,
  pollVoteSuccess,
  pollVoteFailure,

  pollOwnRequest,
  pollOwnSuccess,
 pollOwnFailure,

 deletePollRequest,
 deletePollSuccess,
 deletePollFailure
} = PollSlice.actions;

export default PollSlice.reducer;
