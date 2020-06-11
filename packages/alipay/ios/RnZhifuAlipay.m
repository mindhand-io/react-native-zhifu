#import "RnZhifuAlipay.h"

@implementation RnZhifuAlipay

RCT_EXPORT_MODULE()

RCT_REMAP_METHOD(getSdkVersion,
                 withResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve([[AlipaySDK defaultService] currentVersion]);
}

@end
