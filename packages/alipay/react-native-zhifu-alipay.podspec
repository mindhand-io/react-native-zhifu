require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = package["name"]
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-zhifu-alipay
                   DESC
  s.homepage     = "https://github.com/mindhand-io/react-native-zhifu-alipay"
  # brief license entry:
  s.license      = "MIT"
  # optional - use expanded license entry instead:
  # s.license    = { :type => "MIT", :file => "LICENSE" }
  s.authors      = { "Stackie Jia" => "stackie@mindhand.io" }
  s.platforms    = { :ios => "9.0" }
  s.source       = { :git => "https://github.com/mindhand-io/react-native-zhifu-alipay.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,c,m,swift}"
  s.requires_arc = true

  # 支付宝 SDK 依赖的 library 和 frameworks
  s.library = "c++", "z"
  s.frameworks = "UIKit", "Foundation", "CFNetwork", "SystemConfiguration", "QuartzCore", "CoreGraphics", "CoreMotion", "CoreTelephony", "CoreText", "WebKit"

  s.resource = "ios/AlipaySDK.bundle"
  s.vendored_frameworks = 'ios/AlipaySDK.framework'

  s.dependency "React"
end

