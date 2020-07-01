package com.mindhand.rnzhifu.alipay;

import android.app.Activity;

import com.alipay.sdk.app.AuthTask;
import com.alipay.sdk.app.EnvUtils;
import com.alipay.sdk.app.H5PayCallback;
import com.alipay.sdk.app.PayTask;
import com.alipay.sdk.util.H5PayResultModel;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import java.util.Map;

public class RnZhifuAlipayModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;
  private PayTask payTask;
  private AuthTask authTask;

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
    Activity currentActivity = getCurrentActivity();
    this.payTask = new PayTask(currentActivity);
    this.authTask = new AuthTask(currentActivity);
  }

  @ReactMethod
  public void getSdkVersion(Promise promise) {
    promise.resolve(payTask.getVersion());
  }

  @ReactMethod
  public void init(final ReadableMap options, Promise promise) {
    if (options.hasKey("sandboxMode") && options.getBoolean("sandboxMode")) {
      EnvUtils.setEnv(EnvUtils.EnvEnum.SANDBOX);
    } else {
      EnvUtils.setEnv(EnvUtils.EnvEnum.ONLINE);
    }
    promise.resolve(null);
  }

  @ReactMethod
  void pay(final ReadableMap options, final Promise promise) {
    Runnable payRunnable = new Runnable() {
      @Override
      public void run() {
        WritableMap result = Arguments.createMap();
        for (Map.Entry<String, String> entry : payTask.payV2(options.getString("orderInfo"), options.hasKey("showLoading") && options.getBoolean("showLoading")).entrySet()) {
          result.putString(entry.getKey(), entry.getValue());
        }
        promise.resolve(result);
      }
    };
    Thread payThread = new Thread(payRunnable);
    payThread.start();
  }

  @ReactMethod
  void auth(final ReadableMap options, final Promise promise) {
    Runnable authRunnable = new Runnable() {
      @Override
      public void run() {
        WritableMap result = Arguments.createMap();
        for (Map.Entry<String, String> entry : authTask.authV2(options.getString("authInfo"), options.hasKey("showLoading") && options.getBoolean("showLoading")).entrySet()) {
          result.putString(entry.getKey(), entry.getValue());
        }
        promise.resolve(result);
      }
    };
    Thread authThread = new Thread(authRunnable);
    authThread.start();
  }

  @ReactMethod
  void payInterceptorWithUrl(final ReadableMap options, final Callback payResultCallback, final Promise promise) {
    Runnable payRunnable = new Runnable() {
      @Override
      public void run() {
        boolean isIntercepted = payTask.payInterceptorWithUrl(options.getString("h5PayUrl"), options.hasKey("showLoading") && options.getBoolean("showLoading"), new H5PayCallback() {
          @Override
          public void onPayResult(final H5PayResultModel payResult) {
            WritableMap result = Arguments.createMap();
            result.putString("resultCode", payResult.getResultCode());
            result.putString("returnUrl", payResult.getReturnUrl());
            payResultCallback.invoke(result);
          }
        });
        promise.resolve(isIntercepted);
      }
    };
    Thread payThread = new Thread(payRunnable);
    payThread.start();
  }
}
