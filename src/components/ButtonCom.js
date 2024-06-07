import React from 'react';
import {Text, TouchableOpacity, Image, ImageBackground} from 'react-native';

import PropTypes from 'prop-types';
import {Colors, Fonts, Icons} from '../themes/ImagePath';

export default function ButtonCom(props) {
  function onPress() {
    if (props.onPress) {
      props.onPress();
    }
  }

  return (
    <TouchableOpacity
      style={[
        {
          height: props.height,
          width: props.width ? props.width : '100%',
          borderRadius: props.borderRadius,
          borderColor: props.borderColor,
          borderWidth: props.borderWidth,
          justifyContent: props.justifyContent,
          alignItems: props.alignItems,
          alignSelf: props.alignSelf,
          marginTop: props.marginTop,
          marginBottom: props.marginBottom,
          marginHorizontal: props.marginHorizontal,
          marginVertical: props.marginVertical,
          flexDirection: 'row',
          backgroundColor: props.backgroundColor
            ? props.backgroundColor
            : 'transparent',
        },
        props.style,
      ]}
      onPress={() => {
        onPress();
      }}>
      <Text
        style={{
          color: props.textColor,
          fontSize: props.fontSize,
          fontFamily: Fonts.OpenSans_Bold,
          marginTop: props.textMarginTop,
          fontWeight: props.fontWeight,
          textAlign: 'center',
          // textTransform: props.textTransform,
        }}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
}

ButtonCom.propTypes = {
  height: PropTypes.number,
  width: PropTypes.any,
  backgroundColor: PropTypes.string,
  borderColor: PropTypes.string,
  borderWidth: PropTypes.number,
  borderRadius: PropTypes.number,
  textColor: PropTypes.string,
  fontSize: PropTypes.number,
  title: PropTypes.string,
  onPress: PropTypes.func,
  alignSelf: PropTypes.string,
  image: PropTypes.bool,
  imageicon: PropTypes.string,
  marginTop: PropTypes.number,
  marginBottom: PropTypes.number,
  marginHorizontal: PropTypes.number,
  marginVertical: PropTypes.number,
  //   textTransform: PropTypes.string,
  fontWeight: PropTypes.string,
  tintColor: PropTypes.string,
};

ButtonCom.defaultProps = {
  height: normalize(50),
  borderRadius: normalize(10),
  textColor: 'white',
  fontSize: normalize(13),
  borderWidth: 0,
  title: '',
  onPress: null,
  alignSelf: null,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 0,
  marginBottom: 0,
  marginHorizontal: 0,
  marginVertical: 0,
  //   textTransform: '',
  fontWeight: 'bold',
  tintColor: 'white',
  imgwidth: normalize(30),
  imgheight: normalize(30),
};
