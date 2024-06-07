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

export default function TextInputmultiple(props) {
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
        // height:
        //   props?.flag === 2
        //     ? normalize(120)
        //     : props?.fullNameFlag == 6
        //     ? normalize(70)
        //     : normalize(150),
        paddingVertical:normalize(20),
        width: props.width ? props.width : '100%',
        borderRadius: props.borderRadius,
        backgroundColor: props.backgroundColor,
        borderColor: props?.focus ? Colors.orange : Colors.borderColor,
        borderWidth: props.borderWidth,
        marginTop: props.marginTop,
        marginBottom: props.marginBottom,
        marginVertical: props.marginVertical,
        padding: normalize(11),
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingLeft: normalize(15),
      }}>
      {props?.focus && (
        <Text
          style={{
            color: Colors.orange,
            fontFamily: Fonts.Nunito_Regular,
            fontSize: normalize(12),
            position: 'absolute',
            top: normalize(-9),
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
              marginTop: normalize(6),
            }}>
            {props.toptext}
          </Text>
        )}
        <TextInput
          style={{
            // height: '100%',
            // width: '100%',
            // textAlignVertical: 'top',
            color: '#383A46',
            fontSize: normalize(13),
            fontFamily: Fonts.OpenSans_Regular,
            fontWeight: '600',
            marginLeft: Platform.OS == 'android' ? normalize(-3) : normalize(0),
            marginTop: Platform.OS == 'ios' ? normalize(7) : normalize(0),
            // alignItems: 'flex-start',
          }}
          secureTextEntry={props.isSecure}
          multiline
          placeholder={props.placeholder}
          editable={props.editable}
          placeholderTextColor="#909090" //{props.placeholderTextColor}
          keyboardType={props.keyboardType}
          // returnKeyType={props?.isReturn===5 &&'done'}
          value={props.value}
          onFocus={() => onFocus()}
          onBlur={() => onBlur()}
          maxLength={props.maxLength}
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

TextInputmultiple.propTypes = {
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
  placeholderTextColor: PropTypes.string,
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

TextInputmultiple.defaultProps = {
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
