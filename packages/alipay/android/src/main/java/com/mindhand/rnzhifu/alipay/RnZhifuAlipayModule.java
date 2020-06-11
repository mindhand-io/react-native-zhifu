package com.mindhand.rnzhifu.alipay;

import com.alipay.sdk.app.PayTask;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class RnZhifuAlipayModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private PayTask payTask;

    public RnZhifuAlipayModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RnZhifuAlipay";
    }

  @Override
  public void initialize() {
    super.initialize();
    this.payTask = new PayTask(getCurrentActivity());
  }

  @ReactMethod
    public void getSdkVersion(Promise promise) {
      promise.resolve(payTask.getVersion());
    }
}
