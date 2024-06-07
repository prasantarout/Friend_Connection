import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import StackNav from './src/navigation/StackNav';
import {SafeAreaProvider} from 'react-native-safe-area-context';
// import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {useEffect} from 'react';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import connectionrequest from './src/utils/helpers/NetInfo';
import { notificationlistRequest } from './src/redux/reducer/AuthReducer';
import { useDispatch } from 'react-redux';
import {useNetInfo} from '@react-native-community/netinfo';
import NoInternetModal from './src/components/NoInternetModal';

export default function App() {
  const netInfo = useNetInfo();
  useEffect(() => {
    requestUserPermission();
  }, []);
  useEffect(() => {
    let data={
      page:1,
      perpage:10,
      search:''
    }
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      let obj = {
        generalSearch: '',
      };
      connectionrequest()
        .then(() => {})
        .catch(err => {});

      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });
      console.log('A new notification', remoteMessage);
      await notifee.displayNotification({
        title: remoteMessage?.notification?.title,
        body: remoteMessage?.notification?.body,
        android: Platform.OS == 'android' && {
          channelId,
        },
      });
    });
    return () => {
      unsubscribe;
    };
  }, []);
  async function requestUserPermission() {
    await notifee.requestPermission();
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  return (
    // <GestureHandlerRootView style={{flex: 1}}>
    <SafeAreaProvider>
      <StackNav />
      <NoInternetModal netInfo={netInfo} />
    </SafeAreaProvider>
    // </GestureHandlerRootView>
  );
}
