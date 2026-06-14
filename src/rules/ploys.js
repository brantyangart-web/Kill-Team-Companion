/**
 * ploys.js — 官方 Ploy 数据 + 效果逻辑
 *
 * 数据来源: docs/ploy-specification.md
 * 包含: 1 通用 + 8 SM + 8 PM + 8 LEG = 25 ploys
 *
 * 架构:
 *   - PLOY_DATABASE: 所有 ploy 的完整定义
 *   - getAvailablePloys(faction, type): 获取可用 ploy 列表
 *   - canUsePloy(ployId, context): 判定能否使用
 *   - applyPloyEffect(ployId, context): 应用 ploy 效果
 *   - isPloyActive(ployId, faction): 查询持久 ploy 是否生效
 */

import { gameState } from '../js/state.js';
import { getTeamSlot, hasFactionTrait } from './faction.js';

// ==========================================
//        Ploy 数据库 (PLOY_DATABASE)
// ==========================================

export const PLOY_DATABASE = {
  // ---- 通用 (Core) ----
  'command_reroll': {
    id: 'command_reroll', name_en: 'Command Re-roll', name_cn: '指挥重投',
    faction: 'ALL', type: 'firefight', cp: 1,
    timing: 'after_rolling_dice',
    duration: 'instant',
    desc: '投掷攻击骰或防御骰后，可重投其中 1 个骰子。',
    usage_limit: 'unlimited', // 不计入每 TP 限制
    is_strategic_gambit: false,
  },

  // ---- Space Marine / Angels of Death ----
  // Strategy Ploys
  'combat_doctrine': {
    id: 'combat_doctrine', name_en: 'Combat Doctrine', name_cn: '战斗教条',
    faction: 'Space Marine', type: 'strategy', cp: 1,
    timing: 'strategy_phase',
    duration: 'persistent',
    desc: '选择一个战斗教条。对应场景下所有友军武器获得 Balanced 规则。',
    options: ['devastator', 'tactical', 'assault'],
    option_descs: {
      devastator: 'Devastator: 射击 6" 外目标时武器获得 Balanced',
      tactical: 'Tactical: 射击 6" 内目标时武器获得 Balanced',
      assault: 'Assault: 近战或反击时武器获得 Balanced',
    },
    usage_limit: 'per_tp',
    is_strategic_gambit: true,
  },
  'and_they_shall_know_no_fear': {
    id: 'and_they_shall_know_no_fear', name_en: 'And They Shall Know No Fear', name_cn: '无所畏惧',
    faction: 'Space Marine', type: 'strategy', cp: 1,
    timing: 'strategy_phase',
    duration: 'persistent',
    desc: '忽略友军受伤 (Injured) 带来的所有属性减益 (Move -2", Hit +1)。',
    usage_limit: 'per_tp',
    is_strategic_gambit: true,
  },
  'adaptive_tactics': {
    id: 'adaptive_tactics', name_en: 'Adaptive Tactics', name_cn: '自适应战术',
    faction: 'Space Marine', type: 'strategy', cp: 1,
    timing: 'strategy_phase',
    duration: 'until_end_of_tp',
    desc: '临时更换 secondary Chapter Tactic，TP 结束后恢复原选择。',
    usage_limit: 'per_tp',
    is_strategic_gambit: true,
  },
  'indomitus': {
    id: 'indomitus', name_en: 'Indomitus', name_cn: '不屈意志',
    faction: 'Space Marine', type: 'strategy', cp: 1,
    timing: 'strategy_phase',
    duration: 'persistent',
    desc: '敌方射击友军时，若投出 2+ 个失败骰，可丢弃 1 个并将另 1 个保留为普通成功。',
    usage_limit: 'per_tp',
    is_strategic_gambit: true,
  },
  // Firefight Ploys
  'adjust_doctrine': {
    id: 'adjust_doctrine', name_en: 'Adjust Doctrine', name_cn: '调整教条',
    faction: 'Space Marine', type: 'firefight', cp: 1,
    timing: 'during_activation',
    duration: 'instant',
    desc: '在友军激活期间，更换已选的战斗教条 (前提: 本 TP 已使用 Combat Doctrine)。',
    prerequisite: 'combat_doctrine',
    usage_limit: 'per_tp',
    is_strategic_gambit: false,
    free_conditions: ['captain_using'], // Captain 使用时免费
  },
  'transhuman_physiology': {
    id: 'transhuman_physiology', name_en: 'Transhuman Physiology', name_cn: '超人耐力',
    faction: 'Space Marine', type: 'firefight', cp: 1,
    timing: 'defence_dice_step',
    duration: 'instant',
    desc: '敌方射击友军时，在防御骰步骤可将 1 个普通成功升级为暴击成功。',
    usage_limit: 'per_tp',
    is_strategic_gambit: false,
  },
  'shock_assault': {
    id: 'shock_assault', name_en: 'Shock Assault', name_cn: '冲击突击',
    faction: 'Space Marine', type: 'firefight', cp: 1,
    timing: 'fight_after_charge',
    duration: 'until_end_of_action',
    desc: '冲锋后近战时: 武器获得 Shock 规则 + 第一次 strike 额外 +1 伤害 (上限 7)。',
    usage_limit: 'per_tp',
    is_strategic_gambit: false,
  },
  'wrath_of_vengeance': {
    id: 'wrath_of_vengeance', name_en: 'Wrath of Vengeance', name_cn: '复仇之怒',
    faction: 'Space Marine', type: 'firefight', cp: 1,
    timing: 'during_counteract',
    duration: 'until_end_of_counteraction',
    desc: '反击时可免费执行额外 1 个 1AP 行动 (两个行动必须不同)。',
    usage_limit: 'per_tp',
    is_strategic_gambit: false,
    free_conditions: ['engage_order_with_reliquaries'],
  },

  // ---- Plague Marine ----
  // Strategy Ploys
  'contagion': {
    id: 'contagion', name_en: 'Contagion', name_cn: '传染蔓延',
    faction: 'Plague Marine', type: 'strategy', cp: 1,
    timing: 'strategy_phase',
    duration: 'persistent',
    desc: '满足条件的敌方: Move -2", 武器 Hit +1 (不与受伤叠加)。条件: 有 Poison token 且在 PM 3" 内可见，或在 Icon Bearer 3" 内可见。',
    usage_limit: 'per_tp',
    is_strategic_gambit: true,
    free_conditions: ['icon_bearer_in_enemy_territory'],
  },
  'lumbering_death': {
    id: 'lumbering_death', name_en: 'Lumbering Death', name_cn: '缓慢死神',
    faction: 'Plague Marine', type: 'strategy', cp: 1,
    timing: 'strategy_phase',
    duration: 'persistent',
    desc: 'PM 射击/近战时若本 activation 移动不超过 3" (或正在反击)，武器获得 Ceaseless 规则。',
    usage_limit: 'per_tp',
    is_strategic_gambit: true,
  },
  'cloud_of_flies': {
    id: 'cloud_of_flies', name_en: 'Cloud of Flies', name_cn: '蝇云',
    faction: 'Plague Marine', type: 'strategy', cp: 1,
    timing: 'strategy_phase',
    duration: 'until_next_ready_step',
    desc: '放置蝇云标记。3" 外射击标记 1" 内的 PM 时，该 PM 视为 obscured。下回合 Ready 步骤移除。',
    usage_limit: 'per_tp',
    is_strategic_gambit: true,
  },
  'nurglings': {
    id: 'nurglings', name_en: 'Nurglings', name_cn: '纳格林',
    faction: 'Plague Marine', type: 'strategy', cp: 1,
    timing: 'strategy_phase',
    duration: 'until_next_activation_end',
    desc: '选择 1 个敌方 (PM 3" 内 或 有 Poison token 且在 7" 内): APL -1 直到其下次 activation 结束。',
    usage_limit: 'per_tp',
    is_strategic_gambit: true,
  },
  // Firefight Ploys
  'virulent_poison': {
    id: 'virulent_poison', name_en: 'Virulent Poison', name_cn: '剧毒扩散',
    faction: 'Plague Marine', type: 'firefight', cp: 1,
    timing: 'during_activation_or_counteraction',
    duration: 'instant',
    desc: '给敌方施加 Poison token: (1) 3" 内或 7" 内可见敌方; 或 (2) 投 2D6=7+ 给 7" 内敌方。',
    usage_limit: 'per_tp',
    is_strategic_gambit: false,
  },
  'poisonous_demise': {
    id: 'poisonous_demise', name_en: 'Poisonous Demise', name_cn: '毒亡爆发',
    faction: 'Plague Marine', type: 'firefight', cp: 1,
    timing: 'on_incapacitated',
    duration: 'instant',
    desc: 'PM 被击杀时: 3" 内可见敌方获得 Poison token; 已有 token 的受 1 伤害。',
    usage_limit: 'per_tp',
    is_strategic_gambit: false,
  },
  'sickening_resilience': {
    id: 'sickening_resilience', name_en: 'Sickening Resilience', name_cn: '恶心坚韧',
    faction: 'Plague Marine', type: 'firefight', cp: 1,
    timing: 'when_taking_damage',
    duration: 'until_end_of_activation',
    desc: 'PM 受到伤害时: DR 自动减 1 (不需投骰，最低 2 伤害)，持续到当前 activation/counteraction 结束。',
    usage_limit: 'per_tp',
    is_strategic_gambit: false,
  },
  'curse_of_rot': {
    id: 'curse_of_rot', name_en: 'Curse of Rot', name_cn: '腐朽诅咒',
    faction: 'Plague Marine', type: 'firefight', cp: 1,
    timing: 'after_opponent_rolls',
    duration: 'instant',
    desc: 'PM 射击/近战 3" 内 (或有 token 在 7" 内) 敌方时: 对手骰出 3 的结果造成 1 伤害且不能保留/重投。',
    usage_limit: 'per_tp',
    is_strategic_gambit: false,
  },

  // ---- Legionary ----
  // Strategy Ploys
  'blood_for_the_blood_god': {
    id: 'blood_for_the_blood_god', name_en: 'Blood for the Blood God', name_cn: '血祭血神',
    faction: 'Legionary', type: 'strategy', cp: 1,
    timing: 'strategy_phase',
    duration: 'persistent',
    desc: '非 KHORNE LEG Fight 时第一次 strike +1 伤害 (上限 7)。KHORNE LEG 近战武器 Dmg +1 (上限 7)。',
    usage_limit: 'per_tp',
    is_strategic_gambit: true,
  },
  'implacable': {
    id: 'implacable', name_en: 'Implacable', name_cn: '坚定不移',
    faction: 'Legionary', type: 'strategy', cp: 1,
    timing: 'strategy_phase',
    duration: 'persistent',
    desc: '射击 LEG 时 Piercing 1 降级为 Piercing Crits 1。NURGLE LEG 忽略受伤减益。',
    usage_limit: 'per_tp',
    is_strategic_gambit: true,
  },
  'quicksilver_speed': {
    id: 'quicksilver_speed', name_en: 'Quicksilver Speed', name_cn: '疾速银影',
    faction: 'Legionary', type: 'strategy', cp: 1,
    timing: 'strategy_phase',
    duration: 'persistent',
    desc: 'LEG 本 TP 移动过后 Fight/Retaliate 时敌方近战武器 Hit +1。SLAANESH LEG 移动过后被 6" 外射击时敌方武器 Hit +1。不与受伤叠加。',
    usage_limit: 'per_tp',
    is_strategic_gambit: true,
  },
  'fickle_fates': {
    id: 'fickle_fates', name_en: 'Fickle Fates', name_cn: '命运无常',
    faction: 'Legionary', type: 'strategy', cp: 1,
    timing: 'strategy_phase',
    duration: 'persistent',
    desc: 'LEG 射击 ready 敌方时武器获得 Balanced (已有则升级为 Relentless)。TZEENTCH LEG 被射击时保留 critical 后可保留 1 个 fail 为 normal。',
    usage_limit: 'per_tp',
    is_strategic_gambit: true,
  },
  // Firefight Ploys
  'unending_bloodshed': {
    id: 'unending_bloodshed', name_en: 'Unending Bloodshed', name_cn: '无尽杀戮',
    faction: 'Legionary', type: 'firefight', cp: 1,
    timing: 'khorne_incapacitated_in_fight',
    duration: 'instant',
    desc: 'KHORNE LEG Fight/Retaliate 中被击杀时，可用 1 个未结算的 success 对敌方 strike。',
    usage_limit: 'per_tp',
    is_strategic_gambit: false,
  },
  'mutability_and_change': {
    id: 'mutability_and_change', name_en: 'Mutability and Change', name_cn: '变异与转化',
    faction: 'Legionary', type: 'firefight', cp: 1,
    timing: 'on_activation',
    duration: 'until_end_of_activation',
    desc: 'TZEENTCH LEG 激活时 APL +1，但不能重复执行相同 action。WARRIOR 本 TP 不能改变 Marks of Chaos。',
    usage_limit: 'per_tp',
    is_strategic_gambit: false,
  },
  'malignant_aura': {
    id: 'malignant_aura', name_en: 'Malignant Aura', name_cn: '恶性灵光',
    faction: 'Legionary', type: 'firefight', cp: 1,
    timing: 'shoot_target_selection',
    duration: 'until_end_of_action',
    desc: 'NURGLE LEG Shoot 时: 射击 3" 内敌方 (含 secondary) 远程武器获得 Piercing 1。',
    usage_limit: 'per_tp',
    is_strategic_gambit: false,
  },
  'sickening_captivation': {
    id: 'sickening_captivation', name_en: 'Sickening Captivation', name_cn: '魅惑厌恶',
    faction: 'Legionary', type: 'firefight', cp: 1,
    timing: 'during_activation',
    duration: 'until_next_activation_end',
    desc: 'SLAANESH LEG 激活期间: 选 4" 内可见敌方，APL -1 直到其下次 activation 结束。',
    usage_limit: 'per_tp',
    is_strategic_gambit: false,
  },
};

