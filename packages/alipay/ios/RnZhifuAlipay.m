#import "RnZhifuAlipay.h"

@implementation RnZhifuAlipay

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleOpenURLNotification:) name:@"RCTOpenURLNotification" object:nil];
        // 反注释下面代码，可以输出支付宝 SDK 调试信息，便于诊断问题
//        [AlipaySDK startLogWithBlock:^(NSString* log){
//            NSLog(@"%@", log);
//        }];
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
        [[AlipaySDK defaultService] processOrderWithPaymentResult:aURL standbyCallback:nil];
        [[AlipaySDK defaultService] processAuth_V2Result:aURL standbyCallback:nil];
    }
}

RCT_REMAP_METHOD(getSdkVersion,
                 getSdkVersionWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve([[AlipaySDK defaultService] currentVersion]);
}

RCT_REMAP_METHOD(init,
                 initWithOptions:(NSDictionary*)options
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
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
    if ([scheme length] == 0) {
        reject(@"INVALID_SCHEME", @"自动获取 URL Scheme 失败，请确认你的应用已经设置了 Info.plist -> URL Types -> URL Schemes，或者手动提供 scheme 选项", nil);
        return;
    }
    [self setScheme:scheme];
    resolve(nil);
}

RCT_REMAP_METHOD(pay,
                 payWithOptions:(NSDictionary*)options
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        // 支付宝 SDK 必须在 UI 线程调用
        [[AlipaySDK defaultService]
         payOrder:options[@"orderInfo"]
         fromScheme:[self scheme]
         callback:^(NSDictionary *resultDic) {
            resolve(resultDic);
        }];
    });
}

RCT_REMAP_METHOD(auth,
                 authWithOptions:(NSDictionary*)options
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        // 支付宝 SDK 必须在 UI 线程调用
        [[AlipaySDK defaultService]
         auth_V2WithInfo:options[@"authInfo"]
         fromScheme:[self scheme]
         callback:^(NSDictionary *resultDic) {
            resolve(resultDic);
        }];
    });
}

RCT_REMAP_METHOD(payInterceptorWithUrl,
                 payInterceptorWithUrlWithOptions:(NSDictionary*)options
                 payResultCallback:(RCTResponseSenderBlock)callback
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        // 支付宝 SDK 必须在 UI 线程调用
        BOOL isIntercepted = [[AlipaySDK defaultService]
         payInterceptorWithUrl:options[@"h5PayUrl"]
         fromScheme:[self scheme]
         callback:^(NSDictionary *resultDic) {
            callback(@[resultDic]);
        }];
        resolve([NSNumber numberWithBool:isIntercepted]);
    });
}

@end
