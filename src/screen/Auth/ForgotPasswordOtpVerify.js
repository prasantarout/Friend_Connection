import React, {useRef, useState} from 'react';
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
  TextInput,
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
import showErrorAlert from '../../utils/helpers/Toast';
import {
  otpverificationRequest,
  resendOtpRequest,
} from '../../redux/reducer/AuthReducer';
import connectionrequest from '../../utils/helpers/NetInfo';
import {useSelector, useDispatch} from 'react-redux';
export default function ForgotPasswordOtpVerify(props) {
  const email = props?.route?.params?.email;
  const [pin1, setPin1] = useState('');
  const [pin2, setPin2] = useState('');
  const [pin3, setPin3] = useState('');
  const [pin4, setPin4] = useState('');
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRef3 = useRef(null);
  const inputRef4 = useRef(null);

  const [pin1status, setpin1status] = useState(false);
  const [pin2status, setpin2status] = useState(false);
  const [pin3status, setpin3status] = useState(false);
  const [pin4status, setpin4status] = useState(false);
  const height1 = Dimensions.get('window').height;
  let headerType = 'icon';
  const AuthReducer = useSelector(state => state.AuthReducer);
  const dispatch = useDispatch();

  function otpfunction() {
    if (pin1 == '' || pin2 == '' || pin3 == '' || pin4 == '') {
      showErrorAlert('Please enter otp');
    } else {
      let obj = {
        otp: Number(pin1 + pin2 + pin3 + pin4).toString(),
        email: props?.route?.params?.email
      }; 
      // return
      connectionrequest()
        .then(() => {
          dispatch(otpverificationRequest(obj));
        })
        .catch(err => {
          showErrorAlert('Please connect to internet');
        });
      // console.log('Submitted DATA: ', obj.otp);
    }
  }

  if (status == '' || AuthReducer.status != status) {
    switch (AuthReducer.status) {
      case 'Auth/otpverificationRequest':
        status = AuthReducer.status;
        break;
      case 'Auth/otpverificationSuccess':
        status = AuthReducer.status;
        props?.navigation?.navigate('ChangePassword', {
          email: props?.route?.params?.email,
        });
        break;
      case 'Auth/otpverificationFailure':
        status = AuthReducer.status;
        break;
    }
  }

  // props.navigation?.navigate('ChangePassword')

  return (
    <View
      style={{
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,
        backgroundColor: Colors.backgroundorange,
      }}>
      <StatusBar translucent backgroundColor={'transparent'} />
      <Loader visible={AuthReducer.status === 'Auth/otpverificationRequest'} />
      <Loader visible={AuthReducer.status === 'Auth/resendOtpRequest'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={{flex: 1}}>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: normalize(20)}}>
          <View
            style={{
              width: Dimensions.get('screen').width,
              height: Dimensions.get('screen').height * 0.33,
              borderBottomLeftRadius: normalize(15),
              borderBottomRightRadius: normalize(15),
              overflow: 'hidden',
              // position: 'absolute',
            }}>
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
              Forgot <Text style={{color: Colors.orange}}>Password</Text>
            </Text>
            <Text style={styles.pageSubtitle}>
              Enter OTP received on your email address.
            </Text>
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: normalize(20),
              }}>
              <View
                style={[
                  styles.viewstyle,
                  {
                    borderColor: pin1status
                      ? Colors.orange
                      : Colors.bordercolor,
                  },
                ]}>
                <TextInput
                  value={pin1}
                  placeholder="-"
                  placeholderTextColor={'#1F2440'}
                  ref={inputRef1}
                  onChangeText={value => {
                    setPin1(value);
                    if (!pin1.length > 0) {
                      inputRef2.current.focus();
                    }
                  }}
                  onFocus={() => setpin1status(true)}
                  onBlur={() => setpin1status(false)}
                  maxLength={1}
                  style={{
                    ...styles.title,
                  }}
                  returnKeyType={'done'}
                  keyboardType="numeric"
                />
              </View>
              <View
                style={[
                  styles.viewstyle,
                  {
                    borderColor: pin2status
                      ? Colors.orange
                      : Colors.bordercolor,
                  },
                ]}>
                <TextInput
                  value={pin2}
                  ref={inputRef2}
                  placeholder="-"
                  placeholderTextColor={'#1F2440'}
                  onChangeText={value => {
                    setPin2(value);
                    if (!pin2.length > 0) {
                      inputRef3.current.focus();
                    } else {
                      inputRef1.current.focus();
                    }
                  }}
                  onKeyPress={({nativeEvent}) => {
                    if (nativeEvent.key === 'Backspace') {
                      inputRef1.current.focus();
                    }
                  }}
                  onFocus={() => setpin2status(true)}
                  onBlur={() => setpin2status(false)}
                  maxLength={1}
                  style={{
                    ...styles.title,
                  }}
                  returnKeyType={'done'}
                  keyboardType="numeric"
                />
              </View>
              <View
                style={[
                  styles.viewstyle,
                  {
                    borderColor: pin3status
                      ? Colors.orange
                      : Colors.bordercolor,
                  },
                ]}>
                <TextInput
                  value={pin3}
                  ref={inputRef3}
                  placeholder="-"
                  placeholderTextColor={'#1F2440'}
                  onChangeText={value => {
                    setPin3(value);
                    if (!pin3.length > 0) {
                      inputRef4.current.focus();
                    } else {
                      inputRef2.current.focus();
                    }
                  }}
                  onKeyPress={({nativeEvent}) => {
                    if (nativeEvent.key === 'Backspace') {
                      inputRef2.current.focus();
                    }
                  }}
                  maxLength={1}
                  onFocus={() => setpin3status(true)}
                  onBlur={() => setpin3status(false)}
                  style={{
                    ...styles.title,
                  }}
                  returnKeyType={'done'}
                  keyboardType='numeric'
                />
              </View>
              <View
                style={[
                  styles.viewstyle,
                  {
                    borderColor: pin4status
                      ? Colors.orange
                      : Colors.bordercolor,
                  },
                ]}>
                <TextInput
                  value={pin4}
                  ref={inputRef4}
                  placeholder="-"
                  placeholderTextColor={'#1F2440'}
                  onChangeText={value => {
                    setPin4(value);
                    if (!pin4.length > 0) {
                      inputRef4.current.focus();
                    } else {
                      inputRef3.current.focus();
                    }
                  }}
                  onKeyPress={({nativeEvent}) => {
                    if (nativeEvent.key === 'Backspace') {
                      inputRef3.current.focus();
                    }
                  }}
                  // keyboardType="number-pad"
                  maxLength={1}
                  onFocus={() => setpin4status(true)}
                  onBlur={() => setpin4status(false)}
                  style={{
                    ...styles.title,
                  }}
                  returnKeyType={'done'}
                  keyboardType="numeric"
                  // inputAccessoryViewID={val => console.log(val)}
                />
              </View>
            </View>

            <ButtonCom
              onPress={() => otpfunction()}
              width={'100%'}
              backgroundColor={'#1F2440'}
              title={'Continue'}
            />
            <Text style={styles.bottomBelowText}>
              Didn’t received OTP?{' '}
              <Text
                onPress={() => {
                  dispatch(
                    resendOtpRequest({email: props?.route?.params?.email}),
                  );
                  setPin1('');
                  setPin2('');
                  setPin3('');
                  setPin4('');
                }}
                style={{color: Colors.orange}}>
                Resend
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    textAlign: 'left',
    marginTop: normalize(15),
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
  headerimage: {
    width: normalize(60),
    height: normalize(70),
    resizeMode: 'stretch',
    position: 'absolute',
    right: normalize(-5),
    top: 0,
  },
  head1sttext: {
    fontSize: normalize(18),
    fontFamily: Fonts.OpenSans_Medium,
    color: Colors.black,
    marginTop: normalize(35),
  },
  head2ndtext: {
    color: Colors.textcolor,
    fontFamily: Fonts.OpenSans_Regular,
    fontSize: normalize(12),
    width: '80%',
    textAlign: 'center',
    marginTop: normalize(10),
  },
  title: {
    height: normalize(60),
    width:'50%',
    // borderRadius: normalize(10),
    // paddingLeft: normalize(25),
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: normalize(20),
    color: 'black',
    fontFamily: Fonts.OpenSans_Medium,
    alignSelf: 'center',
    textAlign: 'center',
    
  },
  viewstyle: {
    height: normalize(60),
    width: normalize(60),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,

    borderRadius: normalize(8),
  },
});
