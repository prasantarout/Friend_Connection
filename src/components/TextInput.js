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

export default function TextInputItem(props) {
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
        height:
          props?.flag === 11
            ? normalize(90)
            : props?.flag === 19
            ? normalize(90)
            : normalize(62),
        width: props.width ? props.width : '100%',
        borderRadius: props.borderRadius,
        backgroundColor: props.backgroundColor,
        borderColor: props?.focus ? Colors.orange : Colors.borderColor,
        borderWidth:
          props?.flag === 11 ? 0 : props?.flag === 19 ? 0 : props.borderWidth,
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
            color: Colors.orange,
            fontFamily: Fonts.Nunito_Regular,
            fontSize: normalize(12),
            position: 'absolute',
            top: props?.flag === 19 ? normalize(-5) : normalize(-9),
            backgroundColor: 'white',
            left: normalize(14),
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
              marginTop: props?.flag === 19 ? normalize(-35) : normalize(6),
            }}>
            {props.toptext}
          </Text>
        )}
        <TextInput
          style={{
            color: '#383A46',
            fontSize: normalize(13),
            fontFamily: Fonts.OpenSans_Regular,
            // letterSpacing:1,
            fontWeight: '600',
            marginLeft: Platform.OS == 'android' ? normalize(-3) : normalize(0),
            // backgroundColor:'red'
            marginTop: Platform.OS == 'ios' ? normalize(7) : normalize(0),
          }}
          secureTextEntry={props.isSecure}
          multiline={props.multiline}
          placeholder={props.placeholder}
          editable={props.editable}
          placeholderTextColor="#909090" //{props.placeholderTextColor}
          keyboardType={props.keyboardType}
          // keyboardType='phone-pad'
          value={props.value}
          onFocus={() => onFocus()}
          onBlur={() => onBlur()}
          maxLength={props.maxLength}
          onSubmitEditing={props?.onSubmitEditing}
          onChangeText={text => {
            onChangeText(text);
          }}
          scrollEnabled={props.multiline ? false : true}
        />
      </View>
      {props.isrightimage && (
        <TouchableOpacity
          style={{position: 'absolute', right: normalize(10)}}
          onPress={() => rightimagepress()}>
          <Image
            source={!props?.showhide ? Icons.visible : Icons.notVisible}
            style={{
              width: normalize(18),
              height: normalize(15),
              resizeMode: 'contain',
              tintColor: Colors.textinputtext,
            }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

TextInputItem.propTypes = {
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

TextInputItem.defaultProps = {
  height: normalize(60),
  width: '100%',
  borderRadius: normalize(12),
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
