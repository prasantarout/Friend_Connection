import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: '',
  isLoading: true,
  matchsuggestionlistResponse: {},
  matchuserdetailsResponse:{},
  followuserResponse:{},
  interestuserResponse:{},
  tigermatchjoinResponse:{},
  matchrequestlistResponse:{},
  matchfriendlistResponse:{}
};

const MatchSlice = createSlice({
  name: 'Match',
  initialState,
  reducers: {

    //matchsuggestion
    matchsuggestionlistRequest(state, action) {
      state.status = action.type;
    },
    matchsuggestionlistSuccess(state, action) {
      state.matchsuggestionlistResponse = action.payload;
      state.status = action.type;
    },
    matchsuggestionlistFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    //matchuserdetails
    matchuserdetailsRequest(state, action) {
        state.status = action.type;
      },
      matchuserdetailsSuccess(state, action) {
        state.matchuserdetailsResponse = action.payload;
        state.status = action.type;
      },
      matchuserdetailsFailure(state, action) {
        state.error = action.error;
        state.status = action.type;
      },

      //followuser
    followuserRequest(state, action) {
        state.status = action.type;
      },
      followuserSuccess(state, action) {
        state.followuserResponse = action.payload;
        state.status = action.type;
      },
      followuserFailure(state, action) {
        state.error = action.error;
        state.status = action.type;
      },

      //interestuser
    interestuserRequest(state, action) {
        state.status = action.type;
      },
      interestuserSuccess(state, action) {
        state.interestuserResponse = action.payload;
        state.status = action.type;
      },
      interestuserFailure(state, action) {
        state.error = action.error;
        state.status = action.type;
      },

      //tigermatchjoin
    tigermatchjoinRequest(state, action) {
        state.status = action.type;
      },
      tigermatchjoinSuccess(state, action) {
        state.tigermatchjoinResponse = action.payload;
        state.status = action.type;
      },
      tigermatchjoinFailure(state, action) {
        state.error = action.error;
        state.status = action.type;
      },

 //matchrequest
 matchrequestlistRequest(state, action) {
  state.status = action.type;
},
matchrequestlistSuccess(state, action) {
  state.matchrequestlistResponse = action.payload;
  state.status = action.type;
},
matchrequestlistFailure(state, action) {
  state.error = action.error;
  state.status = action.type;
},


 //matchfriend
 matchfriendlistRequest(state, action) {
  state.status = action.type;
},
matchfriendlistSuccess(state, action) {
  state.matchfriendlistResponse = action.payload;
  state.status = action.type;
},
matchfriendlistFailure(state, action) {
  state.error = action.error;
  state.status = action.type;
},
   
  },
});

export const {
  matchsuggestionlistRequest,
  matchsuggestionlistSuccess,
  matchsuggestionlistFailure,
  matchuserdetailsRequest,
  matchuserdetailsSuccess,
  matchuserdetailsFailure,
  followuserRequest,
  followuserSuccess,
  followuserFailure,
  interestuserRequest,
  interestuserSuccess,
  interestuserFailure,
  tigermatchjoinRequest,
  tigermatchjoinSuccess,
  tigermatchjoinFailure,
  matchrequestlistRequest,
  matchrequestlistSuccess,
  matchrequestlistFailure,
  matchfriendlistRequest,
  matchfriendlistSuccess,
  matchfriendlistFailure

 
} = MatchSlice.actions;

export default MatchSlice.reducer;
