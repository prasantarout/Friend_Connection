import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  status: '',
  isLoading: true,
  eventRequestListRes: {},
  eventUpcomingListRes: {},
  eventCompletedRes: {},
  eventDetailsRes: {},
  eventEnrolmentRes: {},
  RelatedEventRes: {},
  sendNotificationRes:{}
};

const PostSlice = createSlice({
  name: 'Event',
  initialState,
  reducers: {
    //token

    //event list
    EventListRequest(state, action) {
      state.status = action.type;
    },
    EventListSuccess(state, action) {
      state.eventRequestListRes = action.payload;
      state.status = action.type;
    },
    EventListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    EventUpcomingRequest(state, action) {
      state.status = action.type;
    },
    EventUpcomingSuccess(state, action) {
      state.eventUpcomingListRes = action.payload;
      state.status = action.type;
    },
    EventUpcomingFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    EventCompletedRequest(state, action) {
      state.status = action.type;
    },
    EventCompletedSuccess(state, action) {
      state.eventCompletedRes = action.payload;
      state.status = action.type;
    },
    EventCompletedFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    EventDetailsRequest(state, action) {
      state.status = action.type;
    },
    EventDetailsSuccess(state, action) {
      state.eventDetailsRes = action.payload;
      state.status = action.type;
    },
    EventDetailsFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },


    sendRequestRequest(state, action) {
      state.status = action.type;
    },
    sendRequestSuccess(state, action) {
      state.sendNotificationRes = action.payload;
      state.status = action.type;
    },
    sendRequestFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
   
   
    EventEnrolmentRequest(state, action) {
      state.status = action.type;
    },
    EventEnrolmentSuccess(state, action) {
      state.eventEnrolmentRes = action.payload;
      state.status = action.type;
    },
    EventEnrolmentFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    RelatedEventRequest(state, action) {
      state.status = action.type;
    },
    RelatedEventSuccess(state, action) {
      state.RelatedEventRes = action.payload;
      state.status = action.type;
    },
    RelatedEventFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
  },
});

export const {
  EventListRequest,
  EventListFailure,
  EventListSuccess,

  EventUpcomingRequest,
  EventUpcomingFailure,
  EventUpcomingSuccess,

  EventCompletedRequest,
  EventCompletedSuccess,
  EventCompletedFailure,

  EventDetailsRequest,
  EventDetailsSuccess,
  EventDetailsFailure,

  EventEnrolmentRequest,
  EventEnrolmentSuccess,
  EventEnrolmentFailure,

  RelatedEventRequest,
  RelatedEventSuccess,
  RelatedEventFailure,

  sendRequestRequest,
  sendRequestSuccess,
  sendRequestFailure
} = PostSlice.actions;

export default PostSlice.reducer;
