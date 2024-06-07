import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  status: '',
  isLoading: true,
  signupResponse: {},
  loginResponse: {},
  forgotpasswordResponse: {},
  otpverificationResponse: {},
  resendOtpRes: {},
  craetenewpasswordResponse: {},
  getTokenResponse: '',

  getProfileRes: {},

  mobileOtpSentResponse: {},

  verifiedMobileResponse: {},

  deleteAccountRes: {},

  classListRes: {},

  degreeListRes: {},

  streamListRes: {},

  ResetPasswordRes: {},
  contactUsRes: {},
  updateProfileRes: {},
  universityListRes: {},
  notificationlistRes: {},
  cmsContentRes: {},
  getCmsContentRes: {},

  emailExitsRes: {},
  logoutRes:{}
};

const AuthSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    //token

    //Signup page
    signupRequest(state, action) {
      state.status = action.type;
    },
    signupSuccess(state, action) {
      state.signupResponse = action.payload;
      state.status = action.type;
    },
    signupFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    getTokenRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    getTokenSuccess(state, action) {
      state.isLoading = false;
      state.getTokenResponse = action.payload;
      state.status = action.type;
    },
    getTokenFailure(state, action) {
      state.isLoading = false;
      state.error = action.error;
      state.status = action.type;
    },

    //Sign in
    loginRequest(state, action) {
      state.status = action.type;
    },
    loginSuccess(state, action) {
      state.loginResponse = action.payload;
      state.status = action.type;
    },
    loginFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //otp verification
    otpverificationRequest(state, action) {
      state.status = action.type;
    },
    otpverificationSuccess(state, action) {
      state.otpverificationResponse = action.payload;
      state.status = action.type;
    },
    otpverificationFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //otp verification
    resendOtpRequest(state, action) {
      state.status = action.type;
    },
    resendOtpSuccess(state, action) {
      state.resendOtpRes = action.payload;
      state.status = action.type;
    },
    resendOtpFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //forgot password
    forgotpasswordRequest(state, action) {
      state.status = action.type;
    },
    forgotpasswordSuccess(state, action) {
      state.forgotpasswordResponse = action.payload;
      state.status = action.type;
    },
    forgotpasswordFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // cratenewpassword
    craetenewpasswordRequest(state, action) {
      state.status = action.type;
    },
    craetenewpasswordSuccess(state, action) {
      state.craetenewpasswordResponse = action.payload;
      state.status = action.type;
    },
    craetenewpasswordFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //logout
    logoutRequest(state, action) {
      state.status = action.type;
    },
    logoutSuccess(state, action) {
      state.logoutRes = action.payload;
      state.status = action.type;
    },
    logoutFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //delete account response
    deleteAccountRequest(state, action) {
      state.status = action.type;
    },
    deleteAccountSuccess(state, action) {
      state.deleteAccountRes = action.payload;
      state.status = action.type;
    },
    deleteAccountFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //class list response
    classListRequest(state, action) {
      state.status = action.type;
    },
    classListSuccess(state, action) {
      state.classListRes = action.payload;
      state.status = action.type;
    },
    classListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
    //degree list response
    degreeListRequest(state, action) {
      state.status = action.type;
    },
    degreeListSuccess(state, action) {
      state.degreeListRes = action.payload;
      state.status = action.type;
    },
    degreeListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //degree list response
    streamListRequest(state, action) {
      state.status = action.type;
    },
    streamListSuccess(state, action) {
      state.streamListRes = action.payload;
      state.status = action.type;
    },
    streamListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //university list response
    universityListRequest(state, action) {
      state.status = action.type;
    },
    universityListSuccess(state, action) {
      state.universityListRes = action.payload;
      state.status = action.type;
    },
    universityListFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //degree list response
    getProfileRequest(state, action) {
      state.status = action.type;
    },
    getProfileSuccess(state, action) {
      state.getProfileRes = action.payload;
      state.status = action.type;
    },
    getProfileFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //degree list response
    resetPasswordRequest(state, action) {
      state.status = action.type;
    },
    resetPasswordSuccess(state, action) {
      state.ResetPasswordRes = action.payload;
      state.status = action.type;
    },
    resetPasswordFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //contact us response
    contactUsRequest(state, action) {
      state.status = action.type;
    },
    contactUsSuccess(state, action) {
      state.contactUsRes = action.payload;
      state.status = action.type;
    },
    contactUsFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    //contact us response
    updateProfileRequest(state, action) {
      state.status = action.type;
    },
    updateProfileSuccess(state, action) {
      state.updateProfileRes = action.payload;
      state.status = action.type;
    },
    updateProfileFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    clearChangePasswordRequest(state, action) {
      state.status = action.type;
    },
    clearChangePasswordSuccess(state, action) {
      state.craetenewpasswordResponse = action.payload;
      state.status = action.type;
    },

    clearTokenRequest(state, action) {
      state.status = action.type;
    },
    clearTokenSuccess(state, action) {
      state.getTokenResponse = action.payload;
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

    
    clearProfileRequest(state, action) {
      state.status = action.type;
    },
    clearProfileSuccess(state, action) {
      state.getProfileRes = action.payload;
    },

    //contact us response
    notificationlistRequest(state, action) {
      state.status = action.type;
    },
    notificationlistSuccess(state, action) {
      state.notificationlistRes = action.payload;
      state.status = action.type;
    },
    notificationlistFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // cms content
    cmsContentRequest(state, action) {
      state.status = action.type;
    },
    cmsContentSuccess(state, action) {
      state.cmsContentRes = action.payload;
      state.status = action.type;
    },
    cmsContentFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // cms content
    getCmsContentRequest(state, action) {
      state.status = action.type;
    },
    GetCmsContentSuccess(state, action) {
      state.getCmsContentRes = action.payload;
      state.status = action.type;
    },
    GetCmsContentFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },

    // cms content
    validateEmailExitsRequest(state, action) {
      state.status = action.type;
    },
    validateEmailExitsSuccess(state, action) {
      state.emailExitsRes = action.payload;
      state.status = action.type;
    },
    validateEmailExitsFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
  },
});

