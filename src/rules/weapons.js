/**
 * weapons.js — 武器关键字声明式引擎
 *
 * 设计思想:
 *   所有武器规则以"纯函数修饰器"形式声明在 WEAPON_RULES 表中。
 *   每条规则接收上下文 ctx，返回一个 modifiers 对象，
 *   applyWeaponRules() 将所有修饰器聚合为一个统一的修改清单，
 *   供 combat.js / shootResolver.js 消费。
 *
 *   新增武器规则时：只需在 WEAPON_RULES 表中加一行，不动 combat 流程。
 *
 * 规则参考:
 *   docs/rules/MinerU_markdown_eng_jul25_kt_lite_rules-jmjv4hdamy-qlsqxdf83p.md (lines 201-242)
 */

// ==========================================
//        规则字符串解析器
// ==========================================

/**
 * 解析武器规则字符串，提取规则名和参数
 * @param {string} ruleStr - 例如 "Piercing Crits 1", "Torrent 2\"", "Heavy (Dash only)", "Lethal 5+"
 * @returns {{ name: string, param: string|null, rawParam: string }}
 *
 * 示例:
 *   "Piercing Crits 1"      → { name: "Piercing Crits", param: "1", rawParam: "1" }
 *   "Torrent 2\""           → { name: "Torrent",        param: "2", rawParam: '2"' }
 *   "Heavy (Dash only)"     → { name: "Heavy",          param: "Dash only", rawParam: "(Dash only)" }
 *   "Lethal 5+"             → { name: "Lethal",         param: "5", rawParam: "5+" }
 *   "Saturate"              → { name: "Saturate",       param: null, rawParam: null }
 *   "1\" Devastating 3"     → { name: "Devastating",    param: "3", param2: "1", rawParam: '1" ... 3' }
 */
