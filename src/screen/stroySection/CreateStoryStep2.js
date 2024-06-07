import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  TextInput,
  ScrollView,
  Dimensions,
  ImageBackground,
  StatusBar,
  Keyboard,
  Pressable,
  KeyboardAvoidingView,
  Button,
  BackHandler,
} from 'react-native';
import React, {Fragment, useEffect, useState} from 'react';
import {Icons} from '../../themes/ImagePath';
import normalize from '../../utils/helpers/dimen';
import {Colors} from '../../themes/Colors';
import TextInputItem from '../../components/TextInput';
import Modal from 'react-native-modal';
import TextInputmultiple from '../../components/TextInputmultiple';
import CustomChipComponent from '../../components/CustomChipComponent';
import showErrorAlert from '../../utils/helpers/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import constants from '../../utils/helpers/constants';
import {postApi} from '../../utils/helpers/ApiRequest';
import axios from 'axios';
import {SafeAreaView} from 'react-native-safe-area-context';
import { navigationRef } from '../../utils/helpers/RootNavigation';
export default function CreateStoryStep2(props) {
  const {selectedImg} = props.route.params;
  const colorArr = [
    {
      id: 0,
      hexcode: '#F9CE7A',
    },
    {
      id: 1,
      hexcode: '#cc0000',
    },
    {
      id: 2,
      hexcode: '#FFFF00',
    },
    {
      id: 3,
      hexcode: '#008000',
    },
    {
      id: 4,
      hexcode: '#0000FF',
    },
    {
      id: 5,
      hexcode: '#964B00',
    },
    {
      id: 6,
      hexcode: '#808080',
    },

    {
      id: 7,
      hexcode: '#FFFFFF',
    },
    {
      id: 8,
      hexcode: '#000000',
    },
  ];
  const fontArr = [
    {
      id: 0,
      fonts: 'Poppins-Medium',
    },
    {
      id: 1,
      fonts: 'Poppins-SemiBoldItalic',
    },
    {
      id: 2,
      fonts: 'OpenSans-MediumItalic',
    },
    {
      id: 3,
      fonts: 'Poppins-BoldItalic',
    },
    {
      id: 4,
      fonts: 'Poppins-MediumItalic',
    },
    {
      id: 5,
      fonts: 'Poppins-SemiBold',
    },
    {
      id: 6,
      fonts: 'OpenSans-Medium',
    },
    {
      id: 7,
      fonts: 'Poppins-BlackItalic',
    },
    {
      id: 8,
      fonts: 'Poppins-Italic',
    },
  ];
  const [description, setDescription] = useState('');
  const [descriptionFocus, setIsDescriptionFocus] = useState(false);
  const [title, setTitle] = useState('');
  const [isTitleFocus, setIsTitleFocus] = useState(false);
  const [isDetailsModal, setIsDetailsModal] = useState(false);
  const [seletedColor, setSeletedColor] = useState(colorArr[0].hexcode);
  const [seletedFont, setSeletedFont] = useState(fontArr[0].fonts);
  const [tags, setTags] = useState([]);
  const [floatingText, setFloatingText] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const detectKeyboard = () => {
    Keyboard.addListener('keyboardWillShow', () => setIsKeyboardVisible(true));
    Keyboard.addListener('keyboardWillHide', () => {
      Keyboard.dismiss();
      setIsKeyboardVisible(false);
    });
  };

  useEffect(() => {
    detectKeyboard();
  }, []);
  const detailsModal = () => {
    return (
      <Modal
        avoidKeyboard={true}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating={true}
        isVisible={isDetailsModal}
        style={{width: '100%', alignSelf: 'center', margin: 0}}
        animationInTiming={800}
        animationOutTiming={1000}
        onBackdropPress={() => {
          setIsDetailsModal(false);
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(255, 255, 255, 1)',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            borderTopRightRadius: normalize(20),
            borderTopLeftRadius: normalize(20),
            paddingVertical: normalize(10),
            paddingHorizontal: normalize(10),
            height: '65%',
          }}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            <View
              style={{
                paddingVertical: normalize(10),
                backgroundColor: Colors.white,
                paddingHorizontal: normalize(15),
                borderTopEndRadius: normalize(15),
                borderTopStartRadius: normalize(15),
              }}>
              <TextInputItem
                toptext={'Title'}
                placeholder={'Enter Title'}
                width="100%"
                value={title}
                onChangeText={val => setTitle(val)}
                onFocus={() => setIsTitleFocus(true)}
                onBlur={() => setIsTitleFocus(false)}
                focus={isTitleFocus}
              />
              <TextInputmultiple
                toptext={'Description'}
                placeholder={'Enter Description'}
                width="100%"
                value={description}
                height={10}
                onChangeText={val => setDescription(val)}
                onFocus={() => setIsDescriptionFocus(true)}
                onBlur={() => setIsDescriptionFocus(false)}
                focus={descriptionFocus}
              />
              <CustomChipComponent
                toptext={'Tags'}
                placeholder={'Enter Your Tag'}
                getData={res => {
                  setTags(res);
                }}
                sendItem={tags}
              />
            </View>
          </ScrollView>
          {/* button */}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              // marginTop: normalize(10),
              // width:"70%",
              paddingHorizontal: normalize(10),
              alignSelf: 'center',
            }}>
            <TouchableOpacity
              disabled={loader}
              onPress={onPressPost}
              activeOpacity={0.1}
              style={{
                width: '80%',
                height: normalize(45),
                marginTop: normalize(10),
                marginBottom: normalize(10),
                backgroundColor: Colors.orange,
                borderRadius: normalize(12),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: normalize(16),
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: Colors.white,
                  fontWeight: '600',
                }}>
                {loader ? 'Posting...' : 'Post'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsDetailsModal(false);
                // props.navigation.goBack();
              }}
              activeOpacity={0.1}
              style={{
                width: normalize(45),
                height: normalize(45),
                alignSelf: 'center',
                marginLeft: normalize(10),
                borderRadius: normalize(10),
                backgroundColor: 'rgba(31, 36, 64, 1)',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={Icons.cross}
                style={{width: normalize(14), height: normalize(14)}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  const onPressPost = async () => {
    try {
      let token = await AsyncStorage.getItem(constants?.TOKEN);
      let headers = {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        'x-access-token': token,
      };
      let obj = new FormData();
      obj.append('title', title);
      obj.append('text', floatingText);
      obj.append('color', floatingText != '' ? seletedColor : '');
      obj.append('font', floatingText != '' ? seletedFont : '');
      obj.append('description', description);
      if (tags.length > 0) {
        tags.map((item, index) => {
          obj.append('tags[' + index + ']', item);
        });
      }
      obj.append('media_url', {
        name: selectedImg.name + `.${selectedImg.type}`,
        type: `image/${selectedImg.type}`,
        uri: selectedImg.uri,
      });
      setLoader(true);
      let response = await axios.post(
        `${constants.BASE_URL}/status/create`,
        obj,
        {headers},
      );

      // console.log(response.data);

      if (response.data.status == 200) {
        setLoader(false);
        showErrorAlert(response.data.message);
        setIsDetailsModal(false);
        props?.navigation?.navigate('TabNavigator');
      } else {
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      console.error('onPressPost>>>', error?.response?.data);
    }
  };


  const handleBackButton = () => {
    if (navigationRef?.current && navigationRef.current.canGoBack()) {
      navigationRef?.current?.goBack();
      return true;
    }
    return false; // Default behavior (app closing)
  };

  React.useEffect(() => {
    const backHandler = BackHandler?.addEventListener(
      "hardwareBackPress",
      handleBackButton
    );

    return () => backHandler.remove();
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
      edges={['top', 'bottom']}>
      <StatusBar
        backgroundColor={'transparent'}
        translucent
        barStyle={'light-content'}
      />
      <ImageBackground
        source={{uri: selectedImg.uri}}
        resizeMode="contain"
        style={{height: '100%', width: '100%'}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={{flex: 1}}>
          <View
            style={[
              {
                flex: 1,
                justifyContent: 'flex-end',
                marginHorizontal: normalize(15),
              },
            ]}>
            {isKeyboardVisible && (
              <Pressable
                style={{
                  position: 'absolute',
                  top: normalize(0),
                  right: normalize(0),
                  padding: normalize(5),
                }}
                onPress={() => Keyboard.dismiss()}>
                <Text
                  style={{
                    color: Colors.white,
                    fontWeight: '700',
                    fontSize: normalize(16),
                  }}>
                  Done
                </Text>
              </Pressable>
            )}
            {/* {floatingText != '' && (
              <Pressable
                onPress={() => {
                  setFloatingText('');
                }}
                style={{
                  height: normalize(15),
                  width: normalize(15),
                  backgroundColor: 'red',
                  alignSelf: 'flex-end',
                }}></Pressable>
            )} */}
            <TextInput
              placeholder="Add text Here"
              placeholderTextColor={seletedColor}
              multiline
              value={floatingText}
              onChangeText={text => setFloatingText(text)}
              // numberOfLines={2}
              style={{
                marginBottom: normalize(55),
                textAlign: 'center',
                fontSize: normalize(20),
                fontFamily: seletedFont,
                color: seletedColor,
              }}
            />
            {/* colors */}
            <View style={{flexDirection: 'row'}}>
              {colorArr.map((item, index) => {
                return (
                  <Pressable
                    key={index}
                    onPress={() => {
                      setSeletedColor(item.hexcode);
                    }}
                    style={{
                      height: normalize(20),
                      width: normalize(20),
                      borderWidth: 1.5,
                      borderColor: Colors.white,
                      borderRadius: normalize(20),
                      backgroundColor: item.hexcode,
                      marginRight: normalize(10),
                      justifyContent: 'center',
                      alignItems: 'center',
                      shadowColor: '#212121',
                      shadowOpacity: 0.2,
                      shadowOffset: {
                        width: 0,
                        height: 0,
                      },
                      shadowRadius: 10,
                      elevation: 3,
                    }}>
                    {seletedColor == item.hexcode && (
                      <View
                        style={{
                          height: '45%',
                          width: '45%',
                          borderRadius: normalize(5),
                          backgroundColor: Colors.white,
                        }}
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
            {/* Fonts */}
            <View style={{flexDirection: 'row', marginTop: normalize(8)}}>
              <ScrollView
                bounces={false}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{backgroundColor: '#cccccc10'}}>
                {fontArr.map((item, index) => {
                  return (
                    <Pressable
                      key={index}
                      onPress={() => {
                        setSeletedFont(item.fonts);
                      }}
                      style={{
                        height: normalize(20),
                        width: normalize(20),
                        borderRadius: normalize(5),
                        backgroundColor:
                          seletedFont == item.fonts ? Colors.white : null,
                        borderColor: Colors.white,
                        borderWidth:
                          seletedFont != item.fonts ? normalize(1) : 0,
                        marginRight: normalize(10),
                        justifyContent: 'center',
                        alignItems: 'center',
                        // shadowColor: '#ccc',
                        // shadowOpacity: 1,
                        // shadowOffset: {
                        //   width: 0,
                        //   height: 0,
                        // },
                        // shadowRadius: 10,
                      }}>
                      <Text
                        style={{
                          color:
                            seletedFont != item.fonts
                              ? Colors.white
                              : Colors.black,
                          fontFamily: item.fonts,
                          fontSize: normalize(10),
                        }}>
                        Aa
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          </View>
          {/* button */}
          {isKeyboardVisible ? (
            <View style={{height: normalize(20)}} />
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: normalize(15),
                marginTop: normalize(12),
                marginHorizontal: normalize(15),
              }}>
              <TouchableOpacity
                onPress={() => {
                  setIsDetailsModal(true);
                  // props.navigation.navigate('CreateStoryStep3');
                }}
                activeOpacity={0.1}
                style={{
                  width: '80%',
                  height: normalize(45),
                  marginTop: normalize(10),
                  marginBottom: normalize(10),
                  backgroundColor: Colors.orange,
                  borderRadius: normalize(12),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: normalize(16),
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: Colors.white,
                    fontWeight: '600',
                  }}>
                  Continue
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  props.navigation.goBack();
                }}
                activeOpacity={0.1}
                style={{
                  width: normalize(45),
                  height: normalize(45),
                  alignSelf: 'center',
                  marginLeft: normalize(10),
                  borderRadius: normalize(10),
                  backgroundColor: 'rgba(31, 36, 64, 1)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={Icons.cross}
                  style={{width: normalize(14), height: normalize(14)}}
                />
              </TouchableOpacity>
            </View>
          )}
        </KeyboardAvoidingView>
      </ImageBackground>
      {detailsModal()}
    </SafeAreaView>
  );
}
