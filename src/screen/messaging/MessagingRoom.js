import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  FlatList,
  TextInput,
  Pressable,
  Dimensions,
  Keyboard,
  BackHandler,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Modal from 'react-native-modal';
import MyStatusBar from '../../utils/helpers/MyStatusBar';
import {Fonts, Icons} from '../../themes/ImagePath';
import normalize from '../../utils/helpers/dimen';
import {Colors} from '../../themes/Colors';
import TextInputItem from '../../components/TextInput';
import TextInputmultiple from '../../components/TextInputmultiple';
import ButtonCom from '../../components/ButtonCom';
import {ImageBackground} from 'react-native';
import {KeyboardAvoidingView} from 'react-native';
import moment from 'moment';
import connectionrequest from '../../utils/helpers/NetInfo';
import {useDispatch, useSelector} from 'react-redux';
import {
  getChatMessageListRequest,
  getMediaLinkRequest,
  blockunblockRequest,
} from '../../redux/reducer/MessagingReducer';
import {useFocusEffect} from '@react-navigation/native';
import Loader from '../../utils/helpers/Loader';
import constants from '../../utils/helpers/constants';
import socketService from '../../utils/helpers/socketService';
import {SafeAreaView} from 'react-native-safe-area-context';
import CameraPicker from '../../components/CameraPicker';
import {EmojiKeyboard} from 'rn-emoji-keyboard';
// import EmojiInput from 'react-native-emoji-input';
// import EmojiPicker, {no} from 'rn-emoji-keyboard';
import {
  EventDetailsRequest,
  RelatedEventRequest,
} from '../../redux/reducer/EventReducer';
import HtmlTextComponent from '../../components/HtmlTextComponent';
import {navigationRef} from '../../utils/helpers/RootNavigation';
import Toast from '../../utils/helpers/Toast';

