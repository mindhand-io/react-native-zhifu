const path = require("path");

async function createConfig() {
  return {
    transformer: {
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
    },
  };
}

module.exports = createConfig();
