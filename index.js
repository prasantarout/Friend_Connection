
import "react-native-gesture-handler";
import React from "react";
import { AppRegistry, LogBox } from "react-native";
import App from "./App";
LogBox.ignoreAllLogs();
import { Provider } from "react-redux";
import Store from './src/redux/Store'
import { name as appName } from "./app.json";

const TigerConnect = () => {
  return (
    <Provider store={Store}>
      <App />
    </Provider>
  );
};
AppRegistry.registerComponent(appName, () => TigerConnect);
