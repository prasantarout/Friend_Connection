import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
  ScrollView,
  ImageBackground,
  TextInput,
  BackHandler,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import MyStatusBar from '../../utils/helpers/MyStatusBar';
import {Fonts, Icons} from '../../themes/ImagePath';
import normalize from '../../utils/helpers/dimen';
import {Colors} from '../../themes/Colors';
import TextInputItem from '../../components/TextInput';
import ButtonCom from '../../components/ButtonCom';
import showErrorAlert from '../../utils/helpers/Toast';
import connectionrequest from '../../utils/helpers/NetInfo';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  classListRequest,
  craetenewpasswordRequest,
  degreeListRequest,
  getProfileRequest,
  streamListRequest,
  universityListRequest,
  updateProfileRequest,
} from '../../redux/reducer/AuthReducer';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../utils/helpers/Loader';
import DropDownComponent from '../../components/DropDownComponent';
import {horizontalScale} from '../../utils/helpers/dimen1';
import CameraPicker from '../../components/CameraPicker';
import TextInputmultiple from '../../components/TextInputmultiple';
import CustomChip from '../../components/CustomChip';
import constants from '../../utils/helpers/constants';
import {navigationRef} from '../../utils/helpers/RootNavigation';
let status = '';
const UpdateProfile = props => {
  const AuthReducer = useSelector(state => state.AuthReducer);
  const [isPhoneFocus, setIsPhoneFocus] = useState(false);
  const [isAgeFocus, setIsAgeFocus] = useState(false);
  const [isFirstNameFocus, setIsFirstNameFocus] = useState(false);
  const [isLastNameFocus, setIsLastNameFocus] = useState(false);
  const [isClassDropDownOpen, setIsClassDropDownOpen] = useState(false);
  const [isGendersDropDownOpen, setIsGenderDropDownOpen] = useState(false);
  const [isUniversityDropDownOpen, setIsUniversityDownOpen] = useState(false);
  const [isEducationDropDownOpen, setIsEducationDropDownOpen] = useState(false);
  const [isDegreeDropDownOpen, setIsDegreeDropDownOpen] = useState(false);
  const [isDegreeYearDropDownOpen, setDegreeYearDropDownOpen] = useState(false);
  const [isGraduationYearDropDownOpen, setGraduationYearDropDownOpen] =
    useState(false);
  const [isEmailFocus, setIsEmailFocus] = useState(false);
  const [cameraPicker, setCameraPicker] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [IsClass, setIsClass] = useState('');
  const [IsUniversity, setIsUniversity] = useState('');
  const [IsStream, setIsStream] = useState('');
  const [IsUniversity1, setIsUniversity1] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [dateShow, setDate] = useState('');
  const [dateShow1, setDate1] = useState('');
  const [isSelected, setIsSelected] = useState(false);
  const [ProfilePicObj, setProfilePicObj] = useState('');
  const [ProfilePicUri, setProfilePicUri] = useState('');
  const [about, setAbout] = useState('');
  const [isAboutFocus, setIsAboutFocus] = useState(false);
  const [IsDegree, setIsDegree] = useState('');
  const [expertise, setExpertise] = useState([]);
  const [webProfilePicUri, setwebProfilePicUri] = useState('');
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
  const isFocus = useIsFocused();

  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  useFocusEffect(
    React.useCallback(() => {
      if (isFocus) {
        const profileData = AuthReducer?.getProfileRes?.data || {};
        console.log(AuthReducer?.getProfileRes?.data, 'Dsadhjd');
        setFirstName(profileData.first_name || '');
        setLastName(profileData.last_name || '');
        setIsClass(profileData.class || '');
        setIsStream(profileData.education_stream || '');
        setEmail(profileData.email || '');
        setPhone(profileData.phone || '');
        setGender(profileData.gender || '');
        // setDegreeYear(profileData.degree_start_date || '');
        // setGraduationYear(profileData.graduation_date || '');
        setDate(profileData?.degree_start_date || '');
        setDate1(profileData?.graduation_date || '');
        setIsDegree(profileData.degree || '');
        setIsSelected(
          profileData.is_studying_in_the_university === 'Yes' ? true : false,
        );
        setIsUniversity(profileData?.university || '');
        setwebProfilePicUri(profileData?.profile_image || '');
        setAbout(profileData?.biography || '');
        setAge(profileData?.age || '');
      }
    }, [isFocus]),
  );

  useEffect(() => {
    dispatch(classListRequest());
    dispatch(degreeListRequest());
    dispatch(streamListRequest());
    dispatch(getProfileRequest());
    dispatch(universityListRequest());
  }, []);

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

  // let obj = {
  //   email: email,
  //   first_name: firstName,
  //   last_name: lastName,
  //   phone: phone,
  //   degree_start_date: dateShow ? dateShow.toString() : '',
  //   graduation_date: dateShow1 ? dateShow1.toString() : '',
  //   university: IsUniversity?._id,
  //   biography: about,
  //   age: age,
  //   expertise_area: tempArr,
  //   education_stream: IsStream?._id,
  //   class: IsClass?._id,
  //   degree:  IsDegree?._id,
  //   is_studying_in_the_university: isSelected ? 'Yes' : 'No',
  //   profile_image: ProfilePicUri,
  const handleSelectionToggle = () => {
    setIsSelected(!isSelected);
    // setDate(null);
    // setDate1('');
  };

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
    if (i < 80) yearsArray?.push(yearObject);
    graduationArray?.push(graduationObject);
  }

  var currentDate = new Date();
  var currentYears = currentDate.getFullYear();

  const handleUpdate = () => {
    if (firstName == '') {
      showErrorAlert('Please enter your first name');
      return;
    }
    if (lastName == '') {
      showErrorAlert('Please enter your last name');
      return;
    }
    if (email == '') {
      showErrorAlert('Please enter your email');
      return;
    }
    if (!regex.test(email)) {
      showErrorAlert('Please enter correct email');
      return;
    }
    if (phone == '') {
      showErrorAlert('Please enter phone');
      return;
    }
    if (phone.length < 8 && phone?.length > 16) {
      showErrorAlert('Please enter a valid phone number');
      return;
    }

    if (age == '') {
      showErrorAlert('Please write your age');
      return;
    }
    if (gender == '') {
      showErrorAlert('Please write your age');
      return;
    }
    if (about == '') {
      showErrorAlert('Please write something about you');
      return;
    }
    if (expertise.length === 0) {
      showErrorAlert('Please write at least 2-3 expertise');
      return;
    }
    if (!IsUniversity1) {
      if (IsUniversity === '') {
        showErrorAlert('Please select university');
        return;
      }
    }
    if (IsStream?.title == '' || IsStream === '') {
      showErrorAlert('Please select your major');
      return;
    }

    if (IsDegree?.title === '' || IsDegree === '') {
      showErrorAlert('Please select your degree');
      return;
    }

    if (dateShow == '') {
      showErrorAlert('Please select your degree start year');
      return;
    }
    if (!isSelected && dateShow1 == '') {
      showErrorAlert('Please select your graduation year');
      return;
    }
    if (!isSelected && dateShow1 < dateShow) {
      showErrorAlert('Graduation year must greater than degree start year');
      return;
    } else {
      let obj = new FormData();
      obj.append('email', email);
      obj.append('first_name', firstName);
      obj.append('last_name', lastName);
      obj.append('phone', phone);
      obj.append('degree_start_date', dateShow ? dateShow.toString() : '');
      obj.append('graduation_date', dateShow1 ? dateShow1.toString() : '');
      obj.append('university', IsUniversity?._id);
      obj.append('biography', about);
      obj.append('age', age);
      obj.append('gender', gender);
      expertise?.map((item, index) =>
        obj.append('expertise_area[' + index + ']', item),
      );
      obj.append('education_stream', IsStream?._id);
      // obj.append('class', IsClass?._id);
      obj.append('degree', IsDegree?._id);
      // obj.append('interested_gender',gender?.title);
      obj.append('is_studying_in_the_university', isSelected ? 'Yes' : 'No');
      {
        ProfilePicObj != '' && obj.append('profile_image', ProfilePicObj);
      }
      // return;
      connectionrequest()
        .then(() => {
          dispatch(updateProfileRequest(obj));
        })
        .catch(err => {
          showErrorAlert('Please connect To Internet');
        });
    }
  };

  if (isFocus) {
    if (status == '' || AuthReducer.status != status) {
      switch (AuthReducer.status) {
        case 'Auth/updateProfileRequest':
          status = AuthReducer.status;
          break;
        case 'Auth/updateProfileSuccess':
          status = AuthReducer.status;
          dispatch(getProfileRequest());
          props.navigation?.navigate('MyProfile');
          break;
        case 'Auth/updateProfileFailure':
          status = AuthReducer.status;
          break;
        case 'Auth/getProfileRequest':
          status = AuthReducer.status;
          break;
        case 'Auth/getProfileSuccess':
          status = AuthReducer.status;
          // dispatch(getProfileRequest());
          // props.navigation?.navigate('MyProfile');
          break;
        case 'Auth/getProfileFailure':
          status = AuthReducer.status;
          break;
      }
    }
  }

  const handleBackButton = () => {
    if (navigationRef?.current && navigationRef.current.canGoBack()) {
      navigationRef?.current?.goBack();
      return true;
    }
    return false; // Default behavior (app closing)
  };

  React.useEffect(() => {
    const backHandler = BackHandler?.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );

    return () => backHandler.remove();
  }, []);

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
      {selected && (
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

  // console.log(AuthReducer.getProfileRes.data, 'Profile');

  return (
    <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <MyStatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <Loader
        visible={
          AuthReducer.status === 'Auth/updateProfileRequest' ||
          AuthReducer.status === 'Auth/getProfileRequest'
        }
      />
      <View style={styles.top}>
        <TouchableOpacity
          style={{
            // height: normalize(40),
            // width: normalize(40),
            paddingRight: normalize(7),
            paddingLeft: normalize(5),
            paddingVertical: normalize(6),
            backgroundColor: 'rgba(242,124,36,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}
          onPress={() => props?.navigation?.goBack('')}>
          <Image
            source={Icons.less}
            style={{
              height: normalize(10),
              width: normalize(10),
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            // width:100,
          }}>
          <Text style={styles.txt}>Update profile</Text>
        </View>
        {/* Horizontal line below the title and icon */}
        <View></View>
      </View>
      <View style={styles.horizontalLine}></View>
      <ScrollView
        contentContainerStyle={{paddingBottom: '20%'}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.itemsContainer}>
          <View style={[styles.profileContainer, {bottom: normalize(5)}]}>
            <ImageBackground
              source={Icons.ellipse}
              style={[styles.iconBackground, {height: 120, width: 120}]}
            />
            <TouchableOpacity
              style={styles.circleIcon}
              onPress={() => setCameraPicker(true)}>
              <Image source={Icons.pick} style={styles.circleImage} />
            </TouchableOpacity>
            <Image
              source={
                ProfilePicUri
                  ? {uri: ProfilePicUri}
                  : webProfilePicUri == ''
                    ? Icons.userProfile
                    : {uri: constants?.IMAGE_URL + 'user/' + webProfilePicUri}
              }
              style={[
                styles.profilePicture,
                {height: 100, width: 100, borderRadius: 50, top: normalize(8)},
              ]}
            />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TextInputItem
              toptext={'First Name'}
              placeholder={'First Name'}
              value={firstName}
              onChangeText={val => setFirstName(val)}
              onFocus={() => setIsFirstNameFocus(true)}
              onBlur={() => setIsFirstNameFocus(false)}
              focus={isFirstNameFocus}
              width="48%"
            />
            <TextInputItem
              toptext={'Last Name'}
              placeholder={'Last Name'}
              width="48%"
              value={lastName}
              onChangeText={val => setLastName(val)}
              onFocus={() => setIsLastNameFocus(true)}
              onBlur={() => setIsLastNameFocus(false)}
              focus={isLastNameFocus}
            />
          </View>
          <TextInputItem
            toptext={'Email Address*'}
            placeholder={'Enter Your Email Address'}
            width="100%"
            value={email}
            onChangeText={val => setEmail(val)}
            onFocus={() => setIsEmailFocus(true)}
            onBlur={() => setIsEmailFocus(false)}
            focus={isEmailFocus}
          />
          <TextInputItem
            toptext={'Phone Number*'}
            placeholder={'Enter Your Phone Number'}
            width="100%"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={val => setPhone(val)}
            onFocus={() => setIsPhoneFocus(true)}
            onBlur={() => setIsPhoneFocus(false)}
            focus={isPhoneFocus}
          />
          <TextInputItem
            toptext={'Age*'}
            placeholder={'Enter Your Age'}
            width="100%"
            keyboardType="phone-pad"
            value={age}
            onChangeText={val => setAge(val)}
            onFocus={() => setIsAgeFocus(true)}
            onBlur={() => setIsAgeFocus(false)}
            focus={isAgeFocus}
          />
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
              setIsClassDropDownOpen(false);
              setGraduationYearDropDownOpen(false);
              setIsUniversityDownOpen(false);
              setDegreeYearDropDownOpen(false);

              //   setIsDegreeDropDownOpen(false);
            }}
            onSelectData={res => {
              setGender(res.item.title);
              setIsGenderDropDownOpen(false);
            }}
            type="dropdown"
            isOpenDropDown={isGendersDropDownOpen}
            drpDownArr={genderDataItem}
            isGenderProfileSelect={299}
          />
          <TextInputmultiple
            toptext={'Biography*'}
            placeholder={'Write your biography'}
            width="100%"
            value={about}
            onChangeText={val => setAbout(val)}
            onFocus={() => setIsAboutFocus(true)}
            onBlur={() => setIsAboutFocus(false)}
            focus={isAboutFocus}
            multiline={true}
          />
          <CustomChip
            getData={res => {
              setExpertise(res);
            }}
            sendItem={AuthReducer?.getProfileRes?.data?.expertise_area}
          />
          <DropDownComponent
            isrightimage={Icons.down}
            toptext={'University*'}
            width={'100%'}
            value={IsUniversity ? IsUniversity?.title : 'Select University'}
            onPress={() => {
              setIsUniversityDownOpen(!isUniversityDropDownOpen);
              setIsEducationDropDownOpen(false);
              setIsClassDropDownOpen(false);
              setGraduationYearDropDownOpen(false);
              setDegreeYearDropDownOpen(false);
              setIsGenderDropDownOpen(false);

              //   setIsDegreeDropDownOpen(false);
            }}
            onSelectData={res => {
              setIsUniversity(res.item);
              setIsUniversityDownOpen(false);
            }}
            type="dropdown"
            isOpenDropDown={isUniversityDropDownOpen}
            drpDownArr={AuthReducer?.universityListRes?.data}
            isProfileUniversitySelect={14}
          />
          {/* <DropDownComponent
            isrightimage={Icons.down}
            toptext={'Class'}
            width={'100%'}
            value={IsClass ? IsClass?.title : 'Select Class'}
            onPress={() => {
              setIsClassDropDownOpen(!isClassDropDownOpen);
              setIsEducationDropDownOpen(false);
              setGraduationYearDropDownOpen(false);
              setDegreeYearDropDownOpen(false);

              setIsGenderDropDownOpen(false);
              //   setIsDegreeDropDownOpen(false);
            }}
            onSelectData={res => {
              setIsClass(res.item);
              setIsClassDropDownOpen(false);
            }}
            type="dropdown"
            isOpenDropDown={isClassDropDownOpen}
            drpDownArr={AuthReducer?.classListRes?.data}
            isProfileClassSelect={12}
          /> */}
          <DropDownComponent
            isrightimage={Icons.down}
            toptext={'Education Major*'}
            width="100%"
            value={IsStream ? IsStream?.title : 'Select Major'}
            onPress={() => {
              setIsEducationDropDownOpen(!isEducationDropDownOpen);
              setIsClassDropDownOpen(false);
              setIsUniversityDownOpen(false);
              setGraduationYearDropDownOpen(false);
              setIsGenderDropDownOpen(false);
              setIsGenderDropDownOpen(false);
              setDegreeYearDropDownOpen(false);
              setIsDegreeDropDownOpen(false);
            }}
            isOpenDropDown={isEducationDropDownOpen}
            drpDownArr={AuthReducer?.streamListRes?.data}
            onSelectData={res => {
              setIsStream(res.item);
              setIsEducationDropDownOpen(false);
            }}
            type="dropdown"
            isProfileEducationSelect={10}
          />
          <DropDownComponent
            isrightimage={Icons.down}
            toptext={'Degree*'}
            placeholder={'Username'}
            width="100%"
            value={IsDegree ? IsDegree?.title : 'A.B'}
            onPress={() => {
              setIsDegreeDropDownOpen(!isDegreeDropDownOpen);
              setIsClassDropDownOpen(false);
              setIsEducationDropDownOpen(false);
              setIsGenderDropDownOpen(false);
              setIsUniversityDownOpen(false);
              setGraduationYearDropDownOpen(false);
              setDegreeYearDropDownOpen(false);
            }}
            isOpenDropDown={isDegreeDropDownOpen}
            drpDownArr={AuthReducer?.degreeListRes?.data}
            onSelectData={res => {
              setIsDegree(res.item);
              setIsDegreeDropDownOpen(false);
            }}
            type="dropdown"
            isProfileDegreeSelect={30}
          />
          <DropDownComponent
            isrightimage={Icons.down}
            toptext={'Degree Start Year*'}
            placeholder={'Username'}
            width="100%"
            value={dateShow ? dateShow : 'Select Year'}
            onPress={() => {
              setDegreeYearDropDownOpen(!isDegreeYearDropDownOpen);
              setIsClassDropDownOpen(false);
              setIsEducationDropDownOpen(false);
              setIsGenderDropDownOpen(false);
              setIsUniversityDownOpen(false);
              setIsDegreeDropDownOpen(false);
              setGraduationYearDropDownOpen(false);
            }}
            isOpenDropDown={isDegreeYearDropDownOpen}
            drpDownArr={yearsArray}
            onSelectData={res => {
              setDate(res.item.title);
              setDegreeYearDropDownOpen(false);
            }}
            type="dropdown"
            isDegreeYearSelect={40}
          />
          <DropDownComponent
            isrightimage={Icons.down}
            toptext={'Anticipated or Actual Graduation Year'}
            placeholder={'Username'}
            width="100%"
            value={dateShow1 ? dateShow1 : 'Select Year'}
            onPress={() => {
              // if (isSelected) {
              //   return;
              // } else {
              setGraduationYearDropDownOpen(!isGraduationYearDropDownOpen);
              setIsClassDropDownOpen(false);
              setIsGenderDropDownOpen(false);
              setIsEducationDropDownOpen(false);
              setIsUniversityDownOpen(false);
              setIsDegreeDropDownOpen(false);
              setDegreeYearDropDownOpen(false);
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
              setDate1(res.item.title);
              setGraduationYearDropDownOpen(false);
            }}
            type="dropdown"
            isGraduationYearSelect={39}
          />
          {/* <DropDownComponent
            isrightimage={Icons.down}
            toptext={'Degree Start Date'}
            width="100%"
            value={dateShow ? dateShow : 'Select Date'}
            onPress={() => {
              setIsStartDatePicker(!isStartDatePicker);
            }}
            type="datePicker"
          
          /> */}

          {/* <DateTimePickerModal
            date={
              AuthReducer?.getProfileRes?.data?.degree_start_date !== ''
                ? new Date(AuthReducer?.getProfileRes?.data?.degree_start_date)
                : new Date()
            }
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
            isrightimage={Icons.down}
            toptext={'Anticipated or Actual Graduation Date'}
            width="100%"
            value={dateShow1 ? dateShow1 : 'Select Year'}
            onPress={() => {
              setIsStartDatePicker1(!isStartDatePicker1);
            }}
            type="datePicker"
          /> */}
          {/* <DateTimePickerModal
            date={
              AuthReducer?.getProfileRes?.data?.graduation_date !== ''
                ? new Date(AuthReducer?.getProfileRes?.data?.graduation_date)
                : new Date()
            }
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
          <ButtonCom
            width={'100%'}
            backgroundColor={'#1F2440'}
            marginTop={normalize(20)}
            title={'Update Profile'}
            onPress={handleUpdate}
          />
        </View>
      </ScrollView>
      <CameraPicker
        pickerVisible={cameraPicker}
        multiple={false}
        onBackdropPress={() => setCameraPicker(false)}
        btnClick_cameraUpload={imgObj => {
          setProfilePicObj(imgObj);
          setProfilePicUri(imgObj.uri);
          setCameraPicker(false);
          // UploadProfile(imgObj);
        }}
        btnClick_galeryUpload={imgObj => {
          setProfilePicObj(imgObj);
          setProfilePicUri(imgObj.uri);
          setCameraPicker(false);
          // console.log(imgObj.uri);
          // UploadProfile(imgObj);
        }}
      />
    </View>
  );
};

export default UpdateProfile;

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Added to align the text and icon vertically
    // flex: 1,
    marginTop: Platform?.OS == 'android' ? normalize(35) : 20,
    marginHorizontal: normalize(20),
  },
  txt: {
    textAlign: 'center',
    color: '#1F2440',
    // marginTop: normalize(10),
    fontSize: 16,
    fontFamily: Fonts.OpenSans_Medium,
    fontWeight: '600',
    lineHeight: 21.79,
  },
  horizontalLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#F4F3F3', // You can change the color to your preference
    width: '100%', // Make the line cover the whole width
    marginTop: normalize(10), // Adjust the margin based on your design
  },
  itemsContainer: {
    marginHorizontal: normalize(20),
    marginTop: normalize(20),
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(15),
  },
  itemIcon: {
    width: normalize(20),
    height: normalize(20),
    marginRight: normalize(10),
  },
  itemName: {
    fontSize: 16,
    color: '#1F2440',
    fontWeight: '600',
    fontFamily: Fonts.OpenSans_Regular,
  },
  rightIcon: {
    width: normalize(15),
    height: normalize(15),
    marginLeft: 'auto', // Push the right icon to the right
  },
  rightIconContainer: {
    backgroundColor: 'rgba(242,124,36,0.2)',
    position: 'absolute',
    right: 0,
    // Set the background color here
    borderRadius: 5, // Adjust as needed
    padding: 5, // Adjust as needed
  },
  profileContainer: {
    alignItems: 'center',
    // bottom: 0,
  },

  iconBackground: {
    height: normalize(75),
    width: normalize(75),
  },
  profilePicture: {
    height: normalize(60),
    width: normalize(60),
    position: 'absolute',
    top: normalize(7),
    borderRadius: normalize(50),
  },
  backgroundImage: {
    width: '100%',
    height: normalize(180),
    marginTop: normalize(10),
    // borderRadius: normalize(10),
  },
  circleIcon: {
    position: 'absolute',
    bottom: normalize(-4),
    backgroundColor: 'red',
    zIndex: 55555,
    borderRadius: normalize(5),
    backgroundColor: '#F27C24',
    width: normalize(25),
    height: normalize(25),
    justifyContent: 'center',
    alignContent: 'center',
  },
  circleImage: {
    width: normalize(18),
    height: normalize(15),
    alignSelf: 'center',
    tintColor: Colors.white,
  },
  header: {
    marginVertical: normalize(10),
  },
  icon_wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileContainer: {
    alignItems: 'center',
  },
  boxContainer: {
    position: 'absolute',
    top: normalize(5),
    right: normalize(5),
    padding: normalize(5),
    borderRadius: normalize(5),
  },
  boxIcon: {
    width: normalize(20),
    height: normalize(20),
  },
  iconBackground: {
    height: normalize(65),
    width: normalize(65),
  },
  profilePicture: {
    height: normalize(50),
    width: normalize(50),
    position: 'absolute',
    top: normalize(7),
    borderRadius: normalize(25),
  },
  textWrapper: {
    marginLeft: normalize(10),
  },
  buttonImg: {
    height: horizontalScale(12),
    width: horizontalScale(12),
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 8,
    marginRight: 8,
  },
  chipText: {
    marginRight: 8,
  },
  deleteIconContainer: {
    marginLeft: 'auto',
  },
  container: {
    padding: 16,
  },
  inputContainer: {
    marginTop: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
  },
});