// ==========================================
//        查询函数
// ==========================================

/**
 * 获取阵营可用的 ploy 列表
 * @param {string} faction - 阵营 id ('Space Marine' / 'Plague Marine' / 'Legionary')
 * @param {string} [type] - 'strategy' | 'firefight' | undefined (全部)
 * @returns {Array} ploy 定义数组
 */
export function getAvailablePloys(faction, type) {
  return Object.values(PLOY_DATABASE).filter(p => {
    if (p.faction !== 'ALL' && p.faction !== faction) return false;
    if (type && p.type !== type) return false;
    return true;
  });
}

/**
 * 获取阵营每 TP 可用 ploy 的已使用状态
 * @param {string} faction
 * @returns {Object} { [ployId]: boolean } 已使用为 true
 */
export function getUsedPloysThisTP(faction) {
  const slot = getTeamSlot(faction);
  if (slot < 0) return {};
  return gameState.usedPloysThisTP?.[slot] || {};
}

/**
 * 标记 ploy 本 TP 已使用
 */
export function markPloyUsedThisTP(faction, ployId) {
  const slot = getTeamSlot(faction);
  if (slot < 0) return;
  if (!gameState.usedPloysThisTP) gameState.usedPloysThisTP = { 0: {}, 1: {} };
  gameState.usedPloysThisTP[slot][ployId] = true;
}

