# 源码树分析

> Kill Team Companion — 项目目录结构详解

## 项目根目录

```
Kill-Team-Companion/
├── index.html                   # 🏠 应用入口 — Vite SPA HTML 骨架（306行）
│                                #    包含所有UI结构：仪表盘、选人面板、战场、弹窗
│                                #    通过 <script type="module"> 引用 app.js
│
├── package.json                 # 📦 项目配置 — Vite 6.3.5 + ES Module
├── package-lock.json            # 依赖锁定文件
├── vite.config.js               # ⚙️ Vite 构建配置 — 路径别名 @ → src, @assets → assets
├── demo.js                      # 🎮 CLI 演示脚本 — Node.js 命令行战斗结算演示（125行）
│
├── assets/                      # 🎨 静态资源（按类型分类）
│   ├── audio/                   #    音效文件（4个WAV，当前应用使用Web Audio API生成音效，
│   │   ├── dice_roll.wav        #    这些文件保留备用）
│   │   ├── gunshot.wav
│   │   ├── sword_clash.wav
│   │   └── sword_strike.wav
│   └── images/
│       ├── backgrounds/         #    战斗动作背景图
│       │   ├── bg_melee_action.png   # 近战背景
│       │   └── bg_shoot_action.png   # 射击背景
│       ├── defaults/            #    默认头像
│       │   ├── default_sm_avatar.png # 星际战士默认头像
│       │   └── default_pm_avatar.png # 瘟疫守卫默认头像
│       ├── headers/             #    阵营标题头图
│       │   ├── faction_header_sm.png # 死亡天使阵营头图
│       │   └── faction_header_pm.png # 瘟疫守卫阵营头图
│       └── operatives/          #    特工头像（按阵营分目录）
│           ├── sm/              #      死亡天使（7个）
│           │   ├── sm_captain.png
│           │   ├── sm_sergeant.png
│           │   ├── sm_sniper.png
│           │   ├── sm_heavy_gunner.png
│           │   ├── sm_assault.png
│           │   ├── sm_warrior_a.png
│           │   └── sm_warrior_b.png
│           └── pm/              #      瘟疫守卫（7个）
│               ├── pm_champion.png
│               ├── pm_caster.png
│               ├── pm_icon.png
│               ├── pm_fighter.png
│               ├── pm_heavy.png
│               ├── pm_gunner.png
│               └── pm_warrior.png
│
├── src/                         # 📂 源代码
│   ├── js/                      #    主应用 JavaScript 模块
│   │   ├── app.js               # ⭐ 主入口（148行）— 模块导入、回调连接、window全局暴露
│   │   ├── state.js             # 📊 游戏状态管理（144行）— gameState + wizardState
│   │   ├── models.js            # 🎯 数据模型（103行）— Weapon + Operative 类
│   │   ├── constants.js         # 📋 常量数据（105行）— 阵营模板 + 规则文本
│   │   ├── audio.js             # 🔊 音效系统（212行）— Web Audio API 12种音效
│   │   ├── ui.js                # 🖥️ UI渲染（1246行）— 42个UI函数
│   │   └── combat.js            # ⚔️ 战斗系统（1508行）— 31个战斗结算函数
│   │
│   ├── models/                  #    独立模型类（供 demo.js 使用）
│   │   ├── agent.js             #      Agent 类
│   │   └── weapon.js            #      Weapon 类
│   │
│   ├── rules/                   #    独立规则引擎（供 demo.js 使用）
│   │   ├── dice.js              #      骰子工具函数
│   │   └── shootResolver.js     #      射击结算逻辑
│   │
│   └── styles/
│       └── main.css             # 🎨 完整样式表（1076行）— 从原 index.html 提取
│
├── docs/                        # 📝 项目文档（本目录）
│   └── ...
│
├── _bmad/                       # 🛠️ BMAD 工具配置（不修改）
└── .claude/                     # 🤖 Claude Code 配置（不修改）
```

## 关键目录说明

| 目录 | 用途 | 备注 |
|------|------|------|
| `src/js/` | 主应用7个核心模块 | ES Module import/export |
| `src/models/` | demo.js 专用模型 | 与主应用 models.js 功能类似但接口不同 |
| `src/rules/` | demo.js 专用规则引擎 | 独立结算逻辑 |
| `src/styles/` | CSS 样式 | 单文件，1076行 |
| `assets/images/` | 26个图片资源 | 按用途分5个子目录 |
| `assets/audio/` | 4个WAV音效 | 应用使用Web Audio API，这些保留备用 |

## 入口点

| 入口 | 类型 | 路径 |
|------|------|------|
| 浏览器应用 | Vite SPA | `index.html` → `src/js/app.js` |
| CLI 演示 | Node.js | `demo.js` → `src/models/` + `src/rules/` |

## 模块依赖关系

```
index.html
  └── app.js ← 主入口，连接所有模块
       ├── state.js ← gameState, wizardState
       │    └── audio.js ← playSound()
       ├── models.js ← Weapon, Operative 类
       │    ├── audio.js
       │    └── state.js
       ├── constants.js ← 阵营模板数据
       │    └── models.js (Weapon类)
       ├── audio.js ← Web Audio API 音效
       ├── ui.js ← 42个UI函数
       │    ├── state.js
       │    ├── audio.js
       │    ├── constants.js
       │    └── models.js
       └── combat.js ← 31个战斗函数
            ├── state.js
            ├── audio.js
            └── models.js

循环依赖通过回调模式解决：
  models.js ←→ ui.js: initModelCallbacks()
  ui.js ←→ combat.js: initCombatCallbacks() / initCombatUiCallbacks()
  state.js ←→ ui.js: initUiCallbacks()
```
