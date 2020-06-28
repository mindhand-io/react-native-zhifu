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
import wechatPay from "react-native-zhifu-wechatpay";
import { generateTestAuthInfo, generateTestOrderInfo } from "./utils/alipay";
import { wechatRegisteredApp } from "./config";

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
  const [wechatSdkVersion, setWechatSdkVersion] = useState<
    string | undefined
  >();

  useEffect(() => {
    async function initSdk(): Promise<void> {
      await alipay.init();
      await wechatPay.init({
        appId: wechatRegisteredApp.appId,
        universalLink: wechatRegisteredApp.universalLink,
      });
    }
    async function fetchSdkVersions(): Promise<void> {
      setAlipaySdkVersion(await alipay.getSdkVersion());
      setWechatSdkVersion(await wechatPay.getSdkVersion());
    }
    void initSdk();
    void fetchSdkVersions();
  });

  const handlePayViaAlipay = useCallback(async () => {
    const { resultStatus, memo, result } = await alipay.pay({
      orderInfo: generateTestOrderInfo(),
    });
    Alert.alert(
      "支付结果",
      `状态码：${resultStatus}\n描述：${memo}\n内容：${result}`
    );
  }, []);

  const handleAuthViaAlipay = useCallback(async () => {
    const { resultStatus, memo, result } = await alipay.auth({
      authInfo: generateTestAuthInfo(),
    });
    Alert.alert(
      "授权结果",
      `状态码：${resultStatus}\n描述：${memo}\n内容：${result}`
    );
  }, []);

  const handlePayViaWechatPay = useCallback(async () => {
    /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
    const order = await fetch(
      "https://wxpay.wxutil.com/pub_v2/app/app_pay.php?plat=ios"
    ).then((resp) => resp.json());
    const { errCode } = await wechatPay.pay({
      partnerId: order.partnerid,
      prepayId: order.prepayid,
      nonceStr: order.noncestr,
      timestamp: order.timestamp,
      package: order.package,
      sign: order.sign,
    });
    /* eslint-enable */
    Alert.alert("支付结果", `状态码：${errCode}`);
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
        <Text style={styles.label}>微信 SDK 版本：{wechatSdkVersion}</Text>
        <View style={styles.buttonContainer}>
          <Button title="微信：发起支付" onPress={handlePayViaWechatPay} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
