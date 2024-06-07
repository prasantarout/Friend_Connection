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
  const {statusDetails, currentIndex, allFeedList} = props.route.params;
  const scrollViewRef = useRef();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const [allStatusList, setAllStatusList] = useState([]);
  const [currentFeedStatusTotalCount, setCurrentFeedStatusTotalCount] =
    useState(allFeedList[0]?.status.length);
  const [currentFeedStatusindex, setCurrentFeedStatusindex] = useState(1);
  const [curentUserIndex, setCurentUserIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isPageBlack, setIsPageBlack] = useState(true);
  const [deleteLoader, setDeleteLoader] = useState(false);

  useEffect(() => {
    setAllStatusList(allFeedList);
  }, [allFeedList]);

  const handleScrollEnd = event => {
    const activeIndex = Math.round(event / width);
    setCurrentFeedStatusTotalCount(allStatusList[activeIndex]?.status.length);
    setCurrentFeedStatusindex(1);
    setCurentUserIndex(activeIndex);
  };
  const createCustomArry = data => {
    try {
      return Array(data)
        .fill()
        .map((_, i) => i);
    } catch (error) {
      // console.log('arrayCreate', error);
    }
  };

  const statusIncrease = () => {
    try {
      if (currentFeedStatusTotalCount != currentFeedStatusindex) {
        setCurrentFeedStatusindex(currentFeedStatusindex + 1);
      } else {
        if (curentUserIndex + 1 == allStatusList.length) {
          props.navigation.goBack();
        } else {
          scrollViewRef.current.scrollTo({
            x: (curentUserIndex + 1) * width,
            y: 0,
            animated: true,
          });
        }
      }
    } catch (error) {
      console.error('statusIncrease>>', error);
    }
  };

  const statusDecrease = () => {
    try {
      if (currentFeedStatusindex != 1) {
        setCurrentFeedStatusindex(currentFeedStatusindex - 1);
      } else {
        if (curentUserIndex - 1 == -1) {
          props.navigation.goBack();
        } else {
          scrollViewRef.current.scrollTo({
            x: (curentUserIndex - 1) * width,
            y: 0,
            animated: true,
          });
        }
      }
    } catch (error) {
      console.error('statusDecrease>>', error);
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
          if (currentFeedStatusindex == currentFeedStatusTotalCount) {
            setCurrentFeedStatusindex(currentFeedStatusindex - 1);
          } else if (currentFeedStatusindex == 1) {
            setCurrentFeedStatusindex(currentFeedStatusindex);
          }
          setCurrentFeedStatusTotalCount(currentFeedStatusTotalCount - 1);
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
                    item?.status?.[currentFeedStatusindex - 1]?.status_media,
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
                  {/* header back icon */}
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

                    {item._id == AuthReducer?.getProfileRes?.data?._id && (
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
                                  item?.status?.[currentFeedStatusindex - 1]
                                    ?._id,
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
                                currentFeedStatusindex - 1 == index
                                  ? Colors.orange
                                  : currentFeedStatusindex - 1 >= index
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
                    {item?.status?.[currentFeedStatusindex - 1]?.text !=
                      ' ' && (
                      <View
                        style={{
                          width: '100%',
                          alignItems: 'center',
                          position: 'absolute',
                          bottom: normalize(110),
                        }}>
                        {/* {console.log(
                          '>>>>>>',
                          item?.status?.[currentFeedStatusindex - 1]?.color,
                        )} */}
                        <Text
                          style={{
                            color:
                              item?.status?.[currentFeedStatusindex - 1]?.color,
                            fontFamily:
                              item?.status?.[currentFeedStatusindex - 1]?.font,
                            fontSize: normalize(16),
                          }}>
                          {item?.status?.[currentFeedStatusindex - 1]?.text}
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
                              maxWidth: normalize(200),
                              backgroundColor: 'green',
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
                        {item?.status?.[currentFeedStatusindex - 1]?.title != ''
                          ? item?.status?.[currentFeedStatusindex - 1]?.title
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
                          {item?.status?.[currentFeedStatusindex - 1]?.tags
                            .length > 0
                            ? item?.status?.[
                                currentFeedStatusindex - 1
                              ]?.tags.map((tagItem, tagIndex) => {
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
                                    {item?.status?.[currentFeedStatusindex - 1]
                                      ?.tags.length -
                                      1 !=
                                      tagIndex && ' '}
                                  </Text>
                                );
                              })
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
                        {item?.status?.[currentFeedStatusindex - 1]
                          ?.description != ''
                          ? item?.status?.[currentFeedStatusindex - 1]
                              ?.description
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
