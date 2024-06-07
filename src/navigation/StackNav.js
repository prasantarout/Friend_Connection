import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {BackHandler} from 'react-native';

import {
  createStackNavigator,
  TransitionSpecs,
  HeaderStyleInterpolators,
} from '@react-navigation/stack';
import * as React from 'react';
import SplashScreen from '../screen/splashScreen/SplashScreen';
import DrawerNavigation from '../screen/Auth/DrawerNavigation';
import SignUp from '../screen/Auth/Signup';
import Setting from '../screen/profile/Setting';
import TabNavigator from './BottomTab';
import ContactUs from '../screen/profile/ContactUs';
import PasswordChange from '../screen/profile/PasswordChange';
import SignupStep2 from '../screen/Auth/SignupStep2';
import WaitingForApproval from '../screen/Auth/WaitingForApproval';
import SignIn from '../screen/Auth/SignIn';
import ForgetPassword from '../screen/Auth/ForgetPassword';
import ForgotPasswordOtpVerify from '../screen/Auth/ForgotPasswordOtpVerify';
import ChangePassword from '../screen/Auth/ChangePassword';
import ChangePasswordSucess from '../screen/Auth/ChangePasswordSucess';
import FriendProfileDetails from '../screen/friendAndRequest/FriendProfileDetails';
import Notification from '../screen/notification/Notification';
import Search from '../screen/search/Search';
import Messaging from '../screen/messaging/Messaging';
import Groups from '../screen/groups/Groups';
import CreatedGroup from '../screen/groups/CreatedGroup';
import CreatedGroupStep2 from '../screen/groups/CreatedGroupStep2';
import CreatedGroupStep3 from '../screen/groups/CreatedGroupStep3';
import MessagingRoom from '../screen/messaging/MessagingRoom';
import CreateGroupSucess from '../screen/groups/CreateGroupSucess';
import GroupDetailsPage from '../screen/groups/GroupDetailsPage';
import InviteGroup from '../screen/groups/InviteGroup';
import TigerMatchProfile from '../screen/tigerMatch/TigerMatchProfile';
import Event from '../screen/events/Event';
import EventDetails from '../screen/events/EventDetails';
import CreateStoryStep1 from '../screen/stroySection/CreateStoryStep1';
import CreateStoryStep2 from '../screen/stroySection/CreateStoryStep2';
import CreateStoryStep3 from '../screen/stroySection/CreateStoryStep3';
import StoryDetailsPage from '../screen/stroySection/StoryDetailsPage';
import CreateVideoPost from '../screen/post/CreateVideoPost';
import CreateVideoPostStep1 from '../screen/post/CreateVideoPostStep1';
import PostedSuccess from '../screen/post/PostedSuccess';
import DeleteAccount from '../screen/profile/DeleteAccount';
import UpdateProfile from '../screen/profile/UpdateProfile';
import { navigationRef } from '../utils/helpers/RootNavigation';
import EditGroup from '../screen/groups/EditGroup';
const StackNav = ({props, navigation}) => {
  const Stack = createStackNavigator();

  const mytheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
    },
  };
  const MyTransition = {
    // gestureDirection: "vertical",
    transitionSpec: {
      open: TransitionSpecs.TransitionIOSSpec,
      close: TransitionSpecs.TransitionIOSSpec,
    },
    headerStyleInterpolator: HeaderStyleInterpolators.forFade,
    cardStyleInterpolator: ({current, next, layouts}) => {
      return {
        cardStyle: {
          transform: [
            {
              translateX: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.width, 1],
              }),
            },
          ],
        },
        overlayStyle: {
          opacity: current.progress.interpolate({
            inputRange: [0, 0.1],
            outputRange: [0, 0.1],
          }),
        },
      };
    },
  };

  const Screens = {
    SplashScreen: SplashScreen,
    SignUp: SignUp,
    ForgetPassword: ForgetPassword,
    ForgotPasswordOtpVerify: ForgotPasswordOtpVerify,
    ChangePassword: ChangePassword,
    SignIn: SignIn,
    ChangePasswordSucess: ChangePasswordSucess,
    SignupStep2: SignupStep2,
    WaitingForApproval: WaitingForApproval,
    TigerMatchProfile: TigerMatchProfile,
    DrawerNavigation: DrawerNavigation,
    TabNavigator: TabNavigator,
    Setting: Setting,
    ContactUs: ContactUs,
    PasswordChange: PasswordChange,
    FriendProfileDetails: FriendProfileDetails,
    Notification: Notification,
    Search: Search,
    Messaging: Messaging,
    Groups: Groups,
    CreatedGroup: CreatedGroup,
    CreatedGroupStep2: CreatedGroupStep2,
    CreatedGroupStep3: CreatedGroupStep3,
    GroupDetailsPage: GroupDetailsPage,
    MessagingRoom: MessagingRoom,
    CreateGroupSucess: CreateGroupSucess,
    InviteGroup: InviteGroup,
    Event: Event,
    EventDetails: EventDetails,
    CreateStoryStep1: CreateStoryStep1,
    CreateStoryStep2: CreateStoryStep2,
    CreateStoryStep3: CreateStoryStep3,
    StoryDetailsPage: StoryDetailsPage,
    CreateVideoPost: CreateVideoPost,
    CreateVideoPostStep1: CreateVideoPostStep1,
    PostedSuccess: PostedSuccess,
    DeleteAccount: DeleteAccount,
    UpdateProfile: UpdateProfile,
    EditGroup:EditGroup
  };

  const handleBackButton = () => {
    if (navigationRef?.current && navigationRef.current.canGoBack()) {
      navigationRef?.current?.goBack();
      return true;
    }
    return false; // Default behavior (app closing)
  };

  React.useEffect(() => {
    const backHandler = BackHandler?.addEventListener(
      "hardwareBackPress",
      handleBackButton
    );

    return () => backHandler.remove();
  }, []);

  return (
    <NavigationContainer theme={mytheme} ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          ...MyTransition,
          animationEnabled: true,
          // gestureEnabled: true,
        }}
        initialRouteName="Splash">
        {Object.entries({
          ...Screens,
        }).map(([name, component]) => {
          return (
            <Stack.Screen
              name={name}
              component={component}
              key={name}
              options={
                {
                  // gestureEnabled: name == 'WaitingForApproval' ? false : true,
                }
              }
            />
          );
        })}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default StackNav;
