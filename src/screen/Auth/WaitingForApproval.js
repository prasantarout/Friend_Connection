import React, {useEffect, useState} from 'react';
import {
  BackHandler,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Fonts, Icons} from '../../themes/ImagePath';
import normalize from '../../utils/helpers/dimen';
import {Colors} from '../../themes/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {getProfileRequest} from '../../redux/reducer/AuthReducer';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
export default function WaitingForApproval(props) {
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state?.AuthReducer);
  const isFocus = useIsFocused();

  // useFocusEffect(
  //   React.useCallback(() => {
  //     dispatch(getProfileRequest());
  //     if (AuthReducer?.getProfileRes?.data?.isApprove === 'Yes') {
  //       props.navigation.navigate('TabNavigator');
  //     }
  //   }, [isFocus]),
  // );
  useEffect(() => {
    setTimeout(() => {
        props.navigation.navigate('SignIn');
    }, 2500);
  }, [isFocus]);
  // console.log(";;;;;;;;;;;")
  function handleBackButtonClick() {
    // console.log('back Pressed wow');
    return true;
  }
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonClick,
    );
    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.backgroundorange,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          height: Dimensions.get('window').width * 0.85,
          width: Dimensions.get('window').width * 0.85,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: normalize(20),
          borderRadius: normalize(15),
        }}>
        <View
          style={{
            height: normalize(55),
            width: normalize(55),
          }}>
          <Image
            source={Icons.clock}
            style={{height: '100%', width: '100%', resizeMode: 'cover'}}
          />
        </View>
        <Text style={styles.pageTitle}>
          Waiting For <Text style={{color: Colors.orange}}>Approval</Text>
        </Text>
        <Text style={styles.pageSubtitle}>
          {/* Lorem Ipsum is simply dummy text of the printing and typesetting */}
          {/* industry. */}
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  pageTitle: {
    fontSize: normalize(18),
    fontFamily: Fonts.OpenSans_SemiBold,
    color: Colors.textBlack,
    textAlign: 'center',
    marginVertical: normalize(8),
  },
  pageSubtitle: {
    fontSize: normalize(12),
    fontFamily: Fonts.OpenSans_Regular,
    color: Colors.textBlack,
    textAlign: 'center',
    marginTop: normalize(4),
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
