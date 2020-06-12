import { Buffer } from "buffer";
import RSASign from "jsrsasign";
import moment from "moment";
import { alipayMerchant } from "../config";

export function rsaSign(
  data: Record<string, string>,
  algorithm: "RSA" | "RSA2",
  privateKey: string
): string {
  /**
   * Credit to https://github.com/0x5e/react-native-alipay/blob/master/index.js
   */
  const object: Record<string, string> = {
    ...data,
    sign_type: algorithm,
    charset: "utf-8",
  };

  // Remove sign field
  delete object.sign;

  // Remove empty field
  Object.keys(object).forEach((key) => {
    if (String(object[key]).length === 0) {
      delete object[key];
    }
  });

  // Sort query string
  let sortedQuery = "";
  const sortedKeys = Object.keys(object).sort((a, b) => (a > b ? 1 : -1));
  for (let i = 0; i < sortedKeys.length; i += 1) {
    const key = sortedKeys[i];
    const value = object[key];
    // 加签前不能 URL Encode，加签之后再 URL Encode
    sortedQuery += `${i === 0 ? "" : "&"}${key}=${value}`;
  }

  // Create signature
  const alg = { RSA: "SHA1withRSA", RSA2: "SHA256withRSA" }[algorithm];
  const sig = new RSASign.KJUR.crypto.Signature({ alg });
  sig.init(RSASign.KEYUTIL.getKey(privateKey));
  object.sign = Buffer.from(sig.signString(sortedQuery), "hex").toString(
    "base64"
  );

  return Object.keys(object)
    .map((k) => `${k}=${encodeURIComponent(object[k])}`)
    .join("&");
}

export function generateTestOrderInfo(): string {
  return rsaSign(
    {
      app_id: alipayMerchant.appId,
      biz_content: JSON.stringify({
        timeout_express: "30m",
        total_amount: "0.01",
        subject: "这是测试商品",
        out_trade_no: (Math.random() * 1000000).toString(),
      }),
      method: "alipay.trade.app.pay",
      timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
      version: "1.0",
    },
    "RSA2",
    `-----BEGIN RSA PRIVATE KEY-----\n${alipayMerchant.privateKey}\n-----END RSA PRIVATE KEY-----`
  );
}

export function generateTestAuthInfo(): string {
  return rsaSign(
    {
      app_id: alipayMerchant.appId,
      apiname: "com.alipay.account.auth",
      method: "alipay.open.auth.sdk.code.get",
      app_name: "mc",
      biz_type: "openservice",
      pid: alipayMerchant.pid,
      product_id: "APP_FAST_LOGIN",
      scope: "kuaijie",
      target_id: (Math.random() * 1000000).toString(),
      auth_type: "AUTHACCOUNT",
    },
    "RSA2",
    `-----BEGIN RSA PRIVATE KEY-----\n${alipayMerchant.privateKey}\n-----END RSA PRIVATE KEY-----`
  );
}
