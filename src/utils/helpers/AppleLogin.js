import React from "react";
import { Image, TouchableOpacity } from "react-native";
import {
  appleAuth,
  AppleButton,
  appleAuthAndroid,
} from "@invertase/react-native-apple-authentication";
import PropTypes from "prop-types";
// import {v4 as uuid} from 'uuid';
import { Platform } from "react-native";
import normalize from "../helpers/dimen";
import { Icons } from "../../themes/ImagePath";
import { horizontalScale, moderateScale, verticalScale } from "./dimen1";
import { Colors } from "../../themes/Colors";

// import jwt_decode from 'jwt-decode';

export default function AppleLogin(props) {
  const onDone = (appleData) => {
    if (props.OnDone) {
      // var appleSignUpObject = {};
      // console.log(' Apple DAta', appleData);
      props.OnDone(appleData);
    }
  };

  async function onAppleButtonPress() {
    // console.log('hihihihi')
    // console.warn("Beginning Apple Authentication");

    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // console.log("appleAuthRequestResponse", appleAuthRequestResponse);

      const { user, email, nonce, identityToken, realUserStatus /* etc */ } =
        appleAuthRequestResponse;

      if (identityToken) {
        // console.log(nonce, identityToken);
        onDone(appleAuthRequestResponse);
      } else {
        // console.log("no token - failed sign-in?");
      }

      if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
        // console.log("I'm a real person!");
      }

      // console.warn(`Apple Authentication Completed, ${user}, ${email}`);
    } catch (error) {
      if (error.code === appleAuth.Error.CANCELED) {
        // console.warn("User canceled Apple Sign in.");
      } else {
        // console.error(error);
      }
    }
  }

  return Platform.OS === "ios" ? (
    // <Button
    //   height={normalize(45)}
    //   width={normalize(280)}
    //   backgroundColor={Colors.red}
    //   justifyContent={'space-between'}
    //   borderRadius={normalize(20)}
    //   marginTop={normalize(15)}
    //   marginHorizontal={normalize(20)}
    //   title={'Continue with Apple'}
    //   textColor={Colors.placeholdercolor}
    //   fontSize={normalize(12)}
    //   fontFamily={Fonts.MontserratRegular}
    //   image={Icons.apple}
    //   imgheight={normalize(20)}
    //   imgwidth={normalize(20)}
    //   rightimage={Icons.Forword}
    //   rightimgheight={normalize(15)}
    //   rightimgwidth={normalize(15)}
    //   rightTintColor={'#7D7D7D'}
    //   marginLeft={normalize(15)}
    //   onPress={() => onAppleButtonPress()}
    // <TouchableOpacity style={{ marginLeft: normalize(8) }} onPress={() => onAppleButtonPress()}>
    //               <Image source={Icons.apple}
    //               style={{resizeMode:'contain',
    //     width: normalize(40),
    //     height:normalize(40)}}
    //   /></TouchableOpacity>
    <TouchableOpacity
      onPress={() => onAppleButtonPress()}
      style={{
        borderRadius: moderateScale(50) + moderateScale(50) / 4,
        borderColor: Colors.borderColor,
        borderWidth: 2,
        width: moderateScale(50),
        alignItems: "center",
        justifyContent: "center",
        height: moderateScale(50),
      }}
    >
      <Image
        source={Icons.apple}
        style={{
          resizeMode: "contain",
          width: verticalScale(32),
          height: horizontalScale(32),
        }}
      />
    </TouchableOpacity>
  ) : // />
  null;
  // <TouchableOpacity onPress={() => { !appleAuthAndroid.isSupported ? showErrorAlert('Sign In with Apple requires Android 4.4 or higher') :
  //     androidAppleLogin()
  // }} >
  //     <Image style={{
  //         height: props.height, width: props.width, borderRadius: props.borderRadius,
  //         marginTop: props.marginTop, marginBottom: props.marginBottom,
  //     }}
  //         source={ImagePath.appleLogin} />
  // </TouchableOpacity>
}
AppleLogin.propTypes = {
  marginBottom: PropTypes.number,
  marginTop: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.any,
  OnDone: PropTypes.func,
  borderRadius: PropTypes.number,
};

AppleLogin.defaultProps = {
  marginBottom: 0,
  marginTop: 0,
  height: 0,
  width: "80%",
  OnDone: () => {},
  borderRadius: 0,
};
