import {
    View,
    Text,
    ActivityIndicator,
    ImageBackground,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
  } from 'react-native';
  import React, {useEffect, useState, useRef} from 'react';
  import {Colors} from '../themes/Colors';
  import {Image} from 'react-native';
  import {createThumbnail} from 'react-native-create-thumbnail';
  import {horizontalScale} from '../../utils/helpers/dimen1';
  import {Icons} from '../themes/ImagePath';
  import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';
  import Video from 'react-native-video';
  
  export const getVideoThumbnail = async item => {
    try {
      const thumbnail = await createThumbnail({
        url: item,
        timeStamp: 2000,
      });
      return thumbnail.path;
    } catch (error) {
      console.log('getVideoThumbnail>>', {err});
      // console.log("getVideoThumbnail error>>", error);
    }
  };
  
  export default function VideoThumbnail({uriItem, style, flagItem}) {
    const [videoUrl, setVideoUrl] = useState('');
    const videoPlayer = useRef(null);
    const [duration, setDuration] = useState(0);
    const [paused, setPaused] = useState(true);
    const [controlsVisible, setControlsVisible] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [playerState, setPlayerState] = useState(PLAYER_STATES.PAUSED);
    const [isLoading, setIsLoading] = useState(true);
    const [muted, setMuted] = useState(false);
    const onSeek = seek => {
      videoPlayer?.current.seek(seek);
    };
  
    const onSeeking = currentVideoTime => setCurrentTime(currentVideoTime);
  
    const onPaused = newState => {
      setPaused(!paused);
      setPlayerState(newState);
    };
  
    const onReplay = () => {
      videoPlayer?.current.seek(0);
      setCurrentTime(0);
      if (Platform.OS === 'android') {
        setPlayerState(PLAYER_STATES.PAUSED);
        setPaused(true);
      } else {
        setPlayerState(PLAYER_STATES.PLAYING);
        setPaused(false);
      }
    };
  
    const onProgress = data => {
      if (!isLoading) {
        setCurrentTime(data.currentTime);
      }
    };
  
    const onLoad = data => {
      setDuration(Math.round(data.duration));
      setIsLoading(false);
    };
  
    const onLoadStart = () => setIsLoading(true);
  
    const onEnd = () => {
      setPlayerState(PLAYER_STATES.ENDED);
      setCurrentTime(duration);
    };
  
    const hideControls = () => {
      setControlsVisible(false);
    };
  
    const showControls = () => {
      setControlsVisible(true);
    };
    const toggleMute = () => {
      setMuted(!muted);
    };
  
    useEffect(() => {
      (async () => {
        const path = await getVideoThumbnail(uriItem);
        setVideoUrl(path);
      })();
    }, []);
  
    return (
      <View style={[style, {}]}>
        <Video
          onEnd={onEnd}
          onLoad={onLoad}
          onLoadStart={onLoadStart}
          poster={videoUrl}
          posterResizeMode={'cover'}
          onProgress={onProgress}
          paused={flagItem !== 15 ? paused : false}
          ref={ref => (videoPlayer.current = ref)}
          resizeMode={'cover'}
          // onFullScreen={isFullScreen}
          source={{
            uri:
              uriItem !== '' &&
              uriItem !== null &&
              uriItem !== undefined &&
              uriItem,
          }}
          style={styles.backgroundVideo}
        />
        {flagItem !== 15 && (
          <MediaControls
            isFullScreen={false}
            duration={duration}
            isLoading={isLoading}
            progress={currentTime}
            onPaused={onPaused}
            onReplay={onReplay}
            // onFullScreen={onFullScreen}
            onSeek={onSeek}
            onSeeking={onSeeking}
            mainColor={'red'}
            playerState={playerState}
            sliderStyle={{containerStyle: {}, thumbStyle: {}, trackStyle: {}}}
          />
        )}
        {controlsVisible && flagItem !== 15 && (
          <SafeAreaView
            style={{
              position: 'absolute',
              top: StatusBar.currentHeight,
              right: 15,
              marginTop: Platform.OS == 'ios' ? normalize(5) : normalize(-10),
            }}>
            <TouchableOpacity onPress={toggleMute} style={styles.coverContainer}>
              <Image
                source={muted ? Icons.mute : Icons.volume}
                resizeMode="contain"
                style={{
                  height: normalize(15),
                  width: normalize(18),
                  tintColor: Colors.white,
                }}
              />
            </TouchableOpacity>
          </SafeAreaView>
        )}
  
        {/* {videoUrl != '' ? (
          <ImageBackground
            source={{uri: videoUrl}}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'cover',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity>
              <Image
                source={Icons.play}
                style={{height: 50, width: 50}}
                tintColor="white"
              />
            </TouchableOpacity>
          </ImageBackground>
        ) : (
          <ActivityIndicator size={'small'} color={Colors.darkBlue} />
        )} */}
      </View>
    );
  }
  const styles = StyleSheet.create({
    backgroundVideo: {
      height: 250,
      width: '100%',
    },
    mediaControls: {
      height: '100%',
      flex: 1,
      alignSelf: 'center',
    },
    coverContainer: {
      height: normalize(35),
      width: normalize(35),
      borderRadius: normalize(35 / 2),
      backgroundColor: 'rgba(52, 52, 52, 0.8)',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  