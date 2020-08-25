# react-native-zhifu-wechatpay

- 设置 LSApplicationQueriesSchemes weixin weixinULAPI
- 添加一个 URL Scheme，值为微信开放平台的 App ID
- 启用 `Associated Domains` entitlement，按官方文档配置好 universal links
- 创建 `WXPayEntryActivity` 并继承 `com.mindhand.rnzhifu.wechatpay.WXPayEntryActivity`

```java
package com.你的包名.wxapi;

public class WXPayEntryActivity extends com.mindhand.rnzhifu.wechatpay.WXPayEntryActivity {
}
```

```xml
<activity
  android:name=".wxapi.WXPayEntryActivity"
  android:label="@string/app_name"
  android:exported="true" />
```

```objc
#import <React/RCTLinkingManager.h>

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
 return [RCTLinkingManager application:application
                  continueUserActivity:userActivity
                    restorationHandler:restorationHandler];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
 return [RCTLinkingManager application:application
                  continueUserActivity:userActivity
                    restorationHandler:restorationHandler];
}
```
