interface ShowLoadingOption {
  /**
   * **（仅 Android 有效）**是否在跳转支付宝 App 前显示“去支付宝付款/授权...”画面
   */
  showLoading?: boolean;
}

interface InitOptions {
  /**
   * **（仅 iOS 有效）**当前应用的 URL Scheme，支付宝 App 完成支付后据此跳回应用（可选，不填会尝试自动获取）
   */
  scheme?: string;

  /**
   * **（仅 Android 有效）**是否启用沙箱环境，默认不启用
   *
   * 沙箱联调指南：https://opendocs.alipay.com/open/204/106450
   */
  sandboxMode?: boolean;
}

type PayOptions = {
  /**
   * 订单信息串，通常由后端提供
   */
  orderInfo: string;
} & ShowLoadingOption;

type AuthOptions = {
  /**
   * 授权信息串，通常由后端提供
   */
  authInfo: string;
} & ShowLoadingOption;

type PayInterceptorOptions = {
  h5PayUrl: string;
} & ShowLoadingOption;

interface PayResult {
  /**
   * 结果码，含义如下：
   *
   * - `9000`	订单支付成功
   * - `8000`	正在处理中，支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态
   * - `4000`	订单支付失败
   * - `5000`	重复请求
   * - `6001`	用户中途取消
   * - `6002`	网络连接出错
   * - `6004`	支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态
   * - `其他` 其它支付错误
   */
  resultStatus: string;

  /**
   * 描述信息
   */
  memo: string;

  /**
   * 具体处理结果，JSON 格式，通常应将它发送给后端
   */
  result: string;
}

interface AuthResult {
  /**
   * 结果码，含义如下：
   *
   * - `9000`	请求处理成功
   * - `4000`	系统异常
   * - `6001`	用户中途取消
   * - `6002`	网络连接出错
   */
  resultStatus: string;

  /**
   * 描述信息
   */
  memo: string;

  /**
   * 具体授权结果，通常应将它发送给后端
   */
  result: string;
}

interface PayInterceptorResult {
  /**
   * 返回码，标识支付状态，含义如下：
   *
   * - `9000` 订单支付成功
   * - `8000` 正在处理中
   * - `4000` 订单支付失败
   * - `5000` 重复请求
   * - `6001` 用户中途取消
   * - `6002` 网络连接出错
   */
  resultCode: string;

  /**
   * 支付结束后应当跳转的 URL 地址
   */
  returnUrl: string;
}

interface RnZhifuAlipayStatic {
  /**
   * 获取当前平台上支付宝 SDK 版本号
   */
  getSdkVersion(): Promise<string>;

  /**
   * 初始化支付宝 SDK，必须在调用其他 API 前使用
   *
   * @param options 初始化相关选项
   */
  init(options?: InitOptions): Promise<void>;

  /**
   * 发起一笔支付
   *
   * 产品介绍：https://opendocs.alipay.com/open/204/105051
   *
   * @param options 支付相关选项
   */
  pay(options: PayOptions): Promise<PayResult>;

  /**
   * 发起支付宝快捷登录
   *
   * 产品介绍：https://opendocs.alipay.com/open/218/105329\
   *
   * @param options 授权登录相关选项
   */
  auth(options: AuthOptions): Promise<AuthResult>;

  /**
   * 判断指定 URL 是否可由支付宝 App 拦截，如果可拦截则跳转支付宝 App，并返回支付结果。用于实现 WebView 跳转支付宝 App 支付。
   *
   * 相关介绍：https://opendocs.alipay.com/open/204/105695
   *
   * @param options H5 URL 拦截相关选项
   * @param onPayResult 支付结果回调
   * @return 如果是可拦截 URL，返回 `true`，否则 `false`
   */
  payInterceptorWithUrl(
    options: PayInterceptorOptions,
    onPayResult: (result: PayInterceptorResult) => void
  ): boolean;
}
declare const alipay: RnZhifuAlipayStatic;
export default alipay;
