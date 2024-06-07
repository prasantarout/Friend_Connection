import {View, Text, Dimensions, SafeAreaView, Image, StatusBar} from 'react-native';
import React from 'react';
import {Fonts, Icons} from '../themes/ImagePath';
import {Colors} from '../themes/Colors';
import {globalConstant} from '../utils/helpers/GlobalConstant';
import {ScrollView} from 'react-native';

export default function CustomBackGroundComp({children, headerType}) {
  return (
    <View
      style={{
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,
        backgroundColor: Colors.white,
      }}>
         <StatusBar translucent backgroundColor={'transparent'} />
      <SafeAreaView
        style={{
          width: Dimensions.get('screen').width,
          height: Dimensions.get('screen').height,
        }}>
        <ScrollView contentContainerStyle={{flex: 1}}>
          <View
            style={{
              width: '100%',
              height: '33%',
              borderBottomLeftRadius: normalize(15),
              borderBottomRightRadius: normalize(15),
              overflow: 'hidden',
              // position: 'absolute',
            }}>
            <Image
              source={Icons.tiger1}
              style={{height: '100%', width: '100%', resizeMode: 'cover'}}
            />
          </View>
          {/* header */}
          <View
            style={{
              marginTop: headerType == 'icon' ? '8%' : '15.7%',
              flexDirection: 'row',
              marginHorizontal: globalConstant.marginHorizontal,
              alignItems: 'center',
            }}>
            <View
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
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {headerType == 'icon' ? (
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
              ) : (
                <Text
                  style={{
                    color: 'white',
                    fontSize: normalize(20),
                    fontFamily: Fonts.OpenSans_Bold,
                  }}>
                  Education Details
                </Text>
              )}
            </View>
          </View>
          {children}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
