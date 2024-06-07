import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: '',
  isLoading: true,
  groupCreatedListRes: {},
  groupCreateRes: {},
  postSubmitRes: {},
  postUpdateRes: {},
  groupSendInvitationRes: {},
  getGroupPostDetailsRes: {},
  getGroupDetails: {},
  groupInviteFriendListRes: {},
  updategroupRes: {},
  pendinggroupRes: {},
  joinedgroupRes: {},
  duringJoinAGroupRes: {},
  duringRejectAGroupRes: {},
  duringLeaveAGroupRes: {},
};

const GroupSlice = createSlice({
  name: 'Group',
  initialState,
  reducers: {
    //token

    //Signup page
    groupCreatedListRequest(state, action) {
      state.status = action.type;
    },
    groupCreatedListSuccess(state, action) {
      state.groupCreatedListRes = action.payload;
      state.status = action.type;
    },
    groupCreatedListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //Signup page
    groupCreateRequest(state, action) {
      state.status = action.type;
    },
    groupCreateSuccess(state, action) {
      state.groupCreateRes = action.payload;
      state.status = action.type;
    },
    groupCreateFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //Signup page
    groupInvitationRequest(state, action) {
      state.status = action.type;
    },
    groupInvitationSuccess(state, action) {
      state.groupSendInvitationRes = action.payload;
      state.status = action.type;
    },
    groupInvitationFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },


    getGroupPostRequest(state, action) {
      state.status = action.type;
    },
    getGroupPostSuccess(state, action) {
      state.getGroupPostDetailsRes = action.payload;
      state.status = action.type;
    },
    getGroupPostFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },


    getGroupDetailsRequest(state, action) {
      state.status = action.type;
    },
    getGroupDetailsSuccess(state, action) {
      state.getGroupDetails = action.payload;
      state.status = action.type;
    },
    getGroupDetailsFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },



    getGroupInviteDetailsRequest(state, action) {
      state.status = action.type;
    },
    getGroupInviteDetailsSuccess(state, action) {
      state.groupInviteFriendListRes = action.payload;
      state.status = action.type;
    },
    getGroupInviteDetailsFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    updategroupRequest(state, action) {
      state.status = action.type;
    },
    updategroupSuccess(state, action) {
      state.updategroupRes = action.payload;
      state.status = action.type;
    },
    updategroupFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },


    //pendinggroup
    pendinggroupRequest(state, action) {
      state.status = action.type;
    },
    pendinggroupSuccess(state, action) {
      state.pendinggroupRes = action.payload;
      state.status = action.type;
    },
    pendinggroupFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //joinedgroup
    joinedgroupRequest(state, action) {
      state.status = action.type;
    },
    joinedgroupSuccess(state, action) {
      state.joinedgroupRes = action.payload;
      state.status = action.type;
    },
    joinedgroupFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    //To join a group
    toJoinAGroupRequest(state, action) {
      state.status = action.type;
    },
    toJoinAGroupSuccess(state, action) {
      state.duringJoinAGroupRes = action.payload;
      state.status = action.type;
    },
    toJoinAGroupFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    //To Invite a group
    toRejectAGroupRequest(state, action) {
      state.status = action.type;
    },
    toRejectAGroupSuccess(state, action) {
      state.duringRejectAGroupRes = action.payload;
      state.status = action.type;
    },
    toRejectAGroupFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    //To Leave a group
    toLeaveAGroupRequest(state, action) {
      state.status = action.type;
    },
    toLeaveAGroupSuccess(state, action) {
      state.duringLeaveAGroupRes = action.payload;
      state.status = action.type;
    },
    toLeaveAGroupFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },



  },
});

export const {
  groupCreateRequest,
  groupCreateSuccess,
  groupCreateFailure,

  groupCreatedListRequest,
  groupCreatedListSuccess,
  groupCreatedListFailure,

  groupInvitationRequest,
  groupInvitationSuccess,
  groupInvitationFailure,

  getGroupPostRequest,
  getGroupPostSuccess,
  getGroupPostFailure,

  getGroupDetailsRequest,
  getGroupDetailsSuccess,
  getGroupDetailsFailure,

  getGroupInviteDetailsRequest,
  getGroupInviteDetailsSuccess,
  getGroupInviteDetailsFailure,

  updategroupRequest,
  updategroupSuccess,
  updategroupFailure,

  pendinggroupRequest,
  pendinggroupSuccess,
  pendinggroupFailure,

  joinedgroupRequest,
  joinedgroupSuccess,
  joinedgroupFailure,

  toJoinAGroupRequest,
  toJoinAGroupSuccess,
  toJoinAGroupFailure,

  toRejectAGroupRequest,
  toRejectAGroupSuccess,
  toRejectAGroupFailure,

  toLeaveAGroupRequest,
  toLeaveAGroupSuccess,
  toLeaveAGroupFailure,
} = GroupSlice.actions;

export default GroupSlice.reducer;
