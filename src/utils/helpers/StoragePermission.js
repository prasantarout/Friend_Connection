import {PermissionsAndroid} from 'react-native';

export const requestExternalStoreageRead = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Tiger Connect',
        message: 'App needs access to external storage',
      },
    );

    return granted == PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    //Handle this error
    return false;
  }
};
