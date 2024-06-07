// actions/userActions.js
import {
SET_SIGNUP_INFO,
SET_SIGNUP_STEP2_INFO,

RESET_SIGNUP_INFO,
RESET_SIGNUP_STEP2_INFO,
SET_UNAUTHORIZED_INFO
} from './Types';

export const setSignInInfo = signInInfo => ({
  type: SET_SIGNUP_INFO,
  payload: signInInfo,
});

export const setSignUpStep2Info = signUpInfoStep2 => ({
  type: SET_SIGNUP_STEP2_INFO,
  payload: signUpInfoStep2,
});

export const resetSignInInfo = () => ({
  type: RESET_SIGNUP_INFO,
});

export const resetSignUpStep2Info=()=>({
  type:RESET_SIGNUP_STEP2_INFO,
})

export const setUnauthorized = () => ({
  type:SET_UNAUTHORIZED_INFO,
});