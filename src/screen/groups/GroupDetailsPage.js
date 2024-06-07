import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Platform,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  BackHandler,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Colors} from '../../themes/Colors';
import {Fonts, Icons} from '../../themes/ImagePath';
import normalize from '../../utils/helpers/dimen';
import Modal from 'react-native-modal';
import ButtonCom from '../../components/ButtonCom';
import TextInputItem from '../../components/TextInput';
import {
  clearPostSubmitSuccess,
  postCommentListRequest,
  postCommentReactionRequest,
  postCommentRequest,
  postFavoriteRequest,
  postReactionRequest,
  postShareRequest,
} from '../../redux/reducer/PostReducer';
import {useDispatch, useSelector} from 'react-redux';
import {
  getGroupDetailsRequest,
  getGroupPostRequest,
  toJoinAGroupRequest,
  toLeaveAGroupRequest,
  toRejectAGroupRequest,
  toRejectAGroupSuccess,
} from '../../redux/reducer/GroupReducer';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import {getProfileRequest} from '../../redux/reducer/AuthReducer';
import showErrorAlert from '../../utils/helpers/Toast';
import connectionrequest from '../../utils/helpers/NetInfo';
import Loader from '../../utils/helpers/Loader';
import constants from '../../utils/helpers/constants';
import TextInputmultiple from '../../components/TextInputmultiple';
import {navigationRef} from '../../utils/helpers/RootNavigation';
import VideoThumbnails from '../../components/VideoThumbnails';
import {cleanSingle} from 'react-native-image-crop-picker';
const {width} = Dimensions.get('window');

