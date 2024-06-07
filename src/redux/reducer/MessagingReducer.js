import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  status: '',
  isLoading: true,
  chatListRes: {},
  chatMessageListRes: {},
  mediaLink: {},
  error: {},
  blockunblockRes:{}
};

const MessagingSlice = createSlice({
  name: 'Messaging',
  initialState,
  reducers: {
    //token

    //Signup page
    getChatListRequest(state, action) {
      state.status = action.type;
    },
    getChatListSuccess(state, action) {
      state.chatListRes = action.payload;
      state.status = action.type;
    },
    getChatListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //friend listing page
    getChatMessageListRequest(state, action) {
      state.status = action.type;
    },
    getChatMessageListSuccess(state, action) {
      state.chatMessageListRes = action.payload;
      state.status = action.type;
    },
    getChatMessageListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    getMediaLinkRequest(state, action) {
      state.status = action.type;
    },
    getMediaLinkSuccess(state, action) {
      state.mediaLink = action.payload;
      state.status = action.type;
    },
    getMediaLinkFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    blockunblockRequest(state, action) {
      state.status = action.type;
    },
    blockunblockSuccess(state, action) {
      state.blockunblockRes = action.payload;
      state.status = action.type;
    },
    blockunblockFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
  },
});

export const {
  getChatListRequest,
  getChatListSuccess,
  getChatListFailure,

  getChatMessageListRequest,
  getChatMessageListSuccess,
  getChatMessageListFailure,

  getMediaLinkRequest,
  getMediaLinkSuccess,
  getMediaLinkFailure,

  blockunblockRequest,
  blockunblockSuccess,
  blockunblockFailure
} = MessagingSlice.actions;

export default MessagingSlice.reducer;
