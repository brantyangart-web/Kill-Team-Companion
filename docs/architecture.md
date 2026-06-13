# 架构文档

> Kill Team Companion — Warhammer 40K Kill Team 战斗助手应用架构

## 概述

Kill Team Companion 是一个纯前端的单页应用（SPA），用于辅助《战锤40K：杀戮小队》实体桌游的战斗结算。应用实现了完整的游戏回合流程——从先攻判定到最终得分，包括射击结算、近战搏斗、伤害分配等核心机制。

**架构特点：** 模块化单体应用，通过回调注入模式解决 ES Module 循环依赖，无后端依赖，零外部框架。

## 技术栈

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 构建工具 | Vite | ^6.3.5 | 开发服务器 + 生产构建 |
| 语言 | JavaScript | ES2022+ | ES Module 语法 |
| 样式 | CSS3 | — | 单文件 1076 行，CSS 变量主题系统 |
| 音频 | Web Audio API | — | 12种程序化生成音效，无外部音频依赖 |
| 字体 | Google Fonts | — | Orbitron (标题) + Outfit (正文) |

## 架构模式

### 整体架构：事件驱动的状态机

应用遵循**显式状态机模式**管理游戏流程：

```
部署选人 (Deployment)
  → 先攻阶段 (Initiative)
    → 策略阶段 (Strategy)
      → 战斗阶段 (Firefight)
        → 回合得分 (Scoring)
          → 下一 Turning Point 或 胜利
```

每个阶段由 `gameState.phase` 控制，通过 UI 函数（如 `startInitiativePhase()`、`proceedToFirefight()`）驱动状态流转。

### 模块架构：回调注入模式

为解决 ES Module 的循环依赖问题（如 `models.js` ↔ `ui.js`、`ui.js` ↔ `combat.js`），采用**回调注入模式**：

```javascript
// state.js — 声明空的回调容器
const ui = {};
export function initUiCallbacks(callbacks) {
  Object.assign(ui, callbacks);
}

// app.js — 在初始化时注入实际函数
initUiCallbacks({
  addLog,
  updateScoresUI,
  renderOperatives,
  // ...
});
```

**四组回调连接：**

| 初始化函数 | 所在模块 | 注入来源 | 解决的循环 |
|-----------|---------|---------|-----------|
| `initUiCallbacks()` | state.js | ui.js 函数 | state ↔ ui |
| `initModelCallbacks()` | models.js | ui.js 函数 | models ↔ ui |
| `initCombatCallbacks()` | ui.js | combat.js 函数 | ui ↔ combat |
| `initCombatUiCallbacks()` | combat.js | ui.js 函数 | ui ↔ combat |

### HTML 事件绑定：window 全局函数

由于 HTML 使用 `onclick` 属性（非事件监听器），所有需要从 HTML 调用的函数必须挂载到 `window` 对象：

```javascript
// app.js — 将模块函数暴露给 HTML onclick
window.openShootWizard = openShootWizard;
window.adjustScore = adjustScore;
// ... 共 30+ 个全局函数
```

## 数据架构

### 游戏状态（gameState）

```javascript
gameState = {
  turningPoint: 1,        // 当前回合数
  phase: 'Initiative',    // 当前阶段
  initiative: 'Space Marine', // 先攻方
  activeTurn: 'Space Marine', // 当前激活阵营
  activeAgent: null,       // 当前激活特工

  smVp: 0, smCp: 2,       // 死亡天使 VP/CP
  pmVp: 0, pmCp: 2,       // 瘟疫守卫 VP/CP

  smActivePloys: [],       // 活跃策略（死亡天使）
  pmActivePloys: [],       // 活跃策略（瘟疫守卫）

  operatives: [],          // 场上所有特工实例
  gameOver: false,         // 游戏是否结束
  customAvatars: {},       // 用户自定义头像映射
  smKillsScored: 0,        // 死亡天使击杀数
  pmKillsScored: 0         // 瘟疫守卫击杀数
}
```

### 战斗结算引导状态（wizardState）

