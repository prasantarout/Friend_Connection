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
import {Icons, Colors, Fonts} from '../themes/ImagePath';

export default function TextInputItem2(props) {
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
    <TouchableOpacity
      onPress={() => rightimagepress()}
      style={{
        height: normalize(70),
        width: props.width ? props.width : '100%',
        borderRadius: props.borderRadius,
        backgroundColor: props.backgroundColor,
        borderColor: props?.focus ? Colors.button : Colors.bordercolor,
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
            fontSize: normalize(13),
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
              color: '#010F1B',
              fontFamily: Fonts.Nunito_Regular,
              fontSize: normalize(13),
              marginTop: normalize(9),
            }}>
            {props.toptext}
          </Text>
        )}
        <Text
          style={{
            color: props?.value ? '#010F1B' : '#A0A0A0',
            fontSize: normalize(13),
            fontFamily: Fonts.Nunito_Medium,
            // letterSpacing:1,
            fontWeight: '600',
            marginLeft: Platform.OS == 'ios' ? normalize(0) : normalize(0),
            marginTop: Platform.OS == 'android' ? normalize(0) : normalize(0),
          }}
          // secureTextEntry={props.isSecure}
          // multiline={props.multiline}
          // placeholder={props.placeholder}
          // editable={props.editable}
          // placeholderTextColor='#A0A0A0' //{props.placeholderTextColor}
          // keyboardType={props.keyboardType}
          // value={props.value}
          // onFocus={()=>onFocus()}
          // onBlur={()=>onBlur()}

          // onChangeText={text => {
          //   onChangeText(text);
          // }}
          // scrollEnabled={props.multiline ? false : true}
        >
          {props?.value ? props?.value : props?.placeholder}
        </Text>
      </View>
      {props.isrightimage && (
        <TouchableOpacity
          style={{position: 'absolute', right: normalize(10)}}
          onPress={() => rightimagepress()}>
          <Image
            source={Icons.arrowdown}
            style={{
              width: normalize(15),
              height: normalize(15),
              resizeMode: 'contain',
              tintColor: Colors.textinputtext,
            }}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

TextInputItem2.propTypes = {
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
};

TextInputItem2.defaultProps = {
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
};
