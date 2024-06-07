import React, {useState, useEffect} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Fonts, Icons} from '../../themes/ImagePath';
import normalize from '../../utils/helpers/dimen';
import MyStatusBar from '../../utils/helpers/MyStatusBar';
import TextInputItem from '../../components/TextInput';
import {Colors} from '../../themes/Colors';

let status = '';
import Loader from '../../utils/helpers/Loader';
import {globalConstant} from '../../utils/helpers/GlobalConstant';
import ButtonCom from '../../components/ButtonCom';
import DropDownComponent from '../../components/DropDownComponent';
import {useDispatch, useSelector} from 'react-redux';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import {
  classListRequest,
  degreeListRequest,
  getProfileRequest,
  signupRequest,
  streamListRequest,
} from '../../redux/reducer/AuthReducer';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment/moment';
import showErrorAlert from '../../utils/helpers/Toast';
import connectionrequest from '../../utils/helpers/NetInfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../utils/helpers/constants';
import {returnKeyLabel} from 'deprecated-react-native-prop-types/DeprecatedTextInputPropTypes';

export default function SignupStep2(props) {
  const signUpData = props?.route.params?.SignUpData;
  // console.log(signUpData, 'ddsadasdsad');
  const [isSelected, setIsSelected] = useState(false);
  const [isSelected1, setIsSelected1] = useState(false);
  const [usernamefocus, setusernamefocus] = useState(false);
  const [isClassDropDownOpen, setIsClassDropDownOpen] = useState(false);
  const [isEducationDropDownOpen, setIsEducationDropDownOpen] = useState(false);
  const [isDegreeDropDownOpen, setIsDegreeDropDownOpen] = useState(false);
  const [isUserTypeDropDownOpen, setIsUserTypeDropDownOpen] = useState(false);
  const [isStartDatePicker, setIsStartDatePicker] = useState(false);
  const [isStartDatePicker1, setIsStartDatePicker1] = useState(false);
  const [isDegreeYearDropDownOpen, setDegreeYearDropDownOpen] = useState(false);
  const [isGraduationYearDropDownOpen, setGraduationYearDropDownOpen] =
    useState(false);
  const [isGendersDropDownOpen, setIsGenderDropDownOpen] = useState(false);
  const [dateShow, setDate] = useState('');
  const [dateShow1, setDate1] = useState('');
  const [IsClass, setIsClass] = useState('');
  const [IsDegree, setIsDegree] = useState('');
  const [isUserType, setIsUserType] = useState('');
  const [IsStream, setIsStream] = useState('');
  const [dataItemValue, setDataItemValue] = useState('');
  const [gender, setGender] = useState('');
  const genderDataItem = [
    {
      id: 1,
      title: 'Male',
    },
    {
      id: 2,
      title: 'Female',
    },
    {
      id: 3,
      title: 'Other',
    },
  ];
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const isFocus = useIsFocused();
  var currentDate = new Date();
  var currentYears = currentDate.getFullYear();

  useEffect(() => {
    dispatch(classListRequest());
    dispatch(degreeListRequest());
    dispatch(streamListRequest());
  }, [isFocus]);

  const getAllFavoriteRoute = async () => {
    // setLoading(true);
    let userId;
    await AsyncStorage.getItem('SignUp').then(result => {
      if (result != null) {
        const dataItem = JSON.parse(result);
        userId = dataItem;
      }
    });
    setDataItemValue(userId);
  };

  useEffect(() => {
    getAllFavoriteRoute();
  }, []);

  const currentYear = new Date().getFullYear();
  const yearsArray = [];

  for (let i = 0; i < 80; i++) {
    const yearObject = {
      id: currentYear - i,
      title: currentYear - i,
    };
    yearsArray.push(yearObject);
  }

  const SignupStep = () => {
    // debugger;
    if (gender === '') {
      showErrorAlert('Please select your gender');
      return;
    }
    // if (IsClass == '') {
    //   showErrorAlert('Please select your class');
    //   return;
    // }
    if (IsStream == '') {
      showErrorAlert('Please select your major');
      return;
    }
    if (IsDegree == '') {
      showErrorAlert('Please select your degree');
      return;
    }

    if (isUserType == '') {
      showErrorAlert('Please select user type');
      return;
    }
    if (dateShow == '') {
      showErrorAlert('Please select your degree start year');
      return;
    }

    if (dateShow1 == '') {
      showErrorAlert('Please select your graduation year');
      return;
    }
    if (!isSelected && dateShow1 < dateShow) {
      showErrorAlert('Graduation year must greater than degree start year');
      return;
    }
    if (!isSelected1) {
      showErrorAlert('Please agree with our Terms & conditions');
      return;
    } else {
      let obj = {
        email:
          signUpData?.email !== undefined
            ? signUpData?.email
            : dataItemValue?.email,
        first_name:
          signUpData?.firstName !== undefined
            ? signUpData?.firstName
            : dataItemValue?.firstName,
        last_name:
          signUpData?.lastName !== undefined
            ? signUpData?.lastName
            : dataItemValue?.lastName,
        phone:
          signUpData?.phone !== undefined
            ? signUpData?.phone
            : dataItemValue?.phone,
        password:
          signUpData?.password !== undefined
            ? signUpData?.password
            : dataItemValue?.password,
        user_type: isUserType === 'Alumni' ? 'Ex-Alumni' : isUserType,
        degree_start_date: dateShow ? dateShow.toString() : '',
        graduation_date: dateShow1 ? dateShow1.toString() : '',
        education_stream: IsStream?._id,
        // class: IsClass?._id,
        degree: IsDegree?._id,
        gender: gender,
        is_studying_in_the_university: isSelected
          ? 'Yes'
          : isUserType === 'Alumni'
            ? 'No'
            : 'No',
      };
      // console.log(obj, 'signupobj');
      // return;

      connectionrequest()
        .then(() => {
          dispatch(signupRequest(obj));
        })
        .catch(err => {
          showErrorAlert('Please connect To Internet');
        });
    }
  };

  let dataItem = [
    {
      id: 1,
      title: 'Student',
    },
    {
      id: 2,
      title: 'Alumni',
    },
  ];
  const handleSelectionToggle = () => {
    setIsSelected(!isSelected);
    // setDate(null);
    setDate1(null);
  };

  const handleSelectionToggle1 = () => {
    setIsSelected1(!isSelected1);
    // setDate(null);
    // setDate1(null);
  };

  const CustomSelectionIndicator = ({selected}) => (
    <View
      style={{
        height: 18,
        width: 18,
        marginRight: 5,
        borderWidth: 1,
        borderColor: selected ? 'gray' : 'gray',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: normalize(2),
      }}>
      {selected && isUserType !== 'Alumni' && (
        <Image
          source={Icons.check}
          style={{
            height: normalize(15), // Adjust the size of the tick mark
            width: normalize(15), // Adjust the size of the tick mark
            resizeMode: 'contain',
            tintColor: 'grey',
          }}
        />
      )}
    </View>
  );

  const CustomSelectionIndicator1 = ({selected1}) => (
    <View
      style={{
        height: 18,
        width: 18,
        marginRight: 5,
        borderWidth: 1,
        borderColor: selected1 ? 'gray' : 'gray',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: normalize(2),
      }}>
      {selected1 && (
        <Image
          source={Icons.check}
          style={{
            height: normalize(15), // Adjust the size of the tick mark
            width: normalize(15), // Adjust the size of the tick mark
            resizeMode: 'contain',
            tintColor: 'grey',
          }}
        />
      )}
    </View>
  );

  // const handleConfirm = date => {
  //   let selectedDate = new Date(date);
  //   let selectedDateFormated = moment(selectedDate).format('MM/DD/YYYY');
  //   setDate(selectedDateFormated);
  //   console.log(selectedDateFormated);
  //   hideDatePicker();
  // };
  // const handleConfirm1 = date => {
  //   let selectedDate = new Date(date);
  //   let selectedDateFormated = moment(selectedDate).format('MM/DD/YYYY');
  //   setDate1(selectedDateFormated);
  //   console.log(selectedDateFormated);
  //   hideDatePicker1();
  // };

  // const hideDatePicker = () => {
  //   setIsStartDatePicker(false);
  // };

  // const hideDatePicker1 = () => {
  //   setIsStartDatePicker1(false);
  // };

  if (status == '' || AuthReducer.status != status) {
    switch (AuthReducer.status) {
      case 'Auth/signupRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/signupSuccess':
        status = AuthReducer.status;
        dispatch(getProfileRequest());
        props?.navigation?.navigate('WaitingForApproval', {
          screen: 'WaitingForApproval',
        });
        AsyncStorage.removeItem('SignUp');
        AsyncStorage.removeItem(constants.SetupToken);
        break;
      case 'Auth/signupFailure':
        status = AuthReducer.status;
        break;
    }
  }

  return (
    <View
      style={{
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,
        backgroundColor: Colors.backgroundorange,
      }}>
      <StatusBar translucent backgroundColor={'transparent'} />
      <Loader visible={AuthReducer?.status === 'Auth/signupRequest'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={{flex: 1}}>
        <ScrollView
          nestedScrollEnabled
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: normalize(20)}}>
          <View style={styles.mainContainer}>
            <ImageBackground
              source={Icons.tiger1}
              style={{height: '100%', width: '100%', resizeMode: 'cover'}}>
              <View
                style={{
                  height: Platform.OS == 'ios' ? normalize(25) : normalize(15),
                }}
              />
              {/* header */}
              <View
                style={{
                  marginTop: '15.7%',
                  flexDirection: 'row',
                  marginHorizontal: globalConstant.marginHorizontal,
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate('SignUp');
                  }}
                  style={{
                    height: normalize(32),
                    width: normalize(32),
                    backgroundColor: 'rgba(176,176,176,0.55)',
                    borderRadius: normalize(8),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={Icons.rightBack}
                    style={{height: '40%', width: '40%', resizeMode: 'contain'}}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: normalize(20),
                      fontFamily: Fonts.OpenSans_Bold,
                    }}>
                    Education Details
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </View>
          <View
            style={{
              marginHorizontal: normalize(12),
              paddingHorizontal: normalize(12),
              paddingTop: normalize(42),
              paddingBottom: normalize(20),
              marginTop: Platform.OS == 'android' ? normalize(-80) : '-17%',
              borderRadius: 20,
              overflow: 'hidden',
              backgroundColor: Colors.white,
            }}>
            <Text style={styles.pageTitle}>
              Enter Education{' '}
              <Text style={{color: Colors.orange}}>Details</Text>
            </Text>

            <Text style={styles.pageSubtitle}>
              {/* Lorem Ipsum is simply dummy text. */}
            </Text>
            <DropDownComponent
              isrightimage={Icons.down}
              toptext={'Gender'}
              width={'100%'}
              value={gender ? gender : 'Select Gender'}
              onPress={() => {
                setIsGenderDropDownOpen(!isGendersDropDownOpen);
                setIsEducationDropDownOpen(false);
                setGraduationYearDropDownOpen(false);
                setDegreeYearDropDownOpen(false);
                setIsUserTypeDropDownOpen(false);
                setIsClassDropDownOpen(false);
                setIsUserTypeDropDownOpen(false);
                setGraduationYearDropDownOpen(false);
                //   setIsDegreeDropDownOpen(false);
              }}
              onSelectData={res => {
                // console.log(res, 'dsadkhj');
                setGender(res.item?.title);
                setIsGenderDropDownOpen(false);
              }}
              type="dropdown"
              isOpenDropDown={isGendersDropDownOpen}
              drpDownArr={[{id: -1, title: 'Select Gender'}, ...genderDataItem]}
              isSignUpGenderSelect={179}
            />
            {/* <DropDownComponent
              isrightimage={Icons.down}
              toptext={'Class'}
              width={Dimensions?.get('window').width * 0.85}
              value={IsClass ? IsClass?.title : 'Select Class'}
              onPress={() => {
                setIsClassDropDownOpen(!isClassDropDownOpen);
                setIsEducationDropDownOpen(false);
                setGraduationYearDropDownOpen(false);
                setIsDegreeDropDownOpen(false);
                setIsGenderDropDownOpen(false);
                setIsUserTypeDropDownOpen(false);
              }}
              onSelectData={res => {
                setIsClass(res.item);
                setIsClassDropDownOpen(false);
              }}
              type="dropdown"
              isOpenDropDown={isClassDropDownOpen}
              drpDownArr={[
                {id: -1, title: 'Select Class'},
                ...(AuthReducer?.classListRes?.data || []),
              ]}
              isSignUpClassSelect={41}
            /> */}
            <DropDownComponent
              isrightimage={Icons.down}
              toptext={'Education Major'}
              width="100%"
              value={IsStream ? IsStream?.title : 'Select Major'}
              onPress={() => {
                setIsEducationDropDownOpen(!isEducationDropDownOpen);
                setIsClassDropDownOpen(false);
                setIsDegreeDropDownOpen(false);
                setDegreeYearDropDownOpen(false);
                setIsGenderDropDownOpen(false);
                setGraduationYearDropDownOpen(false);
                setIsUserTypeDropDownOpen(false);
              }}
              isOpenDropDown={isEducationDropDownOpen}
              drpDownArr={[
                {id: -1, title: 'Select Major'},
                ...(AuthReducer?.streamListRes?.data || []),
              ]}
              onSelectData={res => {
                setIsStream(res.item);
                setIsEducationDropDownOpen(false);
              }}
              type="dropdown"
              isEducationSelect={5}
            />
            <DropDownComponent
              isrightimage={Icons.down}
              toptext={'Degree'}
              placeholder={'Username'}
              width="100%"
              value={IsDegree ? IsDegree?.title : 'Select Degree'}
              onPress={() => {
                setIsDegreeDropDownOpen(!isDegreeDropDownOpen);
                setIsClassDropDownOpen(false);
                setGraduationYearDropDownOpen(false);
                setDegreeYearDropDownOpen(false);
                setIsEducationDropDownOpen(false);
                setIsGenderDropDownOpen(false);
                setIsUserTypeDropDownOpen(false);
              }}
              isOpenDropDown={isDegreeDropDownOpen}
              drpDownArr={[
                {id: -1, title: 'Select Degree'},
                ...(AuthReducer?.degreeListRes?.data || []),
              ]}
              onSelectData={res => {
                setIsDegree(res.item);
                setIsDegreeDropDownOpen(false);
              }}
              type="dropdown"
              isDegreeSelect={6}
            /> 
            <DropDownComponent
              isrightimage={Icons.down}
              toptext={'User Type'}
              placeholder={'Use type'}
              width="100%"
              value={isUserType ? isUserType : 'Select User Type'}
              onPress={() => {
                setIsUserTypeDropDownOpen(!isUserTypeDropDownOpen);
                setIsClassDropDownOpen(false);
                setIsEducationDropDownOpen(false);
                setIsDegreeDropDownOpen(false);
                setIsGenderDropDownOpen(false);
                setDegreeYearDropDownOpen(false);
                setGraduationYearDropDownOpen(false);
              }}
              isOpenDropDown={isUserTypeDropDownOpen}
              drpDownArr={[
                {id: -1, title: 'Select User Type'},
                ...(dataItem || []),
              ]}
              onSelectData={res => {
                setIsUserType(res.item.title);
                setIsUserTypeDropDownOpen(false);
              }}
              type="dropdown"
              isUserTypeSelect={7}
            />
            <DropDownComponent
              isrightimage={Icons.down}
              toptext={'Degree Start Year'}
              placeholder={'Username'}
              width="100%"
              value={dateShow ? dateShow : 'Select Year'}
              onPress={() => {
                setDegreeYearDropDownOpen(!isDegreeYearDropDownOpen);
                setIsClassDropDownOpen(false);
                setIsEducationDropDownOpen(false);
                setIsGenderDropDownOpen(false);
                setIsDegreeDropDownOpen(false);
                setGraduationYearDropDownOpen(false);
                setIsUserTypeDropDownOpen(false);
              }}
              isOpenDropDown={isDegreeYearDropDownOpen}
              drpDownArr={[{id: -1, title: 'Select Year'}, ...yearsArray]}
              onSelectData={res => {
                setDate1('');
                // console.log(res.item,"degree");
                setDate(res.item?.title);
                setDegreeYearDropDownOpen(false);
              }}
              type="dropdown"
              isDegreeYearSelects={18}
            />

            <DropDownComponent
              isrightimage={Icons.down}
              toptext={'Anticipated or Actual Graduation Year'}
              placeholder={'Username'}
              width="100%"
              value={dateShow1 ? dateShow1 : 'Select Year'}
              onPress={() => {
                if (isSelected) {
                  return;
                } else {
                  setGraduationYearDropDownOpen(!isGraduationYearDropDownOpen);
                  setIsClassDropDownOpen(false);
                  setIsEducationDropDownOpen(false);
                  // setIsUniversityDownOpen(false);
                  setIsDegreeDropDownOpen(false);
                  setDegreeYearDropDownOpen(false);
                  setIsUserTypeDropDownOpen(false);
                }
              }}
              isOpenDropDown={isGraduationYearDropDownOpen}
              drpDownArr={[
                {id: -1, title: 'Select Year'},
                ...yearsArray.filter(_year =>
                  dateShow ? _year.title > dateShow : _year,
                ),
              ]}
              onSelectData={res => {
                setDate1(res.item.title);
                setGraduationYearDropDownOpen(false);
              }}
              type="dropdown"
              isGraduationSelect={20}
              isDisable={dateShow === currentYears}
            />
            {/* <DropDownComponent
              isrightimage={Icons.calendars}
              toptext={'Degree Start Date'}
              width="100%"
              value={dateShow ? dateShow : 'Select Date'}
              onPress={() => {
                setIsStartDatePicker(!isStartDatePicker);
              }}
              type="datePicker"
            /> */}

            {/* <DateTimePickerModal
              date={new Date()}
              textColor={Colors.textBlack}
              backdropStyleIOS={Colors.textBlack}
              buttonTextColorIOS={Colors.textBlack}
              isVisible={isStartDatePicker}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              // minimumDate={new Date()}
            /> */}
            {/* <DropDownComponent
              isrightimage={Icons.calendars}
              toptext={'Anticipated or Actual Graduation Date'}
              width="100%"
              value={dateShow1 ? dateShow1 : 'Select Year'}
              onPress={() => {
                setIsStartDatePicker1(!isStartDatePicker1);
              }}
              type="datePicker"
            /> */}
            {/* <DateTimePickerModal
              date={new Date()}
              textColor={Colors.textBlack}
              backdropStyleIOS={Colors.textBlack}
              buttonTextColorIOS={Colors.textBlack}
              isVisible={isStartDatePicker1}
              mode="date"
              onConfirm={handleConfirm1}
              onCancel={hideDatePicker1}
              // minimumDate={new Date()}
            /> */}
            {console.log(dateShow1, 'dxasdsakd')}
            <View style={{flexDirection: 'row', marginVertical: normalize(16)}}>
              <TouchableOpacity
                disabled={
                  isUserType === 'Alumni'
                  // dateShow === currentYears
                }
                onPress={handleSelectionToggle}
                style={{
                  height: normalize(18),
                  width: normalize(18),
                  marginRight: normalize(5),
                }}>
                <CustomSelectionIndicator selected={isSelected} />
                {/* <Image
                  source={Icons.ticksquare}
                  style={{height: '100%', width: '100%', resizeMode: 'cover'}}
                /> */}
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: normalize(13),
                  fontFamily: Fonts.OpenSans_Regular,
                  color: Colors.textBlack,
                }}>
                Currently Studying in the University
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: normalize(10),
                bottom: normalize(4),
              }}>
              <TouchableOpacity
                // disabled={
                //   isUserType === 'Alumni'
                //   // dateShow === currentYears
                // }
                onPress={handleSelectionToggle1}
                style={{
                  height: normalize(18),
                  width: normalize(18),
                  marginRight: normalize(5),
                }}>
                <CustomSelectionIndicator1 selected1={isSelected1} />
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: normalize(13),
                  fontFamily: Fonts.OpenSans_Regular,
                  color: Colors.textBlack,
                }}>
                I agree to the Tiger Connect{' '}
                <Text
                  style={{
                    fontSize: normalize(13),
                    fontFamily: Fonts.OpenSans_Regular,
                    color: Colors.orange,
                  }}
                  onPress={() =>
                    Linking.openURL(
                      'https://www.tigerconnect.com/terms-and-conditions',
                    )
                  }>
                  Terms & Conditions
                </Text>
              </Text>
            </View>
            <ButtonCom
              onPress={() => SignupStep()}
              width={'100%'}
              backgroundColor={'#1F2440'}
              // marginTop={normalize(5)}
              marginBottom={normalize(16)}
              title={'Sign Up'}
            />
            <View style={styles.graycontainer}>
              <Text style={styles.graycontainerText}>
                A Princeton official student or alumni email is required to
                login or join this community ({' '}
                <Text style={styles.orangeTextWithUnderline}>
                  Princeton.edu
                </Text>{' '}
                or
                <Text style={styles.orangeTextWithUnderline}>
                  Alumni.Princeton.edu
                </Text>{' '}
                )
              </Text>
            </View>
          </View>
          <Text style={[styles.italicText, {paddingHorizontal: normalize(40)}]}>
            Tiger Connect is not legally affiliated with or endorsed by
            Princeton University.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height * 0.33,
    borderBottomLeftRadius: normalize(15),
    borderBottomRightRadius: normalize(15),
    overflow: 'hidden',
  },
  pageTitle: {
    fontSize: normalize(18),
    fontFamily: Fonts.OpenSans_SemiBold,
    color: Colors.textBlack,
    textAlign: 'center',
  },
  pageSubtitle: {
    fontSize: normalize(12),
    fontFamily: Fonts.OpenSans_Regular,
    color: Colors.textBlack,
    textAlign: 'center',
    marginTop: normalize(12),
    marginBottom: normalize(10),
  },
  bottomBelowText: {
    fontSize: normalize(14),
    fontFamily: Fonts.OpenSans_Regular,
    color: Colors.textBlack,
    textAlign: 'center',
    marginTop: normalize(4),
    marginBottom: normalize(10),
  },
  graycontainer: {
    padding: normalize(13),
    backgroundColor: 'rgba(31,36,64,0.1)',
    borderRadius: normalize(15),
  },
  graycontainerText: {
    fontSize: normalize(11),
    fontFamily: Fonts.OpenSans_Regular,
    color: Colors.textBlack,
    textAlign: 'center',
    marginTop: normalize(4),
    marginBottom: normalize(10),
    lineHeight: normalize(18),
  },
  orangeTextWithUnderline: {
    color: Colors.orange,
    textDecorationColor: Colors.orange,
    textDecorationLine: 'underline',
  },
  italicText: {
    fontSize: normalize(11),
    fontFamily: Fonts.OpenSans_MediumItalic,
    color: Colors.textBlack,
    textAlign: 'center',
    marginTop: normalize(12),
    marginBottom: normalize(6),
    lineHeight: normalize(16),
    paddingHorizontal: normalize(10),
  },
});
