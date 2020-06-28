package com.mindhand.rnzhifu.wechatpay;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.tencent.mm.opensdk.constants.Build;
import com.tencent.mm.opensdk.constants.ConstantsAPI;
import com.tencent.mm.opensdk.modelpay.PayReq;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import java.util.Map;

public class RnZhifuWechatPayModule extends ReactContextBaseJavaModule {
  private final ReactApplicationContext reactContext;
  private String appId;

  public RnZhifuWechatPayModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RnZhifuWechatPay";
  }

  @ReactMethod
  public void getSdkVersion(Promise promise) {
    promise.resolve(Build.SDK_VERSION_NAME.replace("android ", ""));
  }

  @ReactMethod
  public void init(final ReadableMap options, Promise promise) {
    appId = options.getString("appId");
    WXEntryActivity.wxApi = WXAPIFactory.createWXAPI(getCurrentActivity(), appId);
    promise.resolve(null);
  }

  @ReactMethod
  void pay(final ReadableMap options, final Promise promise) {
    PayReq req = new PayReq();
    req.appId = appId;
    req.partnerId = options.getString("partnerId");
    req.prepayId = options.getString("prepayId");
    req.packageValue = options.getString("package");
    req.nonceStr = options.getString("nonceStr");
    req.timeStamp = String.valueOf(options.getInt("timestamp"));
    req.sign = options.getString("sign");
    WXEntryActivity.paymentResultPromise = promise;
    WXEntryActivity.wxApi.sendReq(req);
  }
}
