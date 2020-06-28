/* eslint-disable */
import { NativeModules } from "react-native";

const { RnZhifuAlipay } = NativeModules;

export default {
  ...RnZhifuAlipay,
  init(options) {
    return RnZhifuAlipay.init(options || {});
  },
};
