import React, {useState} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import PropTypes, {any} from 'prop-types';
import normalize from '../utils/helpers/dimen';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import {Colors} from '../themes/Colors';
import {Fonts} from '../themes/ImagePath';
// import Button from './Button';

function CameraPicker(props) {
  function btnClick_galeryUpload() {
    if (props.btnClick_galeryUpload) {
      ImagePicker.openPicker({
        width: normalize(300),
        height: normalize(400),
        cropping: true,
        multiple: props.multiple,
        mediaType: 'photo',
        includeBase64: true,
        compressImageQuality: 0.1,
        maxFiles: 5,
      })
        .then(response => {
          let arr = [];
          if (props.multiple) {
            response.slice(0, 5).filter(data => {
              arr.push({
                name: data.filename
                  ? data.filename
                  : data.path.replace(/^.*[\\\/]/, ''),
                type: data.mime,
                uri: data.path,
                size: data.size,
                filedata: data.data,
              });
            });
            props.btnClick_galeryUpload(arr);
          } else {
            let imageObj = {};
            // console.log(response);
            imageObj.name = response.filename
              ? response.filename
              : response.path.replace(/^.*[\\\/]/, '');
            imageObj.type = response.mime;
            imageObj.uri = response.path;
            imageObj.size = response.size;
            imageObj.filedata = response.data;
            // console.log(imageObj);
            props.btnClick_galeryUpload(imageObj);
          }
        })
        .catch(err => console.log(err));
    }
  }

  // function to open camera
  function btnClick_cameraUpload() {
    if (props.btnClick_cameraUpload) {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
        multiple: props?.multiple,
        mediaType: 'photo',
        includeBase64: true,
        compressImageQuality: 0.1,
        maxFiles: 5,
      })
        .then(response => {
          let imageObj = {};
          imageObj.name = response.filename
            ? response.filename
            : response.path.replace(/^.*[\\\/]/, '');
          imageObj.type = response.mime;
          imageObj.uri = response.path;
          imageObj.size = response.size;
          imageObj.filedata = response.data;
          //   console.log("++++++++++++++ imgobj", imageObj);
          // console.log('IMAGE', imageObj);
          props.btnClick_cameraUpload(imageObj);
        })
        .catch(err => console.log(err));
    }
  }

  function onBackdropPress() {
    if (props.onBackdropPress) {
      props.onBackdropPress();
    }
  }

  return (
    <Modal
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      backdropTransitionOutTiming={0}
      hideModalContentWhileAnimating={true}
      isVisible={props.pickerVisible}
      style={{width: '100%', alignSelf: 'center', margin: 0}}
      animationInTiming={400}
      animationOutTiming={400}
      onBackdropPress={() => onBackdropPress()}>
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.orange,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          borderTopRightRadius: normalize(20),
          borderTopLeftRadius: normalize(20),
          paddingVertical: normalize(10),
          alignItems: 'center',
        }}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
        <TouchableOpacity
          onPress={() => btnClick_cameraUpload()}
          activeOpacity={0.6}
          style={{
            width: '75%',
            height: normalize(45),
            alignSelf: 'center',
            marginTop: normalize(10),
            marginBottom: normalize(10),
            backgroundColor: Colors.white,
            borderRadius: normalize(10),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: normalize(12),
              alignItems: 'center',
              justifyContent: 'center',
              color: Colors.orange,
            }}>
            Select from Camera
          </Text>
        </TouchableOpacity>
        {/* <Button
          width={'75%'}
          height={normalize(45)}
          alignSelf={'center'}
          marginTop={normalize(0)}
          marginBottom={normalize(15)}
          backgroundColor={Colors.lightGreen}
          title={'Select from Gallery'}
          textColor={Colors.white}
          borderRadius={normalize(10)}
          textAlign={'center'}
          fontSize={normalize(12)}
          justifyContent={'center'}
          fontWeight={'600'}
          onPress={() => {
            btnClick_galeryUpload();
          }}
          activeOpacity={0.6}
          titlesingle={true}
        /> */}
        <TouchableOpacity
          onPress={() => btnClick_galeryUpload()}
          activeOpacity={0.6}
          style={{
            width: '75%',
            height: normalize(45),
            alignSelf: 'center',
            marginBottom: props.limitMessage ? normalize(5) : normalize(15),
            borderRadius: normalize(10),
            backgroundColor: 'transparent',
            justifyContent: 'center',
            borderColor: Colors.white,
            borderWidth: 2,
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: normalize(12),
              fontFamily: Fonts.RobotoRegular,
              alignItems: 'center',
              justifyContent: 'center',
              color: Colors.white,
            }}>
            Select from Gallery
          </Text>
        </TouchableOpacity>
        {props.limitMessage && (
          <Text
            style={{
              fontSize: normalize(10),
              fontFamily: Fonts.OpenSans_MediumItalic,
              color: Colors.white,
              marginBottom: normalize(10),
            }}>
            Maximum 5 images are allowed
          </Text>
        )}
      </View>
    </Modal>
  );
}

//Proptypes
CameraPicker.propTypes = {
  pickerVisible: PropTypes.bool,
  btnClick_galeryUpload: PropTypes.func,
  btnClick_cameraUpload: PropTypes.func,
  onBackdropPress: PropTypes.func,
  multiple: PropTypes.bool,
  mediatype: PropTypes.string,
};

//defaultPropsvalue
CameraPicker.defaultProps = {
  pickerVisible: false,
  btnClick_galeryUpload: () => {},
  btnClick_cameraUpload: () => {},
  onBackdropPress: () => {},
  multiple: false,
};
export default React.memo(CameraPicker);
