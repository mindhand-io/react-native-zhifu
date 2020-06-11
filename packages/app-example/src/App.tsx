import React, { FC, useEffect } from "react";
import { View } from "react-native";
import alipay from "react-native-zhifu-alipay";

const App: FC = () => {
  useEffect(() => {
    alipay.getSdkVersion().then((version) => {
      console.log(version);
    });
  });
  return <View />;
};

export default App;
