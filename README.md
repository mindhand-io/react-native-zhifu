# Mindhand 前端工具链

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

- `@mindhand-io/eslint-config` 公共 ESLint 配置 [使用说明](./packages/eslint-config)
- `@mindhand-io/utils` 公共函数库 [使用说明](./packages/utils)

## 如何贡献

- 克隆本仓库，运行 `npm run bootstrap` 自动安装所有仓库的 npm 包依赖
- 如果要创建新的包，运行 `npx lerna create <包名>`
- 如果要修改已有的包，修改完后务必遵循 [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) 规范编写 git commit message
- 运行 `npm run publish` 将包发布到私有 GitHub Packages，并自动生成 CHANGELOG.md
