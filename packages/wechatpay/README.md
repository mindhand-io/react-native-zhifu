# React Native Zhifu - 微信支付

## 安装步骤

1. `yarn add react-native-zhifu-wechatpay`
2. 对于 RN < 0.60，需要手动运行 `react-native link`；对于 RN >= 0.60 无需运行。
3. 使用 Xcode 打开 iOS 项目，按下面说明编辑 `Info.plist`

- 新增 Key `LSApplicationQueriesSchemes`（如果已有则无需重复创建），并添加两个值 `weixin` 和 `weixinULAPI`
- 创建一个新的 URL Scheme，值为在[微信开放平台](https://open.weixin.qq.com)申请的 App ID
- ![配置完成后如图](https://user-images.githubusercontent.com/5107241/91173597-a7dd1b80-e710-11ea-8db3-774ddda98d51.png)

4. iOS 项目还需要正确配置 Universal Links，并填入到微信开放平台后台。Universal Links 配置方法请参照 [Apple 官方文档](https://developer.apple.com/documentation/xcode/allowing_apps_and_websites_to_link_to_your_content)。

5. 编辑 AppDelegate.m，加入以下代码：

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

6. 使用 Android Studio 打开安卓项目，创建 wxapi 包，创建 `WXPayEntryActivity` 类并继承 `com.mindhand.rnzhifu.wechatpay.WXPayEntryActivity`

```java
package <你的应用包名>.wxapi;

public class WXPayEntryActivity extends com.mindhand.rnzhifu.wechatpay.WXPayEntryActivity {
}
```

7. 编辑 AndroidManifest.xml，加入上一步创建的 `WXPayEntryActivity`

```xml
<activity
  android:name=".wxapi.WXPayEntryActivity"
  android:label="@string/app_name"
  android:exported="true" />
```
