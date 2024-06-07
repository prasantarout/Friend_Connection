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
  BackHandler,
} from 'react-native';
import MyStatusBar from '../../utils/helpers/MyStatusBar';
import React, {useEffect, useState} from 'react';
import {Fonts, Icons} from '../../themes/ImagePath';
import normalize from '../../utils/helpers/dimen';
import {Colors} from '../../themes/Colors';
import {ImageBackground} from 'react-native';
import {Pressable} from 'react-native';
import GroupReducer, {
  groupCreatedListRequest,
  joinedgroupRequest,
  pendinggroupRequest,
} from '../../redux/reducer/GroupReducer';
import connectionrequest from '../../utils/helpers/NetInfo';
import {useDispatch, useSelector} from 'react-redux';
import {FlatList} from 'react-native-gesture-handler';
import constants from '../../utils/helpers/constants';
import {useIsFocused} from '@react-navigation/native';
import showErrorAlert from '../../utils/helpers/Toast';
import {navigationRef} from '../../utils/helpers/RootNavigation';
import Loader from '../../utils/helpers/Loader';
let status = '';
const Groups = props => {
  const [selectedButtonId, setSelectedButtonId] = useState(
    props.goToCreatedGroups ? 2 : 1,
  );
  const [value, setvalue] = useState('');
  const [item, setItem] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [search, setSearch] = useState('');
  const GroupReducer = useSelector(state => state.GroupReducer);
  const [page, setpage] = useState(1);
  // const GroupService = GroupReducer?.groupCreatedListRes?.data;
  // console.log(GroupReducer?.groupCreatedListRes, '>>>>>>response');
  const dispatch = useDispatch();
  const isFocus = useIsFocused();

  const [createdgroup, setcreatedgroup] = useState([]);
  const [pendinggroup, setpendinggroup] = useState([]);
  const [joinedgroup, setjoinedgroup] = useState([]);

  const buttonArr = [
    {
      id: 1,
      title: 'Joined',
    },

    {
      id: 3,
      title: 'Pending',
    },
    {
      id: 2,
      title: 'Created',
    },
  ];

  function getGroupList(val, pages) {
    let obj = {
      search: val,
      page: pages,
      perpage: 10,
    };
    connectionrequest()
      .then(() => {
        dispatch(groupCreatedListRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect To Internet');
      });
  }
  function getjoinedgrouplist(val, pages) {
    let obj = {
      search: val,
      page: pages,
      perpage: 20,
    };
    connectionrequest()
      .then(() => {
        dispatch(joinedgroupRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect To Internet');
      });
  }

  function getpendinggrouplist(val, pages) {
    let obj = {
      search: val,
      page: pages,
      perpage: 20,
    };
    connectionrequest()
      .then(() => {
        dispatch(pendinggroupRequest(obj));
      })
      .catch(err => {
        showErrorAlert('Please connect To Internet');
      });
  }

  useEffect(() => {
    getGroupList('', 1);
    getjoinedgrouplist('', 1);
    getpendinggrouplist('', 1);
    console.log('hello');
  }, [isFocus]);

  // useEffect(() => {
  //   if (search != '') {
  //     // Filter services when GetServices or search state changes
  //     // console.log("hello");
  //     filterServices();
  //   } else {
  //     setFilteredServices(GroupService);
  //   }
  // }, [GroupService, search]);

  // const filterServices = () => {
  //   if (!GroupService) {
  //     // Handle the case where GetServices is null or undefined
  //     setFilteredServices([]);
  //     return;
  //   }
  //   const lowerCaseSearch = search?.toLowerCase();
  //   const filtered = GroupService?.filter(item => {
  //     let groupName = item?.group_name?.toLowerCase();
  //     return groupName.slice(0, lowerCaseSearch.length) === lowerCaseSearch;
  //   });
  //   setFilteredServices(filtered);
  // };

  // console.log(filteredServices, '>>>>>>>itemData');

  if (status == '' || GroupReducer.status != status) {
    switch (GroupReducer.status) {
      case 'Group/groupCreatedListRequest':
        status = GroupReducer.status;
        break;
      case 'Group/groupCreatedListSuccess':
        status = GroupReducer.status;
        GroupReducer?.groupCreatedListRes?.page == 1
          ? setcreatedgroup(GroupReducer?.groupCreatedListRes?.data)
          : setcreatedgroup([
              ...createdgroup,
              ...GroupReducer?.groupCreatedListRes?.data,
            ]);
        // getGroupList();
        break;
      case 'Group/groupCreatedListFailure':
        status = GroupReducer.status;
        break;

      case 'Group/joinedgroupRequest':
        status = GroupReducer.status;
        break;
      case 'Group/joinedgroupSuccess':
        status = GroupReducer.status;
        // getGroupList();
        console.log(GroupReducer?.joinedgroupRes);
        GroupReducer?.joinedgroupRes?.page == 1
          ? setjoinedgroup(GroupReducer?.joinedgroupRes?.data)
          : setjoinedgroup([
              ...joinedgroup,
              ...GroupReducer?.joinedgroupRes?.data,
            ]);
        break;
      case 'Group/joinedgroupFailure':
        status = GroupReducer.status;
        break;

      case 'Group/pendinggroupRequest':
        status = GroupReducer.status;
        break;
      case 'Group/pendinggroupSuccess':
        status = GroupReducer.status;
        console.log(GroupReducer?.pendinggroupRes);
        GroupReducer?.pendinggroupRes?.page == 1
          ? setpendinggroup(GroupReducer?.pendinggroupRes?.data)
          : setpendinggroup([
              ...pendinggroup,
              ...GroupReducer?.pendinggroupRes?.data,
            ]);
        // getGroupList();
        break;
      case 'Group/pendinggroupFailure':
        status = GroupReducer.status;
        break;
    }
  }
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

  const RenderItem = ({item, index}) => {
    return (
      <View style={{marginHorizontal: normalize(20), marginTop: normalize(10)}}>
        <Pressable
          onPress={() => {
            props.navigation.navigate('GroupDetailsPage', {
              type:
                selectedButtonId == 1
                  ? 'joined'
                  : selectedButtonId == 2
                    ? 'created'
                    : 'pending',
              dataValue: item,
            });
          }}
          key={index}
          style={{
            marginBottom: index == 2 ? normalize(10) : normalize(10),
          }}>
          <ImageBackground
            source={
              item?.thumbnail !== ''
                ? {uri: constants.IMAGE_URL + '/group/' + item?.thumbnail}
                : Icons.noImage
            }
            style={{
              height: normalize(160),
              width: '100%',
              borderRadius: normalize(10),
              overflow: 'hidden',
            }}>
            {selectedButtonId == 1 ? (
              <View
                style={{
                  height: normalize(30),
                  width: normalize(55),
                  backgroundColor: Colors.orange,
                  position: 'absolute',
                  right: normalize(10),
                  top: normalize(10),
                  borderRadius: normalize(10),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: normalize(13),
                    fontFamily: Fonts.OpenSans_Medium,
                    fontWeight: '600',
                  }}>
                  Join
                </Text>
              </View>
            ) : (
              <Image
                source={Icons.messageEdit}
                style={{
                  height: normalize(25),
                  width: normalize(25),
                  position: 'absolute',
                  right: normalize(10),
                  top: normalize(10),
                }}
              />
            )}

            {/* <View
              style={{
                flexDirection: 'row',
                position: 'absolute',
                left: normalize(10),
                bottom: normalize(8),
                alignItems: 'center',
              }}>
              <Image
                source={Icons.extra4}
                style={{
                  height: normalize(30),
                  width: normalize(45),
                  resizeMode: 'contain',
                }}
              />
              <Text
                style={{
                  color: Colors.white,
                  fontSize: normalize(10),
                  fontFamily: Fonts.OpenSans_Medium,
                  fontWeight: '600',
                  marginLeft: normalize(5),
                }}>
                Jessica and 2 Connections are here
              </Text>
            </View> */}
          </ImageBackground>
          {/* details */}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: normalize(5),
            }}>
            <View style={{width: '80%'}}>
              <Text
                style={{
                  fontSize: normalize(13),
                  fontFamily: Fonts.OpenSans_SemiBold,
                  color: Colors.textBlack,
                }}>
                {item?.group_name}
              </Text>
              <Text
                style={{
                  fontSize: normalize(11),
                  fontFamily: Fonts.OpenSans_Regular,
                  color: Colors.textBlack,
                }}>
                {item?.degree} | {item?.group_moto}
              </Text>
            </View>
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
                {item?.privacy_setting}
              </Text>
            </View>
          </View>
        </Pressable>
      </View>
    );
  };
  const RenderItem1 = ({item, index}) => {
    return (
      <View style={{marginHorizontal: normalize(20), marginTop: normalize(10)}}>
        <Pressable
          onPress={() => {
            props.navigation.navigate('GroupDetailsPage', {
              type:
                selectedButtonId == 1
                  ? 'joined'
                  : selectedButtonId == 2
                    ? 'created'
                    : 'pending',
              dataValue: item,
            });
          }}
          // key={index}
          style={{
            marginBottom: index == 2 ? normalize(10) : normalize(10),
          }}>
          <ImageBackground
            source={
              item?.thumbnail !== ''
                ? {uri: constants.IMAGE_URL + '/group/' + item?.thumbnail}
                : Icons.noImage
            }
            style={{
              height: normalize(160),
              width: '100%',
              borderRadius: normalize(10),
              overflow: 'hidden',
            }}>
            {/* {selectedButtonId == 1 ? (
              <View
                style={{
                  height: normalize(30),
                  width: normalize(55),
                  backgroundColor: Colors.orange,
                  position: 'absolute',
                  right: normalize(10),
                  top: normalize(10),
                  borderRadius: normalize(10),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: Colors.white,
                    fontSize: normalize(13),
                    fontFamily: Fonts.OpenSans_Medium,
                    fontWeight: '600',
                  }}>
                  Join
                </Text>
              </View>
            ) : (
              <Image
                source={Icons.messageEdit}
                style={{
                  height: normalize(25),
                  width: normalize(25),
                  position: 'absolute',
                  right: normalize(10),
                  top: normalize(10),
                }}
              />
            )} */}

            {/* <View
              style={{
                flexDirection: 'row',
                position: 'absolute',
                left: normalize(10),
                bottom: normalize(8),
                alignItems: 'center',
              }}>
              <Image
                source={Icons.extra4}
                style={{
                  height: normalize(30),
                  width: normalize(45),
                  resizeMode: 'contain',
                }}
              />
              <Text
                style={{
                  color: Colors.white,
                  fontSize: normalize(10),
                  fontFamily: Fonts.OpenSans_Medium,
                  fontWeight: '600',
                  marginLeft: normalize(5),
                }}>
                Jessica and 2 Connections are here
              </Text>
            </View> */}
          </ImageBackground>
          {/* details */}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: normalize(5),
            }}>
            <View style={{}}>
              <Text
                style={{
                  fontSize: normalize(13),
                  fontFamily: Fonts.OpenSans_SemiBold,
                  color: Colors.textBlack,
                }}>
                {item?.group_name}
              </Text>
              <Text
                style={{
                  fontSize: normalize(11),
                  fontFamily: Fonts.OpenSans_Regular,
                  color: Colors.textBlack,
                }}>
                {item?.degree?.title} | {item?.group_moto}
              </Text>
            </View>
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
                {item?.privacy_setting}
              </Text>
            </View>
          </View>
        </Pressable>
      </View>
    );
  };
  const renderNoDataFound = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: normalize(10),
        }}>
        <Text style={{color: Colors.placeholder, fontSize: normalize(14)}}>
          No Data Found
        </Text>
      </View>
    );
  };

  function onENdFunction() {
    selectedButtonId == 1
      ? getjoinedgrouplist(search, GroupReducer?.joinedgroupRes?.page + 1)
      : selectedButtonId == 2
        ? getGroupList(search, GroupReducer?.groupCreatedListRes?.page + 1)
        : getpendinggrouplist(search, GroupReducer?.pendinggroupRes?.page + 1);
    setpage(page + 1);
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <MyStatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <Loader
        visible={
          GroupReducer?.status == 'Group/joinedgroupRequest' ||
          GroupReducer?.status == 'Group/groupCreatedListRequest' ||
          GroupReducer?.status == 'Group/pendinggroupRequest'
        }
      />
      {/* header */}
      <View style={styles.top}>
        <TouchableOpacity
          style={{
            height: normalize(20),
            width: normalize(20),
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
        <View
          style={{
            flexDirection: 'row',
            // width: 0,
          }}>
          <Text style={styles.txt}>Groups</Text>
        </View>
        {/* Horizontal line below the title and icon */}
        <View></View>
      </View>
      {/* buttons */}
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: normalize(20),
          marginTop: normalize(25),
        }}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          {buttonArr.map((item, index) => {
            return (
              <Pressable
                key={index}
                onPress={() => {
                  setpage(1),
                    setSelectedButtonId(item?.id),
                    setSearch(''),
                    item?.id == 1
                      ? getjoinedgrouplist('', 1)
                      : item?.id == 2
                        ? getGroupList('', 1)
                        : getpendinggrouplist('', 1);
                }}
                style={{
                  height: normalize(35),
                  width: normalize(70),
                  backgroundColor:
                    selectedButtonId == item.id
                      ? 'rgba(242,124,36,0.2)'
                      : 'transparent',
                  borderRadius: normalize(50),
                  marginRight: index == 2 ? 0 : normalize(5),
                  borderColor: '#F4F3F3',
                  borderWidth: normalize(1),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color:
                      selectedButtonId == item.id ? Colors.orange : '#383A46',
                    fontSize: normalize(11),
                    fontFamily: Fonts.OpenSans_Medium,
                  }}>
                  {item.title}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {selectedButtonId == 2 && (
          <Pressable
            onPress={() => props.navigation.navigate('CreatedGroup')}
            style={{
              height: normalize(35),
              width: normalize(35),
              borderRadius: normalize(20),
            }}>
            <Image
              source={Icons.circle}
              style={{height: '100%', width: '100%', resizeMode: 'cover'}}
            />
          </Pressable>
        )}
      </View>
      <View
        style={{
          height: normalize(48),
          width: '90%',
          borderRadius: normalize(12),
          borderColor: props?.focus ? Colors.orange : Colors.borderColor,
          borderWidth: normalize(1),
          marginTop: normalize(20),
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: normalize(15),
          alignSelf: 'center',
          marginBottom: normalize(8),
          justifyContent: 'space-between',
        }}>
        <View style={{width: '82%'}}>
          <TextInput
            style={{
              color: '#383A46',
              fontSize: normalize(13),
              fontFamily: Fonts.OpenSans_Regular,
            }}
            placeholder={'Search here.....'}
            placeholderTextColor="#909090"
            maxLength={props.maxLength}
            value={search}
            onChangeText={val => setSearch(val)}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            setpage(1),
              selectedButtonId == 1
                ? getjoinedgrouplist(search, 1)
                : selectedButtonId == 2
                  ? getGroupList(search, 1)
                  : getpendinggrouplist(search, 1);
          }}>
          <Image
            source={Icons.inputsearch}
            style={{
              width: normalize(15),
              height: normalize(15),
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
      </View>
      {((selectedButtonId === 1 &&
        GroupReducer?.joinedgroupRes?.data?.length === 0) ||
        (selectedButtonId === 2 &&
          GroupReducer?.groupCreatedListRes?.data?.length === 0) ||
        (selectedButtonId === 3 &&
          GroupReducer?.pendinggroupRes?.data?.length === 0)) &&
        renderNoDataFound()}
      {selectedButtonId == 2 ? (
        <FlatList
          data={
            createdgroup
            // selectedButtonId === 1
            //   ? []
            //   : selectedButtonId === 2
            //     ? filteredServices?.length > 0
            //       ? filteredServices
            //       : []
            //     : []
          }
          renderItem={RenderItem}
          keyExtractor={item => item?.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 100}}
          onEndReached={() => {
            GroupReducer.status != 'Group/groupCreatedListRequest' &&
              GroupReducer?.groupCreatedListRes?.page <
                GroupReducer?.groupCreatedListRes?.pages &&
              //  setpage(page+1),
              onENdFunction();
          }}
        />
      ) : selectedButtonId == 1 ? (
        <FlatList
          data={
            joinedgroup
            // selectedButtonId === 1
            //   ? []
            //   : selectedButtonId === 2
            //     ? filteredServices?.length > 0
            //       ? filteredServices
            //       : []
            //     : []
          }
          renderItem={RenderItem1}
          keyExtractor={item => item?.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 100}}
          onEndReached={() => {
            GroupReducer.status != 'Group/joinedgroupRequest' &&
              GroupReducer?.joinedgroupRes?.page <
                GroupReducer?.joinedgroupRes?.pages &&
              //  setpage(page+1),
              onENdFunction();
          }}
        />
      ) : (
        <FlatList
          data={
            pendinggroup
            // selectedButtonId === 1
            //   ? []
            //   : selectedButtonId === 2
            //     ? filteredServices?.length > 0
            //       ? filteredServices
            //       : []
            //     : []
          }
          renderItem={RenderItem1}
          keyExtractor={item => item?.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 100}}
          onEndReached={() => {
            GroupReducer.status != 'Group/pendinggroupRequest' &&
              GroupReducer?.pendinggroupRes?.page <
                GroupReducer?.pendinggroupRes?.pages &&
              //  setpage(page+1),
              onENdFunction();
          }}
        />
      )}

      <Pressable
        onPress={() => props.navigation.navigate('CreatedGroup')}
        style={{
          height: normalize(30),
          width: normalize(125),
          backgroundColor: Colors.orange,
          position: 'absolute',
          right: normalize(15),
          bottom: normalize(20),
          borderRadius: normalize(30),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: Colors.white,
            fontSize: normalize(13),
            fontFamily: Fonts.OpenSans_Regular,
            fontWeight: '500',
          }}>
          Create Group +
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Groups;

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Added to align the text and icon vertically
    // flex: 1,
    marginTop: Platform?.OS == 'android' ? normalize(35) : 20,
    marginHorizontal: normalize(20),
  },
  txt: {
    textAlign: 'center',
    color: '#1F2440',
    // marginTop: normalize(10),
    fontSize: 16,
    fontFamily: Fonts.OpenSans_Medium,
    fontWeight: '600',
    lineHeight: 21.79,
  },
});
