interface InitOptions {
  /**
   * 微信开放平台注册的 App ID
   */
  appId: string;

  /**
   * 应用配置的 Universal Link，请参考微信官方接入指南
   *
   * https://developers.weixin.qq.com/doc/oplatform/Mobile_App/Access_Guide/iOS.html
   */
  universalLink: string;
}

interface PayResult {
  /**
   * 错误码
   *
   * - `0` 支付成功，展示成功页面
   * - `-1` 错误，可能的原因：签名错误、未注册 App ID、App ID 不正确、注册的 App ID 与设置的不匹配、其他异常等。
   * - `-2` 用户取消，无需处理。发生场景：用户不支付了，点击取消，返回 app。
   */
  errCode: number;

  /**
   * 错误提示字符串
   */
  errStr: string;

  /**
   * 微信支付返回给商家的信息
   */
  returnKey: string;
}

type PayOptions = {
  /**
   * 微信支付分配的商户号
   */
  partnerId: string;

  /**
   * 微信返回的支付交易会话 ID
   */
  prepayId: string;

  /**
   * 暂填写固定值 `Sign=WXPay`
   */
  package: string;

  /**
   * 随机字符串，不长于 32 位
   */
  nonceStr: string;

  /**
   * 时间戳
   */
  timestamp: number;

  /**
   * 签名，详见 [签名生成算法](https://pay.weixin.qq.com/wiki/doc/api/app/app.php?chapter=4_3)
   */
  sign: string;
};

interface RnZhifuWechatPayStatic {
  /**
   * 获取当前平台上微信 SDK 版本号
   */
  getSdkVersion(): Promise<string>;

  /**
   * 初始化微信 SDK，必须在调用其他 API 前使用
   *
   * @param options 初始化相关选项
   */
  init(options: InitOptions): Promise<void>;

  /**
   * 发起一笔支付
   *
   * 产品介绍：https://opendocs.alipay.com/open/204/105051
   *
   * @param options 支付相关选项，相关字段通常由后端提供
   */
  pay(options: PayOptions): Promise<PayResult>;
}
declare const wechatPay: RnZhifuWechatPayStatic;
export default wechatPay;