/**
 * 重置每 TP 的 ploy 使用状态 (在 TP 结束时调用)
 */
export function resetPloysThisTP() {
  gameState.usedPloysThisTP = { 0: {}, 1: {} };
}

/**
 * 查询持久 ploy 是否激活
 * @param {string} ployId
 * @param {string} faction
 * @returns {boolean}
 */
export function isPloyActive(ployId, faction) {
  const slot = getTeamSlot(faction);
  if (slot < 0) return false;
  const persistent = gameState.persistentPloys?.[slot] || [];
  return persistent.includes(ployId);
}

/**
 * 激活一个持久 ploy
 */
export function activatePersistentPloy(ployId, faction) {
  const slot = getTeamSlot(faction);
  if (slot < 0) return;
  if (!gameState.persistentPloys) gameState.persistentPloys = { 0: [], 1: [] };
  if (!gameState.persistentPloys[slot].includes(ployId)) {
    gameState.persistentPloys[slot].push(ployId);
  }
  markPloyUsedThisTP(faction, ployId);
}

/**
 * 激活一个即时/临时 ploy (加入 activePloys)
 */
export function activateFirefightPloy(ployId, faction) {
  const slot = getTeamSlot(faction);
  if (slot < 0) return;
  const key = slot === 0 ? 'smActivePloys' : 'pmActivePloys';
  if (!gameState[key].includes(ployId)) {
    gameState[key].push(ployId);
  }
  markPloyUsedThisTP(faction, ployId);
}

