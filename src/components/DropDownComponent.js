import React, {useState} from 'react';
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import normalize from '../utils/helpers/dimen';
import PropTypes from 'prop-types';
import {Icons, Fonts} from '../themes/ImagePath';
import {Colors} from '../themes/Colors';
import {ScrollView} from 'react-native-gesture-handler';

export default function DropDownComponent(props) {
  function rightimagepress() {
    if (props.rightimagepress) {
      props.rightimagepress();
    }
  } 
  var currentDate = new Date();

  // Get the current year
  var currentYear = currentDate.getFullYear();
  return (
    <>
      <View
        style={{
          height: props?.flag == 2 ? normalize(72) : normalize(62),
          width: props.width ? props.width : '100%',
          borderRadius: props.borderRadius,
          backgroundColor: props.backgroundColor,
          borderColor: props?.focus ? Colors.button : Colors.borderColor,
          borderWidth: props.borderWidth,
          marginTop: props.marginTop,
          marginBottom: props.marginBottom,
          marginVertical: props.marginVertical,
          padding: normalize(11),
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: normalize(15),
        }}>
        {props?.focus && (
          <Text
            style={{
              color: Colors.button,
              fontFamily: Fonts.Nunito_Regular,
              fontSize: normalize(12),
              position: 'absolute',
              top: normalize(-10),
              backgroundColor: 'white',
              left: normalize(12),
            }}>
            {' ' + props.toptext + ' '}
          </Text>
        )}
        <View style={{width: '90%'}}>
          <Text
            style={{
              color: '#A0A0A0',
              fontFamily: Fonts.Nunito_Regular,
              fontSize: normalize(12),
              marginTop: normalize(9),
            }}>
            {props.toptext}
          </Text>
          <Text
            style={{
              color: '#383A46',
              fontSize: normalize(13),
              fontFamily: Fonts.OpenSans_Medium,
              marginTop: normalize(7),
            }}
            numberOfLines={1}>
            {props.value}
          </Text>
        </View>
        {props.isrightimage && (
          <TouchableOpacity
            style={{position: 'absolute', right: normalize(10)}}
            onPress={() => props.onPress && props.onPress()}
            // disabled={
            //   props?.isDisable 
            // }
            >
            <Image
              source={
                props?.flag == 4
                  ? Icons.deletePost
                  : props?.flag == 6
                    ? Icons.addPost
                    : props?.isrightimage
              }
              style={{
                width: normalize(20),
                height: normalize(20),
                resizeMode: 'contain',
                tintColor: props.rightimagetintColor
                  ? props.rightimagetintColor
                  : props?.flag === 2
                    ? '#000000'
                    : props?.flag == 4
                      ? null
                      : props?.flag == 6
                        ? null
                        : Colors.orange,
              }}
            />
          </TouchableOpacity>
        )}
      </View>
      {props.type == 'dropdown' && props.isOpenDropDown && props.drpDownArr && (
        <View
          style={{
            // paddingVertical: 10,
            width: props.width ? props.width : normalize(250),
            position: 'absolute',
            top:
              props?.isEducationSelect === 5
                ? normalize(255)
                : props?.isDegreeSelect === 6
                  ? normalize(334)
                  : props?.isUserTypeSelect === 7
                    ? normalize(410)
                    : props?.isProfileClassSelect === 12
                      ? '69.1%'
                      : props?.isProfileEducationSelect === 10
                        ? '72%'
                        : props?.isProfileUniversitySelect == 14
                          ? '65.4%'
                          : props?.isDegreeYearSelect === 40
                            ? '84%'
                            : props?.isGraduationYearSelect == 39
                              ? '77.4%'
                              : props?.isProfileDegreeSelect == 30
                                ? '78%'
                                : props?.isGraduationSelect === 20
                                  ? '54.5%'
                                  : props?.isDegreeYearSelects
                                    ? normalize(488)
                                    : props?.isGenderSelect === 179
                                      ? normalize(485)
                                      : props?.isSignUpGenderSelect
                                        ? normalize(180)
                                        : props?.isSignUpClassSelect === 41
                                          ? normalize(262)
                                          : props?.isGenderProfileSelect === 299
                                            ? normalize(485)
                                            : props?.privacyFlagItem === 35
                                              ? normalize(112)
                                              : props?.isGroupClassSelect === 12
                                                ? normalize(190)
                                                : normalize(180),
            zIndex: 1,
            height: normalize(100),
            left:
              props?.isProfileEducationSelect === 10 ||
              props?.isProfileClassSelect == 12 ||
              props?.isProfileUniversitySelect == 14 ||
              props?.isProfileDegreeSelect === 30 ||
              props?.isDegreeYearSelect ||
              props?.isGraduationYearSelect == 39 ||
              props?.isGenderSelect === 179 ||
              props?.isGenderProfileSelect === 299 ||
              props?.privacyFlagItem === 35 ||
              props?.isGroupClassSelect === 12
                ? 0
                : normalize(12),
            backgroundColor: '#F2F4F4',
            padding: 10,
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          }}>
          <ScrollView>
            {props.drpDownArr.map((item, index) => {
              return (
                <Text
                  disabled={!props.onSelectData}
                  onPress={() => {
                    props.onSelectData({item, index});
                  }}
                  style={{marginBottom: normalize(10), color: '#000000'}}>
                  {item?.title}
                </Text>
              );
            })}
          </ScrollView>
        </View>
      )}
    </>
  );
}

DropDownComponent.propTypes = {
  height: PropTypes.number,
  width: PropTypes.string,
  backgroundColor: PropTypes.string,
  borderColor: PropTypes.string,
  borderWidth: PropTypes.number,
  borderRadius: PropTypes.number,
  marginTop: PropTypes.number,
  marginBottom: PropTypes.number,
  marginVertical: PropTypes.number,
  toptext: PropTypes.string,
  placeholder: PropTypes.string,
  isSecure: PropTypes.bool,
  placeholderTextColor: PropTypes.placeholderTextColor,
  keyboardType: PropTypes.string,
  value: PropTypes.string,
  multiline: PropTypes.bool,
  editable: PropTypes.bool,
  onChangeText: PropTypes.func,
  isrightimage: PropTypes.bool,
  rightimagepress: PropTypes.func,
  showhide: PropTypes.bool,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  focus: PropTypes.bool,
  maxLength: PropTypes.number,
};

DropDownComponent.defaultProps = {
  height: normalize(60),
  width: '100%',
  borderRadius: normalize(8),
  borderWidth: normalize(1),
  borderColor: Colors.bordercolor,
  marginTop: normalize(15),
  isSecure: false,
  placeholderTextColor: Colors.placeholder,
  keyboardType: 'default',
  value: '',
  multiline: false,
  editable: true,
  onChangeText: null,
  toptext: '',
  isrightimage: false,
  rightimagepress: null,
  showhide: false,
  onFocus: null,
  onBlur: null,
  focus: false,
  maxLength: 300,
};
