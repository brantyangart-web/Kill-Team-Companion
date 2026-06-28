# Tests — Kill Team Companion

单元测试，针对纯规则引擎 `src/rules/`。**不含 UI/E2E**（按当前设计约束）。

## 运行

```bash
npm install          # 首次：安装 vitest
npm test             # 单次运行
npm run test:watch   # 监听模式
npm run test:coverage # 覆盖率（仅 src/rules/）
```

要求 Node ≥ 22（见 `.nvmrc`）。

## 目录结构

```
tests/
  unit/                    # 单元测试，镜像 src/rules/
    dice.test.js
    shootResolver.test.js
  support/
    fixtures/
      combat.js            # POJO 工厂：makeAttacker/makeDefender/makeWeapon
```

`vitest.config.js` 仅收集 `tests/unit/**/*.test.js`，覆盖率仅统计 `src/rules/**/*.js`。

## 重要约定：不要用 models.js 的类

`src/js/models.js` 的 `Operative`/`Weapon` 与 DOM 耦合（导入 `audio.js`/`state.js`，运行时调用 `confirm()`/`playSound`/`ui.*`），无法在 node 下导入。规则引擎消费的是鸭子类型接口，因此：

- **一律用 `tests/support/fixtures/combat.js` 的 POJO 工厂**，不要 `new Operative(...)`。
- 射击测试用 `mode: 'manual'` + `manualAttack`/`manualDefense` 显式骰子，保证确定性（默认 `mode:'random'` 会真随机）。

### 鸭子类型契约（`shootResolver.resolveShooting`）
- attacker: `{ name, faction, apl, actionsPerformed }`
- defender: `{ name, faction, df, sv, wounds, maxWounds, applyDamage(totalDmg, log, drRolls) -> number }`
- weapon: `{ name, attacks, bs, normalDamage, criticalDamage, isRanged?, rules? }`

注意：`shootResolver` 用 `weapon.bs` / `defender.applyDamage`，而 `models.js` 用 `weapon.ts` / `operative.applyWounds` —— 两套实现尚未对齐（见测试设计文档 R1）。

## 规则为准（oracle = 规则文档，不是代码）

所有用例一律以 `docs/rules/merged/merged_kt_lite_rules_zh.md` 为 oracle 编写。
**代码与规则不符时，用例必须 FAIL（真实失败），并在标题标注缺陷编号（D1、D12…）。**
修复代码后自然转绿——不要为了让 `npm test` 变绿而放宽断言。

规则分歧登记（已修/待修）见独立文件：[known-deviations.md](known-deviations.md)。

## 后续

- 武器规则注册表（`applyWeaponRules`）、阵营注入、近战：待 `combat.js` 抽取/导出纯函数或 `src/rules/` 增加 `resolveMelee` 后补测（设计文档 S3/S4/S5）。
- 可选：`@vitest/coverage-v8` 已配置；UI 层将来可用 `vitest browser mode`，无需换 runner。
