# 组件清单

> Kill Team Companion — UI 组件与模块清单

## 模块清单

### 核心应用模块（src/js/）

| 模块 | 文件 | 行数 | 导出函数数 | 职责 |
|------|------|------|-----------|------|
| **app.js** | 入口 | 148 | 0（纯初始化） | 模块导入、回调连接、window全局暴露 |
| **state.js** | 状态管理 | 144 | 7 | 游戏状态、回合流转、阵营切换 |
| **models.js** | 数据模型 | 103 | 4 | Weapon + Operative 类定义 |
| **constants.js** | 常量数据 | 105 | 3 | 阵营模板、规则文本 |
| **audio.js** | 音效系统 | 212 | 2 | Web Audio API 程序化音效 |
| **ui.js** | UI 渲染 | 1246 | 42 | 所有界面渲染与交互函数 |
| **combat.js** | 战斗系统 | 1508 | 31 | 射击/近战完整结算流程 |

### 独立演示模块（供 demo.js）

| 模块 | 文件 | 职责 |
|------|------|------|
| **agent.js** | src/models/ | Agent 类（demo.js 专用） |
| **weapon.js** | src/models/ | Weapon 类（demo.js 专用） |
| **dice.js** | src/rules/ | 骰子工具函数 |
| **shootResolver.js** | src/rules/ | 射击结算逻辑 |

## UI 组件分类

### 布局组件

| 组件 | HTML ID/Class | 对应函数 | 说明 |
|------|--------------|---------|------|
| 全局仪表盘 | `#global-dash` | `updateScoresUI()` | TP、VP/CP、阶段徽章 |
| 引导横幅 | `#guidance-banner` | `updateGuidance()` | 新手操作提示条 |
| 部署选人 | `#start-screen` | `renderRosterPickers()` | 双阵营选人面板 |
| 主战场 | `#battle-area` | `renderOperatives()` | 三栏布局战场 |
| 阵营面板 | `.operative-board` | `renderOperatives()` | 左右两侧特工列表 |
| 操作中心 | `.activation-center` | `updateActivePanel()` | 中间激活操作区 |
| 战况日志 | `.battle-log-card` | `addLog()` | 实时战斗日志滚动区 |

### 弹窗组件

| 组件 | HTML ID | 对应函数 | 说明 |
|------|---------|---------|------|
| 战斗弹窗 | `#combat-modal` | `openModal()` / `closeModal()` | 射击/近战引导多步弹窗 |
| 帮助弹窗 | `#help-modal` | `showRuleHelp()` / `closeHelpModal()` | 规则文本展示 |
| 阶段锁屏 | `#phase-overlay` | `showPhaseOverlay()` / `hidePhaseOverlay()` | 阶段切换全屏遮罩 |
| 阵亡提示 | `#death-overlay` | `triggerOperativeDeathOverlay()` | 特工阵亡大屏 + 动画 + 恶搞台词 |

### 战斗引导步骤（combat-modal 内部）

#### 射击引导（7步）

| 步骤 | 函数 | 说明 |
|------|------|------|
| 1 | `renderShootStep()` | 选择防御方特工 |
| 2 | `renderShootStep()` | 选择武器 |
| 3 | `renderShootStep()` | 确认射程/可见性/掩体 |
| 4 | `renderShootStep()` | 投攻击骰（随机/手动） |
| 5 | `renderShootStep()` | 投防御骰（随机/手动） |
| 6 | `renderShootStep()` | 确认命中与伤害 |
| 7 | `confirmShootResult()` | 结算完成，分配伤害 |

#### 近战引导（6步）

| 步骤 | 函数 | 说明 |
|------|------|------|
| 1 | `renderFightStep()` | 选择防御方特工 |
| 2 | `renderFightStep()` | 选择武器 |
| 3 | `renderFightStep()` | 确认交战距离 |
| 4 | `renderFightStep()` | 投双方骰子 |
| 5 | `renderFightStep()` | 交替打击/招架选择 |
| 6 | `confirmFightResult()` | 结算完成 |

### 交互控件

| 控件 | 类型 | 绑定函数 | 说明 |
|------|------|---------|------|
| VP/CP 调整 | `onclick` | `adjustScore(faction, type, amount)` | 分数增减按钮 |
| 重置对局 | `onclick` | `confirmReset()` | 重置全部游戏状态 |
| 选人复选 | `onclick` | `toggleSelectSM/PM(id)` | 部署选人勾选 |
| 部署确认 | `onclick` | `validateRostersAndDeploy()` | 验证并开始对局 |
| 激活特工 | `onclick` | `activateOperative(id)` | 点击特工卡片激活 |
| 移动/冲锋 | `onclick` | `performMove()` / `performCharge()` | 消耗 1 APL |
| 射击/近战 | `onclick` | `openShootWizard()` / `openFightWizard()` | 打开战斗弹窗 |
| 结束激活 | `onclick` | `endActivation()` | 结束当前特工回合 |
| 先攻骰 | `onclick` | `rollInitiativeOverlay()` | 先攻判定投骰 |
| 购买策略 | `onclick` | `buyPloy()` | 消耗 CP 购买策略 |
| 头像上传 | `onchange` | `handleAvatarFileSelect(event)` | 自定义特工头像 |

## 状态管理函数

| 函数 | 模块 | 说明 |
|------|------|------|
| `initUiCallbacks()` | state.js | 注入 UI 回调 |
| `initModelCallbacks()` | models.js | 注入 UI 回调 |
| `initCombatCallbacks()` | ui.js | 注入 Combat 回调 |
| `initCombatUiCallbacks()` | combat.js | 注入 UI 回调 |
| `resetWizardState()` | state.js | 重置战斗引导状态 |
| `hasUsableOperatives()` | state.js | 检查阵营是否有可用特工 |
| `endTurningPoint()` | state.js | 推进到下一 Turning Point |
| `switchSides()` | state.js | 交替阵营激活 |

## 数据对象

| 对象 | 模块 | 类型 | 说明 |
|------|------|------|------|
| `gameState` | state.js | `export const` | 游戏核心状态 |
| `wizardState` | state.js | `export let` | 战斗引导状态（可变） |
| `SM_TEMPLATES` | constants.js | `const` | 死亡天使 7 人模板 |
| `PM_TEMPLATES` | constants.js | `const` | 瘟疫守卫 7 人模板 |
| `RULE_TEXTS` | constants.js | `const` | 4 种行动规则文本 |
| `GAG_MESSAGES` | state.js | `export const` | 7 条阵亡恶搞台词 |
| `audioCtx` | audio.js | `export const` | Web Audio 上下文 |
