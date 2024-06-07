import React, {useEffect, useState} from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {Fonts, Icons} from '../../themes/ImagePath';
import normalize from '../../utils/helpers/dimen';
import {Colors} from '../../themes/Colors';
import ButtonCom from '../../components/ButtonCom';
export default function CreateGroupSucess(props) {
  console.log(props?.route?.params?.groupId?.data?.[0]?._id, 'props?.route?.params?.data')
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
            source={Icons.right}
            style={{height: '100%', width: '100%', resizeMode: 'cover'}}
          />
        </View>

        <Text style={styles.pageTitle}>
          Group Created <Text style={{color: Colors.orange}}>Successfully</Text>
        </Text>
        {/* <Text style={styles.pageSubtitle}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.
        </Text> */}
        <ButtonCom
          onPress={() => props.navigation?.replace('CreatedGroupStep3',{groupId:props?.route?.params?.groupId?.data?.[0]?._id})}
          width={'50%'}
          backgroundColor={Colors.orange}
          marginTop={normalize(10)}
          borderRadius={normalize(12)}
          title={'Invite Friends'}
        />
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