export function parseWeaponRule(ruleStr) {
  const s = ruleStr.trim();

  // 处理 "1\" Devastating 3" 这种带距离前缀的格式
  const distancePrefixMatch = s.match(/^(\d+)"\s+(.+)$/);
  if (distancePrefixMatch) {
    const [, dist, rest] = distancePrefixMatch;
    const inner = parseWeaponRule(rest);
    return { name: inner.name, param: inner.param, param2: dist, rawParam: s };
  }

  // 处理 "Heavy (Dash only)"
  const parenMatch = s.match(/^([A-Za-z ]+?)\s*\((.+)\)$/);
  if (parenMatch) {
    return { name: parenMatch[1].trim(), param: parenMatch[2].trim(), rawParam: `(${parenMatch[2]})` };
  }

  // 处理 "Name X+" / "Name X" / 'Name X"' (带可选单位后缀 ")
  const numMatch = s.match(/^([A-Za-z ]+?)\s+(\d+)\+?"?$/);
  if (numMatch) {
    return { name: numMatch[1].trim(), param: numMatch[2], rawParam: numMatch[2] };
  }

  // 无参数
  return { name: s, param: null, rawParam: null };
}

// ==========================================
//        规则上下文类型
// ==========================================

/**
 * @typedef {Object} WeaponRuleContext
 * @property {number} retainedCrits - 当前保留的暴击骰数量
 * @property {number} retainedNorms - 当前保留的普通成功骰数量
 * @property {boolean} isInMelee - 是否处于近战结算中
 * @property {boolean} isFirstCritStrike - 是否为本序列的第一次暴击命中 (Shock)
 * @property {string} phase - 当前阶段 ('attack-roll' | 'retain' | 'defense' | 'melee-strike' | ...)
 */

// ==========================================
//        声明式规则表
// ==========================================

/**
 * 每条规则的签名: (ctx, param, param2) => modifiers
 *
 * modifiers 字段约定（所有字段可选）:
 *   autoRetainNormal: number           — Accurate: 自动保留 x 个普通成功（不投）
 *   rerollOneAttackDie: number         — Balanced: 可重投 1 颗攻击骰
 *   rerollAnyAttackDice: boolean       — Relentless: 可重投任意攻击骰
 *   rerollSpecificValue: number        — Ceaseless: 可重投投出该值的骰子
 *   critThreshold: number              — Lethal x+: x+ 视为暴击
 *   aoePrimarySecondary: number        — Blast x: 主目标 + x" 内次目标
 *   aoeRadius: number                  — Torrent x: 溅射半径
 *   immediateCritDmg: number           — Devastating x: 暴击立即造成 x 伤害
 *   aoeDistance: string|null           — Devastating 的距离前缀
 *   selfDamageOnLowRoll: boolean       — Hot: 低骰反噬
 *   usesPerBattle: number              — Limited x: 每场战斗 x 次使用上限
 *   defenseDiceReduction: number       — Piercing / Piercing Crits: 减少防御骰
 *   upgradeNormalToCrit: number        — Severe / Rending: 普通升级为暴击的数量
 *   retainOneFailAsNormal: number      — Punishing: 保留 1 个失败骰作为普通成功
 *   coverSavesDisabled: boolean        — Saturate: 禁用掩体骰
 *   defenseBlockRequiresCrit: boolean  — Brutal: 对手只能用暴击格挡
 *   canShootWhileConcealed: boolean    — Silent: Conceal 也能射击
 *   moveShootLock: string              — Heavy: 移动锁类型 ('all' | 'all-except-dash')
 *   firstCritDiscardsUnresolvedNormal: number — Shock: 第一次暴击丢弃对手 1 个未解决普通
 *   targetAplReduction: number         — Stun: 目标 APL 减值
 *   untilEndOfNextActivation: boolean  — Stun: 持续到目标下一次激活结束
 *   concealNoCover: boolean            — Seek: Conceal 单位不能利用掩体
 *   onlyLightTerrain: boolean          — Seek Light: 只针对 Light 地形
 *   maxRange: number                   — Range x: 射程上限
 */
export const WEAPON_RULES = {

  // ------------------------------------------
  // 保留阶段修饰符 (Retain Phase Modifiers)
  // ------------------------------------------

  /** Accurate x: 保留至多 x 颗攻击骰作为普通成功（不投） */
  'Accurate': (ctx, x) => ({ autoRetainNormal: parseInt(x, 10) }),

  /** Balanced: 可重投 1 颗攻击骰 */
  'Balanced': () => ({ rerollOneAttackDie: 1 }),

  /** Ceaseless: 可重投投出特定值的攻击骰 */
  'Ceaseless': (ctx, val) => ({ rerollSpecificValue: parseInt(val, 10) }),

  /** Lethal x+: x+ 视为暴击 */
  'Lethal': (ctx, x) => ({ critThreshold: parseInt(x, 10) }),

  /** Punishing: 若保留暴击，可保留 1 个失败骰作为普通成功 */
  'Punishing': (ctx) => {
    if (ctx.retainedCrits > 0) return { retainOneFailAsNormal: 1 };
    return {};
  },

  /** Relentless: 可重投任意攻击骰 */
  'Relentless': () => ({ rerollAnyAttackDice: true }),

  /** Rending: 若保留暴击，可将 1 个普通升级为暴击（与 Severe 互斥触发） */
  'Rending': (ctx) => {
    if (ctx.retainedCrits > 0) return { upgradeNormalToCrit: 1, source: 'Rending' };
    return {};
  },

  /** Severe: 若无暴击，将 1 个普通升级为暴击 */
  'Severe': (ctx) => {
    if (ctx.retainedCrits === 0) {
      return { upgradeNormalToCrit: 1, source: 'Severe' };
    }
    return {};
  },

  // ------------------------------------------
  // AoE 与次目标 (Area & Secondary Targets)
  // ------------------------------------------

  /** Blast x: 主目标溅射 x" 内所有次目标 */
  'Blast': (ctx, x) => ({ aoePrimarySecondary: parseInt(x, 10) }),

  /** Devastating x: 暴击立即额外造成 x 伤害（可带距离） */
  'Devastating': (ctx, x, dist) => ({
    immediateCritDmg: parseInt(x, 10),
    aoeDistance: dist || null,
  }),

  /** Torrent x: 选主目标后溅射 x" 内所有次目标（分别投骰） */
  'Torrent': (ctx, x) => ({ aoeRadius: parseInt(x, 10) }),

  // ------------------------------------------
  // 反噬与限制 (Backfire & Limits)
  // ------------------------------------------

  /** Hot: 使用后投 D6，若 < Hit，反噬 = 结果 × 2 */
  'Hot': () => ({ selfDamageOnLowRoll: true }),

  /** Limited x: 整场战斗只能用 x 次 */
  'Limited': (ctx, x) => ({ usesPerBattle: parseInt(x, 10) }),

  // ------------------------------------------
  // 防御修正 (Defense Modifiers)
  // ------------------------------------------

  /** Piercing x: 防御方少投 x 颗骰 */
  'Piercing': (ctx, x) => ({ defenseDiceReduction: parseInt(x, 10) }),

  /** Piercing Crits x: 仅当保留暴击时，防御方少投 x 颗骰 */
  'Piercing Crits': (ctx, x) => {
    if (ctx.retainedCrits > 0) return { defenseDiceReduction: parseInt(x, 10) };
    return {};
  },

  /** Saturate: 防御方不能保留掩体骰 */
  'Saturate': () => ({ coverSavesDisabled: true }),

  /** Seek: 隐蔽单位不能利用地形掩体 */
  'Seek': () => ({ concealNoCover: true, onlyLightTerrain: false }),

  /** Seek Light: 隐蔽单位不能利用 Light 地形掩体 */
  'Seek Light': () => ({ concealNoCover: true, onlyLightTerrain: true }),

  // ------------------------------------------
  // 近战专属 (Melee-Only)
  // ------------------------------------------

  /** Brutal: 对手只能用暴击格挡（近战防御阶段） */
  'Brutal': () => ({ defenseBlockRequiresCrit: true }),

  /** Shock: 第一次暴击命中丢弃对手 1 个未解决的普通成功 */
  'Shock': () => ({ firstCritDiscardsUnresolvedNormal: 1 }),

  /** Stun: 暴击命中后目标 APL -1 直到其下一次激活结束 */
  'Stun': () => ({ targetAplReduction: 1, untilEndOfNextActivation: true }),

  // ------------------------------------------
  // 移动/射击互斥 (Move-Shoot Lock)
  // ------------------------------------------

  /** Heavy: 激活中移动过不能用，用过不能移动。Heavy (x only) 例外特定移动 */
  'Heavy': (ctx, restriction) => ({
    moveShootLock: restriction || 'all',  // 'all' | 'Dash only' | etc.
  }),

  /** Silent: Conceal 状态下也能射击 */
  'Silent': () => ({ canShootWhileConcealed: true }),

  /** Range x: 射程上限 */
  'Range': (ctx, x) => ({ maxRange: parseInt(x, 10) }),
};

// ==========================================
//        聚合器
// ==========================================

/**
 * 计算某把武器在当前上下文下的所有修饰符
 * @param {Weapon} weapon - 武器实例（必须有 .rules 数组）
 * @param {WeaponRuleContext} ctx - 上下文
 * @returns {Object} 聚合后的 modifiers
 *
 * 注意:
 *   - Severe 与 Rending 互斥触发（前者无暴击触发，后者有暴击触发）
 *   - Severe 触发后明确禁用 Punishing / Rending（规则原文）
 *   - 多个 Accurate x 取 Accurate 2（规则原文）
 *   - 多个 Piercing x 叠加
 */
export function applyWeaponRules(weapon, ctx = {}) {
  if (!weapon || !Array.isArray(weapon.rules)) return {};

  const allMods = {};
  const accurateValues = [];

  for (const ruleStr of weapon.rules) {
    const { name, param, param2 } = parseWeaponRule(ruleStr);
    const fn = WEAPON_RULES[name];
    if (!fn) continue;

    const mods = fn(ctx, param, param2);

    // Accurate 特殊处理: 多个取最大，但 cap 在 2
    if (mods.autoRetainNormal !== undefined) {
      accurateValues.push(mods.autoRetainNormal);
      delete mods.autoRetainNormal;
    }

    Object.assign(allMods, mods);
  }

  // 应用 Accurate 聚合逻辑
  if (accurateValues.length > 0) {
    allMods.autoRetainNormal = accurateValues.length > 1
      ? 2  // 多个 Accurate → 视为 Accurate 2
      : accurateValues[0];
  }

  return allMods;
}

/**
 * 检查武器是否拥有某条规则
 * @param {Weapon} weapon
 * @param {string} ruleName
 * @returns {boolean}
 */
export function weaponHasRule(weapon, ruleName) {
  if (!weapon || !Array.isArray(weapon.rules)) return false;
  return weapon.rules.some(r => {
    const { name } = parseWeaponRule(r);
    return name === ruleName;
  });
}

/**
 * 获取武器某规则的参数值
 * @param {Weapon} weapon
 * @param {string} ruleName
 * @returns {string|null} 参数值，无则返回 null
 */
export function getWeaponRuleParam(weapon, ruleName) {
  if (!weapon || !Array.isArray(weapon.rules)) return null;
  for (const r of weapon.rules) {
    const parsed = parseWeaponRule(r);
    if (parsed.name === ruleName) return parsed.param;
  }
  return null;
}