/**
 * 查询临时 ploy 是否当前激活 (firefight ploys)
 */
export function isFirefightPloyActive(ployId, faction) {
  const slot = getTeamSlot(faction);
  if (slot < 0) return false;
  const key = slot === 0 ? 'smActivePloys' : 'pmActivePloys';
  return gameState[key].includes(ployId);
}

/**
 * 获取 Combat Doctrine 当前选择
 */
export function getCombatDoctrineChoice(faction) {
  const slot = getTeamSlot(faction);
  if (slot < 0) return null;
  return gameState.combatDoctrineChoice?.[slot] || null;
}

/**
 * 设置 Combat Doctrine 选择
 */
export function setCombatDoctrineChoice(faction, choice) {
  const slot = getTeamSlot(faction);
  if (slot < 0) return;
  if (!gameState.combatDoctrineChoice) gameState.combatDoctrineChoice = {};
  gameState.combatDoctrineChoice[slot] = choice;
}

// ==========================================
//        效果查询函数 (供 combat.js / models.js 使用)
// ==========================================

/**
 * 查询 SM "And They Shall Know No Fear" 是否激活
 */
export function isIgnoreInjuredPenalties(faction) {
  return isPloyActive('and_they_shall_know_no_fear', faction);
}

/**
 * 查询 PM "Contagion" 对特定敌方是否生效
 * 条件: (有 Poison token 且在 PM 3" 内可见) OR (在 Icon Bearer 3" 内可见)
 * 注: 距离/可见性判断需物理沙盘，这里仅检查 ploy 是否激活
 */
export function isContagionActive(faction) {
  return isPloyActive('contagion', faction);
}

/**
 * 查询 PM "Lumbering Death" 是否激活
 */
export function isLumberingDeathActive(faction) {
  return isPloyActive('lumbering_death', faction);
}

/**
 * 查询 LEG "Blood for the Blood God" 是否激活
 */
export function isBloodForBloodGodActive(faction) {
  return isPloyActive('blood_for_the_blood_god', faction);
}

/**
 * 查询 LEG "Implacable" 是否激活
 */
export function isImplacableActive(faction) {
  return isPloyActive('implacable', faction);
}

/**
 * 查询 LEG "Quicksilver Speed" 是否激活
 */
export function isQuicksilverSpeedActive(faction) {
  return isPloyActive('quicksilver_speed', faction);
}

/**
 * 查询 LEG "Fickle Fates" 是否激活
 */
export function isFickleFatesActive(faction) {
  return isPloyActive('fickle_fates', faction);
}

/**
 * 查询 LEG "Indomitus" 是否激活
 */
export function isIndomitusActive(faction) {
  return isPloyActive('indomitus', faction);
}

/**
 * 获取 ploy 完整定义
 */
export function getPloy(ployId) {
  return PLOY_DATABASE[ployId] || null;
}
