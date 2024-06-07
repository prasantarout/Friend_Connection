import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {Fonts, Icons} from '../../themes/ImagePath';
import {Colors} from '../../themes/Colors';
import Modal from 'react-native-modal';
import TextInputmultiple from '../TextInputmultiple';
import {
  postCommentListRequest,
  postCommentReactionRequest,
  postCommentRequest,
  postFavoriteRequest,
  postListRequest,
  postReactionRequest,
  postShareRequest,
} from '../../redux/reducer/PostReducer';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import showErrorAlert from '../../utils/helpers/Toast';
import Loader from '../../utils/helpers/Loader';
import EventReducer from '../../redux/reducer/EventReducer';
import constants from '../../utils/helpers/constants';
const {width} = Dimensions.get('window');
import moment, {normalizeUnits} from 'moment';
import connectionrequest from '../../utils/helpers/NetInfo';
import {getProfileRequest} from '../../redux/reducer/AuthReducer';
import LinearGradient from 'react-native-linear-gradient';
import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';
import Video from 'react-native-video';
import VideoThumbnails from '../VideoThumbnails';

const LandingPage = ({navigation}) => {
  const [shareModal, setShareModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [isReasonFocus, setIsReasonFocus] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [shareText, setShareText] = useState('');
  const [shareButtonData, setShareButtonData] = useState('');
  const [commentButtonData, setCommentButtonData] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isOpenText, setIsOpenText] = useState(false);
  const [activeReplyIndex, setActiveReplyIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isReact, setIsReact] = useState(false);
  const [commentCurrentPage, setCommentCurrentPage] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [replySubmitted, setReplySubmitted] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [expandedItems, setExpandedItems] = useState([]);
  const [repliesFocus, setRepliesFocus] = useState(false);
  const videoPlayer = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);
  const [screenType, setScreenType] = useState('content');
  const [renderPostList, setRenderPostList] = useState([]);

  const navigation1 = useNavigation();

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const PostReducer = useSelector(state => state?.PostReducer);
  const AuthReducer = useSelector(state => state?.AuthReducer);
  const FriendReducer = useSelector(state => state?.FriendReducer);
  const [feeds, setfeeds] = useState(false);
  let perPage = 10;
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
  useEffect(() => {
    RenderPostList(1);
    dispatch(getProfileRequest());
  }, [isFocused]);

  const RenderPostList = page => {
    let obj = {
      page: page,
      perpage: perPage,
    };
    console.log(obj, 'Dsdshjkd');
    dispatch(postListRequest(obj));
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

  useEffect(() => {
    let status = '';
    if (status == '' || PostReducer.status != status) {
      switch (PostReducer.status) {
        case 'Post/postListRequest':
          status = PostReducer.status;
          break;
        case 'Post/postListSuccess':
          status = PostReducer.status;
          if (PostReducer?.postListRequestRes?.page === 1) {
            setRenderPostList(PostReducer?.postListRequestRes?.data);
          } else {
            setRenderPostList([
              ...renderPostList,
              ...PostReducer?.postListRequestRes?.data,
            ]);
            setIsLoading(false);
          }
          break;
        case 'Post/postListFailure':
          status = PostReducer.status;
          break;
        case 'Post/postShareRequest':
          status = PostReducer.status;
          break;
        case 'Post/postShareSuccess':
          status = PostReducer.status;
          setShareModal(false);
          RenderPostList(PostReducer?.postListRequestRes?.page);
          setShareText('');
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
          RenderPostList(PostReducer?.postListRequestRes?.page);
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
          RenderPostList(PostReducer?.postListRequestRes?.page);
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
          RenderPostList(PostReducer?.postListRequestRes?.page);
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
          RenderPostList(PostReducer?.postListRequestRes?.page);
          break;
        case 'Post/postFavoriteFailure':
          status = PostReducer.status;
          break;
      }
    }
  }, [PostReducer?.status]);

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

  const description = commentButtonData?.description;
  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
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
        isReact: !isReact,
      };
      dispatch(postCommentReactionRequest(obj));
      setIsReact(prevIsReact => !prevIsReact);
    };

    return (
      <View style={styles.commentContainer} key={index} {...item}>
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
                    setRepliesFocus(true), setfeeds(true);
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

  // const getMoreCommentList = () => {
  //   FetchCommentList();
  //   setCurrentPage(prevPage => prevPage + 1);
  // };

  // console.log(currentPage, '>>>>>rss');

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
        useNativeDriver={true}
        animationOutTiming={1000}
        onBackdropPress={() => {
          setCommentModal(false);
          RenderPostList(1);
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
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                  borderRadius: 15,
                  bottom: Platform?.OS === 'ios' ? normalize(20) : 0,
                  padding: normalize(10),
                }}>
                <TextInput
                  style={{
                    flex: 1,
                    color: '#000000',
                    fontSize: normalize(14),
                    padding: normalize(5),
                    width: normalize(250),
                  }}
                  multiline={true}
                  placeholder="Write your comment"
                  placeholderTextColor={'#383A46'}
                  value={commentText}
                  // onContentSizeChange={(e) => {
                  //   const newHeight = e.nativeEvent.contentSize.height;

                  //   const isHeightExceeded = newHeight > 50;

                  //   // setButtonBelow(isHeightExceeded);
                  // }}
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
        useNativeDriver={true}
        animationOutTiming={1000}
        onBackdropPress={() => {
          setShareModal(false);
          setIsOpenText(false);
          setShareText('');
          setIsReasonFocus(false);
        }}
        avoidKeyboard={true}>
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
            height: '40%',
          }}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <Loader visible={PostReducer?.status === 'Post/postShareRequest'} />
          <ScrollView
            style={{paddingBottom: 250}}
            showsVerticalScrollIndicator={false}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.profileContainer}>
                <ImageBackground
                  source={Icons.ellipse}
                  style={styles.iconBackground}
                />
                <Image
                  source={
                    shareButtonData?.user_details?.profile_image !== ''
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
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',

                marginTop: normalize(20),
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
                onPress={() => {
                  setShareModal(false), setShareText('');
                }}>
                <Image
                  source={Icons.cross}
                  style={{width: normalize(15), height: normalize(15)}}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
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
        isReact: item?.isFavourites == false ? true : false,
      };

      dispatch(postFavoriteRequest(obj));
    };

    return (
      <View style={styles.header} key={index} {...item}>
        <View style={styles.icon_wrapper}>
          <View key={item.id} style={styles.profileContainer}>
            <ImageBackground
              source={Icons.ellipse}
              style={styles.iconBackground}
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
              style={styles.profilePicture}
            />
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.name}>{item.user_details?.full_name}</Text>
            <Text style={styles.status}>{item.user_details?.user_type}</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.threeDotContainer,
              {right: 0, position: 'absolute'},
            ]}>
            {/* <Image
              source={Icons.more}
              style={styles.threeDotIcon}
              resizeMode="contain"
            /> */}
          </TouchableOpacity>
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
              item.post_media_details[0]?.media_url !== '' &&
              item?.post_media_details[0]?.media_url !== undefined &&
              item?.post_media_details[0]?.media_url !== null
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
            onPress={() => AddToFavorite()}>
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
            {item.description?.length > 100 && (
              <Text
                onPress={toggleExpand}
                style={{color: Colors.textlightgrey}}>
                {isExpanded ? '...less' : '...More'}
              </Text>
            )}
          </Text>
        </Text>
        <Text style={styles.time}>{moment(item?.createdAt)?.fromNow()}</Text>
      </View>
    );
  };
  return (
    <View style={styles.container_wrapper}>
      <FlatList
        data={renderPostList.length > 0 ? renderPostList : []}
        renderItem={renderPostItem}
        keyExtractor={item => item?._id}
        // onEndReached={() => {
        //   PostReducer.status != 'Post/postListRequest' &&
        //     PostReducer?.postListRequestRes?.page <
        //       PostReducer?.postListRequestRes?.pages &&
        //     RenderPostList(PostReducer?.postListRequestRes?.page + 1);
        // }}
        // onEndReachedThreshold={0.5}
        ListFooterComponent={
          renderPostList?.length !== PostReducer?.postListRequestRes?.total && (
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
                backgroundColor: Colors.darkBlue,
                borderRadius: 10,
                marginHorizontal: 100,
              }}
              onPress={() => {
                if (
                  renderPostList.length < PostReducer?.postListRequestRes?.total
                ) {
                  RenderPostList(PostReducer?.postListRequestRes?.page + 1);
                }
              }}>
              <Text
                style={{fontWeight: '600', fontSize: 14, color: Colors.white}}>
                Load More
              </Text>
            </TouchableOpacity>
          )
        }
        ListEmptyComponent={
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: normalize(20),
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: normalize(12),
                color: Colors.lightGrey,
              }}>
              No post found
            </Text>
          </View>
        }
      />
      {FriendReducer.frindSuggestionByProfileRes?.data?.length > 0 && (
        <View>
          <View
            onPointerLeave={() => console.log('leave')}
            onPointerLeaveCapture={() => console.log('capture')}
            onLayout={event => {}}
            style={{
              borderWidth: 1,
              borderColor: '#F8F8F8',
              marginTop: normalize(8),
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: normalize(20),
            }}>
            <View>
              <Text
                style={{
                  fontWeight: '600',
                  fontSize: normalize(14),
                  lineHeight: normalize(19.9),
                  fontFamily: Fonts.OpenSans_Medium,
                  color: '#1F2440',
                }}>
                Suggested Friends
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation1?.navigate('TabNavigator', {screen: 'Friend'})
              }>
              <Text
                style={{
                  fontSize: normalize(13),
                  fontWeight: '600',
                  fontFamily: Fonts.OpenSans_Medium,
                  color: '#F27C24',
                }}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}>
            {FriendReducer.frindSuggestionByProfileRes?.data?.map(
              (_suggestion, index) => (
                <TouchableOpacity
                  style={styles.friendContainer}
                  key={_suggestion._id}>
                  <Image
                    source={
                      _suggestion?.profile_image !== '' &&
                      _suggestion?.profile_image !== undefined &&
                      _suggestion?.profile_image !== null
                        ? {
                            uri:
                              constants?.IMAGE_URL +
                              'user/' +
                              _suggestion?.profile_image,
                          }
                        : Icons.userProfile
                    }
                    style={styles.friendImage}
                  />
                  <View
                    style={[
                      styles.boxContainer,
                      {
                        backgroundColor: _suggestion?.isTrue
                          ? '#64B956'
                          : '#F27C24',
                      },
                    ]}>
                    <Image
                      source={Icons.box}
                      style={{width: normalize(11), height: normalize(11)}}
                    />
                  </View>
                  {/* <View> */}
                  <LinearGradient
                    colors={['transparent', '#00000060']}
                    start={{x: 0.5, y: 0}}
                    end={{x: 0.5, y: 1}}
                    style={styles.infoContainer}>
                    <Text style={styles.friendName}>
                      {_suggestion.full_name}
                    </Text>
                    <Text style={styles.friendStatus}>
                      {`Class of ${_suggestion?.graduation_date}`}
                    </Text>
                  </LinearGradient>
                  {/* </View> */}
                </TouchableOpacity>
              ),
            )}
          </ScrollView>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#F8F8F8',
              marginTop: normalize(30),
            }}
          />
        </View>
      )}
      <View style={{}}>
        {/* {dataItem1.map((item, index) => (
          <View style={styles.header} key={index}>
            <View style={styles.icon_wrapper}>
              <View key={item.id} style={styles.profileContainer}>
                <ImageBackground
                  source={item.icon}
                  style={styles.iconBackground}
                />
                <Image source={item.picture} style={styles.profilePicture} />
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.status}>{item.status}</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.threeDotContainer,
                  {right: 0, position: 'absolute'},
                ]}>
                <Image
                  source={item.icon2}
                  style={styles.threeDotIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <View>
              <Image
                source={item.background}
                style={styles.backgroundImage}
                resizeMode="contain"
              />
              <View style={styles.contentContainer}>
                <Image source={item.image} style={styles.iconImage} />
                <View>
                  <Text
                    style={[
                      styles.text,
                      {fontWeight: '600', fontSize: normalize(12)},
                    ]}>
                    {item?.name1}
                  </Text>
                  <Text
                    style={[
                      styles.text,
                      {
                        fontWeight: '200',
                        color: '#FFFFFF',
                        fontFamily: Fonts.OpenSans_Light,
                        fontSize: normalize(10),
                      },
                    ]}>
                    {item?.year}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.actionsWrapper}>
              <View style={styles.actionContainer}>
                <TouchableOpacity>
                  <Image source={item.love} style={styles.actionIcon} />
                </TouchableOpacity>
                <Text style={styles.actionCount}>100</Text>
              </View>
              <View style={styles.actionContainer}>
                <TouchableOpacity onPress={() => setCommentModal(true)}>
                  <Image source={item.message} style={styles.actionIcon} />
                </TouchableOpacity>
                <Text style={styles.actionCount}>100</Text>
              </View>
              <View style={styles.actionContainer}>
                <TouchableOpacity onPress={() => setShareModal(true)}>
                  <Image source={item.send} style={styles.actionIcon} />
                </TouchableOpacity>
                <Text style={styles.actionCount}>100</Text>
              </View>
              <TouchableOpacity
                style={[styles.actionContainer, {left: width * 0.35}]}>
                <Image
                  source={item.save}
                  style={[styles.actionIcon]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.desc}>
              <Text style={styles.blueText}>{item.desc.slice(0, 13)}</Text>
              {item.desc.slice(2)}
              <Text style={{color: '#9E9E9E'}}>...More</Text>
            </Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        ))} */}
      </View>
      {RenderSharePostDetails()}
      {RenderCommentPostDetails()}
    </View>
  );
};

