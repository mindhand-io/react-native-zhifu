import React, { FC, useEffect, useCallback, useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Button,
  SafeAreaView,
  Alert,
} from "react-native";
import alipay from "react-native-zhifu-alipay";
import { generateTestAuthInfo, generateTestOrderInfo } from "./utils/alipay";

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 25,
  },
  label: {
    fontSize: 16,
    marginBottom: 20,
    alignSelf: "center",
  },
  buttonContainer: {
    marginBottom: 20,
  },
});

const App: FC = () => {
  const [alipaySdkVersion, setAlipaySdkVersion] = useState<
    string | undefined
  >();

  useEffect(() => {
    void alipay.getSdkVersion().then((version) => {
      setAlipaySdkVersion(version);
    });
  });

  const handlePayViaAlipay = useCallback(async () => {
    const { resultStatus, memo, result } = await alipay.pay({
      orderInfo: generateTestOrderInfo(),
    });
    Alert.alert(
      `支付结果`,
      `状态码：${resultStatus}\n描述：${memo}\n内容：${result}`
    );
  }, []);

  const handleAuthViaAlipay = useCallback(async () => {
    const { resultStatus, memo, result } = await alipay.auth({
      authInfo: generateTestAuthInfo(),
    });
    Alert.alert(
      `授权结果`,
      `状态码：${resultStatus}\n描述：${memo}\n内容：${result}`
    );
  }, []);

  return (
    <SafeAreaView>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.label}>支付宝 SDK 版本：{alipaySdkVersion}</Text>
        <View style={styles.buttonContainer}>
          <Button title="支付宝：发起支付" onPress={handlePayViaAlipay} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="支付宝：快捷登录" onPress={handleAuthViaAlipay} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
