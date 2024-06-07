import React from 'react';
import {Dimensions, Image, Platform, StatusBar, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import normalize from '../utils/helpers/dimen';
import Home from '../screen/Home/Home';
import MyProfile from '../screen/profile/MyProfile';
import AddPostCreatePostStep1 from '../screen/post/AddPostCreatePostStep1';
import TigerMatch from '../screen/tigerMatch/TigerMatch';
import Groups from '../screen/groups/Groups';
import {Icons} from '../themes/ImagePath';
import {Colors} from '../themes/Colors';
import Friend from '../screen/friendAndRequest/Friend';
import TigerMatchProfile from '../screen/tigerMatch/TigerMatchProfile';
import {createStackNavigator} from '@react-navigation/stack';
const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    // <View
    //   style={{
    //     width: Dimensions.get('window').width,
    //     height:
    //       Platform.OS == 'android'
    //         ? Dimensions.get('window').height
    //         : Dimensions.get('window').height,
    //   }}>
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={{
        // keyboardHidesTabBar: true,
        // tabBarHideOnKeyboard: true,
        unmountOnBlur: true,
        showIcon: true,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors.white,
          // borderTopRightRadius: normalize(10),
          height: Platform.OS === 'android' ? normalize(60) : normalize(70),
          borderTopWidth: 1,
          borderTopColor: Colors.placeholder,
          paddingBottom:
            Platform.OS === 'android' ? normalize(5) : normalize(25),
          // borderTopLeftRadius: normalize(10),
        },
        labelStyle: {
          fontSize: normalize(10),
          fontWeight: 'bold',
          // marginTop: 0,
          // padding: 0,
          //   fontFamily: getFont('reg'),
        },
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({focused}) => {
            return (
              <>
                <View
                  style={{
                    backgroundColor: focused
                      ? 'rgba(242,124,36,0.2)'
                      : Colors.white,
                    padding: normalize(10),
                    marginTop: Platform.OS === 'ios' ? normalize(10) : 0,
                    borderRadius: normalize(10),
                  }}>
                  <Image
                    style={{
                      height: normalize(20),
                      width: normalize(20),
                      tintColor: focused ? '#F27C24' : '#292D32',
                      //   zIndex:1
                    }}
                    // source={focused ? Icons.homeactive : Icons.home}
                    source={focused ? Icons.home : Icons.home}
                    resizeMode="contain"
                  />
                </View>
              </>
            );
          },
        }}
      />
      <Tab.Screen
        name="TigerMatchStackScreen"
        component={TigerMatchStackScreen}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({focused}) => {
            return (
              <>
                <View
                  style={{
                    backgroundColor: focused
                      ? 'rgba(242,124,36,0.2)'
                      : Colors.white,
                    padding: normalize(10),
                    marginTop: Platform.OS === 'ios' ? normalize(10) : 0,
                    borderRadius: normalize(10),
                  }}>
                  <Image
                    style={{
                      height: normalize(20),
                      width: normalize(20),
                      tintColor: focused ? '#F27C24' : '#292D32',
                      //   zIndex:1
                    }}
                    // source={focused ? Icons.homeactive : Icons.home}
                    source={focused ? Icons.element : Icons.element}
                    resizeMode="contain"
                  />
                </View>
              </>
            );
          },
        }}
      />
      <Tab.Screen
        name="AddPostCreatePostStep1"
        component={AddPostCreatePostStep1}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({focused}) => {
            return (
              <>
                <View
                  style={{
                    backgroundColor: focused
                      ? 'rgba(242,124,36,0.2)'
                      : Colors.white,
                    padding: normalize(10),
                    marginTop: Platform.OS === 'ios' ? normalize(10) : 0,
                    borderRadius: normalize(10),
                  }}>
                  <Image
                    style={{
                      height: normalize(20),
                      width: normalize(20),
                      tintColor: focused ? '#F27C24' : '#292D32',
                      //   zIndex:1
                    }}
                    // source={focused ? Icons.homeactive : Icons.home}
                    source={focused ? Icons.groups : Icons.groups}
                    resizeMode="contain"
                  />
                </View>
              </>
            );
          },
        }}
      />
      <Tab.Screen
        name="Friend"
        component={Friend}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({focused}) => {
            return (
              <>
                <View
                  style={{
                    backgroundColor: focused
                      ? 'rgba(242,124,36,0.2)'
                      : Colors.white,
                    padding: normalize(10),
                    marginTop: Platform.OS === 'ios' ? normalize(10) : 0,
                    borderRadius: normalize(10),
                  }}>
                  <Image
                    style={{
                      height: normalize(20),
                      width: normalize(20),
                      tintColor: focused ? '#F27C24' : '#292D32',
                      //   zIndex:1
                    }}
                    // source={focused ? Icons.homeactive : Icons.home}
                    source={focused ? Icons.money2 : Icons.money2}
                    resizeMode="contain"
                  />
                </View>
              </>
            );
          },
        }}
      />
      <Tab.Screen
        name="MyProfile"
        component={MyProfile}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({focused}) => {
            return (
              <>
                <View
                  style={{
                    backgroundColor: focused
                      ? 'rgba(242,124,36,0.2)'
                      : Colors.white,
                    padding: normalize(10),
                    marginTop: Platform.OS === 'ios' ? normalize(10) : 0,
                    borderRadius: normalize(10),
                  }}>
                  <Image
                    style={{
                      height: normalize(20),
                      width: normalize(20),
                      tintColor: focused ? '#F27C24' : '#292D32',
                      //   zIndex:1
                    }}
                    // source={focused ? Icons.homeactive : Icons.home}
                    source={focused ? Icons.box : Icons.box}
                    resizeMode="contain"
                  />
                </View>
              </>
            );
          },
        }}
      />
    </Tab.Navigator>
    // </View>
  );
}
const TigerStack = createStackNavigator();

const TigerMatchStackScreen = () => {
  return (
    <TigerStack.Navigator
      initialRouteName="TigerMatch"
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
        animation: 'slide_from_right',
        // unmountOnBlur: true,
      }}>
      <TigerStack.Screen name="tigerMatch" component={TigerMatch} />
      <TigerStack.Screen
        name="TigerMatchProfile"
        component={TigerMatchProfile}
      />
    </TigerStack.Navigator>
  );
};
