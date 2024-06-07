import React, {useState} from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import PropTypes, {any} from 'prop-types';
import normalize from '../utils/helpers/dimen';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import {Colors} from '../themes/Colors';
import {Fonts} from '../themes/ImagePath';
function VideoPicker(props) {
  function btnClick_VideogaleryUpload() {
    if (props?.btnClick_galeryUpload) {
      ImagePicker?.openPicker({
        width: normalize(300),
        height: normalize(400),
        cropping: false,
        multiple: props?.multiple,
        mediaType: 'video',
      })
        .then(response => {
          // console.log(response);
          let arr = [];
          if (props?.multiple) {
            response?.filter(data => {
              arr.push({
                name: data?.filename
                  ? data?.filename
                  : data?.path?.replace(/^.*[\\\/]/, ''),
                type: data?.mime,
                uri: data?.path,
              });
            });
          } else {
            let videoObj = {};
            videoObj.name = response?.filename
              ? response?.filename
              : response?.path.replace(/^.*[\\\/]/, '');
            videoObj.type = response?.mime;
            videoObj.uri = response?.path;
            if (
              videoObj?.type === 'video/mp4' ||
              videoObj?.type === 'video/webm'
            ) {
              arr?.push(videoObj);
            } else {
              alert('Invalid file type. Please select an MP4 or WebM video.');
              return;
            }
          }
          props?.btnClick_VideogaleryUpload(arr);
        })
        .catch(err => console.log(err));
    }
  }

  // function to open camera
  function btnClick_TakeVideoUpload() {
    if (props?.btnClick_TakeVideoUpload) {
      ImagePicker?.openCamera({
        width: 1024,
        height: 1024,
        cropping: false,
        mediaType: 'video',
      })
        .then(response => {
          let VideoObj = {};
          VideoObj.name = response?.filename
            ? response?.filename
            : response?.path?.replace(/^.*[\\\/]/, '');
          VideoObj.type = response?.mime;
          VideoObj.uri = response?.path;
          // console.log("++++++++++++++ imgobj", VideoObj);
          props?.btnClick_TakeVideoUpload(VideoObj);
        })
        .catch(err => console.log(err));
    }
  }

  function onBackdropPress() {
    if (props?.onBackdropPress) {
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
      animationInTiming={800}
      animationOutTiming={1000}
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
          onPress={() => btnClick_TakeVideoUpload()}
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
              color: Colors.primaryColor,
            }}>
            Take Video
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => btnClick_VideogaleryUpload()}
          activeOpacity={0.6}
          style={{
            width: '75%',
            height: normalize(45),
            alignSelf: 'center',
            marginBottom: normalize(15),
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
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({});
//Proptypes
VideoPicker.propTypes = {
  pickerVisible: PropTypes.bool,
  btnClick_galeryUpload: PropTypes.func,
  btnClick_cameraUpload: PropTypes.func,
  onBackdropPress: PropTypes.func,
  multiple: PropTypes.bool,
  mediatype: PropTypes.string,
  // maxVideos: PropTypes.number,
};

//defaultPropsvalue
VideoPicker.defaultProps = {
  pickerVisible: false,
  btnClick_galeryUpload: () => {},
  btnClick_cameraUpload: () => {},
  onBackdropPress: () => {},
  multiple: false,
  // maxVideos: 3,
};
export default React.memo(VideoPicker);
