import React, { FC, useEffect } from "react";
import { View } from "react-native";
import alipay from "react-native-zhifu-alipay";

const App: FC = () => {
  useEffect(() => {
    void alipay.getSdkVersion().then((version) => {
      // eslint-disable-next-line no-console
      console.log(version);
    });
  });
  return <View />;
};

export default App;