```javascript
wizardState = {
  actionType: 'shoot',     // 'shoot' 或 'fight'
  step: 1,                 // 当前引导步骤
  attacker: null,          // 攻击方 Operative 实例
  defender: null,          // 防御方 Operative 实例
  weapon: null,            // 使用武器 Weapon 实例
  mode: 'random',          // 'random' 或 'manual'
  attackRolls: [],         // 攻击骰结果
  defenseRolls: [],        // 防御骰结果
  // ...
}
```

### 数据模型

| 类 | 文件 | 说明 |
|----|------|------|
| `Weapon` | models.js | 武器数据：名称、攻击次数、技能阈值、普通/暴击伤害 |
| `Operative` | models.js | 特工数据：生命值、APL、防御力、护甲值、武器列表、状态 |

### 阵营模板数据

- **SM_TEMPLATES** — 7个死亡天使特工模板（Captain、Sergeant、Sniper 等）
- **PM_TEMPLATES** — 7个瘟疫守卫特工模板（Champion、Caster、Fighter 等）
- **RULE_TEXTS** — 4种行动的规则帮助文本（移动、冲锋、射击、近战）

## 战斗系统架构

### 射击结算流程（openShootWizard）

```
选择目标 → 选择武器 → 确认射程/可见性 → 投攻击骰 → 投防御骰 → 确认结果 → 伤害分配
  Step 1      Step 2      Step 3          Step 4      Step 5      Step 6     Step 7
```

### 近战结算流程（openFightWizard）

```
选择目标 → 选择武器 → 确认交战距离 → 投双方骰 → 交替打击/招架 → 确认结果
  Step 1      Step 2      Step 3         Step 4       Step 5         Step 6
```

### 伤害分配机制

瘟疫守卫拥有特殊能力**恶心作呕（Disgustingly Resilient, DR 5+）**：
- 每点伤害单独投骰，5+ 免除该点伤害
- 若激活「传染韧性」策略（contagious_resilience），允许重投一次失败骰

## UI 架构

### HTML 结构层级

```
app-container
├── global-dash              # 顶部仪表盘（TP、VP、CP、阶段）
├── guidance-banner          # 新手引导条
├── start-screen             # 部署选人界面
├── battleground             # 主战场（激活后显示）
│   ├── operative-board.sm   # 死亡天使特工面板
│   ├── activation-center    # 中间操作区
│   │   ├── active-card      # 激活特工操作面板
│   │   └── battle-log-card  # 实时战况日志
│   └── operative-board.pm   # 瘟疫守卫特工面板
├── combat-modal             # 战斗判定引导弹窗
├── help-modal               # 规则帮助弹窗
├── phase-overlay            # 阶段锁定挡板
└── death-overlay            # 特工阵亡提示
```

### CSS 主题系统

使用 CSS 自定义属性实现阵营主题色：
- `--sm-accent` / `--pm-accent` — 阵营强调色
- `--gold` / `--red` / `--green` — 功能色
- `--bg-card` / `--text-primary` / `--text-muted` — 通用色

## 音效系统

基于 Web Audio API 的程序化音效生成，12种音效类型：

| 音效 | 触发场景 | 技术实现 |
|------|---------|---------|
| click | 按钮点击 | 600Hz 方波短脉冲 |
| shoot | 射击行动 | 3连发白噪音 + 低通滤波 |
| crit | 暴击 | 880→1200Hz 锯齿波 |
| save | 成功防御 | 988Hz 正弦波 |
| flesh | 伤害命中 | 带通滤波白噪音 |
| bubble | DR 免伤 | 200→1200Hz 正弦滑音 |
| alert | 操作警告 | 330Hz 三角波 |
| epic_win | 胜利大捷 | C大调琶音 |
| epic_fail | 失败 | 下行锯齿波滑音 |
| funeral | 特工阵亡 | 庄重短调序列 |
| metal_clash | 金属格挡 | 双频正弦+三角波 |
| heavy_strike | 沉重打击 | 低频锯齿波 + 带通噪音 |

## 独立演示系统

`demo.js` 是独立于主应用的命令行战斗结算演示，使用 `src/models/` 和 `src/rules/` 下的独立模块（Agent、Weapon、ShootResolver），不依赖浏览器环境。

4个演示场景：
1. 开阔地带随机射击
2. 目标隐蔽在重掩体后（Q&A拦截）
3. 目标在掩体中但非隐蔽（掩体保留Save）
4. 物理骰录入模式（精确骰值模拟）