export default function GroupDetailsPage(props) {
  const {type} = props?.route?.params ? props?.route?.params : '';
  const groupId = props?.route?.params?.dataValue
    ? props?.route?.params?.dataValue
    : '';

  const [isJoinGrpRequest, setIsJoinGrpRequest] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [isReasonFocus, setIsReasonFocus] = useState(false);
  const [isReact, setIsReact] = useState(false);
  const [expandedItems, setExpandedItems] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [commentCurrentPage, setCommentCurrentPage] = useState(1);
  const [shareModal, setShareModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [reason, setReason] = useState('');
  const [commentText, setCommentText] = useState('');
  const [replyCommentText, setReplyCommentText] = useState('');
  const [shareText, setShareText] = useState('');
  const [shareButtonData, setShareButtonData] = useState('');
  const [commentButtonData, setCommentButtonData] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isOpenText, setIsOpenText] = useState(false);
  const [activeReplyIndex, setActiveReplyIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [replySubmitted, setReplySubmitted] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [repliesFocus, setRepliesFocus] = useState(false);
  const [posts, setPosts] = useState([]); // State variable to hold all posts
  const [isLoading, setIsLoading] = useState(false);

  const isFocus = useIsFocused();
  const dispatch = useDispatch();
  const GroupReducer = useSelector(state => state.GroupReducer);
  const PostReducer = useSelector(state => state.PostReducer);
  const AuthReducer = useSelector(state => state.AuthReducer);

  const [feeds, setfeeds] = useState(false);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        console.log('show');
        // setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        console.log('hide');
        setfeeds(false);
        // setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const requestCancelModal = () => {
    return (
      <Modal
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating={true}
        isVisible={isJoinGrpRequest}
        style={{
          width: '100%',
          alignSelf: 'center',
          margin: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
        }}
        animationInTiming={800}
        animationOutTiming={1000}
        onBackdropPress={() => {
          setIsJoinGrpRequest(false);
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
            alignItems: 'center',
            height: normalize(175),
          }}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              marginVertical: normalize(10),
            }}>
            <TextInputItem
              toptext={'Join Code'}
              placeholder={'Enter Code'}
              width="100%"
              value={joinCode}
              onChangeText={val => setJoinCode(val)}
              onFocus={() => setIsReasonFocus(true)}
              onBlur={() => setIsReasonFocus(false)}
              focus={isReasonFocus}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: normalize(20),
            }}>
            <TouchableOpacity
              onPress={() => {
                setIsJoinGrpRequest(false);
              }}
              activeOpacity={0.1}
              style={{
                width: '81%',
                height: normalize(45),
                alignSelf: 'center',
                marginTop: normalize(10),
                marginBottom: normalize(10),
                backgroundColor: 'rgba(242, 124, 36, 1)',
                borderRadius: normalize(10),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: normalize(18),
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: Colors.white,
                  fontWeight: '600',
                }}>
                Join Now
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setIsJoinGrpRequest(false);
              }}
              activeOpacity={0.1}
              style={{
                width: normalize(45),
                height: normalize(45),
                alignSelf: 'center',
                marginLeft: normalize(15),
                borderRadius: normalize(10),
                backgroundColor: 'rgba(31, 36, 64, 1)',
                justifyContent: 'center',
                borderColor: Colors.background,
                borderWidth: 2,
                alignItems: 'center',
              }}>
              <Image
                source={Icons.cross}
                style={{width: normalize(15), height: normalize(15)}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  let perPage = 10;
  const RenderGroupPostList = page => {
    let obj = {
      group_id: groupId?._id,
      page: page,
      perpage: perPage,
    };
    dispatch(getGroupPostRequest(obj));
    setIsLoading(true);
  };

  useEffect(() => {
    RenderGroupPostList(1);
    dispatch(getProfileRequest());
    dispatch(getGroupDetailsRequest({group_id: groupId?._id}));
  }, [isFocus]);

  useEffect(() => {
    let status = '';
    let status1 = '';
    if (status1 == '' || GroupReducer != status1) {
      switch (GroupReducer.status) {
        // join a group
        case 'Group/toJoinAGroupRequest':
          status = GroupReducer.status;
          break;
        case 'Group/toJoinAGroupSuccess':
          status = GroupReducer.status;
          dispatch(getGroupDetailsRequest({group_id: groupId?._id}));
          break;
        case 'Group/toJoinAGroupFailure':
          status = GroupReducer.status;
          break;
        // Reject a group
        case 'Group/toRejectAGroupRequest':
          status = GroupReducer.status;
          break;
        case 'Group/toRejectAGroupSuccess':
          status = GroupReducer.status;
          console.log('exit');
          props?.navigation?.navigate('Groups');
          // dispatch(getGroupDetailsRequest({ group_id: groupId?._id }));
          break;
        case 'Group/toRejectAGroupFailure':
          status = GroupReducer.status;
          break;
        // Leave a group
        case 'Group/toLeaveAGroupRequest':
          status = GroupReducer.status;
          break;
        case 'Group/toLeaveAGroupSuccess':
          status = GroupReducer.status;
          props?.navigation?.navigate('Groups');
          // dispatch(getGroupDetailsRequest({ group_id: groupId?._id }));
          break;
        case 'Group/toLeaveAGroupFailure':
          status = GroupReducer.status;
          break;

        case 'Group/getGroupPostRequest':
          status = GroupReducer.status;
          break;
        case 'Group/getGroupPostSuccess':
          status = GroupReducer.status;
          if (GroupReducer?.getGroupPostDetailsRes?.page === 1) {
            setPosts(GroupReducer?.getGroupPostDetailsRes?.data);
          } else {
            setPosts([...posts, ...GroupReducer?.getGroupPostDetailsRes?.data]);
            setIsLoading(false);
          }
          break;
        case 'Group/getGroupPostFailure':
          status = GroupReducer.status;
          break;
      }
    }

    if (status == '' || PostReducer.status != status) {
      switch (PostReducer.status) {
        case 'Post/postShareRequest':
          status = PostReducer.status;
          break;
        case 'Post/postShareSuccess':
          status = PostReducer.status;
          setShareModal(false);
          setShareText('');
          setIsReasonFocus(false)
          RenderGroupPostList(GroupReducer?.getGroupPostDetailsRes?.page);
          break;
        case 'Post/postShareFailure':
          status = PostReducer.status;
          break;
        case 'Post/postReactionRequest':
          status = PostReducer.status;
          break;
        case 'Post/postReactionSuccess':
          status = PostReducer.status;
          // setShareModal(false);
          RenderGroupPostList(GroupReducer?.getGroupPostDetailsRes?.page);
          break;
        case 'Post/postReactionFailure':
          status = PostReducer.status;
          break;
        case 'Post/postCommentRequest':
          status = PostReducer.status;
          break;
        case 'Post/postCommentSuccess':
          status = PostReducer.status;
          let obj = {
            post_id: commentButtonData?._id,
            page: commentCurrentPage,
            perpage: perPage,
          };
          dispatch(postCommentListRequest(obj));
          RenderGroupPostList(GroupReducer?.getGroupPostDetailsRes?.page);
          setCommentText('');
          setReplyText('');
          break;
        case 'Post/postCommentFailure':
          status = PostReducer.status;
          break;
        case 'Post/postCommentReactionRequest':
          status = PostReducer.status;
          break;
        case 'Post/postCommentReactionSuccess':
          status = PostReducer.status;
          let obj1 = {
            post_id: commentButtonData?._id,
            page: commentCurrentPage,
            perpage: perPage,
          };
          dispatch(postCommentListRequest(obj1));
          RenderGroupPostList(GroupReducer?.getGroupPostDetailsRes?.page);
          setCommentText('');
          break;
        case 'Post/postCommentReactionFailure':
          status = PostReducer.status;
          break;
        case 'Post/postFavoriteRequest':
          status = PostReducer.status;
          break;
        case 'Post/postFavoriteSuccess':
          status = PostReducer.status;
          setShareModal(false);
          RenderGroupPostList(GroupReducer?.getGroupPostDetailsRes?.page);
          break;
        case 'Post/postFavoriteFailure':
          status = PostReducer.status;
          break;
      }
    }
  }, [PostReducer?.status, GroupReducer?.status]);

  const description = commentButtonData?.description;
  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const FetchCommentList = item => {
    let obj = {
      post_id: item?._id,
      page: commentCurrentPage,
      perpage: perPage,
    };
    dispatch(postCommentListRequest(obj));
  };

  const ShareButton = item => {
    if (shareText == '') {
      showErrorAlert('Please write somethings');
      return;
    }
    let obj = {
      post_id: shareButtonData?._id,
      user_id: AuthReducer?.getProfileRes?.data?._id,
      post_caption: shareText,
    };
    dispatch(postShareRequest(obj));
  };

  const postReaction = item => {
    let obj = {
      post_id: item?._id,
      isReact: item?.isReact === false ? true : false,
    };

    dispatch(postReactionRequest(obj));
  };

  const submitComment = () => {
    if (commentText == '') {
      showErrorAlert('Please write your message');
      return;
    } else {
      let obj = {
        post_id: commentButtonData?._id,
        user_id: AuthReducer?.getProfileRes?.data?._id,
        comment_id: null,
        comment_text: commentText,
      };
      // return
      connectionrequest()
        .then(() => {
          dispatch(postCommentRequest(obj));
        })
        .catch(err => {
          showErrorAlert('Please connect To Internet');
        });
    }
  };

  const handleBackButton = () => {
    if (navigationRef?.current && navigationRef.current.canGoBack()) {
      navigationRef?.current?.goBack();
      return true;
    }
    return false;
  };

  React.useEffect(() => {
    const backHandler = BackHandler?.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );

    return () => backHandler.remove();
  }, []);

  const renderPostItem = ({item, index}) => {
    const isExpanded = expandedItems.includes(item._id);
    const toggleExpand = () => {
      setExpandedItems(prev =>
        isExpanded ? prev.filter(id => id !== item?._id) : [...prev, item?._id],
      );
    };

    const AddToFavorite = item => {
      let obj = {
        post_id: item?._id,
        isReact: item?.isFavourites === false ? true : false,
      };

      dispatch(postFavoriteRequest(obj));
      setIsReact(prevIsReact => !prevIsReact);
    };

    return (
      <View style={styles.header} key={index}>
        <View style={styles.icon_wrapper}>
          <View key={item.id} style={styles.profileContainer}>
            <ImageBackground
              source={Icons.ellipse}
              style={{
                height: normalize(32),
                width: normalize(32),
              }}
            />
            <Image
              source={
                item?.user_details?.profile_image !== '' &&
                item?.user_details?.profile_image !== undefined &&
                item?.user_details?.profile_image !== null
                  ? {
                      uri:
                        constants?.IMAGE_URL +
                        'user/' +
                        item?.user_details?.profile_image,
                    }
                  : Icons.userProfile
              }
              style={{
                height: normalize(28),
                width: normalize(28),
                position: 'absolute',
                borderRadius: 50,
                top: normalize(2),
              }}
            />
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.name}>{item.user_details?.full_name}</Text>
            <Text style={styles.status}>{item.user_details?.user_type}</Text>
          </View>
        </View>
        {item.post_media_details[0]?.media_type === 'video/mp4' ? (
          <VideoThumbnails
            uriItem={
              constants.IMAGE_URL +
              'post/media/' +
              item.post_media_details[0]?.media_url
            }
            style={{
              height: normalize(160),
              width: '100%',
              borderRadius: normalize(10),
              overflow: 'hidden',
              marginTop: 10,
              borderWidth: 1,
            }}
            resizeMode="cover"
          />
        ) : (
          <Image
            source={
              item.post_media_details[0]?.media_url !== ''
                ? {
                    uri:
                      constants?.IMAGE_URL +
                      'post/media/' +
                      item.post_media_details[0]?.media_url,
                  }
                : Icons.noImage
            }
            style={{
              height: normalize(160),
              width: '100%',
              borderRadius: normalize(10),
              overflow: 'hidden',
              marginTop: 10,
            }}
            resizeMode="cover"
          />
        )}

        <View style={styles.actionsWrapper}>
          <View style={styles.actionContainer}>
            <TouchableOpacity
              onPress={() => {
                postReaction(item);
              }}
              style={{flexDirection: 'row'}}>
              <Image
                source={item?.isReact === true ? Icons.like : Icons.love}
                style={styles.actionIcon}
              />

              <Text style={styles.actionCount}>{item?.reactes}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.actionContainer}>
            <TouchableOpacity
              onPress={() => {
                setCommentButtonData(item), setCommentModal(true);
                FetchCommentList(item);
              }}
              style={{flexDirection: 'row'}}>
              <Image source={Icons.messages} style={styles.actionIcon} />
              <Text style={styles.actionCount}>{item?.comments}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.actionContainer}>
            <TouchableOpacity
              onPress={() => {
                setShareButtonData(item), setShareModal(true);
              }}
              style={{flexDirection: 'row'}}>
              <Image source={Icons.send} style={styles.actionIcon} />
              <Text style={styles.actionCount}>{item?.share}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              styles.actionContainer,
              {
                left:
                  Platform?.OS === 'android' ? width * 0.352 : width * 0.342,
              },
            ]}
            onPress={() => AddToFavorite(item)}>
            <Image
              source={item?.isFavourites === true ? Icons.bookmark : Icons.save}
              style={[
                styles.actionIcon1,
                {tintColor: item?.isFavourites === true ? Colors.orange : null},
              ]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.desc}>
          <Text style={{color: '#2196F3'}}>
            {item?.tags?.map(tag => `#${tag}`)?.join(' ')}
          </Text>{' '}
          <Text style={[styles.blueText]}>
            {isExpanded ? item.description : item.description.slice(0, 100)}
          </Text>
          {item.description?.length > 50 && (
            <>
              {!isExpanded && (
                <>
                  <TouchableOpacity onPress={toggleExpand}>
                    <Text
                      style={{color: '#9E9E9E', left: normalize(2), top: 2}}>
                      ...More
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {isExpanded && (
                <>
                  <TouchableOpacity onPress={toggleExpand}>
                    <Text
                      style={{
                        color: '#9E9E9E',
                        left: normalize(2),
                        top: normalize(2),
                      }}>
                      ...Less
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}
        </Text>

        <Text style={styles.time}>{moment(item?.createdAt)?.fromNow()}</Text>
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    const toggleReply = () => {
      if (activeReplyIndex === index) {
        setActiveReplyIndex(null);
      } else {
        setActiveReplyIndex(index);
      }
    };

    const isReplying = activeReplyIndex === index;
    const handleReplyChange = text => {
      setReplyText(text);
    };

    const ReplyComment = item => {
      if (replyText == '') {
        showErrorAlert('Please write your reply message');
        return;
      } else {
        let obj = {
          post_id: commentButtonData?._id,
          user_id: AuthReducer?.getProfileRes?.data?._id,
          comment_id: item?._id,
          comment_text: replyText,
        };
        // console.log(obj, 'dsdsajkdl');
        // return
        connectionrequest()
          .then(() => {
            dispatch(postCommentRequest(obj));
            toggleReply();
            setReplySubmitted(true);
          })
          .catch(err => {
            showErrorAlert('Please connect To Internet');
          });
      }
    };
    const commentReaction = () => {
      let obj = {
        comment_id: item?._id,
        isReact:item?.isReact===true ? false:true,
      };
      dispatch(postCommentReactionRequest(obj));
      setIsReact(prevIsReact => !prevIsReact);
    };

    return (
      <View style={styles.commentContainer} key={index}>
        <Image
          source={
            item?.user_details?.image !== undefined
              ? {uri: item?.user_details?.profile_image}
              : Icons.userProfile
          }
          style={styles.commentImage}
        />
        <View style={styles.commentContent}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentName}>
              {item?.user_details?.full_name}
            </Text>
            <Text style={styles.commentTime}>
              {moment(item?.createdAt).fromNow()}
            </Text>
          </View>
          <View style={styles.commentMessageBox}>
            <Text style={styles.commentMessage}>{item.comment_text}</Text>
            <View style={[styles.commentFooter]}>
              <TouchableOpacity
                style={styles.replyContainer}
                onPress={toggleReply}>
                {isReplying ? (
                  <Text style={styles.replyText}>Close</Text>
                ) : (
                  <Text style={styles.replyText}>Reply</Text>
                )}
              </TouchableOpacity>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={() => commentReaction()}>
                  <Image
                    source={item?.isReact === true ? Icons.like : Icons.love}
                    style={styles.replyIcon}
                  />
                </TouchableOpacity>
                <Text style={styles.likesText}>{item?.reactes}</Text>
              </View>
            </View>
          </View>
          {isReplying && (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: normalize(10),
                }}>
                <TextInput
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: '#CCCCCC',
                    borderRadius: 15,
                    color: '#000000',
                    fontSize: normalize(14),
                    padding: normalize(10),
                  }}
                  onFocus={() => {
                    setRepliesFocus(true), setfeeds(true), console.log('blur');
                  }}
                  placeholder="Write your reply"
                  placeholderTextColor={'#383A46'}
                  value={replyText}
                  multiline={true}
                  onChangeText={handleReplyChange}
                />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: normalize(15),
                  }}
                  onPress={() => {
                    ReplyComment(item);
                  }}>
                  <Image
                    source={Icons.sendMsg}
                    style={{height: normalize(25), width: normalize(25)}}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
          {item?.replies?.map((reply, index) => (
            <View style={styles.replyContainers} key={index}>
              <Image
                source={
                  Icons.userProfile
                  // reply?.users?.profile_image !== ''
                  //   ? {
                  //       uri:
                  //         constants?.IMAGE_URL +
                  //         'users/' +
                  //         reply?.users?.profile_image,
                  //     }
                  //   : Icons.userProfile
                }
                style={styles.commentImage}
              />
              <View style={styles.commentContent}>
                <View style={styles.commentHeaderText}>
                  <Text style={styles.commentName}>
                    {reply?.users?.full_name}
                  </Text>
                  <Text style={styles.commentTime}>
                    {moment(item?.createdAt).fromNow()}
                  </Text>
                </View>
                <View style={styles.replyMessageBox1}>
                  <Text style={styles.commentMessage}>
                    {reply?.comment_text}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const RenderCommentPostDetails = () => {
    return (
      <Modal
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating={true}
        isVisible={commentModal}
        style={{width: '100%', alignSelf: 'center', margin: 0}}
        animationInTiming={800}
        animationOutTiming={1000}
        onBackdropPress={() => {
          setCommentModal(false);
          RenderGroupPostList(1);
        }}>
        <Loader visible={PostReducer?.status === 'Post/postCommentRequest'} />
        <KeyboardAvoidingView
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

            height: '90%',
          }}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          {/* Floating Button at the Top Right */}
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: normalize(-20),
              // bottom:normalize(20),
              right: normalize(10),
              zIndex: 11111,
              backgroundColor: '#1F2440',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              height: normalize(45),
              width: normalize(50),
            }}
            onPress={() => setCommentModal(false)}>
            <Image
              source={Icons.cross}
              style={{width: normalize(15), height: normalize(15)}}
            />
          </TouchableOpacity>
          <View style={{flex: 1}}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              automaticallyAdjustKeyboardInsets={true}>
              <View style={{}}>
                <View style={{marginHorizontal: 10}}>
                  {commentButtonData &&
                  commentButtonData?.post_media_details[0]?.media_type ===
                    'video/mp4' ? (
                    <VideoThumbnails
                      uriItem={
                        constants.IMAGE_URL +
                        'post/media/' +
                        commentButtonData?.post_media_details[0]?.media_url
                      }
                      style={{
                        height: normalize(160),
                        width: '100%',
                        borderRadius: normalize(10),
                        overflow: 'hidden',
                        marginTop: 10,
                        borderWidth: 1,
                      }}
                      resizeMode="cover"
                    />
                  ) : (
                    <Image
                      source={
                        commentButtonData &&
                        commentButtonData?.post_media_details[0]?.media_url !==
                          undefined
                          ? {
                              uri:
                                constants?.IMAGE_URL +
                                'post/media/' +
                                commentButtonData?.post_media_details[0]
                                  ?.media_url,
                            }
                          : Icons.noImage
                      }
                      style={[styles.backgroundImage]}
                      resizeMode="cover"
                    />
                  )}
                </View>
                <Text style={styles.desc1}>
                  <Text style={{color: '#2196F3'}}>
                    {commentButtonData?.tags?.map(tag => `#${tag}`)?.join(' ')}
                  </Text>{' '}
                  <Text style={styles.blueText}>
                    {isExpanded ? description : description?.slice(0, 100)}
                  </Text>
                  {description?.length > 50 && (
                    <>
                      {!isExpanded && (
                        <>
                          <TouchableOpacity onPress={toggleReadMore}>
                            <Text
                              style={{
                                color: '#9E9E9E',
                                left: normalize(15),
                                top: normalize(2),
                              }}>
                              ...More
                            </Text>
                          </TouchableOpacity>
                        </>
                      )}
                      {isExpanded && (
                        <>
                          <TouchableOpacity onPress={toggleReadMore}>
                            <Text
                              style={{
                                color: '#9E9E9E',
                                left: normalize(15),
                                top: normalize(2),
                              }}>
                              ...Less
                            </Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </>
                  )}
                </Text>
                <View
                  style={{
                    borderBottomWidth: 2,
                    borderBottomColor: '#F7F7F7',
                    marginTop: 15,
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginHorizontal: normalize(15),
                    marginTop: normalize(14),
                  }}>
                  <Text
                    style={{
                      fontSize: normalize(13),
                      fontWeight: '500',
                    }}>
                    Comments
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity>
                      <Image
                        source={Icons.love}
                        style={{height: normalize(15), width: normalize(15)}}
                      />
                    </TouchableOpacity>
                    <Text style={{marginLeft: normalize(8)}}>
                      {PostReducer?.postCommentListRes
                        ?.totalCommentsReaction !== undefined &&
                        PostReducer?.postCommentListRes?.totalCommentsReaction}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    borderBottomWidth: 2,
                    borderBottomColor: '#F7F7F7',
                    marginTop: 15,
                  }}
                />
                {/* Comments Section using FlatList */}
                {PostReducer?.postCommentListRes?.data?.length > 0 ? (
                  <FlatList
                    data={
                      PostReducer?.postCommentListRes?.data?.length > 0
                        ? PostReducer?.postCommentListRes?.data
                        : []
                    }
                    renderItem={renderItem}
                    keyExtractor={item => item?.toString()}
                    // onEndReached={getMoreCommentList}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom: 100}}
                  />
                ) : (
                  <View
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text
                      style={{
                        marginTop: normalize(15),
                        color: Colors.placeholder,
                      }}>
                      Not Yet Comments
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
            {/* Share Now and Close Buttons */}
            {/* Text Input for Comment */}

            {feeds != true && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginHorizontal: normalize(15),
                }}>
                <TextInput
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: '#CCCCCC',
                    borderRadius: 15,
                    color: '#000000',
                    fontSize: normalize(14),
                    padding: normalize(15),
                  }}
                  placeholder="Write your comment"
                  placeholderTextColor={'#383A46'}
                  value={commentText}
                  onChangeText={text => setCommentText(text)}
                />
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: normalize(15),
                  }}
                  onPress={() => {
                    submitComment();
                  }}>
                  <Image
                    source={Icons.sendMsg}
                    style={{height: normalize(25), width: normalize(25)}}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  const RenderSharePostDetails = () => {
    return (
      <Modal
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating={true}
        isVisible={shareModal}
        style={{width: '100%', alignSelf: 'center', margin: 0}}
        animationInTiming={800}
        animationOutTiming={1000}
        onBackdropPress={() => {
          setShareModal(false);
          setIsOpenText(false);
          setShareText('');
          setIsReasonFocus(false);
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
            // alignItems: 'center',
            height: '50%',
          }}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <Loader visible={PostReducer?.status === 'Post/postShareRequest'} />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.profileContainer}>
              <ImageBackground
                source={Icons.ellipse}
                style={styles.iconBackground}
              />
              <Image
                source={
                  shareButtonData?.user_details?.profile_image !== '' &&
                  shareButtonData?.user_details?.profile_image !== undefined &&
                  shareButtonData?.user_details?.profile_image !== null
                    ? {
                        uri:
                          constants.IMAGE_URL +
                          'user/' +
                          shareButtonData?.user_details?.profile_image,
                      }
                    : Icons.userProfile
                }
                style={styles.profilePicture}
              />
            </View>
            <Text
              style={{
                textAlign: 'center',
                marginLeft: normalize(15),
                fontSize: normalize(12),
              }}>
              {shareButtonData?.user_details?.full_name}
            </Text>
          </View>
          <TextInputmultiple
            toptext={'Say something about the post'}
            placeholder={'Write something'}
            width="100%"
            value={shareText}
            onChangeText={val => setShareText(val)}
            onFocus={() => setIsReasonFocus(true)}
            onBlur={() => setIsReasonFocus(false)}
            focus={isReasonFocus}
            isReturn={5}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: normalize(25),
              // alignItems:'center',
              // marginHorizontal: normalize(20),
              width: '80%',
              // marginRight: 20,
            }}>
            <TouchableOpacity
              style={styles.floatingButton}
              onPress={() => {
                setIsPosting(true), ShareButton();
              }}>
              <Text
                style={{
                  fontSize: normalize(18),
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: Colors.white,
                  fontWeight: '600',
                }}>
                Share Now
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.floatingButton1}
              onPress={() => setShareModal(false)}>
              <Image
                source={Icons.cross}
                style={{width: normalize(15), height: normalize(15)}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const totalMembers =
    GroupReducer?.getGroupDetails?.data?.group_member_details.length;
  const users = GroupReducer?.getGroupDetails?.data?.group_member_details.map(
    member => ({
      name: member.friend_details[0]?.user_details[0]?.full_name || 'Unknown',
      image: member.friend_details[0]?.user_details[0]?.profile_image || '',
    }),
  );

  const onPressJoinButton = id => {
    try {
      dispatch(toJoinAGroupRequest({group_id: id}));
      // setIsJoinGrpRequest(true);
    } catch (error) {
      console.log('onPressJoinButton>>', error);
    }
  };
  const onPressRejectButton = id => {
    try {
      dispatch(toRejectAGroupRequest({group_id: id}));
    } catch (error) {
      console.log('onPressRejectButton>>', error);
    }
  };
  const onPressLeaveButton = id => {
    try {
      dispatch(toLeaveAGroupRequest({group_id: id}));
    } catch (error) {
      console.log('onPressLeaveButton>>', error);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.backgroundorange}}>
      <StatusBar
        translucent
        backgroundColor={
          isJoinGrpRequest ? 'rgba(0, 0, 0, 0.7)' : Colors.darkBlue
        }
        barStyle={'light-content'}
      />
      <Loader
        visible={
          GroupReducer?.status === 'Group/getGroupDetailsRequest' ||
          GroupReducer?.status === 'Group/toRejectAGroupRequest' ||
          GroupReducer?.status === 'Group/toJoinAGroupRequest' ||
          GroupReducer?.status === 'Group/toLeaveAGroupRequest'
        }
      />
      <ScrollView
        bounces={false}
        contentContainerStyle={{paddingBottom: normalize(15)}}
        showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={
            GroupReducer?.getGroupDetails?.data?.thumbnail !== '' &&
            GroupReducer?.getGroupDetails?.data?.thumbnail !== undefined &&
            GroupReducer?.getGroupDetails?.data?.thumbnail !== null
              ? {
                  uri:
                    constants?.IMAGE_URL +
                    'group/' +
                    GroupReducer?.getGroupDetails?.data?.thumbnail,
                }
              : Icons.noImage
          }
          resizeMode="cover"
          borderRadius={15}
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height * 0.55,

            paddingHorizontal: normalize(15),
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: normalize(50),
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.goBack();
              }}
              style={{
                height: normalize(23),
                width: normalize(23),
                backgroundColor: Colors.lightOrange,
                borderRadius: normalize(7),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={Icons.less}
                style={{height: '40%', width: '40%', resizeMode: 'contain'}}
              />
            </TouchableOpacity>
            {type == 'created' && (
              <TouchableOpacity
                onPress={() => props?.navigation?.navigate('EditGroup')}
                style={{
                  height: normalize(25),
                  width: normalize(25),
                  // backgroundColor: Colors.lightOrange,
                  // elevation: 2,
                  // shadowColor: '#000',
                  // shadowOffset: {
                  //   x: 0,
                  //   y: 0,
                  // },
                  // shadowOpacity: 0.2,
                  // shadowRadius: 5,
                  // backgroundColor: '#fff',
                }}>
                <Image
                  source={Icons.messageEdit}
                  style={{height: '100%', width: '100%', resizeMode: 'contain'}}
                />
              </TouchableOpacity>
            )}
          </View>
        </ImageBackground>

        <View
          style={{marginHorizontal: normalize(15), marginTop: normalize(25)}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}>
            <Text
              numberOfLines={3}
              style={{
                fontSize: normalize(16),
                fontFamily: Fonts.OpenSans_SemiBold,
                color: Colors.textBlack,
                maxWidth: normalize(200),
              }}>
              {GroupReducer?.getGroupDetails?.data?.group_name !== undefined &&
                GroupReducer?.getGroupDetails?.data?.group_name}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                opacity: 0.6,
              }}>
              <Image
                source={Icons.earth}
                style={{
                  height: normalize(13),
                  width: normalize(13),
                  resizeMode: 'cover',
                }}
              />
              <Text
                style={{
                  marginHorizontal: normalize(3),
                  fontSize: normalize(12),
                  fontFamily: Fonts.OpenSans_Regular,
                  color: Colors.textBlack,
                }}>
                {GroupReducer?.getGroupDetails?.data?.privacy_setting !== '' &&
                  GroupReducer?.getGroupDetails?.data?.privacy_setting}
              </Text>
            </View>
          </View>

          <Text
            style={{
              marginTop: normalize(4),
              fontSize: normalize(14),
              fontFamily: Fonts.OpenSans_Regular,
              color: Colors.textBlack,
              opacity: 0.7,
            }}>
            {GroupReducer?.getGroupDetails?.data?.total_members !== undefined &&
              GroupReducer?.getGroupDetails?.data?.total_members}{' '}
            Member
            {GroupReducer?.getGroupDetails?.data?.total_members?.length > 1 &&
              's'}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: normalize(15),
              marginBottom: normalize(12),
            }}>
            {type != 'created' &&
              (GroupReducer?.getGroupDetails?.data?.isJoined === true ? (
                <View
                  style={[
                    styles.buttonContainer,
                    {
                      borderWidth: 0,
                      backgroundColor: Colors.lightOrange,
                      alignItems: 'center',
                    },
                  ]}>
                  <Text style={[styles.buttonText, {color: Colors.orange}]}>
                    Joined
                  </Text>
                  {/* <Image
                  source={Icons.downArr}
                  style={[
                    styles.buttonIcon,
                    {
                      height: normalize(20),
                      width: normalize(20),
                    },
                  ]}
                /> */}
                </View>
              ) : (
                <ButtonCom
                  onPress={() => {
                    onPressJoinButton(GroupReducer?.getGroupDetails?.data?._id);
                  }}
                  height={normalize(45)}
                  width={'47%'}
                  backgroundColor={Colors.orange}
                  title={'Join'}
                  borderRadius={normalize(13)}
                />
              ))}

            {type == 'created' ? (
              <ButtonCom
                onPress={() => {
                  props.navigation.navigate('InviteGroup', {
                    group_id: props?.route?.params?.dataValue,
                  });
                }}
                height={normalize(45)}
                width={'47%'}
                backgroundColor={Colors.textBlack}
                title={'Invite'}
                borderRadius={normalize(13)}
              />
            ) : (
              <ButtonCom
                onPress={() => {
                  GroupReducer?.getGroupDetails?.data?.isJoined
                    ? onPressLeaveButton(
                        GroupReducer?.getGroupDetails?.data?._id,
                      )
                    : onPressRejectButton(
                        GroupReducer?.getGroupDetails?.data?._id,
                      );
                }}
                height={normalize(45)}
                width={'47%'}
                backgroundColor={Colors.textBlack}
                title={
                  GroupReducer?.getGroupDetails?.data?.isJoined
                    ? 'Leave'
                    : 'Reject'
                }
                borderRadius={normalize(13)}
              />
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: normalize(10),
            }}>
            {users?.length > 0 &&
              users?.slice(0, 3)?.map((user, index) => (
                <Image
                  source={
                    user?.image !== ''
                      ? {
                          uri: constants?.IMAGE_URL + 'user/' + user.image,
                        }
                      : Icons?.userProfile
                  }
                  style={{
                    height: normalize(30),
                    width: normalize(30),
                    resizeMode: 'contain',
                    borderWidth: 1,
                    borderRadius: 50,
                    marginLeft: index > 0 ? normalize(-12) : 5,
                  }}
                  key={index}
                />
              ))}
            {totalMembers > 3 && (
              <Text style={{fontSize: normalize(12), color: '#383A46'}}>
                +{totalMembers - 3}
              </Text>
            )}
            {users?.length > 0 && (
              <Text
                numberOfLines={1}
                style={{
                  color: '#383A46',
                  fontSize: normalize(12),
                  marginLeft: normalize(5),
                  maxWidth: normalize(230),
                  fontFamily: Fonts.OpenSans_Regular,
                }}>
                {totalMembers === 1
                  ? `${users?.length > 0 && users[0]?.name} is here`
                  : totalMembers === 2
                    ? `${
                        users?.length > 0 && users[0]?.name
                      } and 1 connection are here`
                    : `${users?.length > 0 && users[0]?.name} and ${
                        totalMembers - 1
                      } connections are here`}
              </Text>
            )}
          </View>

          <Text
            style={{
              fontSize: normalize(16),
              fontFamily: Fonts.OpenSans_SemiBold,
              color: Colors.textBlack,
            }}>
            Motive
          </Text>
          <Text
            style={{
              marginTop: normalize(4),
              fontSize: normalize(14),
              fontFamily: Fonts.OpenSans_Regular,
              color: Colors.textBlack,
            }}>
            {GroupReducer?.getGroupDetails?.data?.group_moto !== '' &&
              GroupReducer?.getGroupDetails?.data?.group_moto !== undefined &&
              GroupReducer?.getGroupDetails?.data?.group_moto !== null &&
              GroupReducer?.getGroupDetails?.data?.group_moto}
          </Text>
          <Text
            style={{
              fontSize: normalize(16),
              fontFamily: Fonts.OpenSans_SemiBold,
              color: Colors.textBlack,
              marginVertical: normalize(15),
            }}>
            Post
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: normalize(12),
            }}>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => {
                if (GroupReducer?.getGroupDetails?.data?.isJoined === false) {
                  showErrorAlert(
                    `Sorry, your can not post right now,because you haven't joined the group`,
                  );
                } else {
                  props?.navigation.navigate('CreateVideoPost', {
                    postGroupId: groupId,
                    type: type,
                  });
                }
                dispatch(clearPostSubmitSuccess({}));
              }}>
              <Image source={Icons.videoSquare} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Media</Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}></View>
          </View>
          {posts?.length > 0 ? (
            <FlatList
              data={posts}
              renderItem={renderPostItem}
              keyExtractor={item => item?.toString()}
              onEndReached={() => {
                GroupReducer.status != 'Group/getGroupPostRequest' &&
                  GroupReducer?.getGroupPostDetailsRes?.page <
                    GroupReducer?.getGroupPostDetailsRes?.pages &&
                  RenderGroupPostList(
                    GroupReducer?.getGroupPostDetailsRes?.page + 1,
                  );
                console.log('hello flatlist');
              }}
              onEndReachedThreshold={0.1}
            />
          ) : (
            <View
              style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
              <Text
                style={{fontSize: normalize(14), color: Colors.placeholder}}>
                Not Yet Posted
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      {requestCancelModal()}
      {RenderSharePostDetails()}
      {RenderCommentPostDetails()}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    height: normalize(45),
    width: '47%',
    borderRadius: normalize(13),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: normalize(1),
    borderColor: Colors.borderColor1,
    flexDirection: 'row',
  },
  buttonText: {
    marginLeft: normalize(5),
    fontSize: normalize(14),
    color: Colors.textBlack,
    fontFamily: Fonts.OpenSans_Bold,
  },
  buttonIcon: {
    height: normalize(22),
    width: normalize(22),
    resizeMode: 'cover',
  },

  container_wrapper: {
    marginTop: normalize(20),
  },
  header: {
    marginVertical: normalize(10),
  },
  icon_wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileContainer: {
    alignItems: 'center',
  },
  boxContainer: {
    position: 'absolute',
    top: normalize(10),
    right: normalize(10),
    padding: normalize(5),
    borderRadius: normalize(5),
  },
  boxIcon: {
    width: normalize(20),
    height: normalize(20),
  },
  floatingButton: {
    // position: 'absolute',
    // zIndex: 11111,
    // bottom: Platform.OS === 'ios' ? 120 : 120,
    // left:normalize(10),
    // paddingHorizontal:normalize(110),
    width: '100%',
    backgroundColor: '#F27C24',
    borderRadius: 10,
    padding: 16,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButton1: {
    // position: 'absolute',
    // zIndex: 11111,
    // bottom: Platform.OS === 'ios' ? 122 : 120,

    right: -10,
    width: '21%',
    backgroundColor: '#1F2440',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: normalize(45),
  },
  iconBackground: {
    height: normalize(65),
    width: normalize(65),
  },
  profilePicture: {
    height: normalize(50),
    width: normalize(50),
    position: 'absolute',
    top: normalize(7),
    borderRadius: normalize(25),
  },
  textWrapper: {
    marginLeft: normalize(10),
  },
  name: {
    fontSize: normalize(14),
    fontWeight: '600',
    lineHeight: normalize(14),
    color: '#1F2440',
  },
  status: {
    fontSize: normalize(11),
    color: 'gray',
  },
  threeDotIcon: {
    width: normalize(16),
    height: normalize(16),
  },
  backgroundImage: {
    width: '100%',
    height: normalize(180),
    marginTop: normalize(10),
    // borderRadius: normalize(10),
  },
  actionsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: normalize(10),
    width: '60%',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  actionCount: {
    marginLeft: normalize(5),
    fontSize: normalize(14),
    color: 'gray',
  },
  actionIcon: {
    width: normalize(17),
    height: normalize(16),
  },
  actionIcon1: {
    width: normalize(16),
    height: normalize(16),
  },
  desc: {
    fontSize: normalize(12),
    width: '100%',
    color: '#1F2440',
    textAlign: 'justify',
    fontFamily: Fonts.OpenSans_Medium,
  },
  time: {
    fontSize: normalize(12),
    color: '#1F2440',
    lineHeight: normalize(13.26),
    fontFamily: Fonts.OpenSans_Regular,
    marginTop: normalize(10),
    textTransform: 'capitalize',
  },
  blueText: {
    color: '#000000',
  },
  friendContainer: {
    marginHorizontal: normalize(5),
    alignItems: 'center',
    marginTop: normalize(10),
  },
  friendImage: {
    width: normalize(100),
    height: normalize(100),
    borderRadius: normalize(10), // Make it a square with rounded corners
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.08)', // Semi-transparent black background
    padding: normalize(5),
    borderBottomLeftRadius: normalize(10),
    borderBottomRightRadius: normalize(10),
  },
  friendName: {
    color: '#FFFFFF',
    fontSize: normalize(12),
    fontWeight: '600',
  },
  friendStatus: {
    color: Colors.backgroundLight,
    fontSize: normalize(10),
    fontWeight: '400',
  },
  scrollViewContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  contentContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: normalize(10),
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconImage: {
    width: normalize(35),
    height: normalize(35),
    borderRadius: normalize(20),
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  text: {
    color: 'white',
    marginLeft: normalize(5),
    bottom: normalize(5),
    // fontWeight:'600'
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: normalize(8),
    marginHorizontal: normalize(15),
  },
  replyContainers: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: normalize(8),
    marginHorizontal: normalize(0),
  },
  commentImage: {
    height: normalize(30),
    width: normalize(30),
    borderRadius: normalize(15),
    marginRight: normalize(8),
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentName: {
    fontSize: normalize(14),
    fontWeight: '600',
  },
  commentTime: {
    fontSize: normalize(12),
    color: '#9E9E9E',
  },
  commentMessageBox: {
    backgroundColor: '#F7F7F7',
    padding: normalize(8),
    borderRadius: normalize(8),
    marginTop: normalize(8),
  },
  replyMessageBox1: {
    backgroundColor: '#F7F7F7',
    padding: normalize(10),
    borderRadius: normalize(8),
    marginTop: normalize(8),
  },
  commentMessage: {
    fontSize: normalize(14),
  },
  commentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // alignSelf: 'flex-end',
    alignItems: 'center',
    left: normalize(40),
    marginTop: normalize(8),
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    left: normalize(40),
    bottom: normalize(1.5),
    // right:20
  },
  replyIcon: {
    height: normalize(15),
    width: normalize(15),
    marginRight: normalize(4),
  },
  replyText: {
    fontSize: normalize(14),
  },
  likesText: {
    fontSize: normalize(12),
    color: '#9E9E9E',
  },
  replyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  replyMessageBox: {
    backgroundColor: '#f4f4f4',
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  replyMessage: {
    fontSize: normalize(14),
    color: '#000000',
  },
  commentHeaders: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: '#f4f4f4',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  commentImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentHeaderText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentName: {
    fontWeight: 'bold',
  },
  commentTime: {
    color: '#888',
    textTransform: 'capitalize',
  },
  backgroundImage: {
    width: '100%',
    height: normalize(180),

    // marginTop: normalize(10),
    borderRadius: normalize(10),
  },
  desc1: {
    fontSize: normalize(12),
    width: '100%',
    color: '#1F2440',
    textAlign: 'justify',
    fontFamily: Fonts.OpenSans_Medium,
    marginTop: normalize(10),
    paddingHorizontal: normalize(15),
  },
});
