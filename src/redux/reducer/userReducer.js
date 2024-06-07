// reducers/userReducer.js
import {
  SET_SIGNUP_INFO,
  SET_SIGNUP_STEP2_INFO,
  RESET_SIGNUP_INFO,
  RESET_SIGNUP_STEP2_INFO,
} from '../action/Types';

const initialState = {
  signupInfo: {
    firstName: '',
    lastName: '',
    email: '',
    mobileNo:'',
    password: '',
    confirmPassword: '',
  },
  signupInfoStep2: {
    gender: '',
    EducationMajor: '',
    SelectDegree: '',
    UseType: '',
    degreeStartYear: '',
    actualGraduationYear: '',
    currentlyStudyingInUniversity:false,
    isAgreeToTerm:false
  },
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SIGNUP_INFO:
      return {...state, signupInfo: action.payload};
    case RESET_SIGNUP_INFO:
      return {...state, signupInfo: initialState.signupInfo};
    case SET_SIGNUP_STEP2_INFO:
      return {...state, signupInfoStep2: action.payload};
    case RESET_SIGNUP_STEP2_INFO:
      return {...state, signupInfoStep2: initialState.signupInfoStep2};

    default:
      return state;
  }
};


export default userReducer;