export const {
  signupFailure,
  signupSuccess,
  signupRequest,

  getTokenRequest,
  getTokenSuccess,
  getTokenFailure,

  loginRequest,
  loginSuccess,
  loginFailure,

  forgotpasswordRequest,
  forgotpasswordSuccess,
  forgotpasswordFailure,

  craetenewpasswordRequest,
  craetenewpasswordFailure,
  craetenewpasswordSuccess,

  logoutRequest,
  logoutSuccess,
  logoutFailure,

  sendPasswordResetLinkRequest,
  sendPasswordResetLinkFailure,
  sendPasswordResetLinkSuccess,

  otpverificationRequest,
  otpverificationSuccess,
  otpverificationFailure,
  // refreshTokenRequest,refreshTokenSuccess,refreshTokenFailure,

  deleteAccountRequest,
  deleteAccountSuccess,
  deleteAccountFailure,

  classListRequest,
  classListSuccess,
  classListFailure,

  degreeListRequest,
  degreeListSuccess,
  degreeListFailure,

  streamListRequest,
  streamListSuccess,
  streamListFailure,

  universityListRequest,
  universityListSuccess,
  universityListFailure,

  getProfileRequest,
  getProfileSuccess,
  getProfileFailure,

  resendOtpRequest,
  resendOtpSuccess,
  resendOtpFailure,

  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,

  contactUsRequest,
  contactUsSuccess,
  contactUsFailure,

  cmsContentRequest,
  cmsContentSuccess,
  cmsContentFailure,

  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,

  getCmsContentRequest,
  GetCmsContentSuccess,
  GetCmsContentFailure,

  clearChangePasswordRequest,
  clearChangePasswordSuccess,

  clearContactUsRequest,
  clearContactUsSuccess,

  clearUpdateProfileRequest,
  clearUpdateProfileSuccess,
  notificationlistRequest,
  notificationlistSuccess,
  notificationlistFailure,

  validateEmailExitsRequest,
  validateEmailExitsSuccess,
  validateEmailExitsFailure,

  clearTokenRequest,
  clearTokenSuccess,

  clearProfileRequest,
  clearProfileSuccess,
} = AuthSlice.actions;

export default AuthSlice.reducer;
