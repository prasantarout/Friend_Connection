import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  TextInput,
  SafeAreaView,
  ScrollView,
  Dimensions,
  FlatList,
  ImageBackground,
  StatusBar,
  Pressable,
  ActivityIndicator,
  Alert,
  BackHandler,
} from 'react-native';
import React, {Fragment, useEffect, useRef, useState} from 'react';
import {Fonts, Icons} from '../../themes/ImagePath';
import normalize from '../../utils/helpers/dimen';
import {Colors} from '../../themes/Colors';
import constants from '../../utils/helpers/constants';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {navigationRef} from '../../utils/helpers/RootNavigation';
const {width, height} = Dimensions.get('screen');
export default function StoryDetailsPage(props) {
  const {currentIndex, allFeedList} = props.route.params;
  const scrollViewRef = useRef();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const [allStatusList, setAllStatusList] = useState([]);
  const [currentFeedStatusTotalCount, setCurrentFeedStatusTotalCount] =
    useState(allFeedList[currentIndex]?.status.length);
  const [currentFeedStatusindex, setCurrentFeedStatusindex] = useState(0);
  const [curentUserIndex, setCurentUserIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isPageBlack, setIsPageBlack] = useState(true);
  const [deleteLoader, setDeleteLoader] = useState(false);

  useEffect(() => {
    setCurrentFeedStatusTotalCount(allFeedList[currentIndex]?.status?.length);
    setAllStatusList(allFeedList);
  }, [allFeedList]);

  const handleScrollEnd = event => {
    const activeIndex = Math.round(event / width);
    setCurrentFeedStatusTotalCount(allStatusList[activeIndex]?.status?.length);
    setCurrentFeedStatusindex(0);
    setCurentUserIndex(activeIndex);
  };
  const createCustomArry = data => {
    try {
      return Array(data)
        .fill()
        .map((_, i) => i);
    } catch (error) {
      console.log('arrayCreate', error);
    }
  };
  const statusIncrease = () => {
    try {
      if (currentFeedStatusTotalCount - 1 != currentFeedStatusindex) {
        let b = currentFeedStatusindex + 1;
        setCurrentFeedStatusindex(b);
      } else {
        if (curentUserIndex + 1 == allStatusList.length) {
          props.navigation.goBack();
        } else {
          let a = curentUserIndex + 1;
          setCurentUserIndex(a);
          setCurrentFeedStatusindex(0);
          setCurrentFeedStatusTotalCount(allStatusList[a]?.status?.length);
          scrollViewRef.current.scrollTo({
            x: a * width,
            y: 0,
            animated: true,
          });
        }
      }
    } catch (error) {
      console.error('statussIncrease>>', error);
    }
  };
  const statusDecrease = () => {
    try {
      if (currentFeedStatusindex != 0) {
        let b = currentFeedStatusindex - 1;
        setCurrentFeedStatusindex(b);
      } else {
        if (curentUserIndex - 1 == -1) {
          props.navigation.goBack();
        } else {
          let a = curentUserIndex - 1;
          setCurentUserIndex(a);
          setCurrentFeedStatusindex(0);
          setCurrentFeedStatusTotalCount(allStatusList[a]?.status?.length);
          scrollViewRef.current.scrollTo({
            x: (curentUserIndex - 1) * width,
            y: 0,
            animated: true,
          });
        }
      }
    } catch (error) {
      console.error('statussDecrease>>', error);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current.scrollTo({
        x: currentIndex * width,
        y: 0,
        animated: true,
      });
    }, 0);
  }, [currentIndex]);

  useEffect(() => {
    setTimeout(() => {
      setIsPageBlack(false);
      setCurentUserIndex(currentIndex);
    }, 250);
  }, [currentIndex]);

  const onPressDeleteStatus = async id => {
    try {
      setDeleteLoader(true);
      let token = await AsyncStorage.getItem(constants?.TOKEN);
      let headers = {
        'x-access-token': token,
      };
      let response = await axios.delete(`${constants.BASE_URL}/status/delete`, {
        headers,
        data: {
          status_id: id,
        },
      });

      // console.log('response>>', response.data);
      if (response.data.status == 200) {
        setDeleteLoader(false);
        if (allStatusList[0]?.status?.length == 1) {
          props.navigation.goBack();
        } else {
          deleteStatusTemp(id);
        }
      } else {
        setDeleteLoader(false);
      }
    } catch (error) {
      setDeleteLoader(false);
      console.error('onPressDeleteStatus>>>', error);
    }
  };
  const deleteStatusTemp = id => {
    try {
      let oldArr = allStatusList;
      let newArr = [];
      oldArr.map((item, index) => {
        if (index == 0) {
          let oldStatusArr = item?.status;
          let newStatusArr = [];

          oldStatusArr.map((statusItem, statusIndex) => {
            if (statusItem._id != id) {
              newStatusArr.push(statusItem);
            }
          });
          item.status = newStatusArr;
          newArr.push({...item, status: newStatusArr});

          if (currentFeedStatusindex == currentFeedStatusTotalCount - 1) {
            let a = currentFeedStatusindex - 1;
            setCurrentFeedStatusindex(a);
          } else if (currentFeedStatusindex == 0) {
            setCurrentFeedStatusindex(0);
          }
          let d = currentFeedStatusTotalCount - 1;
          setCurrentFeedStatusTotalCount(d);
        } else {
          newArr.push(item);
        }
      });
      setAllStatusList(newArr);
    } catch (error) {
      console.error('deleteStatusTemp>>>', error);
    }
  };
  const handleBackButton = () => {
    if (navigationRef.current && navigationRef.current.canGoBack()) {
      navigationRef.current.goBack();
      return true;
    }
    return false; // Default behavior (app closing)
  };
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );

    return () => backHandler.remove();
  }, []);
  return (
    <View
      style={{
        height: height,
        width: width,
        opacity: isPageBlack ? 0 : 1,
      }}>
      <StatusBar backgroundColor={'transparent'} translucent />
      <ScrollView
        ref={scrollViewRef}
        pagingEnabled
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={() => {
          setIsScrolling(true);
        }}
        onScrollEndDrag={() => {
          setIsScrolling(false);
        }}
        onMomentumScrollEnd={e =>
          handleScrollEnd(e.nativeEvent.contentOffset.x)
        }>
        {allStatusList.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                height: height,
                width: width,
              }}>
              <ImageBackground
                source={{
                  uri:
                    constants.IMAGE_URL +
                    'status/media/' +
                    item?.status?.[currentFeedStatusindex]?.status_media,
                }}
                resizeMode="contain"
                style={{
                  height: '100%',
                  width: '100%',
                }}>
                <View
                  style={{
                    flex: 1,
                    paddingBottom: normalize(15),
                  }}>
                  {/* header back and delete icon */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      opacity: isScrolling ? 0 : 1,
                      marginHorizontal: normalize(15),
                      marginTop: normalize(50),
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        props.navigation.goBack();
                      }}
                      style={styles.headerIconContainer}>
                      <Image
                        source={Icons.rightBack}
                        style={styles.headerIcon}
                      />
                    </TouchableOpacity>
                    {/* {item._id == AuthReducer?.getProfileRes?.data?._id && ( */}
                    {item.user_id && (
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert('Delete!', 'Are you sure?', [
                            {
                              text: 'Cancel',
                              onPress: () => {},
                              style: 'cancel',
                            },
                            {
                              text: 'Delete',
                              onPress: () => {
                                onPressDeleteStatus(
                                  item?.status?.[currentFeedStatusindex]?._id,
                                );
                              },
                            },
                          ]);
                        }}
                        style={[
                          [
                            styles.headerIconContainer,
                            {
                              backgroundColor: Colors.orange,
                            },
                          ],
                        ]}>
                        <Image
                          source={Icons.delete}
                          style={[
                            styles.headerIcon,
                            {
                              height: '60%',
                              width: '60%',
                              tintColor: Colors.white,
                            },
                          ]}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  {/* status count indicator */}
                  <View
                    style={{
                      width: width,
                      height: normalize(3),
                      // backgroundColor: 'red',
                      marginBottom: normalize(10),
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      opacity: isScrolling ? 0 : 1,
                      marginTop: normalize(10),
                    }}>
                    {createCustomArry(currentFeedStatusTotalCount).map(
                      (item, index) => {
                        return (
                          <View
                            key={index}
                            style={{
                              width:
                                currentFeedStatusTotalCount > 1
                                  ? `${98 / currentFeedStatusTotalCount}%`
                                  : '100%',
                              height: '100%',
                              backgroundColor:
                                currentFeedStatusindex == index
                                  ? Colors.orange
                                  : currentFeedStatusindex >= index
                                    ? Colors.orange
                                    : 'white',
                              borderRadius: normalize(5),
                            }}
                          />
                        );
                      },
                    )}
                  </View>
                  {/* status change by this section */}
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                    }}>
                    {item?.status?.[currentFeedStatusindex]?.text != ' ' && (
                      <View
                        style={{
                          width: '100%',
                          alignItems: 'center',
                          position: 'absolute',
                          bottom: normalize(110),
                        }}>
                        <Text
                          style={{
                            color:
                              item?.status?.[currentFeedStatusindex]?.color ==
                                undefined ||
                              item?.status?.[currentFeedStatusindex]?.color ==
                                ''
                                ? 'yellow'
                                : item?.status?.[currentFeedStatusindex]?.color,
                            fontFamily:
                              item?.status?.[currentFeedStatusindex]?.font,
                            fontSize: normalize(16),
                          }}>
                          {item?.status?.[currentFeedStatusindex]?.text}
                        </Text>
                      </View>
                    )}

                    <Pressable
                      disabled={isScrolling}
                      onPress={statusDecrease}
                      style={{flex: 1}}
                    />
                    <Pressable
                      disabled={isScrolling}
                      onPress={statusIncrease}
                      style={{flex: 1}}
                    />
                  </View>
                  {/* status details */}
                  <View
                    style={{
                      marginHorizontal: normalize(15),
                      position: 'absolute',
                      bottom: normalize(20),
                    }}>
                    <View style={{}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginBottom: normalize(10),
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          {/* profile image  */}
                          <View
                            style={{
                              height: normalize(31),
                              width: normalize(31),
                              borderRadius: normalize(31) / 2,
                              overflow: 'hidden',
                              borderColor: Colors.white,
                              borderWidth: normalize(1),
                              backgroundColor: Colors.white,
                            }}>
                            <Image
                              source={
                                item.profile_image !== ''
                                  ? {
                                      uri:
                                        constants.IMAGE_URL +
                                        'user/' +
                                        item.profile_image,
                                    }
                                  : Icons.usernoimage
                              }
                              style={{
                                height: '100%',
                                width: '100%',
                                resizeMode: 'cover',
                              }}
                            />
                          </View>
                          <Text
                            numberOfLines={1}
                            style={{
                              marginLeft: normalize(5),
                              fontSize: normalize(13),
                              fontFamily: Fonts.OpenSans_SemiBold,
                              color: Colors.white,
                              width: normalize(130),
                              // backgroundColor: 'green',
                            }}>
                            {item?.full_name}
                          </Text>
                        </View>
                      </View>
                      {/* title */}
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: normalize(16),
                          fontFamily: Fonts.OpenSans_SemiBold,
                          color: Colors.white,
                        }}>
                        {item?.status?.[currentFeedStatusindex]?.title != ''
                          ? item?.status?.[currentFeedStatusindex]?.title
                          : ' '}
                      </Text>
                      {/* Hash tag */}
                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          marginVertical: 0,
                        }}>
                        <Text
                          numberOfLines={2}
                          style={{
                            fontSize: normalize(11),
                            fontFamily: Fonts.OpenSans_SemiBold,
                          }}>
                          {item?.status?.[currentFeedStatusindex]?.tags.length >
                          0
                            ? item?.status?.[currentFeedStatusindex]?.tags.map(
                                (tagItem, tagIndex) => {
                                  return (
                                    <Text
                                      key={tagIndex}
                                      numberOfLines={1}
                                      style={{
                                        fontSize: normalize(11),
                                        fontFamily: Fonts.OpenSans_SemiBold,
                                        color: Colors.orange,
                                      }}>
                                      #{tagItem}
                                      {item?.status?.[currentFeedStatusindex]
                                        ?.tags.length -
                                        1 !=
                                        tagIndex && ' '}
                                    </Text>
                                  );
                                },
                              )
                            : ' '}
                        </Text>
                      </View>
                      {/* describtion */}
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: normalize(13),
                          fontFamily: Fonts.OpenSans_Regular,
                          color: Colors.white,
                          opacity: 0.8,
                        }}>
                        {item?.status?.[currentFeedStatusindex]?.description !=
                        ''
                          ? item?.status?.[currentFeedStatusindex]?.description
                          : ' '}
                      </Text>
                    </View>
                  </View>
                </View>
              </ImageBackground>
            </View>
          );
        })}
      </ScrollView>
      {deleteLoader && (
        <View style={styles.activityIndicator}>
          <ActivityIndicator size={'large'} color={Colors.orange} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  activityIndicator: {
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
    backgroundColor: 'rgba(0,0,0,0.8)',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconContainer: {
    height: normalize(23),
    width: normalize(23),
    backgroundColor: 'rgba(256,256,256,0.4)',
    borderRadius: normalize(7),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    height: '40%',
    width: '40%',
    resizeMode: 'contain',
  },
});
