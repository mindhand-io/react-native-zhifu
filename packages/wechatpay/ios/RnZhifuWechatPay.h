#import <React/RCTBridgeModule.h>
#import <WechatOpenSDK/WXApi.h>

@interface RnZhifuWechatPay : NSObject <RCTBridgeModule, WXApiDelegate>

@property (copy, nonatomic) RCTPromiseResolveBlock paymentResultResolver;

@end
