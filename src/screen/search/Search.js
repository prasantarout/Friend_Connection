import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  FlatList,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MyStatusBar from '../../utils/helpers/MyStatusBar';
import {Fonts, Icons} from '../../themes/ImagePath';
import normalize from '../../utils/helpers/dimen';
import {Colors} from '../../themes/Colors';
import TextInputItem from '../../components/TextInput';
import TextInputmultiple from '../../components/TextInputmultiple';
import ButtonCom from '../../components/ButtonCom';
import {SafeAreaView} from 'react-native';
import {ImageBackground} from 'react-native';
import connectionrequest from '../../utils/helpers/NetInfo';
import {tigerFriendSuggestionByProfileRequest} from '../../redux/reducer/FriendReducer';
import {useDispatch, useSelector} from 'react-redux';
import FriendCard from '../../components/FriendCard';
import {
  classListRequest,
  degreeListRequest,
  streamListRequest,
} from '../../redux/reducer/AuthReducer';
let status = '';
import Toast from '../../utils/helpers/Toast';
import {useIsFocused} from '@react-navigation/native';
import SearchPicker from '../../components/SearchPicker';
const Search = props => {
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const FriendReducer = useSelector(state => state.FriendReducer);
  const [subject, setSubject] = useState('');
  const [isSubjectFocus, setIsSubjectFocus] = useState(false);
  const [statement, setStatement] = useState('');
  const [isStatementFocus, setIsStatementFocus] = useState(false);
  const [value, setvalue] = useState('');
  const [suggestionfriend, setsuggestionfriend] = useState([]);
  const isFocused = useIsFocused();
  const [selected, setselected] = useState('');
  const [modalVisible, setmodalVisible] = useState(false);
  const [selectid, setselectid] = useState(null);

  const [selectededucation, setselectededucation] = useState('');
  const [educationmodalVisible, seteducationmodalVisible] = useState(false);
  const [educationselectid, seteducationselectid] = useState(null);

  const [stream, setstream] = useState('');
  const [streammodal, setstreammodal] = useState(false);
  const [streamid, setstreamid] = useState(null);
  // console.log(AuthReducer?.classListRes?.data  );

  const [data, setdata] = useState([
    {
      img: Icons.user1,
      headtxt: 'Jessie Cameron',
      txt: 'Class of 2018 Graduate',
      mobile: '+1 000 222 1232',
    },
    {
      img: Icons.user,
      headtxt: 'Maria Brooklyn',
      txt: 'Class of 2018 Graduate',
      mobile: '+1 000 222 1232',
    },
    {
      img: Icons.user2,
      headtxt: 'Jaime Martinez',
      txt: 'Class of 2018 Graduate',
      mobile: '+1 000 222 1232',
    },
    {
      img: Icons.userimg,
      headtxt: 'Rossy Melon',
      txt: 'Class of 2018 Graduate',
      mobile: '+1 000 222 1232',
    },
    {
      img: Icons.user1,
      headtxt: 'Jessie Cameron',
      txt: 'Class of 2018 Graduate',
      mobile: '+1 000 222 1232',
    },
    {
      img: Icons.user,
      headtxt: 'Maria Brooklyn',
      txt: 'Class of 2018 Graduate',
      mobile: '+1 000 222 1232',
    },
    {
      img: Icons.user2,
      headtxt: 'Jaime Martinez',
      txt: 'Class of 2018 Graduate',
      mobile: '+1 000 222 1232',
    },
    {
      img: Icons.userimg,
      headtxt: 'Rossy Melon',
      txt: 'Class of 2018 Graduate',
      mobile: '+1 000 222 1232',
    },
  ]);

  function renderItem({item, index}) {
    return (
      <View style={{width: '48%', marginTop: normalize(15)}}>
        <ImageBackground
          source={item?.img}
          style={{
            width: '100%',
            height: normalize(140),
            borderRadius: normalize(10),
            overflow: 'hidden',
          }}>
          <ImageBackground
            source={Icons.imageback}
            style={{
              width: '100%',
              height: normalize(70),
              resizeMode: 'stretch',
              position: 'absolute',
              bottom: 0,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'flex-end',
                width: '100%',
                position: 'absolute',
                bottom: normalize(10),
              }}>
              <ImageBackground
                style={{
                  width: normalize(55),
                  height: normalize(25),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: normalize(15),
                  overflow: 'hidden',
                }}
                source={Icons.Whiteborder}>
                <Text
                  style={{
                    color: Colors.white,
                    fontFamily: Fonts.OpenSans_Medium,
                    fontSize: normalize(11),
                  }}>
                  Science
                </Text>
              </ImageBackground>
              <ImageBackground
                style={{
                  width: normalize(55),
                  height: normalize(25),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: normalize(15),
                  overflow: 'hidden',
                  marginLeft: normalize(5),
                }}
                source={Icons.Whiteborder}>
                <Text
                  style={{
                    color: Colors.white,
                    fontFamily: Fonts.OpenSans_Medium,
                    fontSize: normalize(11),
                  }}>
                  Zoology
                </Text>
              </ImageBackground>
            </View>
          </ImageBackground>
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: normalize(10),
              top: normalize(10),
            }}>
            <Image
              source={Icons.friends}
              style={{
                width: normalize(20),
                height: normalize(20),
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
        </ImageBackground>

        <Text
          style={{
            fontFamily: Fonts.OpenSans_Medium,
            color: Colors.black,
            fontSize: normalize(12),
            textTransform: 'capitalize',
            marginTop: normalize(4),
          }}>
          {item?.headtxt}
        </Text>
        <Text
          style={{
            fontFamily: Fonts.OpenSans_Regular,
            color: '#1F2440',
            fontSize: normalize(10),
            lineHeight: normalize(18),
          }}>
          {item?.txt}
        </Text>
        <Text
          style={{
            fontFamily: Fonts.OpenSans_Regular,
            fontSize: normalize(10),
            color: '#A0A0A0',
          }}>
          {item?.mobile}
        </Text>
      </View>
    );
  }
  useEffect(() => {
    let data = {
      search: '',
      page: 1,
      perpage: 10,
    };
    connectionrequest()
      .then(() => {
        dispatch(tigerFriendSuggestionByProfileRequest(data));
        dispatch(classListRequest());
        dispatch(degreeListRequest());
        dispatch(streamListRequest());
      })
      .catch(err => {
        Toast('Please connect To Internet');
      });
  }, [isFocused]);
  if (status == '' || FriendReducer.status != status) {
    switch (FriendReducer.status) {
      case 'Friend/tigerFriendSuggestionByProfileRequest':
        status = FriendReducer.status;
        console.log('hihihihihihihi');

      case 'Friend/tigerFriendSuggestionByProfileSuccess':
        status = FriendReducer.status;
        console.log(FriendReducer?.frindSuggestionByProfileRes?.data);
        setsuggestionfriend(FriendReducer?.frindSuggestionByProfileRes?.data);
        break;
    }
  }

  function searchfunction() {
    let data = {
      search: value?.trim(),
      page: 1,
      perpage: 10,
      // class: selectid,
      degree: educationselectid,
      education_stream: streamid,

      // degree: '',
      // education_stream: '',
    };
    console.log(data, 'Dsadkasjdd');
    // return
    connectionrequest()
      .then(() => {
        console.log(data);
        dispatch(tigerFriendSuggestionByProfileRequest(data));
      })
      .catch(err => {
        Toast('Please connect To Internet');
      });
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <MyStatusBar backgroundColor={'white'} barStyle={'dark-content'} />
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
          <Text style={styles.txt}>Search</Text>
        </View>
        {/* Horizontal line below the title and icon */}
        <View></View>
      </View>
      {/* <View style={styles.horizontalLine}></View> */}
      <View
        style={{
          height: normalize(40),
          width: '90%',
          borderRadius: normalize(12),
          // backgroundColor: props.backgroundColor,
          borderColor: Colors.borderColor,
          borderWidth: normalize(1),
          marginTop: normalize(20),
          // marginBottom: props.marginBottom,
          // marginVertical: props.marginVertical,
          // padding: normalize(11),
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: normalize(15),
          alignSelf: 'center',
          paddingRight: normalize(3),
        }}>
        <TouchableOpacity
          onPress={() => searchfunction()}
          style={{marginRight: normalize(5)}}>
          <Image
            source={Icons.inputsearch}
            style={{
              width: normalize(15),
              height: normalize(15),
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
        <View style={{width: '82%', justifyContent: 'center'}}>
          <TextInput
            style={{
              color: '#383A46',
              fontSize: normalize(12),
              fontFamily: Fonts.OpenSans_Regular,
              height: '100%',
              // fontWeight: '600',
            }}
            placeholder={'Search here.....'}
            placeholderTextColor="#909090"
            value={value}
            // maxLength={props.maxLength}
            onChangeText={text => {
              setvalue(text);
            }}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: normalize(15),
          // width: '90%',
          marginHorizontal: normalize(22),
          alignSelf: 'center',
          gap: normalize(10),
          marginBottom: normalize(8),
        }}>
        {/* <TouchableOpacity
          onPress={() => setmodalVisible(true)}
          style={{
            width: '32%',
            height: normalize(30),
            borderWidth: 1,
            borderColor: Colors.borderColor,
            borderRadius: normalize(15),
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: normalize(8),
          }}>
          <Text
            style={{
              color: '#383A46',
              fontFamily: Fonts.OpenSans_Regular,
              fontSize: normalize(11),
              // backgroundColor:'red',
              width:normalize(55)
            }}>
            {selected == '' ? 'Class Of' : selected}
          </Text>
          <Image
            source={Icons.downArr}
            style={{
              width: normalize(14),
              height: normalize(14),
              resizeMode: 'contain',
              tintColor: '#383A46',
            }}
          />
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => setstreammodal(true)}
          style={{
            width: '50%',
            height: normalize(30),
            borderWidth: 1,
            borderColor: Colors.borderColor,
            borderRadius: normalize(15),
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: normalize(8),
          }}>
          <Text
            style={{
              color: '#383A46',
              fontFamily: Fonts.OpenSans_Regular,
              fontSize: normalize(11),
              // backgroundColor:'red',
              width: normalize(55),
            }}
            numberOfLines={1}
            >
            {stream == '' ? 'Major' : stream}
          </Text>
          <Image
            source={Icons.downArr}
            style={{
              width: normalize(14),
              height: normalize(14),
              resizeMode: 'contain',
              tintColor: '#383A46',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => seteducationmodalVisible(true)}
          style={{
            width: '50%',
            height: normalize(30),
            borderWidth: 1,
            borderColor: Colors.borderColor,
            borderRadius: normalize(15),
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: normalize(8),
          }}>
          <Text
            style={{
              color: '#383A46',
              fontFamily: Fonts.OpenSans_Regular,
              fontSize: normalize(11),
              // backgroundColor:'red',
              width: normalize(55),
            }}>
            {selectededucation == '' ? 'Education' : selectededucation}
          </Text>
          <Image
            source={Icons.downArr}
            style={{
              width: normalize(14),
              height: normalize(14),
              resizeMode: 'contain',
              tintColor: '#383A46',
            }}
          />
        </TouchableOpacity>
      </View>

      <View style={{marginHorizontal: normalize(15)}}>
        <FlatList
          data={suggestionfriend}
          // data={suggestedFriend}
          ListEmptyComponent={() => (
            <Text style={styles.noData}>No Data found</Text>
          )}
          numColumns={2}
          contentContainerStyle={{paddingBottom: normalize(250)}}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{
            justifyContent: 'space-between',
          }}
          renderItem={({item, index}) => (
            <FriendCard type="Suggestion" item={item} index={index} />
          )}
        />
      </View>
      <SearchPicker
        backgroundColor={Colors.white}
        dataList={AuthReducer?.classListRes?.data}
        modalVisible={modalVisible}
        onBackdropPress={() => setmodalVisible(false)}
        search={false}
        rendertopdata={
          <TouchableOpacity
            onPress={() => {
              setselected('All');
              setmodalVisible(false);
              setselectid(null);
            }}
            style={[
              styles.dropDownItem,
              {
                backgroundColor: selected == 'All' ? Colors.blue : null,
                borderColor: Colors.lightGrey,
              },
            ]}>
            <Text
              style={[
                styles.dropDownItemText,
                {
                  color: selected == 'All' ? Colors.white : Colors.black,
                },
                // height == item.feet ? {color: Colors.red} : null,
              ]}>
              {'All'}
            </Text>
          </TouchableOpacity>
        }
        renderData={({item, index}) => {
          // console.log(item.txt);
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setselected(item.title);
                setmodalVisible(false);
                setselectid(item?._id);
                // console.log(item.id);
                // sortfunction(item.name)
                // dispatch(getcityAction(item._id));
                //setstateid(item._id);
              }}
              style={[
                styles.dropDownItem,
                {
                  backgroundColor: selected == item.title ? Colors.blue : null,
                  borderColor: Colors.lightGrey,
                },
              ]}>
              <Text
                style={[
                  styles.dropDownItemText,
                  {
                    color: selected == item.title ? Colors.white : Colors.black,
                  },
                  // height == item.feet ? {color: Colors.red} : null,
                ]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
      <SearchPicker
        backgroundColor={Colors.white}
        dataList={AuthReducer?.degreeListRes?.data}
        modalVisible={educationmodalVisible}
        onBackdropPress={() => seteducationmodalVisible(false)}
        search={false}
        rendertopdata={
          <TouchableOpacity
            onPress={() => {
              setselectededucation('All');
              seteducationmodalVisible(false);
              seteducationselectid(null);
            }}
            style={[
              styles.dropDownItem,
              {
                backgroundColor:
                  selectededucation == 'All' ? Colors.blue : null,
                borderColor: Colors.lightGrey,
              },
            ]}>
            <Text
              style={[
                styles.dropDownItemText,
                {
                  color:
                    selectededucation == 'All' ? Colors.white : Colors.black,
                },
                // height == item.feet ? {color: Colors.red} : null,
              ]}>
              {'All'}
            </Text>
          </TouchableOpacity>
        }
        renderData={({item, index}) => {
          // console.log(item.txt);
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setselectededucation(item.title);
                seteducationmodalVisible(false);
                seteducationselectid(item?._id);
                // console.log(item.id);
                // sortfunction(item.name)
                // dispatch(getcityAction(item._id));
                //setstateid(item._id);
              }}
              style={[
                styles.dropDownItem,
                {
                  backgroundColor:
                    selectededucation == item.title ? Colors.blue : null,
                  borderColor: Colors.lightGrey,
                },
              ]}>
              <Text
                style={[
                  styles.dropDownItemText,
                  {
                    color:
                      selectededucation == item.title
                        ? Colors.white
                        : Colors.black,
                  },
                  // height == item.feet ? {color: Colors.red} : null,
                ]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <SearchPicker
        backgroundColor={Colors.white}
        dataList={AuthReducer?.streamListRes?.data}
        modalVisible={streammodal}
        onBackdropPress={() => setstreammodal(false)}
        search={false}
        rendertopdata={
          <TouchableOpacity
            onPress={() => {
              setstream('All');
              setstreammodal(false);
              setstreamid(null);
            }}
            style={[
              styles.dropDownItem,
              {
                backgroundColor: stream == 'All' ? Colors.blue : null,
                borderColor: Colors.lightGrey,
              },
            ]}>
            <Text
              style={[
                styles.dropDownItemText,
                {
                  color: stream == 'All' ? Colors.white : Colors.black,
                },
                // height == item.feet ? {color: Colors.red} : null,
              ]}>
              {'All'}
            </Text>
          </TouchableOpacity>
        }
        renderData={({item, index}) => {
          // console.log(item.txt);
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setstream(item.title);
                setstreammodal(false);
                setstreamid(item?._id);
                // console.log(item.id);
                // sortfunction(item.name)
                // dispatch(getcityAction(item._id));
                //setstateid(item._id);
              }}
              style={[
                styles.dropDownItem,
                {
                  backgroundColor: stream == item.title ? Colors.blue : null,
                  borderColor: Colors.lightGrey,
                },
              ]}>
              <Text
                style={[
                  styles.dropDownItemText,
                  {
                    color: stream == item.title ? Colors.white : Colors.black,
                  },
                  // height == item.feet ? {color: Colors.red} : null,
                ]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};
export default Search;

const styles = StyleSheet.create({
  dropDownItem: {
    borderWidth: 1,
    marginTop: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
    height: normalize(40),
    width: '80%',
    alignSelf: 'center',
  },
  dropDownItemText: {
    fontSize: normalize(14),
    lineHeight: normalize(14),
  },
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
  horizontalLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#F4F3F3', // You can change the color to your preference
    width: '100%', // Make the line cover the whole width
    marginTop: normalize(10), // Adjust the margin based on your design
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
  noData: {
    marginTop: '50%',
    textAlign: 'center',
    fontSize: normalize(14),
    fontWeight: '700',
    fontFamily: Fonts.OpenSans_Light,
    color: Colors.lightGrey,
  },
});
