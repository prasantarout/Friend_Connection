import React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Fonts, Icons} from '../../themes/ImagePath';
import normalize from '../../utils/helpers/dimen';
import MyStatusBar from '../../utils/helpers/MyStatusBar';
import {Colors} from '../../themes/Colors';
import LinearGradient from 'react-native-linear-gradient';
import ButtonCom from '../../components/ButtonCom';
export default function GetStarted(props) {
  return (
    <>
    <ImageBackground
      style={{
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,
      }}
      resizeMode="stretch"
      source={Icons.start}>
         <MyStatusBar backgroundColor={'transparent'}  />
      <View style={{flex: 1}} />
      <View
        style={{
          flex: 1.2,
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
        <View
          style={{
            height: normalize(50),
            width: normalize(150),
          }}>
          <Image
            source={Icons.tiger}
            style={{height: '100%', width: '100%', resizeMode: 'contain'}}
          />
        </View>
        <View
          style={{
            height: normalize(100),
            width: '85%',
            borderRadius: normalize(10),
          }}>
          <Image
            source={Icons.extra1}
            style={{height: '100%', width: '100%', resizeMode: 'contain'}}
          />
        </View>

        <View
          style={{
            height: normalize(3),
            width: normalize(150),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {[0, 1, 2].map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  height: '100%',
                  width: '30%',
                  borderRadius: 10,
                  backgroundColor:
                    index == 1 ? '#ffff' : 'rgba(255,255,255,0.3)',
                }}
              />
            );
          })}
        </View>
        <ButtonCom
          onPress={() => props.navigation?.navigate('SignIn')}
          width={'85%'}
          backgroundColor={'#1F2440'}
          marginBottom={normalize(10)}
          title={'Get Started'}
        />
        {Platform.OS == 'android' && <View style={{height: normalize(15)}} />}
      </View>
    </ImageBackground>
    </>
  );
}
const styles = StyleSheet.create({});
