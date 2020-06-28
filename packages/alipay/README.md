# react-native-zhifu-alipay

## Getting started

`$ npm install react-native-zhifu-alipay --save`

### Mostly automatic installation

`$ react-native link react-native-zhifu-alipay`

## Usage

```javascript
import RnZhifuAlipay from "react-native-zhifu-alipay";

// TODO: What to do with the module?
RnZhifuAlipay;
```

设置至少一个 URL Scheme
proguard

```objc
#import <React/RCTLinkingManager.h>

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}
```
