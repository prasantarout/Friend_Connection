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

export default function DropDownOne(props) {
  function onChangeText(text) {
    if (props.onChangeText) {
      props.onChangeText(text);
    }
  }
  function rightimagepress() {
    if (props.rightimagepress) {
      props.rightimagepress();
    }
  }

  function onFocus() {
    if (props.onFocus) {
      props.onFocus();
    }
  }
  function onBlur() {
    if (props.onBlur) {
      props.onBlur();
    }
  }

  return (
    <View
      style={{
        height: normalize(82),
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
        {props?.focus == false && (
          <Text
            style={{
              color: '#A0A0A0',
              fontFamily: Fonts.Nunito_Regular,
              fontSize: normalize(12),
              marginTop: normalize(9),
            }}>
            {props.toptext}
          </Text>
        )}
        <Text
          style={{
            color: '#383A46',
            fontSize: normalize(13),
            fontFamily: Fonts.OpenSans_Medium,
            marginTop: normalize(7),
          }}>
          {props.value}
        </Text>
      </View>
      {props.isrightimage && (
        <TouchableOpacity
          style={{position: 'absolute', right: normalize(10)}}
          onPress={() => rightimagepress()}>
          <Image
            source={props?.isrightimage}
            style={{
              width: normalize(20),
              height: normalize(20),
              resizeMode: 'contain',
              tintColor: props.rightimagetintColor
                ? props.rightimagetintColor
                : Colors.orange,
            }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

DropDownOne.propTypes = {
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

DropDownOne.defaultProps = {
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
