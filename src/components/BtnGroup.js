import React from 'react';
import {Text, TouchableOpacity, Image, ImageBackground} from 'react-native';

import PropTypes from 'prop-types';
import normalize from '../utils/helpers/dimen';
import {Fonts,Icons } from '../themes/ImagePath';
import { Colors } from '../themes/Colors';
export default function BtnGroup(props) {
  function onPress() {
    if (props.onPress) {
      props.onPress();
    }
  }

  return (
    <TouchableOpacity
      style={{
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
        // backgroundColor:'red'
    
      }}
      onPress={() => {
        onPress();
      }}>
      <ImageBackground
      source={Icons.button}
      resizeMode='stretch'
        style={{
          height: '100%',
          width: '100%',
          borderRadius: props.borderRadius,
          borderColor: props.borderColor,
          borderWidth: props.borderWidth,
          justifyContent: props.justifyContent,
          alignItems: props.alignItems,
          alignSelf: props.alignSelf,
        //   marginTop: props.marginTop,
          marginBottom: props.marginBottom,
          marginHorizontal: props.marginHorizontal,
          marginVertical: props.marginVertical,
          flexDirection: 'row',
          overflow:'hidden'
        }}>
        <Text
          style={{
            color: props.textColor,
            fontSize: props.fontSize,
            fontFamily: Fonts.Nunito_Black,
            marginTop: props.textMarginTop,
            fontWeight: props.fontWeight,
            textAlign: 'center',
            // textTransform: props.textTransform,
          }}
          >
          {props.title}
        </Text>
      </ImageBackground>
    </TouchableOpacity>
  );
}

BtnGroup.propTypes = {
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

BtnGroup.defaultProps = {
  height: normalize(50),
  borderRadius: normalize(10),
  textColor: Colors.white,
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
  tintColor: Colors.white,
  imgwidth: normalize(30),
  imgheight: normalize(30),
};
