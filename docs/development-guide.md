# 开发指南

> Kill Team Companion — 本地开发与环境配置

## 前置要求

| 工具 | 最低版本 | 说明 |
|------|---------|------|
| Node.js | 18+ | ES Module 支持 |
| npm | 9+ | 包管理器 |

> 本项目**无任何生产依赖**，仅有 `vite` 作为开发依赖。

## 快速开始

```bash
# 1. 克隆项目
git clone <repository-url>
cd Kill-Team-Companion

# 2. 安装依赖（仅 vite）
npm install

# 3. 启动开发服务器
npm run dev
# → 浏览器自动打开 http://localhost:5173

# 4. 构建生产版本
npm run build
# → 输出到 dist/ 目录

# 5. 预览构建结果
npm run preview
# → 启动预览服务器验证构建

# 6. 运行 CLI 演示
npm run demo
# → Node.js 命令行战斗结算演示
```

## NPM 脚本

| 命令 | 作用 | 说明 |
|------|------|------|
| `npm run dev` | 启动 Vite 开发服务器 | 支持热更新（HMR） |
| `npm run build` | 生产构建 | 输出到 `dist/`，自动处理模块打包 |
| `npm run preview` | 预览构建结果 | 验证构建产物是否正常 |
| `npm run demo` | CLI 演示 | Node.js 运行 demo.js |

## 项目结构约定

### 路径别名（vite.config.js）

```javascript
resolve: {
  alias: {
    '@': resolve(__dirname, 'src'),       // @ → src/
    '@assets': resolve(__dirname, 'assets') // @assets → assets/
  }
}
```

### 模块导入规则

1. **主应用模块**（`src/js/` 之间）使用相对路径：
   ```javascript
   import { playSound } from './audio.js';
   ```

2. **样式导入**从 JS 入口文件引用：
   ```javascript
   // app.js
   import '../styles/main.css';
   ```

3. **demo.js** 使用相对路径引用 `src/` 子目录：
   ```javascript
   import { Agent } from './src/models/agent.js';
   ```

### 资源引用

| 资源类型 | 路径格式 | 示例 |
|---------|---------|------|
| 特工头像 | `./assets/images/operatives/{faction}/{name}.png` | `./assets/images/operatives/sm/sm_captain.png` |
| 阵营头图 | `./assets/images/headers/faction_header_{faction}.png` | `./assets/images/headers/faction_header_sm.png` |
| 背景图 | `./assets/images/backgrounds/bg_{type}_action.png` | `./assets/images/backgrounds/bg_shoot_action.png` |
| 默认头像 | `./assets/images/defaults/default_{faction}_avatar.png` | `./assets/images/defaults/default_sm_avatar.png` |

## 架构关键模式

### 添加新功能时的检查清单

1. **新 UI 函数** → 在 `ui.js` 中定义并 export
2. **需要从 HTML 调用** → 在 `app.js` 中添加 `window.xxx = xxx`
3. **跨模块调用** → 在 `app.js` 中通过 `initXxxCallbacks()` 注入
4. **新音效类型** → 在 `audio.js` 的 `playSound()` 中添加新的 `else if` 分支
5. **新阵营/特工** → 在 `constants.js` 中添加模板数据 + 对应头像到 `assets/`

### 循环依赖处理

本项目使用**回调注入模式**避免循环依赖。如果新模块需要调用另一个模块的函数：

```javascript
// 在被依赖模块中声明回调容器
const callbacks = {};
export function initXxxCallbacks(fns) {
  Object.assign(callbacks, fns);
}

// 在 app.js 中连接
import { initXxxCallbacks } from './xxx.js';
import { someFunction } from './yyy.js';
initXxxCallbacks({ someFunction });
```

## CSS 开发

- 单文件 `src/styles/main.css`（1076行）
- 使用 CSS 自定义属性（变量）实现主题
- 阵营主题色：`--sm-accent`（蓝色）、`--pm-accent`（绿色）
- 字体：Orbitron（标题）、Outfit（正文），通过 Google Fonts 加载

## 常见开发任务

### 添加新的特工类型

1. 在 `constants.js` 的 `SM_TEMPLATES` 或 `PM_TEMPLATES` 中添加模板对象
2. 在 `assets/images/operatives/{faction}/` 中放置头像 PNG
3. 更新模板中的 `defaultAvatar` 路径

### 添加新的战斗动作

1. 在 `ui.js` 的 `RULE_TEXTS` 中添加规则帮助文本
2. 在 `combat.js` 中实现结算逻辑
3. 在 `ui.js` 中添加 UI 渲染函数
4. 在 `app.js` 中连接回调并暴露到 window

### 添加新的音效

1. 在 `audio.js` 的 `playSound()` 中添加新的 `else if (type === 'xxx')` 分支
2. 使用 Web Audio API 的 OscillatorNode / BufferSource 实现
3. 在需要的地方调用 `playSound('xxx')`

## 测试

当前项目**无自动化测试**。验证方式：

- **浏览器验证**：`npm run dev` 手动测试所有交互
- **CLI 验证**：`npm run demo` 确认战斗结算引擎正常
- **构建验证**：`npm run build && npm run preview` 确认生产构建正常