export default LandingPage;

const styles = StyleSheet.create({
  container_wrapper: {
    marginTop: normalize(5),
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
  iconBackground: {
    height: normalize(32),
    width: normalize(32),
  },
  profilePicture: {
    height: normalize(28),
    width: normalize(28),
    position: 'absolute',
    top: normalize(2),

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

    // marginTop: normalize(10),
    borderRadius: normalize(10),
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
    color: '#1F2440',
    textAlign: 'justify',
    fontFamily: Fonts.OpenSans_Medium,
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
  time: {
    fontSize: normalize(12),
    color: '#1F2440',
    lineHeight: normalize(13.26),
    fontFamily: Fonts.OpenSans_Regular,
    marginTop: normalize(10),
    textTransform: 'capitalize',
  },
  blueText: {
    // color: '#2196F3',
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
    // backgroundColor: 'rgba(0,0,0,0.08)', // Semi-transparent black background
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(8),
    borderBottomLeftRadius: normalize(10),
    borderBottomRightRadius: normalize(10),
    justifyContent: 'flex-end',
    height: '50%',
  },
  friendName: {
    color: '#FFFFFF',
    fontSize: normalize(12),
    fontWeight: '600',
    marginBottom: normalize(2),
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
  floatingButton2: {
    position: 'absolute',
    zIndex: 11111,
    bottom: Platform.OS === 'ios' ? normalize(165) : 120,
    right: 0, // Align to the right edge
    width: normalize(50), // Set a fixed width
    backgroundColor: '#1F2440',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: normalize(45),
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
    textTransform: 'capitalize',
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
});
