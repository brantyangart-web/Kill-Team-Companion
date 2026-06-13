---
title: '全面重构 Kill Team Companion 项目结构'
type: 'refactor'
created: '2026-06-13'
status: 'done'
baseline_commit: '75fd33b50504962d833f204436d155eeb49d78b8'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** 项目根目录散落 20 个 PNG 图片、4 个 WAV 音效，加上一个 4654 行的单体 index.html（内联全部 CSS + JS）。src/ 目录已有部分提取的模块但未被引用，与内联代码功能重复。项目无构建工具、无模块化、无标准目录结构，维护困难。

**Approach:** 按前端项目标准重构目录结构——资源按类型归入 `assets/`；将 index.html 的内联 CSS 和 JS 拆分为独立文件并模块化；引入 Vite 作为开发/构建工具；统一 src/ 中的模块与 index.html 中的内联代码（消除重复）。

## Boundaries & Constraints

**Always:**
- 重构后应用功能必须与重构前完全一致（纯重构，零功能变更）
- 所有资源引用路径必须正确更新，不产生 404
- 使用 ES Module 语法（import/export）
- 保留 `demo.js` 的可执行性（通过 `npm run demo`）

**Ask First:**
- 是否删除根目录下未被引用的 WAV 文件（目前应用使用 Web Audio API 生成音效，WAV 文件未被引用）
- 是否将 src/rules/ 和 src/models/ 的现有模块作为重构后的正式模块（而非重写）

**Never:**
- 不修改游戏规则逻辑、数值、UI 交互行为
- 不引入任何新功能
- 不删除 git 历史
- 不修改 .claude/ 或 _bmad/ 目录

</frozen-after-approval>

## Code Map

- `index.html` -- 主应用文件（4654行，包含全部 HTML + 内联 CSS + 内联 JS），需拆分
- `src/models/agent.js` -- Agent 类（与内联 Operative 类功能重复）
- `src/models/weapon.js` -- Weapon 类（与内联 Weapon 类功能重复）
- `src/rules/dice.js` -- 骰子工具函数
- `src/rules/shootResolver.js` -- 射击结算逻辑
- `demo.js` -- 命令行演示脚本，引用 src/ 模块
- `package.json` -- 项目配置（当前无依赖）
- 根目录 20 个 PNG -- 特工头像、阵营头图、背景图、默认头像
- 根目录 4 个 WAV -- 音效文件（未被应用引用）

## Tasks & Acceptance

**Execution:**

- [ ] `package.json` -- 添加 Vite 为开发依赖，添加 dev/build/preview 脚本，更新项目名称 -- 启用现代构建工具链
- [ ] `vite.config.js` -- 创建 Vite 配置，设置 assets 路径别名 -- 统一资源引用
- [ ] `assets/images/operatives/sm/` + `assets/images/operatives/pm/` -- 将 14 个特工头像 PNG 按阵营移入子目录 -- 消除根目录图片混乱
- [ ] `assets/images/headers/` -- 将 2 个阵营头图 PNG 移入 -- 同上
- [ ] `assets/images/backgrounds/` -- 将 2 个背景 PNG 移入 -- 同上
- [ ] `assets/images/defaults/` -- 将 2 个默认头像 PNG 移入 -- 同上
- [ ] `assets/audio/` -- 将 4 个 WAV 移入 -- 同上
- [ ] `src/styles/main.css` -- 从 index.html 提取全部 `<style>` 内容（~1090行 CSS）为独立 CSS 文件 -- 实现样式模块化
- [ ] `src/js/constants.js` -- 提取 SM_TEMPLATES 和 PM_TEMPLATES 数据（含图片路径更新） -- 分离数据与逻辑
- [ ] `src/js/models.js` -- 提取并统一 Weapon 和 Operative 类（合并 src/models/ 中的已有版本） -- 消除代码重复
- [ ] `src/js/audio.js` -- 提取 Web Audio API 音效系统（playSound 函数及所有音效类型） -- 独立音频模块
- [ ] `src/js/state.js` -- 提取 gameState 对象和相关状态操作函数 -- 集中状态管理
- [ ] `src/js/combat.js` -- 提取射击和近战结算函数 -- 分离战斗逻辑
- [ ] `src/js/ui.js` -- 提取所有 UI 渲染函数（选人面板、特工卡片、弹窗等） -- 分离 UI 层
- [ ] `src/js/app.js` -- 创建主入口文件，导入并初始化所有模块 -- 应用启动点
- [ ] `index.html` -- 精简为 HTML 骨架模板，引用外部 CSS 和 `<script type="module">` 入口 -- 成为 Vite 标准入口
- [ ] `src/models/agent.js`, `src/models/weapon.js`, `src/rules/dice.js`, `src/rules/shootResolver.js` -- 确认 demo.js 引用路径兼容，必要时调整导出 -- 保持 demo 可运行

