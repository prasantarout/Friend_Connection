import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  status: '',
  isLoading: true,
  postListRequestRes: {},
  postSubmitRes: {},
  postUpdateRes: {},
  postDeleteRes: {},
  postReactionRes: {},
  postShareRes: {},
  postCommentRes: {},
  postCommentListRes: {},
  postCommentReactionRes: {},
  postFavoriteReactionRes: {},
  deletePostRes:{}
};

const PostSlice = createSlice({
  name: 'Post',
  initialState,
  reducers: {
    //token

    //Signup page
    postListRequest(state, action) {
      state.status = action.type;
    },
    postListSuccess(state, action) {
      state.postListRequestRes = action.payload;
      state.status = action.type;
    },
    postListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    //Signup page
    postSubmitRequest(state, action) {
      state.status = action.type;
    },
    postSubmitSuccess(state, action) {
      state.postSubmitRes = action.payload;
      state.status = action.type;
    },
    postSubmitFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //Signup page
    postUpdateRequest(state, action) {
      state.status = action.type;
    },
    postUpdateSuccess(state, action) {
      state.postUpdateRes = action.payload;
      state.status = action.type;
    },
    postUpdateFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //Signup page
    postDeleteRequest(state, action) {
      state.status = action.type;
    },
    postDeleteSuccess(state, action) {
      state.postDeleteRes = action.payload;
      state.status = action.type;
    },
    postDeleteFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //Signup page
    postShareRequest(state, action) {
      state.status = action.type;
    },
    postShareSuccess(state, action) {
      state.postShareRes = action.payload;
      state.status = action.type;
    },
    postShareFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    //Signup page
    postReactionRequest(state, action) {
      state.status = action.type;
    },
    postReactionSuccess(state, action) {
      state.postReactionRes = action.payload;
      state.status = action.type;
    },
    postReactionFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // post comment response
    postCommentRequest(state, action) {
      state.status = action.type;
    },
    postCommentSuccess(state, action) {
      state.postCommentRes = action.payload;
      state.status = action.type;
    },
    postCommentFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // post comment list
    postCommentListRequest(state, action) {
      state.status = action.type;
    },
    postCommentListSuccess(state, action) {
      state.postCommentListRes = action.payload;
      state.status = action.type;
    },
    postCommentListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    // post comment list
    postCommentReactionRequest(state, action) {
      state.status = action.type;
    },
    postCommentReactionSuccess(state, action) {
      state.postCommentReactionRes = action.payload;
      state.status = action.type;
    },
    postCommentReactionFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // post Favorite list
    postFavoriteRequest(state, action) {
      state.status = action.type;
    },
    postFavoriteSuccess(state, action) {
      state.postFavoriteReactionRes = action.payload;
      state.status = action.type;
    },
    postFavoriteFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // post Favorite list
    deletePostRequest(state, action) {
      state.status = action.type;
    },
    deletePostSuccess(state, action) {
      state.deletePostRes = action.payload;
      state.status = action.type;
    },
    deletePostFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },


    clearPostSubmitRequest(state, action) {
      state.status = action.type;
    },
    clearPostSubmitSuccess(state, action) {
      state.postSubmitRes = action.payload;
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
  postListRequest,
  postListSuccess,
  postListFailure,

  postSubmitRequest,
  postSubmitSuccess,
  postSubmitFailure,

  postUpdateRequest,
  postUpdateSuccess,
  postUpdateFailure,

  postDeleteRequest,
  postDeleteSuccess,
  postDeleteFailure,

  postReactionRequest,
  postReactionSuccess,
  postReactionFailure,

  clearChangePasswordRequest,
  clearChangePasswordSuccess,

  clearContactUsRequest,
  clearContactUsSuccess,

  clearUpdateProfileRequest,
  clearUpdateProfileSuccess,

  postShareRequest,
  postShareSuccess,
  postShareFailure,

  postCommentRequest,
  postCommentSuccess,
  postCommentFailure,

  postCommentListRequest,
  postCommentListSuccess,
  postCommentListFailure,

  postCommentReactionRequest,
  postCommentReactionSuccess,
  postCommentReactionFailure,

  postFavoriteRequest,
  postFavoriteSuccess,
  postFavoriteFailure,

  clearPostSubmitRequest,
  clearPostSubmitSuccess,

  deletePostRequest,
  deletePostSuccess,
  deletePostFailure
} = PostSlice.actions;

export default PostSlice.reducer;
