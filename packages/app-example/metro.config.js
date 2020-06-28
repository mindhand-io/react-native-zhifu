const path = require("path");

const reactNativePath = require.resolve("react-native");
const reactNativeFolder = `${
  reactNativePath.split("node_modules/react-native/")[0]
}node_modules/react-native/`;

async function createConfig() {
  return {
    transformer: {
      publicPath: "/assets/dark/magic",
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
    /**
     * 关于 React Native 和 Monorepo 结合可以参考：https://engineering.brigad.co/react-native-monorepos-code-sharing-f6c08172b417
     */
    watchFolders: [path.resolve(__dirname, "../../")],
    resolver: {
      /**
       * 解决 Metro 不支持 Symlink 问题
       *
       * Ref: https://github.com/facebook/metro/issues/1#issuecomment-541642857
       */
      extraNodeModules: new Proxy(
        {},
        {
          get: (_, name) => {
            return path.join(__dirname, `node_modules/${name}`);
          },
        }
      ),
      server: {
        enhanceMiddleware: (middleware) => {
          return (req, res, next) => {
            if (req.url.startsWith("/assets/dark/magic")) {
              req.url = req.url.replace("/assets/dark/magic", "/assets");
            } else if (req.url.startsWith("/assets/dark")) {
              req.url = req.url.replace("/assets/dark", "/assets/..");
            } else if (req.url.startsWith("/assets")) {
              req.url = req.url.replace("/assets", "/assets/../..");
            }
            return middleware(req, res, next);
          };
        },
      },
    },
  };
}

module.exports = createConfig();
