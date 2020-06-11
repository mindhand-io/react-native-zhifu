#import "RnZhifuAlipay.h"

@implementation RnZhifuAlipay

RCT_EXPORT_MODULE()

- (instancetype)init
{
    self = [super init];
    if (self) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleOpenURLNotification:) name:@"RCTOpenURLNotification" object:nil];
    }
    return self;
}

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)handleOpenURLNotification:(NSNotification *)aNotification
{
    NSString * aURLString =  [aNotification userInfo][@"url"];
    NSURL * aURL = [NSURL URLWithString:aURLString];
    if ([aURL.host isEqualToString:@"safepay"]) {
        // 处理支付宝 App 返回结果
        [[AlipaySDK defaultService] processOrderWithPaymentResult:aURL standbyCallback:nil];
        [[AlipaySDK defaultService] processAuth_V2Result:aURL standbyCallback:nil];
    }
}

- (NSString*)getSchemeFromOptions:(NSDictionary*)options
{
    NSString* scheme = options[@"scheme"];
    // Scheme 如果没有传递，则自动获取可用 Scheme
    if ([scheme length] == 0) {
        NSMutableArray* urlTypes = [[NSBundle mainBundle] infoDictionary][@"CFBundleURLTypes"];
        if ([urlTypes count] != 0) {
            NSMutableArray* schemes = ((NSDictionary *)(urlTypes[0]))[@"CFBundleURLSchemes"];
            if ([schemes count] != 0) {
                scheme = schemes[0];
            }
        }
    }
    return scheme;
}

RCT_REMAP_METHOD(getSdkVersion,
                 getSdkVersionWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve([[AlipaySDK defaultService] currentVersion]);
}

RCT_REMAP_METHOD(pay,
                 payWithOptions:(NSDictionary*)options
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    [[AlipaySDK defaultService]
     payOrder:options[@"orderInfo"]
     fromScheme:[self getSchemeFromOptions:options]
     callback:^(NSDictionary *resultDic) {
        resolve(resultDic);
    }];
}

RCT_REMAP_METHOD(auth,
                 authWithOptions:(NSDictionary*)options
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    [[AlipaySDK defaultService]
     auth_V2WithInfo:options[@"authInfo"]
     fromScheme:[self getSchemeFromOptions:options]
     callback:^(NSDictionary *resultDic) {
        resolve(resultDic);
    }];
}

RCT_REMAP_METHOD(payInterceptorWithUrl,
                 payInterceptorWithUrlWithOptions:(NSDictionary*)options
                 payResultCallback:(RCTResponseSenderBlock)callback
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    BOOL isIntercepted = [[AlipaySDK defaultService]
     payInterceptorWithUrl:options[@"h5PayUrl"]
     fromScheme:[self getSchemeFromOptions:options]
     callback:^(NSDictionary *resultDic) {
        callback(@[resultDic]);
    }];
    resolve([NSNumber numberWithBool:isIntercepted]);
}

@end
