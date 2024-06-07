import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
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
import Loader from '../../utils/helpers/Loader';
import BtnGroup from '../../components/BtnGroup';
import CustomBackGroundComp from '../../components/CustomBackGroundComp';
import {globalConstant} from '../../utils/helpers/GlobalConstant';
import ButtonCom from '../../components/ButtonCom';
import showErrorAlert from '../../utils/helpers/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../utils/helpers/constants';
import DropDownComponent from '../../components/DropDownComponent';
import {setSignInInfo} from '../../redux/action/userActions';
import {connect, useDispatch, useSelector} from 'react-redux';
import {validateEmailExitsRequest} from '../../redux/reducer/AuthReducer';
import {useNavigation} from '@react-navigation/native';
const SignUp = ({signupInfo, setSignInInfo}) => {
  const [isFirstNameFocus, setIsFirstNameFocus] = useState(false);
  const navigation = useNavigation();
  const [isLastNameFocus, setIsLastNameFocus] = useState(false);
  const [isEmailFocus, setIsEmailFocus] = useState(false);
  const [isPhoneFocus, setIsPhoneFocus] = useState(false);
  const [isPasswordFocus, setIsPasswordFocus] = useState(false);
  const [isConfirmPasswordFocus, setIsConfirmPasswordFocus] = useState(false);
  const [showhide, setshowhide] = useState(true);
  const [showhide1, setshowhide1] = useState(true);

  const AuthReducer = useSelector(state => state.AuthReducer);
  const dispatch = useDispatch();

  let headerType = 'icon';

  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const handleInputChange = (field, text) => {
    setSignInInfo({...signupInfo, [field]: text});
  };

  const handleEmailExistOrNot = () => {
    if (signupInfo.firstName === '') {
      showErrorAlert('Please enter your first name');
      return;
    }
    if (signupInfo.lastName === '') {
      showErrorAlert('Please enter your last name');
      return;
    }
    // if (/[^a-zA-Z]/.test(signupInfo.firstName)) {
    //   showErrorAlert('Please enter valid first name');
    //   return;
    // }
    // if (/[^a-zA-Z]/.test(signupInfo.lastName)) {
    //   showErrorAlert('Please enter valid last name');
    // }
    if (signupInfo.email == '') {
      showErrorAlert('Please enter your email address');
      return;
    }
    if (!regex.test(signupInfo.email)) {
      showErrorAlert('Please enter valid email address');
      return;
    }
    // if (!regex.test(signupInfo.email)) {
    //   showErrorAlert('Please enter valid email address');
    //   return;
    // }
    if (signupInfo?.mobileNo == '') {
      showErrorAlert('Please enter phone');
      return;
    }
    if (signupInfo?.mobileNo?.length < 8 || signupInfo?.mobileNo?.length > 16) {
      showErrorAlert('Please enter a valid phone number');
      return;
    }

    if (signupInfo.password == '') {
      showErrorAlert('Please enter your password');
      return;
    }
    if (signupInfo.confirmPassword == '') {
      showErrorAlert('Please enter your confirm password');
      return;
    }
    if (signupInfo.password !== signupInfo.confirmPassword) {
      showErrorAlert('Password and confirm password should be same');
      return;
    } else {
      let obj = {
        email: signupInfo?.email,
        phone: signupInfo.mobileNo,
      };
      dispatch(validateEmailExitsRequest(obj));
    }
  };

  let status = '';
  useEffect(() => {
    if (status == '' || AuthReducer.status != status) {
      switch (AuthReducer.status) {
        case 'Auth/validateEmailExitsRequest':
          status = AuthReducer.status;
          break;
        case 'Auth/validateEmailExitsSuccess':
          status = AuthReducer.status;
          navigation?.navigate('SignupStep2');
          break;
        case 'Auth/validateEmailExitsFailure':
          status = AuthReducer.status;
          break;
      }
    }
  }, [AuthReducer?.status]);

  return (
    <View
      style={{
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,
        backgroundColor: Colors.backgroundorange,
      }}>
      <StatusBar translucent backgroundColor={'transparent'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={{flex: 1}}>
        <ScrollView
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
                  marginTop: '8%',
                  flexDirection: 'row',
                  marginHorizontal: globalConstant.marginHorizontal,
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
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
                  <View
                    style={{
                      width: '70%',
                      height: normalize(80),
                    }}>
                    <Image
                      source={Icons.tiger}
                      style={{
                        height: '100%',
                        width: '100%',
                        resizeMode: 'contain',
                      }}
                    />
                  </View>
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
              marginTop: normalize(-50),
              borderRadius: 20,
              overflow: 'hidden',
              backgroundColor: Colors.white,
            }}>
            <Text style={styles.pageTitle}>
              Sign <Text style={{color: Colors.orange}}>Up</Text>
            </Text>
            {/* <Text style={styles.pageSubtitle}>
              Lorem Ipsum is simply dummy text.
            </Text> */}
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TextInputItem
                toptext={'First Name'}
                placeholder={'First Name'}
                value={signupInfo.firstName || ''}
                onChangeText={text => handleInputChange('firstName', text)}
                onFocus={() => setIsFirstNameFocus(true)}
                onBlur={() => setIsFirstNameFocus(false)}
                focus={isFirstNameFocus}
                width="48%"
              />
              <TextInputItem
                toptext={'Last Name'}
                placeholder={'Last Name'}
                width="48%"
                value={signupInfo.lastName || ''}
                onChangeText={text => handleInputChange('lastName', text)}
                onFocus={() => setIsLastNameFocus(true)}
                onBlur={() => setIsLastNameFocus(false)}
                focus={isLastNameFocus}
              />
            </View>

            <TextInputItem
              toptext={'Email Address*'}
              placeholder={'Enter Your Email Address'}
              width="100%"
              value={signupInfo.email || ''}
              onChangeText={text => handleInputChange('email', text)}
              onFocus={() => setIsEmailFocus(true)}
              onBlur={() => setIsEmailFocus(false)}
              focus={isEmailFocus}
            />
            <TextInputItem
              toptext={'Phone Number*'}
              placeholder={'Enter Your Phone Number'}
              width="100%"
              keyboardType="phone-pad"
              value={signupInfo.mobileNo || ''}
              onChangeText={text => handleInputChange('mobileNo', text)}
              onFocus={() => setIsPhoneFocus(true)}
              onBlur={() => setIsPhoneFocus(false)}
              focus={isPhoneFocus}
            />

            <TextInputItem
              toptext={'Desired Password*'}
              placeholder={'**********'}
              value={signupInfo.password || ''}
              onChangeText={text => handleInputChange('password', text)}
              isSecure={showhide}
              isrightimage={true}
              rightimagepress={() => setshowhide(!showhide)}
              showhide={showhide}
              onFocus={() => setIsPasswordFocus(true)}
              onBlur={() => setIsPasswordFocus(false)}
              focus={isPasswordFocus}
            />
            <TextInputItem
              toptext={'Confirm Password*'}
              placeholder={'**********'}
              value={signupInfo.confirmPassword || ''}
              onChangeText={text => handleInputChange('confirmPassword', text)}
              isSecure={showhide1}
              isrightimage={true}
              rightimagepress={() => setshowhide1(!showhide1)}
              showhide={showhide1}
              onFocus={() => setIsConfirmPasswordFocus(true)}
              onBlur={() => setIsConfirmPasswordFocus(false)}
              focus={isConfirmPasswordFocus}
            />
            <ButtonCom
              onPress={() => handleEmailExistOrNot()}
              width={'100%'}
              backgroundColor={'#1F2440'}
              marginTop={normalize(20)}
              marginBottom={normalize(13)}
              title={'Continue'}
            />
            <Text style={styles.bottomBelowText}>
              Already have an account?{' '}
              <Text
                onPress={() => {
                  navigation?.navigate('SignIn');
                }}
                style={{color: Colors.orange}}>
                Sign In
              </Text>
            </Text>

            <View style={styles.graycontainer}>
              <Text style={styles.graycontainerText}>
                A Princeton official student or alumni email is required to
                login or join this community ({' '}
                <Text style={styles.orangeTextWithUnderline}>
                  Princeton.edu
                </Text>
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
};

const mapStateToProps = state => ({
  signupInfo: state.user.signupInfo,
});

const mapDispatchToProps = {
  setSignInInfo,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);

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
