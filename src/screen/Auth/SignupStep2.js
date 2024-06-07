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
import {connect, useDispatch, useSelector} from 'react-redux';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import {
  classListRequest,
  cmsContentRequest,
  degreeListRequest,
  getCmsContentRequest,
  getProfileRequest,
  signupRequest,
  streamListRequest,
} from '../../redux/reducer/AuthReducer';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import moment from 'moment/moment';
import showErrorAlert from '../../utils/helpers/Toast';
import connectionrequest from '../../utils/helpers/NetInfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../utils/helpers/constants';
import {returnKeyLabel} from 'deprecated-react-native-prop-types/DeprecatedTextInputPropTypes';
import Modal from 'react-native-modal';
import HtmlTextComponent from '../../components/HtmlTextComponent';
import {WebView} from 'react-native-webview';
import {setSignUpStep2Info} from '../../redux/action/userActions';
const SignupStep2 = ({
  signupInfoStep2,
  setSignUpStep2Info,
  props,
  signupInfo,
}) => {
  const signUpData = props?.route.params?.SignUpData;
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
  const [isModalSelect, setIsModalSelect] = useState(false);
  const [formData, setFormData] = useState({});
  const navigation = useNavigation();

  console.log(signupInfo, '>>>>>>>>>>response');

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

  useEffect(() => {
    getAllFavoriteRoute();
    dispatch(cmsContentRequest());
  }, []);

  const currentYear = new Date().getFullYear();
  const yearsArray = [];
  const graduationArray = [];
  for (let i = 0; i < 86; i++) {
    const yearObject = {
      id: currentYear - i,
      title: currentYear - i,
    };
    const graduationObject = {
      id: currentYear + 6 - i,
      title: currentYear + 6 - i,
    };
    if (i < 80) yearsArray.push(yearObject);
    graduationArray.push(graduationObject);
  }

  const SignupStep = () => {
    // debugger;
    if (signupInfoStep2?.gender === '') {
      showErrorAlert('Please select your gender');
      return;
    }
    // if (IsClass == '') {
    //   showErrorAlert('Please select your class');
    //   return;
    // }
    if (signupInfoStep2?.EducationMajor == '') {
      showErrorAlert('Please select your major');
      return;
    }
    if (signupInfoStep2?.SelectDegree == '') {
      showErrorAlert('Please select your degree');
      return;
    }

    if (signupInfoStep2?.UseType == '') {
      showErrorAlert('Please select user type');
      return;
    }
    if (signupInfoStep2?.degreeStartYear == '') {
      showErrorAlert('Please select your degree start year');
      return;
    }

    if (signupInfoStep2?.actualGraduationYear == '') {
      showErrorAlert('Please select your graduation year');
      return;
    }
    if (
      !signupInfoStep2.currentlyStudyingInUniversity &&
      signupInfoStep2?.actualGraduationYear < signupInfoStep2?.degreeStartYear
    ) {
      showErrorAlert('Graduation year must greater than degree start year');
      return;
    }
    if (!signupInfoStep2?.isAgreeToTerm) {
      showErrorAlert('Please agree with our Terms & conditions');
      return;
    } else {
      let obj = {
        email:
          signupInfo?.email !== '' ? signupInfo?.email : dataItemValue?.email,
        first_name:
          signupInfo?.firstName !== ''
            ? signupInfo?.firstName
            : dataItemValue?.firstName,
        last_name:
          signupInfo?.lastName !== ''
            ? signupInfo?.lastName
            : dataItemValue?.lastName,
        phone:
          signupInfo?.mobileNo !== ''
            ? signupInfo?.mobileNo
            : dataItemValue?.phone,
        password:
          signupInfo?.password !== ''
            ? signupInfo?.password
            : dataItemValue?.password,
        user_type:
          signupInfoStep2?.UseType === 'Alumni'
            ? 'Ex-Alumni'
            : signupInfoStep2?.UseType,
        degree_start_date: signupInfoStep2?.degreeStartYear?.toString(),
        graduation_date: signupInfoStep2?.actualGraduationYear.toString(),
        education_stream: signupInfoStep2?.EducationMajor?._id,
        // class: IsClass?._id,
        degree: signupInfoStep2?.SelectDegree?._id,
        gender: signupInfoStep2?.gender,
        is_studying_in_the_university: isSelected
          ? 'Yes'
          : isUserType === 'Alumni'
            ? 'No'
            : 'No',
      };
      // console.log(obj, 'signupobj', signupInfoStep2);
      // return;
      connectionrequest()
        .then(async () => {
          dispatch(signupRequest(obj));
          await AsyncStorage.setItem('SignupStep2Data', JSON.stringify(obj));
        })
        .catch(err => {
          showErrorAlert('Please connect To Internet');
        });
    }
  };

  const getAllFavoriteRoute = async () => {
    const storedData = await AsyncStorage.getItem('SignupStep2Data');
    if (storedData) {
      setDataItemValue(JSON.parse(storedData));
      setFormData(JSON.parse(storedData));
    } else {
      let userId;
      await AsyncStorage.getItem('SignUp').then(result => {
        if (result != null) {
          const dataItem = JSON.parse(result);
          userId = dataItem;
        }
      });
      setDataItemValue(userId);
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
    handleInputChange('currentlyStudyingInUniversity', !isSelected);
    // setDate(null);
  };

  const handleSelectionToggle1 = () => {
    setIsSelected1(!isSelected1);
    handleInputChange('isAgreeToTerm', !isSelected1);

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

  const RenderContentModal = () => {
    return (
      <Modal
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating={true}
        isVisible={isModalSelect}
        style={{width: '100%', alignSelf: 'center', margin: 0}}
        animationInTiming={800}
        useNativeDriver={true}
        animationOutTiming={1000}
        onBackdropPress={() => {
          setIsModalSelect(false);
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(255, 255, 255, 1)',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            borderTopRightRadius: normalize(20),
            borderTopLeftRadius: normalize(20),
            paddingVertical: normalize(10),
            height: '90%',
          }}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: normalize(-10),
              // bottom:normalize(20),
              right: normalize(10),
              zIndex: 11111,
              backgroundColor: '#1F2440',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              height: normalize(40),
              width: normalize(40),
            }}
            onPress={() => setIsModalSelect(false)}>
            <Image
              source={Icons.cross}
              style={{width: normalize(15), height: normalize(15)}}
            />
          </TouchableOpacity>
          <ScrollView
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets={true}
            contentContainerStyle={{paddingBottom: '50%'}}>
            <View>
              <Text
                style={{
                  fontSize: normalize(16),
                  fontWeight: '500',
                  textAlign: 'center',
                  color: '#000',
                }}>
                Terms & Conditions
              </Text>
              <View style={{marginHorizontal: normalize(20)}}>
                <HtmlTextComponent
                  htmlContent={
                    AuthReducer?.getCmsContentRes?.data?.content !== '' &&
                    AuthReducer?.getCmsContentRes?.data?.content !== null &&
                    AuthReducer?.getCmsContentRes?.data?.content !==
                      undefined &&
                    AuthReducer?.getCmsContentRes?.data?.content
                  }
                  register={5}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };
  {
  }

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

  const afterSignUp = async () => {
    try {
      dispatch(getProfileRequest());
      navigation?.navigate('WaitingForApproval', {
        screen: 'WaitingForApproval',
      });
      await AsyncStorage.removeItem('SignUp');
      await AsyncStorage.removeItem(constants?.SetupToken);
    } catch (error) {}
  };

  useEffect(() => {
    if (AuthReducer.status == 'Auth/signupSuccess') {
      afterSignUp();
    }
  }, [AuthReducer.status]);

  const handleInputChange = (field, text) => {
    setSignUpStep2Info({...signupInfoStep2, [field]: text});
  };

  return (
    <View
      style={{
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,
        backgroundColor: Colors.backgroundorange,
      }}>
      <StatusBar translucent backgroundColor={'transparent'} />
      <Loader visible={AuthReducer?.status === 'Auth/signupRequest'} />
      <Loader visible={AuthReducer?.status === 'Auth/cmsContentRequest'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={{flex: 1}}>
        <ScrollView
          nestedScrollEnabled
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: normalize(100)}}>
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
                    navigation.navigate('SignUp');
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
              toptext={'Gender*'}
              width={'100%'}
              value={
                signupInfoStep2?.gender
                  ? signupInfoStep2?.gender
                  : 'Select Gender'
              }
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
                handleInputChange('gender', res.item?.title);
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
              toptext={'Education Major*'}
              width="100%"
              value={
                signupInfoStep2?.EducationMajor?.title
                  ? signupInfoStep2?.EducationMajor?.title
                  : 'Select Major'
              }
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
                handleInputChange('EducationMajor', res.item);
                setIsStream(res.item);
                setIsEducationDropDownOpen(false);
              }}
              type="dropdown"
              isEducationSelect={5}
            />
            <DropDownComponent
              isrightimage={Icons.down}
              toptext={'Degree*'}
              placeholder={'Username'}
              width="100%"
              value={
                signupInfoStep2?.SelectDegree?.title
                  ? signupInfoStep2?.SelectDegree?.title
                  : 'Select Degree'
              }
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
                handleInputChange('SelectDegree', res.item);
                setIsDegree(res.item);
                setIsDegreeDropDownOpen(false);
              }}
              type="dropdown"
              isDegreeSelect={6}
            />
            <DropDownComponent
              isrightimage={Icons.down}
              toptext={'User Type*'}
              placeholder={'Use type'}
              width="100%"
              value={
                signupInfoStep2?.UseType
                  ? signupInfoStep2?.UseType
                  : 'Select User Type'
              }
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
                handleInputChange('UseType', res.item?.title);
                setIsUserType(res.item.title);
                setIsUserTypeDropDownOpen(false);
              }}
              type="dropdown"
              isUserTypeSelect={7}
            />
            <DropDownComponent
              isrightimage={Icons.down}
              toptext={'Degree Start Year*'}
              placeholder={'Username'}
              width="100%"
              value={
                signupInfoStep2?.degreeStartYear
                  ? signupInfoStep2?.degreeStartYear
                  : 'Select Year'
              }
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
                handleInputChange('degreeStartYear', res.item?.title);
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
              value={
                signupInfoStep2?.actualGraduationYear
                  ? signupInfoStep2?.actualGraduationYear
                  : 'Select Year'
              }
              onPress={() => {
                // if (isSelected) {
                //   return;
                // } else {
                setGraduationYearDropDownOpen(!isGraduationYearDropDownOpen);
                setIsClassDropDownOpen(false);
                setIsEducationDropDownOpen(false);
                // setIsUniversityDownOpen(false);
                setIsDegreeDropDownOpen(false);
                setDegreeYearDropDownOpen(false);
                setIsUserTypeDropDownOpen(false);
                // }
              }}
              isOpenDropDown={isGraduationYearDropDownOpen}
              drpDownArr={[
                {id: -1, title: 'Select Year'},
                ...graduationArray.filter(_year =>
                  dateShow ? _year.title > dateShow : _year,
                ),
              ]}
              onSelectData={res => {
                handleInputChange('actualGraduationYear', res.item?.title);
                setDate1(res.item.title);
                setGraduationYearDropDownOpen(false);
              }}
              type="dropdown"
              isGraduationSelect={20}
              // isDisable={dateShow === currentYears}
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
                <CustomSelectionIndicator
                  selected={signupInfoStep2?.currentlyStudyingInUniversity}
                />
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
                <CustomSelectionIndicator1
                  selected1={signupInfoStep2?.isAgreeToTerm}
                />
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
                  onPress={() => {
                    setIsModalSelect(true);
                    dispatch(
                      getCmsContentRequest(
                        AuthReducer?.cmsContentRes?.data?.length > 0 &&
                          AuthReducer?.cmsContentRes?.data?.[0]?.slug,
                      ),
                    );
                  }}>
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
        {RenderContentModal()}
      </KeyboardAvoidingView>
    </View>
  );
};
// const mapStateToProps = state => ({
//   signupInfoStep2: state.user.signupInfoStep2,
// });
const mapStateTonavigation = state => ({
  signupInfoStep2: state.user.signupInfoStep2,
  signupInfo: state?.user?.signupInfo,
});
const mapDispatchTonavigation = {
  setSignUpStep2Info,
};

// export default connect(mapStateTonavigation)(SignupStep2);

export default connect(
  mapStateTonavigation,
  mapDispatchTonavigation,
)(SignupStep2);

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
