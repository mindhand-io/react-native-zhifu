package com.mindhand.rnzhifu.wechatpay;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.tencent.mm.opensdk.constants.ConstantsAPI;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.modelpay.PayResp;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;

public class WXPayEntryActivity extends Activity implements IWXAPIEventHandler {
  public static IWXAPI wxApi;
  public static Promise paymentResultPromise;

  @Override
  protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    wxApi.handleIntent(getIntent(), this);
  }

  @Override
  protected void onNewIntent(Intent intent) {
    super.onNewIntent(intent);

    setIntent(intent);
    wxApi.handleIntent(intent, this);
  }

  @Override
  public void onReq(BaseReq baseReq) {}

  @Override
  public void onResp(BaseResp resp) {
    if (resp.getType() == ConstantsAPI.COMMAND_PAY_BY_WX) {
      if (paymentResultPromise != null) {
        WritableMap result = Arguments.createMap();
        result.putInt("errCode", resp.errCode);
        result.putString("errStr", resp.errStr);
        result.putString("returnKey", ((PayResp)resp).returnKey);
        paymentResultPromise.resolve(result);
      }
      finish();
    }
  }
}
