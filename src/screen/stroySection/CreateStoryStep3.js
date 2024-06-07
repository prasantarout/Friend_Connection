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
  BackHandler,
} from 'react-native';
import React, {Fragment, useState} from 'react';
import {Fonts, Icons} from '../../themes/ImagePath';
import normalize from '../../utils/helpers/dimen';
import {Colors} from '../../themes/Colors';
import TextInputmultiple from '../../components/TextInputmultiple';
import DropDownComponent from '../../components/DropDownComponent';
import TextInputItem from '../../components/TextInput';
import {navigationRef} from '../../utils/helpers/RootNavigation';

export default function CreateStoryStep3(props) {
  const [description, setDescription] = useState('');
  const [descriptionFocus, setIsDescriptionFocus] = useState(false);

  const [tag, setTag] = useState('');
  const [isTagFocus, setIsTagFocus] = useState(false);

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

  return (
    <View
      style={{
        height: Dimensions.get('screen').height,
        width: Dimensions.get('screen').width,
      }}>
      <StatusBar backgroundColor={'transparent'} translucent />
      <ImageBackground
        source={Icons.extra9}
        resizeMode="cover"
        style={{height: '100%', width: '100%', justifyContent: 'flex-end'}}>
        <View
          style={{
            paddingVertical: normalize(10),
            backgroundColor: Colors.white,
            paddingHorizontal: normalize(15),
            borderTopEndRadius: normalize(15),
            borderTopStartRadius: normalize(15),
          }}>
          <TextInputmultiple
            toptext={'Description'}
            placeholder={'Enter Description'}
            width="100%"
            value={description}
            height={100}
            onChangeText={val => setDescription(val)}
            onFocus={() => setIsDescriptionFocus(true)}
            onBlur={() => setIsDescriptionFocus(false)}
            focus={descriptionFocus}
          />
          <TextInputItem
            toptext={'Tags'}
            placeholder={'Enter Tags'}
            width="100%"
            value={tag}
            onChangeText={val => setTag(val)}
            onFocus={() => setIsTagFocus(true)}
            onBlur={() => setIsTagFocus(false)}
            focus={isTagFocus}
          />

          {/* <DropDownComponent
            isrightimage={Icons.down}
            toptext={'Class'}
            placeholder={'Username'}
            width="100%"
            value={'Select Class'}
            rightimagetintColor={Colors.textBlack}
          /> */}

          {/* button */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              // marginBottom: normalize(15),
              marginTop: normalize(10),
            }}>
            <TouchableOpacity
              onPress={() => props?.navigation?.navigate('TabNavigator')}
              activeOpacity={0.1}
              style={{
                width: '80%',
                height: normalize(45),
                marginTop: normalize(10),
                marginBottom: normalize(10),
                backgroundColor: Colors.orange,
                borderRadius: normalize(12),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: normalize(16),
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: Colors.white,
                  fontWeight: '600',
                }}>
                Post
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                props.navigation.goBack();
              }}
              activeOpacity={0.1}
              style={{
                width: normalize(45),
                height: normalize(45),
                alignSelf: 'center',
                marginLeft: normalize(10),
                borderRadius: normalize(10),
                backgroundColor: 'rgba(31, 36, 64, 1)',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={Icons.cross}
                style={{width: normalize(14), height: normalize(14)}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