const MessagingRoom = props => {
  const [subject, setSubject] = useState('');
  const [isSubjectFocus, setIsSubjectFocus] = useState(false);

  const {room_id, name, profile_image, isblock, block_by} =
    props?.route?.params;
    console.log(block_by,">>>>>>>redd")
  const MessagingReducer = useSelector(state => state.MessagingReducer);
  const AuthReducer = useSelector(state => state.AuthReducer);
  const [chat, setChat] = useState([]);
  const [attachmentModal, setAttachmentModal] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectionState, setSelectionState] = useState({});

  const [isStatementFocus, setIsStatementFocus] = useState(false);
  const [value, setvalue] = useState('');
  const [images, setImages] = useState(null);
  const [imagesUri, setImagesUri] = useState(null);
  const [moreDropdown, setMoreDropdown] = useState(false);
  const [emojiBoard, setEmojiBoard] = useState(false);
  const socket = socketService(AuthReducer.getTokenResponse);
  let status = '';
  const dispatch = useDispatch();
  const previewRef = useRef(null);
  const handleBackButton = () => {
    if (navigationRef?.current && navigationRef.current.canGoBack()) {
      navigationRef?.current?.goBack();
      return true;
    }
    return false; // Default behavior (app closing)
  };

  React.useEffect(() => {
    const backHandler = BackHandler?.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );

    return () => backHandler.remove();
  }, []);
  
  useFocusEffect(
    useCallback(() => {
      connectionrequest()
        .then(() => {
          dispatch(getChatMessageListRequest({room_id, page: 1, limit: 150}));
          socket.emit('seen:message', {room_id});
          // setFetchedOnce(true);
        })
        .catch(err => {
          console.log(err);
          Toast('Please connect To Internet');
        });
    }, []),
  );

  const incommingMessageHandler = data => {
    // console.log('New message Recieved - ', data);
    socket.emit('seen:message', {room_id});
    setChat(prev => [data, ...prev]);
  };

  useEffect(() => {
    socket.on('message:success', incommingMessageHandler);
    socket.on(
      `${room_id}_${AuthReducer.getProfileRes.data._id}_new_message`,
      incommingMessageHandler,
    );

    return () => {
      socket.removeEventListener('message:success', incommingMessageHandler);
      socket.removeEventListener(
        `${room_id}_${AuthReducer.getProfileRes.data._id}_new_message`,
        incommingMessageHandler,
      );
    };
  }, []);

  useEffect(() => {
    if (status == '' || MessagingReducer.status != status) {
      switch (MessagingReducer.status) {
        case 'Messaging/getChatMessageListRequest':
          status = MessagingReducer.status;
          break;
        case 'Messaging/getChatMessageListSuccess':
          status = MessagingReducer.status;
          setChat(MessagingReducer.chatMessageListRes.data.slice().reverse());
          break;
        case 'Messaging/getChatMessageListFailure':
          status = MessagingReducer.status;
          break;

        case 'Messaging/blockunblockRequest':
          status = MessagingReducer.status;
          break;
        case 'Messaging/blockunblockSuccess':
          status = MessagingReducer.status;
          props?.navigation?.navigate('Messaging');
          console.log('block');
          break;
        case 'Messaging/blockunblockFailure':
          status = MessagingReducer.status;
          break;
      }
    }
  }, [MessagingReducer.status]);

  const sendMessage = () => {
    try {
      socket.emit('send:message', {
        room_id: room_id,
        sender_id: AuthReducer.getProfileRes?.data?._id,
        text: value,
        image: images || [],
      });
      setvalue('');
      setImages(null);
      setImagesUri(null);
    } catch (err) {
      console.log(err);
    }
  };

  // useEffect(() => {
  //   const keyboardShow = Keyboard.addListener('keyboardWillShow', () => {
  //     setEmojiBoard(false);
  //   });
  //   return () => {
  //     Keyboard.removeSubscription(keyboardShow);
  //   };
  // }, []);

  const RecievedChatBubble = ({item, next_chat_item, index}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          width: '85%',
          marginTop:
            next_chat_item?.sender_id === item?.sender_id
              ? normalize(5)
              : normalize(13),
          alignItems: 'center',
        }}>
        <View
          style={{
            width: normalize(20),
            aspectRatio: 1 / 1,
            alignSelf: 'flex-end',
          }}>
          <Image
            source={
              item?.sender_data?.profile_image !== '' &&
              item?.sender_data?.profile_image !== undefined &&
              item?.sender_data?.profile_image !== null
                ? {
                    uri:
                      constants?.IMAGE_URL +
                      'user/' +
                      item?.sender_data?.profile_image,
                  }
                : Icons.userProfile
            }
            style={{
              width: '100%',
              height: '100%',
              borderRadius: normalize(50),
              resizeMode: 'cover',
            }}
          />
        </View>
        <View
          style={{
            maxWidth: '100%',
            flex: Boolean(item?.image.length) ? 1 : undefined,
            marginLeft: normalize(10),
            backgroundColor: '#f5f5f5',
            paddingVertical: normalize(15),
            paddingHorizontal: normalize(3),
            borderTopRightRadius: normalize(10),
            borderTopLeftRadius: normalize(10),
            borderBottomLeftRadius:
              chat[index - 1]?.sender_id === item?.sender_id ? normalize(7) : 0,

            borderBottomRightRadius: normalize(10),
          }}>
          {Boolean(item?.event_data) ? (
            <EventChatItem item={item} left />
          ) : (
            <>
              {Boolean(item?.image.length) && (
                <Pressable
                  style={{
                    flex: 1,
                    height: normalize(150),
                    marginBottom: item?.text ? normalize(2) : normalize(5),
                    borderRadius: normalize(10),
                    overflow: 'hidden',
                    position: 'relative',
                    flexDirection: 'row',
                  }}
                  onPress={() => {
                    setPreviewData(item), setPreviewModal(true);
                  }}>
                  <Image
                    source={
                      item?.image[0] !== '' &&
                      item?.image[0] !== undefined &&
                      item?.image[0] !== null
                        ? {
                            uri:
                              constants?.IMAGE_URL +
                              'chat/' +
                              item?.image[0].name,
                          }
                        : Icons.userProfile
                    }
                    style={{
                      flex: 1,
                      height: '100%',
                      resizeMode: 'cover',
                      alignSelf: 'center',
                    }}
                  />
                  {Boolean(item?.image.length - 1) && (
                    <View
                      style={{flex: 1, flexDirection: 'row', height: '100%'}}>
                      <Image
                        source={
                          item?.image[1] !== '' &&
                          item?.image[1] !== undefined &&
                          item?.image[1] !== null
                            ? {
                                uri:
                                  constants?.IMAGE_URL +
                                  'chat/' +
                                  item?.image[1].name,
                              }
                            : Icons.userProfile
                        }
                        style={{
                          flex: 1,
                          height: '100%',
                          resizeMode: 'cover',
                          alignSelf: 'center',
                        }}
                      />
                      <View
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#cccccc80',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                        }}>
                        <Text
                          style={{
                            color: '#222',
                            fontFamily: Fonts.OpenSans_SemiBold,
                            fontSize: normalize(14),
                          }}>
                          +{item?.image.length - 1} more
                        </Text>
                      </View>
                    </View>
                  )}
                </Pressable>
              )}
              <View style={{flexDirection: 'row'}}>
                {item?.text ? (
                  <Text
                    style={{
                      fontFamily: Fonts.OpenSans_Medium,
                      color: Colors.textinputtext,
                      fontSize: normalize(11),
                      // flex: 1,
                      marginBottom: normalize(5),
                      paddingHorizontal: normalize(6),
                      paddingTop: normalize(4),
                      // marginRight: normalize(5),
                    }}>
                    {item?.text}
                  </Text>
                ) : null}
                <Text
                  style={{
                    color: '#aaa',
                    alignSelf: 'flex-end',
                    fontSize: normalize(8),
                    marginLeft: 'auto',
                    paddingLeft: normalize(1),
                    marginRight: normalize(2),
                    top:normalize(9)
                    
                  }}>
                  {moment(item?.chat_date).format('hh:mm A')}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    );
  };

  const SendChatBubble = ({item, next_chat_item, index}) => {
    // console.log(item, item.chat_type);
    return (
      <View
        style={{
          maxWidth: '80%',
          // marginTop: normalize(20),
          alignItems: 'center',
          alignSelf: 'flex-end',
        }}>
        {/* <Text
      style={{
        alignSelf: 'flex-end',
        fontFamily: Fonts.OpenSans_Regular,
        fontSize: normalize(10),
        color: '#A0A0A0',
      }}>
      {moment(item?.chat_date).format('MMM DD, YYYY [AT] hh:mm A')}
    </Text> */}
        <View
          style={{
            maxWidth: '100%',
            // flex: 1,
            backgroundColor: '#1F2440',
            paddingVertical: normalize(3),
            // paddingTop: normalize(13),
            paddingHorizontal: normalize(3),
            borderTopRightRadius: normalize(10),
            borderTopLeftRadius: normalize(10),
            borderBottomLeftRadius: normalize(10),
            borderBottomRightRadius:
              chat[index - 1]?.sender_id === item?.sender_id ? normalize(7) : 0,
            marginTop:
              next_chat_item?.sender_id === item?.sender_id
                ? normalize(4)
                : normalize(8),
          }}>
          {Boolean(item.event_data) ? (
            <EventChatItem item={item} />
          ) : (
            <>
              {Boolean(item?.image.length) && (
                <Pressable
                  style={{
                    width: '100%',
                    height: normalize(150),
                    marginBottom: item?.text ? normalize(2) : normalize(5),
                    borderRadius: normalize(10),
                    overflow: 'hidden',
                    position: 'relative',
                    flexDirection: 'row',
                  }}
                  onPress={() => {
                    setPreviewData(item), setPreviewModal(true);
                  }}>
                  <Image
                    source={
                      item?.image[0] !== '' &&
                      item?.image[0] !== undefined &&
                      item?.image[0] !== null
                        ? {
                            uri:
                              constants?.IMAGE_URL +
                              'chat/' +
                              item?.image[0].name,
                          }
                        : Icons.userProfile
                    }
                    style={{
                      flex: 1,
                      height: '100%',
                      resizeMode: 'cover',
                      alignSelf: 'center',
                    }}
                  />
                  {Boolean(item?.image.length - 1) && (
                    <View
                      style={{flex: 1, flexDirection: 'row', height: '100%'}}>
                      <Image
                        source={
                          item?.image[1] !== '' &&
                          item?.image[1] !== undefined &&
                          item?.image[1] !== null
                            ? {
                                uri:
                                  constants?.IMAGE_URL +
                                  'chat/' +
                                  item?.image[1].name,
                              }
                            : Icons.userProfile
                        }
                        style={{
                          flex: 1,
                          height: '100%',
                          resizeMode: 'cover',
                          alignSelf: 'center',
                        }}
                      />
                      <View
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#cccccc90',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                        }}>
                        <Text
                          style={{
                            color: '#222',
                            fontFamily: Fonts.OpenSans_SemiBold,
                            fontSize: normalize(14),
                          }}>
                          +{item?.image.length - 1} more
                        </Text>
                      </View>
                    </View>
                  )}
                </Pressable>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  // alignSelf: 'stretch',
                }}>
                {item?.text ? (
                  <Text
                    style={{
                      fontFamily: Fonts.OpenSans_Medium,
                      color: Colors.white,
                      fontSize: normalize(11),
                      // flex: 1,
                      marginBottom: normalize(5),
                      paddingHorizontal: normalize(6),
                      paddingTop: normalize(4),
                      // marginRight: normalize(5),
                    }}>
                    {item?.text}
                  </Text>
                ) : null}
                <Text
                  style={{
                    color: '#eee',
                    alignSelf: 'flex-end',
                    fontSize: normalize(8),
                    marginLeft: 'auto',
                    paddingLeft: normalize(1),
                    marginRight: normalize(1),
                  }}>
                  {moment(item?.chat_date).format('hh:mm A')}
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    );
  };

  const EventChatItem = ({item, left}) => {
    const event = item.event_data;
    return (
      <Pressable
        style={{width: '100%'}}
        onPress={() => {
          props.navigation.navigate('EventDetails');
          dispatch(EventDetailsRequest({id: event?._id}));
          dispatch(
            RelatedEventRequest({
              event_id: event?._id,
              page: 1,
              perpage: 10,
            }),
          );
        }}>
        <View
          style={{
            width: '100%',
            height: normalize(150),
            marginBottom: item?.text ? normalize(2) : normalize(5),
            borderRadius: normalize(10),
            overflow: 'hidden',
            position: 'relative',
            flexDirection: 'row',
          }}>
          <Image
            source={
              !!event.event_image
                ? {
                    uri: constants.IMAGE_URL + 'event/' + event?.event_image,
                  }
                : Icons.noImage
            }
            style={{
              flex: 1,
              height: '100%',
            }}
            resizeMode="cover"
          />
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{marginBottom: normalize(5)}}>
            <View style={styles.event_data_row}>
              <Text
                style={[
                  styles.event_data_text,
                  {
                    fontFamily: Fonts.OpenSans_Medium,
                    width: normalize(110),
                    color: left ? Colors.textinputtext : Colors.white,
                  },
                ]}>
                Event Name:{' '}
              </Text>
              <Text
                style={[
                  styles.event_data_text,
                  {color: left ? Colors.textinputtext : Colors.white, flex: 1},
                ]}>
                {event.eventName}
              </Text>
            </View>
            <View style={styles.event_data_row}>
              <Text
                style={[
                  styles.event_data_text,
                  {
                    fontFamily: Fonts.OpenSans_Medium,
                    width: normalize(110),
                    color: left ? Colors.textinputtext : Colors.white,
                  },
                ]}>
                Event Location:{' '}
              </Text>
              <Text
                style={[
                  styles.event_data_text,
                  {color: left ? Colors.textinputtext : Colors.white},
                ]}>
                {event.eventLocation}
              </Text>
            </View>
            <View style={styles.event_data_row}>
              <Text
                style={[
                  styles.event_data_text,
                  {
                    fontFamily: Fonts.OpenSans_Medium,
                    width: normalize(110),
                    color: left ? Colors.textinputtext : Colors.white,
                  },
                ]}>
                Event Date & Time:
              </Text>
              <Text
                style={[
                  styles.event_data_text,
                  {color: left ? Colors.textinputtext : Colors.white},
                ]}>
                {moment(event.date).format('llll')}
              </Text>
            </View>
            <View style={[styles.event_data_row, {flexWrap: 'wrap'}]}>
              <Text
                style={[
                  styles.event_data_text,
                  {
                    fontFamily: Fonts.OpenSans_Medium,
                    width: normalize(110),
                    marginBottom: normalize(2),
                    color: left ? Colors.textinputtext : Colors.white,
                  },
                ]}>
                Event Description:{' '}
              </Text>
              <HtmlTextComponent
                htmlContent={event.description}
                style={{
                  p: {
                    ...styles.event_data_text,
                    color: left ? Colors.textinputtext : Colors.white,
                  },
                }}
              />
              {/* <Text style={styles.event_data_text}>{event.description}</Text> */}
            </View>
          </View>
          <Text
            style={{
              color: left ? '#aaa' : '#eee',
              alignSelf: 'flex-end',
              fontSize: normalize(8),
              marginLeft: 'auto',
              paddingLeft: normalize(1),
              marginRight: normalize(1),
            }}>
            {moment(item?.chat_date).format('hh:mm A')}
          </Text>
        </View>
      </Pressable>
    );
  };

  const renderItem = useCallback(({item, index, chat}) => {
    const next_chat_item = chat[index + 1];
    return (
      <>
        {item?.sender_id !== AuthReducer.getProfileRes?.data?._id ? (
          <RecievedChatBubble
            item={item}
            next_chat_item={next_chat_item}
            index={index}
          />
        ) : (
          <SendChatBubble
            item={item}
            next_chat_item={next_chat_item}
            index={index}
          />
        )}
        {(next_chat_item === undefined ||
          moment(next_chat_item?.chat_date).format('DD/MM/YYYY') !==
            moment(item?.chat_date).format('DD/MM/YYYY')) && (
          <Text
            style={{
              textAlign: 'center',
              fontFamily: Fonts.OpenSans_Regular,
              fontSize: normalize(10),
              color: '#A0A0A0',
              marginTop: normalize(15),
              marginBottom: normalize(5),
            }}>
            {moment(item?.chat_date).calendar(null, {
              sameDay: '[Today]',
              lastDay: '[Yesterday]',
              lastWeek: 'dddd',
              sameElse: 'DD/MM/YYYY',
            })}
            {/* {moment(item?.chat_date).format('MMM DD, YYYY [AT] hh:mm A')} */}
          </Text>
        )}
      </>
    );
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}>
        <MyStatusBar backgroundColor={'white'} barStyle={'dark-content'} />
        <Loader
          visible={
            status === 'Messaging/getChatMessageListRequest' ||
            status === 'Messaging/getMediaLinkRequest' ||
            MessagingReducer?.status == 'Messaging/blockunblockRequest'
          }
        />
        <View style={styles.top}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              // width: 0,
            }}>
            <TouchableOpacity
              style={{
                height: normalize(20),
                width: normalize(20),
                backgroundColor: 'rgba(242,124,36,0.2)',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                marginRight: normalize(15),
              }}
              onPress={() => props?.navigation?.goBack('')}>
              <Image
                source={Icons.less}
                style={{
                  height: normalize(10),
                  width: normalize(10),
                  marginRight: normalize(2),
                  marginBottom: normalize(1),
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
            <ImageBackground
              style={{
                width: normalize(32),
                height: normalize(32),
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: normalize(8),
              }}
              source={Icons.Ellipse}>
              <Image
                source={
                  profile_image !== '' &&
                  profile_image !== undefined &&
                  profile_image !== null
                    ? {
                        uri: constants?.IMAGE_URL + 'user/' + profile_image,
                      }
                    : Icons.userProfile
                }
                style={{
                  width: normalize(27),
                  height: normalize(27),
                  borderRadius: normalize(50),
                }}
              />
            </ImageBackground>
            {console.log(AuthReducer?.getProfileRes?.data,block_by,"block")}
            <Text style={styles.txt}>{name}</Text>
            {(!isblock ||
              block_by == AuthReducer?.getProfileRes?.data?._id) && (
              <TouchableOpacity
                style={{
                  width: normalize(15),
                  height: normalize(25),
                  justifyContent: 'center',
                  // backgroundColor: 'red',
                }}
                onPress={() => setMoreDropdown(true)}>
                <Image
                  source={Icons.more}
                  style={{
                    width: normalize(15),
                    height: normalize(15),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
          {/* Horizontal line below the title and icon */}
          <View></View>
        </View>
        <View style={styles.horizontalLine}></View>

        <FlatList
          data={chat}
          renderItem={data => renderItem({...data, chat: chat})}
          keyboardDismissMode="interactive"
          style={{
            flex: 1,
            paddingHorizontal: normalize(15),
          }}
          keyExtractor={item => {
            return item?._id;
          }}
          contentContainerStyle={{paddingTop: normalize(10)}}
          showsVerticalScrollIndicator={false}
          // extraData={chat}
          inverted
          removeClippedSubviews
        />
        {Boolean(images) && (
          <View style={styles.smallPreview}>
            <FlatList
              data={imagesUri}
              keyExtractor={item => item}
              horizontal
              snapToEnd={false}
              contentContainerStyle={{gap: normalize(5)}}
              showsHorizontalScrollIndicator={false}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity style={styles.smallPreviewImageContainer}>
                    <Image
                      source={{uri: item}}
                      style={styles.smallPreviewImage}
                    />
                    <Pressable
                      style={styles.crossIconContainer}
                      onPress={() => {
                        setImages(prev =>
                          prev.filter(_prev => _prev.uri !== item),
                        );
                        setImagesUri(prev =>
                          prev.filter(_prev => _prev !== item),
                        );
                      }}>
                      <Image
                        source={Icons.circleClose}
                        style={styles.crossIcon}
                      />
                    </Pressable>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}
        {isblock ? (
          <View
            style={{
              backgroundColor: '#F2F2F2',
              width: '100%',
              // alignItems: 'flex-end',
              // flexDirection: 'row',
              paddingHorizontal: '5%',
              borderTopRightRadius: normalize(10),
              borderTopLeftRadius: normalize(10),
              paddingBottom:
                Platform.OS === 'ios' ? normalize(15) : normalize(10),
              paddingTop: normalize(10),
            }}>
            <Text
              style={{
                paddingVertical: normalize(5),
                textAlign: 'center',
                fontFamily: Fonts.OpenSans_Medium,
                fontSize: normalize(14),
                color: Colors.theme,
              }}>
              {block_by == AuthReducer?.getProfileRes?.data?._id
                ? 'You Blocked This User'
                : 'You Are Blocked By This User'}
            </Text>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: '#F2F2F2',
              width: '100%',
              alignItems: 'flex-end',
              flexDirection: 'row',
              paddingHorizontal: '5%',
              borderTopRightRadius: normalize(10),
              borderTopLeftRadius: normalize(10),
              paddingBottom:
                Platform.OS === 'ios' ? normalize(15) : normalize(10),
              paddingTop: normalize(10),
            }}>
            <TouchableOpacity
              style={{
                paddingVertical: normalize(5),
                paddingRight: normalize(7),
              }}
              onPress={() => {
                setAttachmentModal(true);
              }}>
              <Image
                source={Icons.imageupload}
                style={{
                  width: normalize(25),
                  height: normalize(25),
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingVertical: normalize(5),
                paddingHorizontal: normalize(7),
              }}
              onPress={() => {
                setEmojiBoard(prev => !prev);
                Keyboard.dismiss();
              }}>
              <Image
                source={Icons.emoji}
                style={{
                  width: normalize(23),
                  height: normalize(23),
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                borderRadius: normalize(20),
                backgroundColor: '#EDEEEF',
                borderColor: Colors.borderColor,
                borderWidth: normalize(1),
                paddingLeft: normalize(11),

                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'space-between',
              }}>
              {/* <View style={{flex: 1}}> */}
              {/* <TouchableOpacity
                onPress={() => {}}
                style={{
                  height: '100%',
                  aspectRatio: 1 / 1,
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={Icons.arrowtop}
                  style={{
                    width: normalize(15),
                    height: normalize(15),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity> */}
              <TextInput
                style={{
                  color: '#383A46',
                  fontSize: normalize(13),
                  fontFamily: Fonts.OpenSans_Regular,
                  flex: 1,
                  minHeight: normalize(35),
                  maxHeight: normalize(100),
                  paddingTop:
                    Platform.OS === 'android' ? normalize(5) : normalize(9),
                  paddingBottom:
                    Platform.OS === 'android' ? normalize(5) : normalize(9),
                }}
                textAlignVertical="center"
                placeholder={'Type...'}
                placeholderTextColor="#909090"
                value={value}
                multiline
                maxLength={props.maxLength}
                onChangeText={text => {
                  setvalue(text);
                }}
                focusable
                onSelectionChange={({nativeEvent: {selection}}) => {
                  setSelectionState(selection);
                }}
                onPressIn={() => setEmojiBoard(false)}
              />
              {/* </View> */}

              {value.trim().length > 0 || images?.length > 0 ? (
                <TouchableOpacity
                  onPress={sendMessage}
                  style={{
                    width: normalize(35),
                    aspectRatio: 1 / 1,
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'flex-end',
                  }}>
                  <Image
                    source={Icons.arrowtop}
                    style={{
                      width: normalize(15),
                      height: normalize(15),
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        )}
        <Modal
          animationIn={'pulse'}
          animationOut={'bounceOutDown'}
          backdropTransitionOutTiming={0}
          hideModalContentWhileAnimating={true}
          isVisible={previewModal}
          style={{
            marginHorizontal: normalize(0),
            paddingTop: Platform.OS === 'ios' ? normalize(10) : normalize(0),
            justifyContent: 'flex-start',
          }}
          animationInTiming={500}
          backdropColor={Colors.white}
          backdropOpacity={1}>
          <View style={styles.header}>
            <TouchableOpacity
              style={{
                height: normalize(20),
                width: normalize(20),
                backgroundColor: 'rgba(242,124,36,0.2)',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                position: 'absolute',
                top: Platform.OS === 'android' ? '30%' : '60%',
                left: normalize(20),
              }}
              onPress={() => setPreviewModal(false)}>
              <Image
                source={Icons.less}
                style={{
                  height: normalize(10),
                  width: normalize(10),
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
            <View>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#333',
                  fontFamily: Fonts.OpenSans_SemiBold,
                  fontSize: normalize(12),
                }}>
                {previewData?.sender_id === AuthReducer.getProfileRes.data._id
                  ? 'You'
                  : name}
              </Text>
              <Text
                style={{
                  fontFamily: Fonts.OpenSans_Medium,
                  marginTop: normalize(3),
                  fontSize: normalize(10),
                  textAlign: 'center',
                }}>
                {moment(previewData?.chat_date).calendar(null, {
                  sameDay: 'hh:mm A',
                  lastDay: '[Yesterday] hh:mm A',
                  lastWeek: 'dddd hh:mm A',
                  sameElse: 'DD/MM/YYYY hh:mm A',
                })}
              </Text>
            </View>
          </View>
          <FlatList
            data={previewData?.image}
            keyExtractor={item => item.name}
            horizontal
            // centerContent
            showsHorizontalScrollIndicator={false}
            snapToInterval={Dimensions.get('screen').width}
            decelerationRate={'fast'}
            snapToAlignment="start"
            style={styles.imageCarousal}
            getItemLayout={(data, index) => ({
              length: Dimensions.get('screen').width,
              offset: Dimensions.get('screen').width * index,
              index,
            })}
            // pagingEnabled={false}
            ref={previewRef}
            onScroll={event => {
              const ind =
                event.nativeEvent.contentOffset.x /
                Dimensions.get('screen').width;
              const roundIndex = Math.round(ind);
              setCurrentIndex(roundIndex);
            }}
            renderItem={({item}) => {
              return (
                <View
                  style={{
                    flex: 1,
                    width: Dimensions.get('screen').width,
                  }}>
                  <Image
                    source={{
                      uri: constants?.IMAGE_URL + 'chat/' + item.name,
                    }}
                    // resizeMethod="resize"
                    style={{
                      flex: 1,
                      height: '100%',
                      width: '100%',
                      resizeMode: 'contain',
                    }}
                  />
                </View>
              );
            }}
          />
          <View style={styles.smallImageCarousal}>
            <FlatList
              data={previewData?.image}
              keyExtractor={item => item.name}
              horizontal
              contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
              showsHorizontalScrollIndicator={false}
              snapToInterval={Dimensions.get('screen').width}
              decelerationRate={0}
              // ref={previewRef}
              renderItem={({item, index}) => {
                return (
                  <Pressable
                    style={{
                      flex: 1,
                      width: Dimensions.get('screen').width / 5.5,
                      borderWidth: normalize(2),
                      borderColor:
                        index === currentIndex ? Colors.orange : 'transparent',
                      borderRadius: normalize(5),
                    }}
                    onPress={() => {
                      previewRef.current.scrollToIndex({
                        animated: true,
                        index: index,
                      });
                      // previewRef.current = index;
                    }}>
                    <Image
                      source={{
                        uri: constants?.IMAGE_URL + 'chat/' + item.name,
                      }}
                      style={{
                        flex: 1,
                        height: '100%',
                        width: '100%',
                        resizeMode: 'cover',
                        borderRadius: normalize(3),
                      }}
                    />
                  </Pressable>
                );
              }}
            />
          </View>
        </Modal>
        <CameraPicker
          pickerVisible={attachmentModal}
          multiple={true}
          onBackdropPress={() => setAttachmentModal(false)}
          btnClick_cameraUpload={imgObj => {
            // console.log('imgObj', imgObj);
            setImages([imgObj]);
            setImagesUri([imgObj.uri]);
            setAttachmentModal(false);
            // UploadProfile(imgObj);
          }}
          btnClick_galeryUpload={imgObj => {
            // console.log(imgObj, '>>>>>>>>>>>>>');
            setImages(imgObj);
            setImagesUri(imgObj.map(_image => _image.uri));
            setAttachmentModal(false);
            // UploadProfile(imgObj);
          }}
          limitMessage
        />
        {/*More Dropdown Modal*/}

        <Modal
          animationIn={'fadeIn'}
          animationOut={'fadeOut'}
          backdropTransitionOutTiming={0}
          hideModalContentWhileAnimating={true}
          isVisible={moreDropdown}
          style={{
            marginHorizontal: normalize(0),
            paddingTop: Platform.OS === 'ios' ? normalize(10) : normalize(0),
            // justifyContent: 'flex-start',
            position: 'relative',
          }}
          animationInTiming={100}
          animationOutTiming={100}
          // backdropColor={Colors.white}
          backdropOpacity={0}
          onBackdropPress={() => setMoreDropdown(false)}>
          {(isblock == null ||
            isblock == false ||
            block_by == AuthReducer?.getProfileRes?.data?._id) && (
            <View style={styles.dropdown}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: normalize(10),
                  paddingVertical: normalize(5),
                  borderRadius: 5,
                  alignItems: 'center',
                }}
                onPress={() => {
                  connectionrequest()
                    .then(() => {
                      dispatch(blockunblockRequest({room_id}));
                      setMoreDropdown(false);
                    })
                    .catch(err => {
                      Toast('Please connect To Internet');
                    });
                }}
                activeOpacity={0.5}>
                <Image
                  source={Icons.blocked}
                  style={{
                    height: normalize(15),
                    width: normalize(15),
                    resizeMode: 'contain',
                  }}
                />
                <Text
                  style={{marginLeft: normalize(10), fontSize: normalize(12)}}>
                  {isblock == null || isblock == false ? 'Block' : 'Unblock'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Modal>
        {emojiBoard && (
          <EmojiKeyboard
            onEmojiSelected={({emoji}) => {
              console.log(selectionState);
              if (
                selectionState.start === value.length &&
                selectionState.end === value.length
              ) {
                setvalue(prev => prev + emoji);
              } else if (selectionState.start === selectionState.end) {
                setvalue(
                  prev =>
                    `${prev.slice(0, selectionState.start)}${emoji}${prev.slice(
                      selectionState.start,
                      prev.length,
                    )}`,
                );
              } else {
                setvalue(
                  prev =>
                    `${prev.slice(0, selectionState.start)}${emoji}${prev.slice(
                      selectionState.end,
                      prev.length,
                    )}`,
                );
              }
            }}
            // open={emojiBoard}
            emojiSize={40}
            enableRecentlyUsed
            enableSearchAnimation
            allowMultipleSelections
            expandable={false}
            enableSearchBar
            styles={{
              container: {
                elevation: 0,
                shadowOpacity: 0,
              },
              category: {
                container: {
                  padding: normalize(5),
                  borderRadius: normalize(80),
                  backgroundColor: '#fff',
                },
                icon: {
                  borderRadius: normalize(50),
                },
              },
            }}
            theme={{
              category: {
                container: '#eee',
                containerActive: Colors.orange,
                icon: '#555',
                iconActive: '#fff',
              },
            }}
            // onClose={() => {
            //   setEmojiBoard(false);
            // }}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default MessagingRoom;

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Added to align the text and icon vertically
    // flex: 1,
    marginTop: Platform.OS === 'android' ? normalize(15) : normalize(5),
    marginHorizontal: normalize(20),
  },
  txt: {
    // textAlign: 'center',
    color: '#1F2440',
    // marginTop: normalize(10),
    fontSize: 16,
    fontFamily: Fonts.OpenSans_Medium,
    fontWeight: '600',
    lineHeight: 21.79,
    flex: 1,
  },
  horizontalLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#F4F3F3', // You can change the color to your preference
    width: '100%', // Make the line cover the whole width
    marginTop: normalize(10),
    // Adjust the margin based on your design
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(15),
  },
  itemIcon: {
    width: normalize(20),
    height: normalize(20),
    marginRight: normalize(10),
  },
  itemName: {
    fontSize: 16,
    color: '#1F2440',
    fontWeight: '600',
    fontFamily: Fonts.OpenSans_Regular,
  },
  rightIcon: {
    width: normalize(15),
    height: normalize(15),
    marginLeft: 'auto', // Push the right icon to the right
  },
  rightIconContainer: {
    backgroundColor: 'rgba(242,124,36,0.2)',
    position: 'absolute',
    right: 0,
    // Set the background color here
    borderRadius: 5, // Adjust as needed
    padding: 5, // Adjust as needed
  },
  // popup: {
  //   backgroundColor: Colors.white,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginBottom: normalize(60),
  //   // height: normalize(200),
  //   elevation: 4,
  //   shadowColor: '#000',
  //   shadowOffset: {
  //     x: 3,
  //     y: 0,
  //   },
  //   shadowOpacity: 0.15,
  //   shadowRadius: 25,
  //   borderRadius: normalize(10),
  //   borderWidth: normalize(1),
  //   borderColor: Colors.borderColor,
  //   padding: normalize(12),
  //   gap: normalize(10),
  // },
  // attachment_container: {},
  // attachment: {
  //   width: normalize(40),
  //   height: normalize(40),
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   padding: normalize(10),
  //   backgroundColor: Colors.orange,
  //   borderRadius: 50,
  // },
  // attachment_image: {
  //   width: '100%',
  //   height: '100%',
  //   resizeMode: 'contain',
  // },
  // attachment_text: {
  //   textAlign: 'center',
  //   marginTop: normalize(5),
  // },
  smallPreview: {
    // height: '20%',
    // gap: normalize(5),
    flex: 0.2,
    padding: normalize(10),
    backgroundColor: Colors.lightbackground,
  },
  smallPreviewImageContainer: {
    height: '100%',
    aspectRatio: 1 / 1,
    position: 'relative',
  },
  smallPreviewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  crossIconContainer: {
    position: 'absolute',
    top: normalize(5),
    right: normalize(5),
  },
  crossIcon: {
    width: normalize(15),
    height: normalize(15),
  },

  //Preview Modal CSS
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(12),
    paddingTop: Platform.OS === 'android' ? 0 : normalize(12),
    marginBottom: normalize(10),
    // backgroundColor: 'green',
  },
  imageCarousal: {
    flex: 1,
    marginBottom: normalize(10),
  },
  smallImageCarousal: {
    height: normalize(50),
    paddingHorizontal: normalize(10),
  },
  dropdown: {
    backgroundColor: Colors.white,
    position: 'absolute',
    top: Platform.OS === 'android' ? '5%' : '9%',
    right: normalize(15),
    width: normalize(100),
    shadowColor: '#333',
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 4,
    borderRadius: 5,
    paddingVertical: normalize(5),
    borderWidth: 0.5,
    borderColor: Colors.borderColor,
    // overflow: 'hidden',
  },
  event_data_row: {
    paddingHorizontal: normalize(5),
    flexDirection: 'row',
    flexWrap: 'wrap',
    // gap: normalize(5),
  },
  event_data_text: {
    fontFamily: Fonts.OpenSans_Regular,
    paddingTop: normalize(3),
  },
});
