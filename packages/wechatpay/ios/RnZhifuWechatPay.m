#import "RnZhifuWechatPay.h"

@implementation RnZhifuWechatPay

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

        // 反注释下面代码，可以输出微信 SDK 调试信息，便于诊断问题
//        [WXApi startLogByLevel:WXLogLevelDetail logBlock:^(NSString *log) {
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
    [WXApi handleOpenURL:aURL delegate:self];
}

-(void)onResp:(BaseResp *)resp
{
    if ([resp isKindOfClass:[PayResp class]]) {
        if ([self paymentResultResolver] != nil) {
            NSString* errStr = [resp errStr];
            if (errStr == nil) errStr = @"";
            [self paymentResultResolver](@{
                @"errCode": [NSNumber numberWithInt:[resp errCode]],
                @"errStr": errStr,
                @"returnKey": [(PayResp*)resp returnKey]
                                         });
        }
    }
}

RCT_REMAP_METHOD(getSdkVersion,
                 getSdkVersionWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve([WXApi getApiVersion]);
}

RCT_REMAP_METHOD(init,
                 initWithOptions:(NSDictionary*)options
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    [WXApi registerApp:options[@"appId"] universalLink:options[@"universalLink"]];
    resolve(nil);
}

RCT_REMAP_METHOD(pay,
                 payWithOptions:(NSDictionary*)options
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    PayReq *request = [[PayReq alloc] init];
    request.partnerId = options[@"partnerId"];
    request.prepayId = options[@"prepayId"];
    request.package = options[@"package"];
    request.nonceStr = options[@"nonceStr"];
    request.timeStamp = [(NSNumber*)options[@"timestamp"] intValue];
    request.sign = options[@"sign"];
    dispatch_async(dispatch_get_main_queue(), ^{
        [WXApi sendReq:request completion:^(BOOL success) {
            [self setPaymentResultResolver:resolve];
        }];
    });
}

@end
