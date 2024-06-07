import React, {useEffect, useState} from 'react';
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

let status = '';
import Loader from '../../utils/helpers/Loader';
import BtnGroup from '../../components/BtnGroup';
import CustomBackGroundComp from '../../components/CustomBackGroundComp';
import {globalConstant} from '../../utils/helpers/GlobalConstant';
import ButtonCom from '../../components/ButtonCom';
import {loginRequest} from '../../redux/reducer/AuthReducer';
import connectionrequest from '../../utils/helpers/NetInfo';
import showErrorAlert from '../../utils/helpers/Toast';
import {useSelector, useDispatch} from 'react-redux';
import {generateDeviceToken} from '../../utils/helpers/FirebaseToken';
import {clearUpdateProfileRequest} from '../../redux/reducer/PostReducer';
import { resetSignInInfo, resetSignUpStep2Info } from '../../redux/action/userActions';
import { clearAllFeedListRequest } from '../../redux/reducer/HomeReducer';
export default function SignIn(props) {
  const [email, setEmail] = useState('');
  const [isEmailFocus, setIsEmailFocus] = useState(false);
  const [isPasswordFocus, setIsPasswordFocus] = useState(false);
  const [showhide, setshowhide] = useState(true);
  const [password, setPassword] = useState('');
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  function signinfunction(token) {
    // onPress={()=>props.navigation.navigate('TabNavigator')}
    if (email == '') {
      showErrorAlert('Please enter your Email Id');
    } else if (!regex.test(email)) {
      showErrorAlert('Please enter correct Email Id');
    } else if (password == '') {
      showErrorAlert('Please enter password');
    } else if (password?.length < 6) {
      showErrorAlert('Please enter atleast 8 character password');
    } else {
      let obj = {
        email: email.toLocaleLowerCase(),
        password: password,
        device_token: token,
        device_type: Platform.OS == 'android' ? 'android' : 'ios',
      };
      // return
      connectionrequest()
        .then(() => {
          dispatch(loginRequest(obj));
        })
        .catch(err => {
          showErrorAlert('Please connect To Internet');
        });
    }
  }
  useEffect(() => {
    let status = '';
    if (status == '' || AuthReducer.status != status) {
      switch (AuthReducer.status) {
        case 'Auth/loginRequest':
          status = AuthReducer.status;
          break;
        case 'Auth/loginSuccess':
          status = AuthReducer.status;
          setEmail('');
          setPassword('')
          props?.navigation?.navigate('TabNavigator', {
            screen: 'Home',
          });
          // dispatch(clearUpdateProfileRequest({}));
          dispatch(clearAllFeedListRequest({}))
          break;
        case 'Auth/loginFailure':
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
      <Loader visible={AuthReducer?.status === 'Auth/loginRequest'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={{flex: 1}}>
        <ScrollView
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
                  marginTop: '8%',
                  flexDirection: 'row',
                  marginHorizontal: globalConstant.marginHorizontal,
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.goBack();
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
              Sign <Text style={{color: Colors.orange}}>In</Text>
            </Text>
            {/* <Text
              style={[styles.pageSubtitle, {paddingHorizontal: normalize(15)}]}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </Text> */}

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
              toptext={'Password*'}
              placeholder={'**********'}
              value={password}
              onChangeText={val => setPassword(val)}
              isSecure={showhide}
              isrightimage={true}
              rightimagepress={() => setshowhide(!showhide)}
              showhide={showhide}
              onFocus={() => setIsPasswordFocus(true)}
              onBlur={() => setIsPasswordFocus(false)}
              focus={isPasswordFocus}
            />
            <Text
              onPress={() => {
                props.navigation?.navigate('ForgetPassword');
              }}
              style={[
                styles.pageSubtitle,
                {
                  textAlign: 'left',
                  marginTop: normalize(10),
                  marginBottom: normalize(12),
                  marginLeft: normalize(5),
                },
              ]}>
              Forgot Password?
            </Text>
            <ButtonCom
              onPress={() => {
                generateDeviceToken()
                  .then(token => {
                    console.log('DEVICE TOKEN: ' + token);
                    signinfunction(token);
                  })
                  .catch(err => {
                    console.log('Err: ' + JSON.stringify(err));
                    signinfunction('123456');
                  });
              }}
              width={'100%'}
              backgroundColor={'#1F2440'}
              marginBottom={normalize(18)}
              title={'Sign In'}
            />
            <Text style={styles.bottomBelowText}>
              Do not have an account?{' '}
              <Text
                onPress={() => {
                  props.navigation?.navigate('SignUp');
                  dispatch(resetSignInInfo());
                  dispatch(resetSignUpStep2Info());
                }}
                style={{color: Colors.orange}}>
                Sign Up
              </Text>
            </Text>
          </View>
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
    marginVertical: normalize(10),
    lineHeight: normalize(18),
    paddingHorizontal: normalize(10),
  },
});
