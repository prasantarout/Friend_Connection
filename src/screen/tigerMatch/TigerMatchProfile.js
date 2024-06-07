import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  Dimensions,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import MyStatusBar from '../../utils/helpers/MyStatusBar';
import HeaderSection from '../../components/HeaderSection';
import normalize from '../../utils/helpers/dimen';
import {Fonts, Icons} from '../../themes/ImagePath';
import {Colors} from '../../themes/Colors';
import Modal from 'react-native-modal';
import Carousel from 'react-native-snap-carousel';
import {useDispatch, useSelector} from 'react-redux';
import connectionrequest from '../../utils/helpers/NetInfo';
export const SLIDER_WIDTH = Dimensions.get('window').width + 40;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.82);
import Toast from '../../utils/helpers/Toast';
import {
  followuserRequest,
  interestuserRequest,
  matchuserdetailsRequest,
} from '../../redux/reducer/MatchReducer';
import Loader from '../../utils/helpers/Loader';
import constants from '../../utils/helpers/constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import {navigationRef} from '../../utils/helpers/RootNavigation';
let status1 = '';
const TigerMatchProfile = props => {
  const isCarousel = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [profileDetaileModal, setProfileDetaileModal] = useState(false);
  const dispatch = useDispatch();
  const MatchReducer = useSelector(state => state.MatchReducer);
  const AuthReducer = useSelector(state => state.AuthReducer);
  const [carouselist, setcarouselist] = useState([]);
  const [loading, setloading] = useState(true);
  console.log(
    MatchReducer?.matchuserdetailsResponse?.data?.post_media,
    'Dsdsjdds',
  );

  useEffect(() => {
    setCurrentIndex(props?.route?.params?.in);
    // console.log(props?.route?.params);
    if (props?.route?.params?.data) {
      setcarouselist(
        props?.route?.params?.data?.map((item, index) => {
          return {
            ...item,
            createisfollow: false,
            createisinterest: false,
          };
        }),
      );
    }

    //  if(isCarousel){
    // isCarousel?.current?.goToSlide(props?.route?.params?.in, true);
    // if (isCarousel.current) {
    // isCarousel.current.snapToItem(2)
    // }
    setTimeout(() => {
      isCarousel.current.snapToItem(props?.route?.params?.in);
    }, 1000);
    //  }
    connectionrequest()
      .then(() => {
        dispatch(
          matchuserdetailsRequest({
            user_id: props?.route?.params?.id,
          }),
        );
      })
      .catch(err => {
        Toast('Please connect To Internet');
      });
  }, []);
  // console.log(carouselist);

  function followother(itemId) {
    let data = {
      following_user: itemId,
    };
    console.log(data, '>>>>>>>respomnsssjhdashjkd');
    connectionrequest()
      .then(() => {
        dispatch(followuserRequest(data));
      })
      .catch(err => {
        Toast('Please connect To Internet');
      });
  }

  function creteinterestfunction() {
    let data = {
      to_user_id: MatchReducer?.matchuserdetailsResponse?.data?._id,
    };
    connectionrequest()
      .then(() => {
        dispatch(interestuserRequest(data));
      })
      .catch(err => {
        Toast('Please connect To Internet');
      });
  }

  useEffect(() => {
    if (status1 == '' || MatchReducer.status != status1) {
      switch (MatchReducer.status) {
        case 'Match/followuserRequest':
          status1 = MatchReducer.status;
          break;
        case 'Match/followuserSuccess':
          status1 = MatchReducer.status;
          dispatch(
            matchuserdetailsRequest({
              user_id: MatchReducer?.matchuserdetailsResponse?.data?._id,
            }),
          );

          // let arr=[...carouselist]
          let arr = [];
          arr = [...carouselist];
          if (arr?.length > 0) {
            arr[currentIndex].createisfollow =
              !arr[currentIndex]?.createisfollow;
          }

          break;
        case 'Match/followuserFailure':
          status1 = MatchReducer.status;
          break;

        case 'Match/interestuserRequest':
          status1 = MatchReducer.status;
          break;
        case 'Match/interestuserSuccess':
          status1 = MatchReducer.status;
          dispatch(
            matchuserdetailsRequest({
              user_id: MatchReducer?.matchuserdetailsResponse?.data?._id,
            }),
          );

          // let arr=[...carouselist]
          let arr1 = [];
          arr1 = [...carouselist];
          if (arr1?.length > 0) {
            arr1[currentIndex].createisinterest =
              !arr1[currentIndex]?.createisinterest;
          }

          break;
        case 'Match/interestuserFailure':
          status1 = MatchReducer.status;
          break;

        case 'Match/matchuserdetailsRequest':
          status1 = MatchReducer.status;
          break;
        case 'Match/matchuserdetailsSuccess':
          status1 = MatchReducer.status;
          setTimeout(() => {
            setloading(false);
          }, 2000);

          break;
        case 'Match/matchuserdetailsFailure':
          status1 = MatchReducer.status;
          break;
      }
    }
  }, [MatchReducer?.status]);

  let tempArr = [];
  MatchReducer?.matchuserdetailsResponse?.data?.post_media?.map(item => {
    if (item?.post_media_details?.length > 0) {
      tempArr?.push(item);
    }
  });

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

  console.log(MatchReducer?.matchuserdetailsResponse?.data, '>>>>>>>>ress');

  const ProfileDetaile = () => {
    return (
      <Modal
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating={true}
        isVisible={profileDetaileModal}
        style={{width: '100%', alignSelf: 'center', margin: 0}}
        animationInTiming={800}
        animationOutTiming={1000}
        onBackdropPress={() => {
          setProfileDetaileModal(false);
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
            height: '90%',
          }}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <ScrollView
            bounces={false}
            contentContainerStyle={{paddingBottom: normalize(15)}}
            showsVerticalScrollIndicator={false}>
            <View
              style={{
                width: '100%',
                marginTop: normalize(10),
                height: normalize(320),
                // backgroundColor:'red'
              }}>
              <ImageBackground
                borderRadius={normalize(10)}
                source={
                  MatchReducer?.matchuserdetailsResponse?.data?.profile_image ==
                  ''
                    ? Icons.usernoimage
                    : {
                        uri:
                          constants?.IMAGE_URL +
                          'user/' +
                          MatchReducer?.matchuserdetailsResponse?.data
                            ?.profile_image,
                      }
                }
                blurRadius={10}
                resizeMode="cover"
                style={{
                  height: normalize(280),
                  width: '100%',
                  // resizeMode: 'contain',
                }}>
                <ImageBackground
                  borderRadius={normalize(10)}
                  source={
                    MatchReducer?.matchuserdetailsResponse?.data
                      ?.profile_image == ''
                      ? Icons.usernoimage
                      : {
                          uri:
                            constants?.IMAGE_URL +
                            'user/' +
                            MatchReducer?.matchuserdetailsResponse?.data
                              ?.profile_image,
                        }
                  }
                  // blurRadius={10}
                  resizeMode="contain"
                  style={{
                    height: normalize(280),
                    width: '100%',
                    // resizeMode: 'contain',
                  }}></ImageBackground>
              </ImageBackground>
              <View
                style={{
                  width: '100%',
                  height: normalize(55),
                  position: 'absolute',
                  bottom: normalize(10),
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() =>
                    MatchReducer?.matchuserdetailsResponse?.data?.is_interested
                      ? creteinterestfunction() //Toast("You have already shown interest to this user")
                      : Toast('You are not interested in this user')
                  }
                  style={{width: normalize(33), height: normalize(33)}}>
                  <Image
                    source={
                      MatchReducer?.matchuserdetailsResponse?.data
                        ?.is_interested
                        ? Icons.cancel
                        : Icons.circleClose
                    }
                    style={{width: '100%', height: '100%'}}
                  />
                </TouchableOpacity>
                {console.log(
                  MatchReducer?.matchuserdetailsResponse?.data,
                  '>>>>>>dsda',
                )}
                <TouchableOpacity
                  onPress={() =>
                    MatchReducer?.matchuserdetailsResponse?.data?.is_interested
                      ? Toast('You are interested in this user')
                      : creteinterestfunction()
                  }
                  style={{
                    width: normalize(44),
                    height: normalize(44),
                    marginLeft: normalize(3),
                  }}>
                  <Image
                    source={
                      MatchReducer?.matchuserdetailsResponse?.data
                        ?.is_interested
                        ? Icons.circleHeart
                        : Icons.greyhearticon
                    }
                    style={{width: '100%', height: '100%', resizeMode: 'cover'}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    followother(
                      MatchReducer?.matchuserdetailsResponse?.data?._id,
                    )
                  }
                  style={{
                    marginLeft: normalize(3),
                    width: normalize(33),
                    height: normalize(33),
                  }}>
                  <Image
                    source={
                      //Icons.unfriend
                      MatchReducer?.matchuserdetailsResponse?.data
                        ?.tiger_match_is_follow_ == false
                        ? Icons.friendRequest
                        : Icons.unfriend
                    }
                    style={{width: '100%', height: '100%', resizeMode: 'cover'}}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                setProfileDetaileModal(false);
              }}
              style={{
                height: normalize(29),
                width: normalize(29),
                resizeMode: 'contain',
                position: 'absolute',
                top: normalize(0),
                right: normalize(0),
              }}>
              <Image
                source={Icons.closeIcon}
                style={{
                  height: normalize(29),
                  width: normalize(29),
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
            {MatchReducer?.matchuserdetailsResponse?.data
              ?.tiger_match_room_id !== null && (
              <TouchableOpacity
                onPress={() => {
                  setProfileDetaileModal(false),
                    props?.navigation?.navigate('MessagingRoom', {
                      room_id:
                        MatchReducer?.matchuserdetailsResponse?.data
                          ?.tiger_match_room_id,
                      name:
                        MatchReducer?.matchuserdetailsResponse?.data
                          ?.first_name +
                        ' ' +
                        MatchReducer?.matchuserdetailsResponse?.data?.last_name,
                      profile_image:
                        MatchReducer?.matchuserdetailsResponse?.data
                          ?.profile_image,
                      isblock:
                        MatchReducer?.matchuserdetailsResponse?.data
                          ?.tiger_match_is_block,
                      block_by:
                        MatchReducer?.matchuserdetailsResponse?.data
                          ?.tiger_match_block_by,
                    });
                }}
                style={{
                  alignSelf: 'flex-end',
                  paddingHorizontal: normalize(25),
                  paddingVertical: normalize(12),
                  backgroundColor: Colors.orange,
                  borderRadius: normalize(15),
                }}>
                <Text
                  style={{
                    fontSize: normalize(12),
                    fontFamily: Fonts.OpenSans_SemiBold,
                    color: Colors.white,
                  }}>
                  Message
                </Text>
              </TouchableOpacity>
            )}
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: normalize(16),
                  fontFamily: Fonts.OpenSans_SemiBold,
                  color: Colors.textBlack,
                }}>
                {MatchReducer?.matchuserdetailsResponse?.data?.first_name +
                  ' ' +
                  MatchReducer?.matchuserdetailsResponse?.data?.last_name}
              </Text>
              <Text
                style={{
                  fontSize: normalize(16),
                  fontFamily: Fonts.OpenSans_SemiBold,
                  color: '#d3d3d3',
                }}>
                {' '}
                {MatchReducer?.matchuserdetailsResponse?.data?.age}y
              </Text>
            </View>
            {MatchReducer?.matchuserdetailsResponse?.data
              ?.is_studying_in_the_university == 'Yes' && (
              <Text
                style={{
                  marginTop: normalize(4),
                  fontSize: normalize(14),
                  fontFamily: Fonts.OpenSans_Regular,
                  color: Colors.orange,
                  opacity: 0.7,
                }}>
                Class of{' '}
                {MatchReducer?.matchuserdetailsResponse?.data?.graduation_date}
              </Text>
            )}
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{marginVertical: normalize(15)}}>
              {MatchReducer?.matchuserdetailsResponse?.data?.expertise_area?.map(
                (item, index) => (
                  <View
                    style={{
                      height: normalize(35),
                      width: normalize(90),
                      borderRadius: normalize(20),
                      marginRight: normalize(10),
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 10,
                      backgroundColor: Colors.lightOrange,
                    }}>
                    <Text
                      style={{
                        fontSize: normalize(12),
                        fontFamily: Fonts.OpenSans_Regular,
                        color: Colors.orange,
                      }}
                      numberOfLines={1}>
                      {item}
                    </Text>
                  </View>
                ),
              )}
            </ScrollView>
            <Text
              style={{
                marginTop: normalize(4),
                fontSize: normalize(14),
                fontFamily: Fonts.OpenSans_Regular,
                color: Colors.textBlack,
                marginBottom: normalize(15),
              }}>
              {MatchReducer?.matchuserdetailsResponse?.data?.biography}
            </Text>

            <Text
              style={{
                fontSize: normalize(16),
                fontFamily: Fonts.OpenSans_SemiBold,
                color: Colors.textBlack,
                marginBottom: normalize(15),
              }}>
              Media
            </Text>

            <View
              style={{
                flexWrap: 'wrap',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              {tempArr?.length > 0 ? (
                <>
                  {tempArr?.map((post, index) => {
                    if (post?.post_media_details?.length > 0) {
                      return (
                        <View
                          key={index}
                          style={{
                            width: '31%', // Adjusted width for a 3x3 grid layout
                            height: normalize(105),
                            marginBottom: normalize(12),
                            borderRadius: normalize(10),
                          }}>
                          <Image
                            source={{
                              uri:
                                constants?.IMAGE_URL +
                                'post/media/' +
                                post?.post_media_details[0]?.media_url,
                            }}
                            style={{
                              width: '100%',
                              height: '100%',
                              resizeMode: 'stretch',
                              borderRadius: normalize(10),
                            }}
                          />
                        </View>
                      );
                    }
                  })}
                </>
              ) : (
                <Text
                  style={{
                    fontSize: normalize(12),
                    fontWeight: '400',
                    color: Colors.placeholder,
                  }}>
                  No Media Found
                </Text>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  function calldetails(index) {
    connectionrequest()
      .then(() => {
        dispatch(
          matchuserdetailsRequest({
            user_id: carouselist?.[index]?._id,
          }),
        );
      })
      .catch(err => {
        Toast('Please connect To Internet');
      });
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}} edges={['top']}>
      <Loader
        visible={
          MatchReducer?.status == 'Match/matchuserdetailsRequest' ||
          MatchReducer?.status == 'Match/interestuserRequest' ||
          MatchReducer?.status == 'Match/followuserRequest'
        }
      />
      {loading && (
        <View
          style={[
            {
              position: 'absolute',
              backgroundColor: 'white',
              zIndex: 999,
              top: 0,
              left: 0,
              height: Dimensions.get('screen').height,
              width: Dimensions.get('screen').width,
              alignItems: 'center',
              justifyContent: 'center',
              // margin:0,bottom:-30
            },
          ]}>
          <View
            style={{
              height: normalize(140),
              width: normalize(140),
              borderRadius: normalize(10),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}>
            <ActivityIndicator
              size={'large'}
              color={Colors.orange}></ActivityIndicator>
          </View>
        </View>
      )}
      <MyStatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <HeaderSection style={{flex: 0}} />

      <View
        style={{
          flexDirection: 'row',
          paddingTop: normalize(7),
          paddingHorizontal: normalize(15),
        }}>
        <TouchableOpacity
          style={{
            paddingRight: normalize(7),
            paddingVertical: normalize(6),
            paddingLeft: normalize(5),
            backgroundColor: 'rgba(242,124,36,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}
          onPress={() => props?.navigation?.goBack('')}>
          <Image
            source={Icons.less}
            style={{
              height: normalize(10),
              width: normalize(10),
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
        }}>
        <View style={styles.backgroundView}></View>
        {/* <TouchableOpacity
          style={{
            height: normalize(25),
            width: normalize(25),
            backgroundColor: 'rgba(242,124,36,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            position:'absolute',
            left:normalize(15),
            top:normalize(15),
            zIndex:999
          }}
          onPress={() => props?.navigation?.goBack('')}>
          <Image
            source={Icons.less}
            style={{
              height: normalize(10),
              width: normalize(10),
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity> */}
        <Carousel
          scrollEnabled={true}
          // layout={'default'}
          // layoutCardOffset={`92`}
          ref={isCarousel}
          activeSlideOffset={2}
          // ref={ref => (isCarousel.current = ref)}
          data={carouselist}
          renderItem={({item, index}) => (
            <View key={index}>
              <ImageBackground
                borderRadius={normalize(10)}
                source={
                  item?.profile_image == ''
                    ? Icons.usernoimage
                    : {
                        uri:
                          constants?.IMAGE_URL + 'user/' + item?.profile_image,
                      }
                }
                resizeMode="cover"
                blurRadius={10}
                style={{
                  height: '96%',
                  width: ITEM_WIDTH,
                  // resizeMode: '',
                  marginHorizontal: normalize(0),
                  marginTop: normalize(8),
                }}>
                <ImageBackground
                  borderRadius={normalize(10)}
                  source={
                    item?.profile_image == ''
                      ? Icons.usernoimage
                      : {
                          uri:
                            constants?.IMAGE_URL +
                            'user/' +
                            item?.profile_image,
                        }
                  }
                  resizeMode={item?.profile_image == '' ? 'contain' : 'contain'}
                  style={{
                    height: '96%',
                    width: ITEM_WIDTH,
                    // resizeMode: '',
                    marginHorizontal: normalize(0),
                    marginTop: normalize(8),
                  }}>
                  <View
                    style={[
                      styles.infoContainer,
                      {flexDirection: 'row', justifyContent: 'space-between'},
                    ]}>
                    <View style={{}}>
                      <Text style={styles.friendName}>
                        {item?.first_name + ' ' + item?.last_name}
                      </Text>
                      <Text style={styles.friendStatus}>
                        {/* {item?.is_studying_in_the_university == 'Yes'
                          ? 'Current student'
                          : ''} */}
                        {`Class of ${item?.graduation_date}`}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        setProfileDetaileModal(true);
                      }}
                      style={{
                        backgroundColor: '#F27C24',
                        height: normalize(35),
                        width: normalize(70),
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: normalize(25),
                      }}>
                      <Text style={styles.friendName}>Info</Text>
                    </TouchableOpacity>
                  </View>
                  {/* <View style={styles.bottomView}>
                    <TouchableOpacity onPress={()=>item?.createisinterest?creteinterestfunction()//Toast("You have already shown interest to this user")
                    : Toast("You are not interested in this user")} style={{width:normalize(34),
                    height:normalize(34)}}
                    
                    ><Image source={item?.createisinterest?Icons.cancel:
                      Icons.circleClose
                      
                    } style={{width:'100%',height:'100%'}} /></TouchableOpacity>
                    <TouchableOpacity onPress={()=>item?.createisinterest?Toast("You are interested in this user")
                    : creteinterestfunction()} style={{width: normalize(44),height:normalize(44),marginLeft:  normalize(3)  ,}}><Image source={
                  item?.createisinterest?
                    Icons.circleHeart:
                      Icons.greyhearticon
                      } style={{width:'100%',height:'100%',resizeMode:'cover'}} /></TouchableOpacity>
                    <TouchableOpacity onPress={() => followother()} 
                    style={{
                       marginLeft:  normalize(3)  ,
                    
                      width: normalize(34),
                      height: normalize(34),
                      // backgroundColor:"red"
                    }}>
                      <Image
                      source={item?.createisfollow ? Icons.unfriend : Icons.friendRequest}
                      style={{ width: "100%", height: "100%",resizeMode:'cover' }}
                    />
                    </TouchableOpacity>
                  </View> */}
                </ImageBackground>
              </ImageBackground>
            </View>
          )}
          sliderWidth={SLIDER_WIDTH}
          itemWidth={ITEM_WIDTH}
          onSnapToItem={index1 => {
            setCurrentIndex(index1);
            index1 <= carouselist?.length - 1 ? calldetails(index1) : null;
          }}
          useScrollView={true}
        />
      </View>

      {ProfileDetaile()}
    </SafeAreaView>
  );
};

export default TigerMatchProfile;

const styles = StyleSheet.create({
  backgroundView: {
    backgroundColor: '#d3d3d3',
    width: '97%',
    height: '80%',
    position: 'absolute',
    left: normalize(5),
    marginTop: normalize(25),
    borderRadius: normalize(15),
  },
  bottomView: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: normalize(-12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleIcon: {
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(40),
  },
  tabButton: {
    padding: normalize(10),
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(40),
    borderColor: '#F4F3F3',
    backgroundColor: Colors.white,
  },
  friendItem: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  friendContainer: {
    width: (Dimensions.get('window').width - normalize(50)) / 2,
    alignItems: 'center',
    marginTop: normalize(15),
  },

  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // backgroundColor: 'rgba(0,0,0,0.08)',
    paddingHorizontal: normalize(15),
    bottom: normalize(50),
  },
  friendName: {
    color: '#FFFFFF',
    fontSize: normalize(15),
    fontWeight: '600',
  },
  friendStatus: {
    color: 'white',
    fontSize: normalize(12),
    fontWeight: '400',
  },
});
