import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  FlatList,
  KeyboardAvoidingView,
  BackHandler,
  TextInput,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import MyStatusBar from '../../utils/helpers/MyStatusBar';
import HeaderSection from '../../components/HeaderSection';
import normalize from '../../utils/helpers/dimen';
import {Fonts, Icons} from '../../themes/ImagePath';
import {Colors} from '../../themes/Colors';
import {ScrollView} from 'react-native-gesture-handler';
import Media from '../../components/landingPage/MediaCommon/Media';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {
  deleteAccountRequest,
  getProfileRequest,
} from '../../redux/reducer/AuthReducer';
const {width} = Dimensions.get('window');
import Modal from 'react-native-modal';
import constants from '../../utils/helpers/constants';
import Loader from '../../utils/helpers/Loader';
import TextInputmultiple from '../../components/TextInputmultiple';
import moment from 'moment';
import {navigationRef} from '../../utils/helpers/RootNavigation';
import {
  deletePostRequest,
  postCommentListRequest,
  postCommentReactionRequest,
  postCommentRequest,
  postFavoriteRequest,
  postReactionRequest,
  postShareRequest,
} from '../../redux/reducer/PostReducer';
import connectionrequest from '../../utils/helpers/NetInfo';
import showErrorAlert from '../../utils/helpers/Toast';
import {SafeAreaView} from 'react-native-safe-area-context';
import VideoThumbnails, {
  getVideoThumbnail,
} from '../../components/VideoThumbnails';
import PopupMenu from '../../components/PopupMenu';
const MyProfile = props => {
  const [fullName, setFullName] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [university, setUniversity] = useState('');
  const [followingDetails, setFollowingDetails] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [reason, setReason] = useState('');
  const [isReasonFocus, setIsReasonFocus] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyCommentText, setReplyCommentText] = useState('');
  const [shareText, setShareText] = useState('');
  const [shareButtonData, setShareButtonData] = useState('');
  const [commentButtonData, setCommentButtonData] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isOpenText, setIsOpenText] = useState(false);
  const [activeReplyIndex, setActiveReplyIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isReact, setIsReact] = useState(false);
  const [commentCurrentPage, setCommentCurrentPage] = useState(1);
  const [replySubmitted, setReplySubmitted] = useState(false);
  const [repliesFocus, setRepliesFocus] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [expandedItems, setExpandedItems] = useState([]);
  const [isPopupMenuVisible, setIsPopupMenuVisible] = useState(false);
  let perPage = 10;
  const AuthReducer = useSelector(state => state.AuthReducer);
  const PostReducer = useSelector(state => state?.PostReducer);
  const biography = AuthReducer?.getProfileRes?.data?.biography;

  const isFocus = useIsFocused();
  const dispatch = useDispatch();

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

  useFocusEffect(
    React.useCallback(() => {
      if (isFocus) {
        const profileData = AuthReducer?.getProfileRes?.data || {};
        setFullName(profileData.first_name + ' ' + profileData.last_name || '');
        setProfileImage(profileData?.profile_image || '');
        setUniversity(profileData?.university?.title || '');
      }
    }, [isFocus, AuthReducer?.status]),
  );
  useEffect(() => {
    dispatch(getProfileRequest());
  }, []);

  let item = [
    {
      id: 1,
      title: 'Followers',
      quantity:
        AuthReducer?.getProfileRes &&
        AuthReducer?.getProfileRes?.total_followers,
      icon1: Icons.save,
      icon2: Icons.setting,
    },
    {
      id: 2,
      title: 'Following',
      quantity:
        AuthReducer?.getProfileRes &&
        AuthReducer?.getProfileRes?.total_following,
      icon1: Icons.save,
      icon2: Icons.setting,
    },
    {
      id: 3,
      title: 'Friends',
      quantity:
        AuthReducer?.getProfileRes && AuthReducer?.getProfileRes?.total_friends,
      icon1: Icons.save,
      icon2: Icons.setting,
    },
  ];

  // pop up menu delete functionality
  const handleMoreIconClick = () => {
    setIsPopupMenuVisible(!isPopupMenuVisible);
  };

  const handleEditOption = () => {
    setIsPopupMenuVisible(false);
  };

  const handleDeleteOption = deleteId => {
    setIsPopupMenuVisible(false);
    deletePost(deleteId);
  };

  const handleClosePopupMenu = () => {
    setIsPopupMenuVisible(false);
  };

  let status = '';
  if (status == '' || AuthReducer.status != status) {
    switch (AuthReducer.status) {
      case 'Post/postShareRequest':
        status = AuthReducer.status;
        break;
      case 'Post/postShareSuccess':
        status = AuthReducer.status;
        // setShareModal(false);
        // RenderPostList();
        break;
      case 'Post/postShareFailure':
        status = AuthReducer.status;
        break;
    }
  }

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

  useEffect(() => {
    let status = '';
    if (status == '' || PostReducer.status != status) {
      switch (PostReducer.status) {
        case 'Post/postShareRequest':
          status = PostReducer.status;
          break;
        case 'Post/postShareSuccess':
          status = PostReducer.status;
          setShareModal(false);
          // RenderGroupPostList();
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
          // RenderGroupPostList();
          dispatch(getProfileRequest());
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
          // RenderGroupPostList();
          dispatch(getProfileRequest());
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
          // RenderGroupPostList();
          dispatch(getProfileRequest());
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
          dispatch(getProfileRequest());
          // RenderGroupPostList();
          break;
        case 'Post/postFavoriteFailure':
          status = PostReducer.status;
          break;

        case 'Post/deletePostRequest':
          status = PostReducer.status;
          break;
        case 'Post/deletePostSuccess':
          status = PostReducer.status;
          setShareModal(false);
          dispatch(getProfileRequest());
          // RenderGroupPostList();
          break;
        case 'Post/deletePostFailure':
          status = PostReducer.status;
          break;
      }
    }
  }, [PostReducer?.status]);

  const deletePost = deleteId => {
    let obj = {
      id: deleteId,
    };
    connectionrequest()
      .then(() => {
        dispatch(deletePostRequest(obj));
      })
      .catch(err => {
        console.log(err);
      });
  };

  const ProfileMediaItem = ({item}) => {
    const [thumbnail, setThumbnail] = useState('');
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      (async () => {
        for (const media of item) {
          if (media?.media_type === 'video/mp4') {
            const res = await getVideoThumbnail(
              constants.IMAGE_URL + 'post/media/' + media.media_url,
            );
            setThumbnail(res);
          } else {
            setThumbnail(constants.IMAGE_URL + 'post/media/' + media.media_url);
          }
        }
        setLoading(false);
      })();
    }, []);

    return (
      <View
        style={{
          width: '31%',
          // height: normalize(105),
          aspectRatio: 4 / 4.5,
          marginBottom: normalize(12),
          borderRadius: normalize(10),
          position: 'relative',
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {loading ? (
          <ActivityIndicator color={Colors.orange} size={'small'} />
        ) : (
          <>
            <Image
              source={
                !item?.media_url
                  ? {
                      uri: thumbnail,
                    }
                  : Icons.noImage
              }
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'cover',
              }}
            />
            {item?.map(
              (media, index) =>
                media?.media_type === 'video/mp4' && (
                  <Image
                    key={index}
                    source={Icons.play}
                    style={{
                      width: normalize(10),
                      aspectRatio: 1,
                      resizeMode: 'contain',
                      position: 'absolute',
                      top: normalize(-10),
                      right: normalize(7),
                    }}
                  />
                ),
            )}
          </>
        )}
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    // console.log(item, 'Dsadskj');
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
        isReact: !isReact,
      };
      dispatch(postCommentReactionRequest(obj));
      setIsReact(prevIsReact => !prevIsReact);
    };

    return (
      <View style={styles.commentContainer}>
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

  const renderPostItem = ({item, index}) => {
    const isExpanded = expandedItems.includes(item._id);
    const toggleExpand = () => {
      setExpandedItems(prev =>
        isExpanded ? prev.filter(id => id !== item?._id) : [...prev, item?._id],
      );
    };

    const AddToFavorite = () => {
      let obj = {
        post_id: item?._id,
        isReact: item?.isFavourites === false ? true : false,
      };
      dispatch(postFavoriteRequest(obj));
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
                AuthReducer?.getProfileRes?.data?.profile_image !== '' &&
                AuthReducer?.getProfileRes?.data?.profile_image !== undefined &&
                AuthReducer?.getProfileRes?.data?.profile_image !== null
                  ? {
                      uri:
                        constants?.IMAGE_URL +
                        'user/' +
                        AuthReducer?.getProfileRes?.data?.profile_image,
                    }
                  : Icons.userProfile
              }
              style={[
                {
                  height: normalize(28),
                  width: normalize(28),
                  position: 'absolute',
                  borderRadius: 50,
                  top: normalize(2),
                },
              ]}
            />
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.name}>
              {AuthReducer?.getProfileRes?.data?.full_name}
            </Text>
            <Text style={styles.status}>
              {AuthReducer?.getProfileRes?.data?.user_type !== '' &&
                AuthReducer?.getProfileRes?.data?.user_type !== undefined &&
                AuthReducer?.getProfileRes?.data?.user_type !== null &&
                AuthReducer?.getProfileRes?.data?.user_type}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.threeDotContainer,
              {right: 0, position: 'absolute', zIndex: 999},
            ]}
            onPress={handleMoreIconClick}>
            <Image
              source={Icons.more}
              style={styles.threeDotIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {/* PopupMenu component */}
          <PopupMenu
            visible={isPopupMenuVisible}
            onClose={handleClosePopupMenu}
            onEdit={handleEditOption}
            onDelete={() => handleDeleteOption(item?._id)}
            type="delete"
          />
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
                setIsReact(prevIsReact => !prevIsReact);
              }}>
              <Image
                source={item?.isReact === true ? Icons.like : Icons.love}
                style={styles.actionIcon}
              />
            </TouchableOpacity>
            <Text style={styles.actionCount}>{item?.reactes}</Text>
          </View>
          <View style={styles.actionContainer}>
            <TouchableOpacity
              onPress={() => {
                setCommentButtonData(item), setCommentModal(true);
                FetchCommentList(item);
              }}>
              <Image source={Icons.messages} style={styles.actionIcon} />
            </TouchableOpacity>
            <Text style={styles.actionCount}>{item?.comments}</Text>
          </View>
          <View style={styles.actionContainer}>
            <TouchableOpacity
              onPress={() => {
                setShareButtonData(item), setShareModal(true);
              }}>
              <Image source={Icons.send} style={styles.actionIcon} />
            </TouchableOpacity>
            <Text style={styles.actionCount}>{item?.share}</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.actionContainer,
              {
                left:
                  Platform?.OS === 'android' ? width * 0.352 : width * 0.342,
              },
            ]}
            onPress={() => {
              AddToFavorite(), setIsReact(prevIsReact => !prevIsReact);
            }}>
            <Image
              source={item?.isFavourites === true ? Icons.bookmark : Icons.save}
              style={[
                styles.actionIcon,
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
          dispatch(getProfileRequest());
          // RenderGroupPostList();
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
                style={{
                  height: normalize(32),
                  width: normalize(32),
                }}
              />
              <Image
                source={
                  AuthReducer?.getProfileRes?.data?.profile_image !== '' &&
                  AuthReducer?.getProfileRes?.data?.profile_image !== null &&
                  AuthReducer?.getProfileRes?.data?.profile_image !== undefined
                    ? {
                        uri:
                          constants.IMAGE_URL +
                          'user/' +
                          AuthReducer?.getProfileRes?.data?.profile_image,
                      }
                    : Icons.user3
                }
                style={[
                  {
                    height: normalize(28),
                    width: normalize(28),
                    position: 'absolute',
                    borderRadius: 50,
                    top: normalize(2),
                  },
                ]}
              />
            </View>
            <Text
              style={{
                textAlign: 'center',
                marginLeft: normalize(15),
                fontSize: normalize(12),
              }}>
              {AuthReducer?.getProfileRes?.data?.full_name !== '' &&
                AuthReducer?.getProfileRes?.data?.full_name !== null &&
                AuthReducer?.getProfileRes?.data?.full_name !== undefined &&
                AuthReducer?.getProfileRes?.data?.full_name}
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
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <MyStatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <Loader visible={PostReducer?.status === 'Post/deletePostRequest'} />
      <HeaderSection />
      <View style={{height: '100%', flex: 4.5, paddingTop: normalize(30)}}>
        <View style={styles.profileContainer}>
          <ImageBackground
            source={Icons.ellipse}
            style={[styles.iconBackground, {height: 120, width: 120}]}
          />
          <TouchableOpacity
            style={styles.circleIcon}
            onPress={() => props?.navigation?.navigate('UpdateProfile')}>
            <Image source={Icons.edit} style={styles.circleImage} />
          </TouchableOpacity>
          <Image
            source={
              profileImage !== ''
                ? {uri: constants.IMAGE_URL + 'user/' + profileImage}
                : Icons.userProfile
            }
            style={[
              styles.profilePicture,
              {height: 100, width: 100, borderRadius: 50, top: normalize(8)},
            ]}
          />
        </View>
        <View style={styles.profileName}>
          <Text
            style={{
              fontSize: normalize(12),
              fontWeight: '600',
              color: '#1F2440',
              lineHeight: normalize(21.79),
              fontFamily: Fonts.OpenSans_Regular,
            }}>
            {fullName !== undefined && fullName}
          </Text>
          <Text
            style={{
              fontSize: normalize(10),
              fontWeight: '400',
              color: '#1F2440',
              lineHeight: normalize(17.7),
              fontFamily: Fonts.OpenSans_Light,
            }}>
            {university !== undefined && university} University
          </Text>
          <Text
            style={{
              fontSize: normalize(12),
              fontWeight: '600',
              color: '#1F2440',
              lineHeight: normalize(20),
              fontFamily: Fonts.OpenSans_Regular,
              textAlign: 'justify',
            }}>
            {isExpanded
              ? biography
              : `${biography?.slice(0, 100)}${
                  biography?.length > 100 ? '' : ''
                }`}
            {/* Displaying first 100 characters with ellipsis if necessary */}
            {biography?.length > 100 && (
              <Text
                onPress={toggleReadMore}
                style={{
                  fontSize: normalize(14),
                  color: 'grey',
                
                }}>
                {isExpanded ? ' ...less' : ' ...more'}
              </Text>
            )}
          </Text>
        </View>
        <View
          style={{
            borderWidth: 1,
            borderColor: '#F4F3F3',
            marginTop: normalize(10),
          }}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              padding: 10,

              // marginHorizontal:20
            }}>
            {item?.map((section, index) => (
              <>
                <View
                  key={index}
                  style={{
                    alignItems: 'center',
                    flex: 0.3,
                  }}>
                  <Text
                    style={{
                      fontWeight: '600',
                      fontSize: normalize(13),
                      lineHeight: 20,
                      color: '#383A46',
                      fontFamily: Fonts.OpenSans_Medium,
                      // left:0,
                      // right: normalize(10),
                    }}>
                    {section.quantity}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '400',
                      fontSize: normalize(11),
                      lineHeight: 25,
                      fontFamily: Fonts.OpenSans_Medium,
                      color: '#A0A0A0',
                    }}>
                    {section.title}
                  </Text>
                </View>
              </>
            ))}
            <View
              style={{
                flex: 0.5,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}>
              {/* <TouchableOpacity
                style={{
                  backgroundColor: 'rgba(242,124,36,0.2)',
                  width: normalize(35),
                  height: normalize(35),
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                }}>
                <Image
                  source={Icons.saveBg}
                  style={{
                    height: normalize(16),
                    width: normalize(16),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity> */}
              <TouchableOpacity
                style={{
                  backgroundColor: '#1F2440',
                  width: normalize(35),
                  height: normalize(35),
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  marginLeft: normalize(53),
                }}
                onPress={() => props?.navigation.navigate('Setting')}>
                <Image
                  source={Icons.setting}
                  style={{
                    height: normalize(16),
                    width: normalize(16),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              flexWrap: 'wrap',
              flexDirection: 'row',
              gap: normalize(10),
              marginHorizontal: normalize(10),
            }}>
            {AuthReducer.getProfileRes?.data?.post_media.length > 0 ? (
              AuthReducer.getProfileRes?.data?.post_media?.map(item => {
                return <ProfileMediaItem item={item} key={item._id} />;
              })
            ) : (
              <View
                style={{
                  flex: 1,
                  height: normalize(150),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#bbb',
                    fontSize: normalize(12),
                    marginBottom: normalize(25),
                    fontFamily: Fonts.OpenSans_Medium,
                  }}>
                  {AuthReducer.getProfileRes?.data?.first_name} hasn't posted
                  anything yet...
                </Text>
              </View>
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 20,
              marginTop: 10,
            }}>
            <View>
              <Text
                style={{
                  fontWeight: '600',
                  fontSize: normalize(14),
                  lineHeight: normalize(21.79),
                  fontFamily: Fonts.OpenSans_Medium,
                  color: '#1F2440',
                }}>
                Posts
              </Text>
            </View>
            {/* <TouchableOpacity>
              <Text
                style={{
                  fontSize: normalize(13),
                  fontWeight: '600',
                  fontFamily: Fonts.OpenSans_Medium,
                  color: '#F27C24',
                }}>
                View All
              </Text>
            </TouchableOpacity> */}
          </View>
          <View style={{marginHorizontal: normalize(16)}}>
            {AuthReducer?.getProfileRes?.data?.post_details?.length > 0 ? (
              <FlatList
                data={
                  AuthReducer?.getProfileRes?.data?.post_details?.length > 0
                    ? AuthReducer?.getProfileRes?.data?.post_details
                    : []
                }
                renderItem={renderPostItem}
                keyExtractor={item => item?.toString()}
              />
            ) : (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <Text style={{color: Colors.placeholder}}>
                  You can view your post here.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
      {RenderSharePostDetails()}
      {RenderCommentPostDetails()}
    </SafeAreaView>
  );
};

export default MyProfile;

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
  },
  profileName: {
    alignItems: 'center',
    marginTop: normalize(20),
    color: '#1F2440',
    marginHorizontal: 20,
  },

  iconBackground: {
    height: normalize(32),
    width: normalize(32),
  },
  profilePicture: {
    height: normalize(60),
    width: normalize(60),
    position: 'absolute',
    top: normalize(7),
    borderRadius: normalize(50),
  },
  backgroundImage: {
    width: '100%',
    height: normalize(180),
    marginTop: normalize(10),
    // borderRadius: normalize(10),
  },
  circleIcon: {
    position: 'absolute',
    bottom: normalize(-4),
    backgroundColor: 'red',
    zIndex: 55555,
    borderRadius: normalize(5),
    backgroundColor: '#F27C24',
    width: normalize(25),
    height: normalize(25),
    justifyContent: 'center',
    alignContent: 'center',
  },
  circleImage: {
    width: normalize(15),
    height: normalize(15),
    alignSelf: 'center',
  },
  header: {
    marginVertical: normalize(10),
  },
  icon_wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },

  profileContainer: {
    alignItems: 'center',
  },
  boxContainer: {
    position: 'absolute',
    top: normalize(5),
    right: normalize(5),
    padding: normalize(5),
    borderRadius: normalize(5),
  },
  boxIcon: {
    width: normalize(20),
    height: normalize(20),
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
    fontSize: normalize(12),
    color: 'gray',
  },
  threeDotIcon: {
    width: normalize(15),
    height: normalize(15),
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
    width: normalize(16),
    height: normalize(15),
  },
  desc: {
    fontSize: normalize(12),
    width: '100%',
    color: '#9E9E9E',
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
});
