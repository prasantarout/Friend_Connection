import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  status: '',
  isLoading: true,
  friendRequestRes: {},
  friendRequestListingRes: {},
  AcceptFriendRequestRes: {},
  rejectFriendRequestRes: {},
  unfriendRequestRes: {},
  friendListingRes: {},
  FriendDetailsReq: {},
  UserDetailsRes: {},
  FriendSuggestionRes: {},
  frindSuggestionByProfileRes: {},
};

const FriendSlice = createSlice({
  name: 'Friend',
  initialState,
  reducers: {
    //token

    //Signup page
    tigerFriedRequest(state, action) {
      state.status = action.type;
    },
    tigerFriedSuccess(state, action) {
      state.friendRequestRes = action.payload;
      state.status = action.type;
    },
    tigerFriedFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //friend listing page
    tigerFriedListingRequest(state, action) {
      state.status = action.type;
    },
    tigerFriedListingSuccess(state, action) {
      state.friendRequestListingRes = action.payload;
      state.status = action.type;
    },
    tigerFriedListingFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //Accept friend page
    tigerAcceptFriedRequest(state, action) {
      state.status = action.type;
    },
    tigerAcceptFriedSuccess(state, action) {
      state.AcceptFriendRequestRes = action.payload;
      state.status = action.type;
    },
    tigerAcceptFriedFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    //reject friend page
    tigerRejectFriedRequest(state, action) {
      state.status = action.type;
    },
    tigerRejectFriedSuccess(state, action) {
      state.rejectFriendRequestRes = action.payload;
      state.status = action.type;
    },
    tigerRejectFriedFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //un-friend page
    tigerUnFriedRequest(state, action) {
      state.status = action.type;
    },
    tigerUnFriedSuccess(state, action) {
      state.unfriendRequestRes = action.payload;
      state.status = action.type;
    },
    tigerUnFriedFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //un-friend page
    tigerFriendListingRequest(state, action) {
      state.status = action.type;
    },
    tigerFriendListingSuccess(state, action) {
      state.friendListingRes = action.payload;
      state.status = action.type;
    },
    tigerFriendListingFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //friend details page
    tigerFriendDetailsRequest(state, action) {
      state.status = action.type;
    },
    tigerFriendDetailsSuccess(state, action) {
      state.FriendDetailsReq = action.payload;
      state.status = action.type;
    },
    tigerFriendDetailsFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //user details page
    userDetailsRequest(state, action) {
      state.status = action.type;
    },
    userDetailsSuccess(state, action) {
      state.UserDetailsRes = action.payload;
      state.status = action.type;
    },
    userDetailsFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //friend suggestion page
    tigerFriendSuggestionRequest(state, action) {
      state.status = action.type;
    },
    tigerFriendSuggestionSuccess(state, action) {
      state.FriendSuggestionRes = action.payload;
      state.status = action.type;
    },
    tigerFriendSuggestionFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //friend suggestion by profile
    tigerFriendSuggestionByProfileRequest(state, action) {
      state.status = action.type;
    },
    tigerFriendSuggestionByProfileSuccess(state, action) {
      state.frindSuggestionByProfileRes = action.payload;
      state.status = action.type;
    },
    tigerFriendSuggestionByProfileFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    clearContactUsRequest(state, action) {
      state.status = action.type;
    },
    clearContactUsSuccess(state, action) {
      state.contactUsRes = action.payload;
      state.status = action.type;
    },

    clearUpdateProfileRequest(state, action) {
      state.status = action.type;
    },
    clearUpdateProfileSuccess(state, action) {
      state.updateProfileRes = action.payload;
      state.status = action.type;
    },
  },
});

export const {
  tigerFriedRequest,
  tigerFriedSuccess,
  tigerFriedFailure,

  tigerFriedListingRequest,
  tigerFriedListingSuccess,
  tigerFriedListingFailure,

  tigerAcceptFriedRequest,
  tigerAcceptFriedSuccess,
  tigerAcceptFriedFailure,

  tigerRejectFriedRequest,
  tigerRejectFriedSuccess,
  tigerRejectFriedFailure,

  tigerUnFriedRequest,
  tigerUnFriedSuccess,
  tigerUnFriedFailure,

  tigerFriendListingRequest,
  tigerFriendListingSuccess,
  tigerFriendListingFailure,

  tigerFriendDetailsRequest,
  tigerFriendDetailsSuccess,
  tigerFriendDetailsFailure,

  userDetailsRequest,
  userDetailsSuccess,
  userDetailsFailure,

  tigerFriendSuggestionRequest,
  tigerFriendSuggestionSuccess,
  tigerFriendSuggestionFailure,

  tigerFriendSuggestionByProfileRequest,
  tigerFriendSuggestionByProfileFailure,
  tigerFriendSuggestionByProfileSuccess,

  clearChangePasswordRequest,
  clearChangePasswordSuccess,

  clearContactUsRequest,
  clearContactUsSuccess,

  clearUpdateProfileRequest,
  clearUpdateProfileSuccess,
} = FriendSlice.actions;

export default FriendSlice.reducer;