**Acceptance Criteria:**
- Given 项目根目录, when 列出根目录文件, then 只包含 `index.html`, `package.json`, `vite.config.js`, `demo.js`, `assets/`, `src/`, `_bmad/`, `.claude/` 等标准项，不再有散落的 PNG/WAV 文件
- Given `npm run dev` 已启动, when 浏览器打开应用, then 所有 UI 正常渲染、图片正确加载、交互功能正常
- Given `npm run build` 执行完成, when 预览构建产物 (`npm run preview`), then 应用功能与开发模式完全一致
- Given `npm run demo` 执行, then 命令行演示脚本正常输出战斗结算结果

## Spec Change Log

## Design Notes

**目录结构（重构后）：**

```
Kill-Team-Companion/
├── assets/
│   ├── audio/                    # 4 个 WAV 音效
│   └── images/
│       ├── backgrounds/          # bg_melee_action.png, bg_shoot_action.png
│       ├── defaults/             # default_sm_avatar.png, default_pm_avatar.png
│       ├── headers/              # faction_header_sm.png, faction_header_pm.png
│       └── operatives/
│           ├── sm/               # 7 个 Space Marine 头像
│           └── pm/               # 7 个 Plague Marine 头像
├── src/
│   ├── js/
│   │   ├── app.js               # 主入口
│   │   ├── audio.js             # Web Audio 音效系统
│   │   ├── combat.js            # 射击/近战结算
│   │   ├── constants.js         # 阵营数据模板
│   │   ├── models.js            # Weapon + Operative 类
│   │   ├── state.js             # gameState 状态管理
│   │   └── ui.js                # UI 渲染与交互
│   ├── models/                  # 保留：供 demo.js 使用
│   │   ├── agent.js
│   │   └── weapon.js
│   ├── rules/                   # 保留：供 demo.js 使用
│   │   ├── dice.js
│   │   └── shootResolver.js
│   └── styles/
│       └── main.css             # 提取的全部 CSS
├── index.html                   # 精简 HTML 骨架 + Vite 入口
├── demo.js                      # CLI 演示（保持可运行）
├── package.json
└── vite.config.js
```

**模块依赖关系：** `app.js` → `state.js`, `ui.js`, `audio.js`, `combat.js`, `constants.js`, `models.js`。所有 UI 函数通过 `ui.js` 暴露为全局函数（因 HTML onclick 属性需要），Vite 构建时自动处理。

## Verification

**Commands:**
- `npm install` -- expected: Vite 安装成功，无错误
- `npm run dev` -- expected: Vite dev server 启动，控制台无报错
- `npm run build` -- expected: 构建成功，输出到 dist/
- `npm run preview` -- expected: 预览服务器启动，应用正常运行
- `npm run demo` -- expected: Node.js 演示脚本正常执行

## Suggested Review Order

**Entry Point & Module Wiring**

- 主入口：导入所有模块并连接跨模块回调 + window 全局函数绑定
  [`app.js:1`](../../src/js/app.js#L1)

- 跨模块回调初始化——解决循环依赖的核心模式
  [`app.js:51`](../../src/js/app.js#L51)

**Build Configuration**

- Vite 配置：路径别名与构建设置
  [`vite.config.js:1`](../../vite.config.js#L1)

- 项目元数据与脚本命令更新
  [`package.json:1`](../../package.json#L1)

**Resource Organization**

- 常量数据模板——所有图片路径已更新到 assets/ 目录
  [`constants.js:1`](../../src/js/constants.js#L1)

- 精简后的 HTML 骨架——图片引用指向新路径
  [`index.html:1`](../../index.html#L1)

**Core Modules**

- 游戏状态管理——gameState + wizardState + 回调模式
  [`state.js:1`](../../src/js/state.js#L1)

- Weapon + Operative 模型类——UI 回调解耦
  [`models.js:1`](../../src/js/models.js#L1)

- Web Audio 音效系统——完整的 12 种音效
  [`audio.js:1`](../../src/js/audio.js#L1)

**UI Layer**

- 42 个 UI 渲染函数——选人、面板、弹窗、特效
  [`ui.js:1`](../../src/js/ui.js#L1)

- 提取的完整 CSS（1076 行）
  [`main.css:1`](../../src/styles/main.css#L1)

**Combat System**

- 31 个战斗结算函数——射击与近战完整流程
  [`combat.js:1`](../../src/js/combat.js#L1)
