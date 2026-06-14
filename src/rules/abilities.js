// ==========================================
//   Kill Team 2024 — Standard 规则特殊能力
//   包含 Chapter Tactics, Marks of Chaos, 特工专属能力
//   仅在 gameState.rulesVersion === 'standard' 时生效
// ==========================================

import { gameState } from '../js/state.js';

// ==========================================
//   Chapter Tactics (Space Marine)
// ==========================================

/**
 * 获取特工的 Chapter Tactics 列表
 * @param {Object} op - Operative 对象
 * @returns {string[]} 章战术 ID 列表
 */
export function getChapterTactics(op) {
  if (gameState.rulesVersion !== 'standard') return [];
  return op.chapterTactics || [];
}

/**
 * 检测特工是否有特定章战术
 * @param {Object} op - Operative 对象
 * @param {string} tacticId - 章战术 ID
 * @returns {boolean}
 */
export function hasChapterTactic(op, tacticId) {
  return getChapterTactics(op).includes(tacticId);
}

// ==========================================
//   Marks of Chaos (Legionary)
// ==========================================

/**
 * 获取特工的混沌印记
 * @param {Object} op - Operative 对象
 * @returns {string|null} 混沌印记 ID 或 null
 */
export function getMarksOfChaos(op) {
  if (gameState.rulesVersion !== 'standard') return null;
  return op.marksOfChaos || null;
}

/**
 * 检测特工是否有特定混沌印记
 * @param {Object} op - Operative 对象
 * @param {string} markId - 混沌印记 ID
 * @returns {boolean}
 */
export function hasMarkOfChaos(op, markId) {
  return getMarksOfChaos(op) === markId;
}

// ==========================================
//   被动效果 — 攻击骰结算
// ==========================================

/**
 * 计算攻击骰的额外效果
 * 返回修改后的 { crits, norms, lethalThreshold } 和日志信息
 *
 * @param {Object} attacker - 攻击方 Operative
 * @param {Object} weapon - 武器对象
 * @param {number[]} attackRolls - 攻击骰结果
 * @param {Object} defender - 防御方 Operative (用于距离检测)
 * @returns {{ crits: number, norms: number, lethalThreshold: number, logs: string[] }}
 */
export function calculateAttackModifications(attacker, weapon, attackRolls, defender) {
  const logs = [];
  let extraCrits = 0;
  let extraNorms = 0;

  const injuryPenalty = (attacker && attacker.isInjured) ? 1 : 0;
  const effectiveTs = weapon.ts + injuryPenalty;

  // Lethal 阈值
  const lethalMatch = weapon.rules.find(r => r.startsWith('Lethal'));
  let lethalThreshold = lethalMatch ? parseInt(lethalMatch.match(/\d+/)?.[0] || '6') : 6;

  // 基础统计
  let crits = 0;
  let norms = 0;
  attackRolls.forEach(val => {
    if (val >= lethalThreshold) crits++;
    else if (val >= effectiveTs) norms++;
  });

  if (gameState.rulesVersion !== 'standard') {
    return { crits, norms, lethalThreshold, logs };
  }

  // === Rending 规则 (基础 + Aggressive Chapter Tactic) ===
  const hasRendingBase = weapon.hasRule && weapon.hasRule('Rending');
  const hasAggressive = hasChapterTactic(attacker, 'aggressive');
  // Aggressive: 近战武器获得 Rending
  const isMelee = !weapon.isRanged;
  const hasRending = hasRendingBase || (hasAggressive && isMelee);

  if (hasRending && crits > 0 && norms > 0) {
    norms -= 1;
    crits += 1;
    logs.push(`[撕裂] ${weapon.name}：保留暴击，升级 1 个普通命中为暴击！`);
  }

  // === Punishing 规则 ===
  const hasPunishing = weapon.hasRule && weapon.hasRule('Punishing');
  if (hasPunishing && crits > 0) {
    const fails = attackRolls.filter(val => val < effectiveTs && val !== 6 && val < lethalThreshold).length;
    if (fails > 0) {
      norms += 1;
      logs.push(`[惩罚] ${weapon.name}：保留暴击，保留 1 个失败骰作为普通成功！`);
    }
  }

  // === Accurate 规则 (基础 + Sharpshooter Chapter Tactic) ===
  const hasAccurateBase = weapon.rules.some(r => r.startsWith('Accurate'));
  const hasSharpshooter = hasChapterTactic(attacker, 'sharpshooter');
  // Sharpshooter: 未移动时爆弹武器 Accurate 1 + Severe
  const isBoltWeapon = /bolt/i.test(weapon.name);
  const hasnNotMoved = attacker && attacker.actionsPerformed.length === 0;
  const hasAccurate = hasAccurateBase || (hasSharpshooter && isBoltWeapon && hasnNotMoved);

  if (hasAccurate) {
    const accurateVal = 1; // Sharpshooter gives Accurate 1
    const fails = attackRolls.filter(val => val < effectiveTs && val < lethalThreshold).length;
    const upgradeCount = Math.min(accurateVal, fails);
    if (upgradeCount > 0) {
      norms += upgradeCount;
      logs.push(`[精准] ${weapon.name}：自动保留 ${upgradeCount} 个普通成功！`);
    }
  }

  // === Severe 规则 (Khorne Mark / Tzeentch Mark / Sharpshooter) ===
  const hasSevereBase = weapon.hasRule && weapon.hasRule('Severe');
  const hasKhorne = hasMarkOfChaos(attacker, 'KHORNE');
  const hasTzeentch = hasMarkOfChaos(attacker, 'TZEENTCH');
  // Khorne: 近战 Severe
  // Tzeentch: 远程 Severe
  // Sharpshooter + 未移动: 爆弹武器 Severe (已在 Accurate 中处理)
  const hasSevere = hasSevereBase ||
    (hasKhorne && isMelee) ||
    (hasTzeentch && !isMelee) ||
    (hasSharpshooter && isBoltWeapon && hasnNotMoved);

  // Severe 效果在伤害计算时应用，这里仅记录

  // === Toxic 规则 (PM) ===
  const hasToxic = weapon.hasRule && weapon.hasRule('Toxic');
  if (hasToxic && defender && defender.poisonTokens > 0) {
    logs.push(`[毒素] ${weapon.name}：目标携带毒素标记，Normal/Critical Dmg +1！`);
    // Toxic 效果在伤害计算时应用
  }

  // === Siege Specialist (Chapter Tactic): 远程 Saturate ===
  const hasSiegeSpecialist = hasChapterTactic(attacker, 'siege_specialist');
  if (hasSiegeSpecialist && !isMelee) {
    logs.push(`[攻城专家] ${attacker.name}：远程武器获得 Saturate！`);
  }

  // === Undivided Mark: 6" 内交战时远程 Ceaseless ===
  const hasUndivided = hasMarkOfChaos(attacker, 'UNDIVIDED');
  if (hasUndivided && !isMelee && defender) {
    // 需要检测距离 ≤6" (简化：假设玩家在判定步骤已确认)
    // 这里标记，实际距离判定由玩家回答
    logs.push(`[无分印记] ${attacker.name}：如果在 6" 内交战，远程武器获得 Ceaseless！`);
  }

  return { crits, norms, lethalThreshold, logs };
}

// ==========================================
//   被动效果 — 防御骰结算
// ==========================================

/**
 * 计算防御骰的额外效果
 *
 * @param {Object} defender - 防御方 Operative
 * @param {number[]} defenseRolls - 防御骰结果
 * @param {Object} weapon - 攻击武器 (用于检测 Saturate)
 * @param {boolean} inCover - 是否在掩体中
 * @returns {{ crits: number, norms: number, logs: string[] }}
 */
export function calculateDefenseModifications(defender, defenseRolls, weapon, inCover) {
  const logs = [];

  // Saturate 规则：防御方不能保留掩体骰
  const hasSaturateForDef = weapon.hasRule && weapon.hasRule('Saturate');
  // Siege Specialist (攻击方): 远程 Saturate
  const attacker = gameState.operatives.find(o => o.id === weapon._ownerId);
  const hasSiegeSpecialist = attacker && hasChapterTactic(attacker, 'siege_specialist') && weapon.isRanged;
  const saturateActive = hasSaturateForDef || hasSiegeSpecialist;

  let norms = (inCover && !saturateActive) ? 1 : 0;
  let crits = 0;

  const sv = defender.sv;

  // Hardy (Chapter Tactic): 防御 5+ 为暴击
  const hasHardy = hasChapterTactic(defender, 'hardy');
  // Repulsive Fortitude (PM Warrior): 防御 5+ 算暴击
  const hasRepulsiveFortitude = defender.operativeType === 'pm_warrior';
  const critThreshold = (hasHardy || hasRepulsiveFortitude) ? 5 : 6;

  defenseRolls.forEach(val => {
    if (val === 6 || (val >= critThreshold && val < 6 && (hasHardy || hasRepulsiveFortitude))) {
      crits++;
    } else if (val >= sv) {
      norms++;
    }
  });

  if (hasHardy && crits > 0) {
    logs.push(`[坚韧] ${defender.name}：章战术生效，5+ 防御骰算暴击！`);
  }
  if (hasRepulsiveFortitude && crits > 0) {
    logs.push(`[厌恶韧性] ${defender.name}：5+ 防御骰算暴击！`);
  }

  // Camo Cloak (SM Eliminator Sniper): 忽略 Saturate
  const hasCamoCloak = defender.operativeType === 'sm_eliminator_sniper';
  if (hasCamoCloak && saturateActive) {
    logs.push(`[伪装斗篷] ${defender.name}：忽略 Saturate 规则！`);
    // 重新计算 norms
    norms = inCover ? 1 : 0;
  }

  return { crits, norms, logs };
}

// ==========================================
//   被动效果 — 伤害减免
// ==========================================

/**
 * 计算伤害减免 (在 applyWounds 之前调用)
 *
 * @param {Object} defender - 防御方 Operative
 * @param {number} incomingDamage - 即将受到的伤害
 * @param {boolean} isNormalDmg - 是否是普通伤害 (vs 暴击伤害)
 * @param {boolean} isCounteracting - 是否正在反击
 * @returns {{ reducedDamage: number, logs: string[] }}
 */
export function calculateDamageReduction(defender, incomingDamage, isNormalDmg, isCounteracting) {
  const logs = [];
  let reducedDamage = incomingDamage;

  if (gameState.rulesVersion !== 'standard') {
    return { reducedDamage, logs };
  }

  // Hardy (Chapter Tactic): 反击时首个 ≥3 Normal Dmg -1
  const hasHardy = hasChapterTactic(defender, 'hardy');
  if (hasHardy && isCounteracting && isNormalDmg && incomingDamage >= 3) {
    reducedDamage -= 1;
    logs.push(`[坚韧] ${defender.name}：反击中首个 ≥3 普通伤害 -1！`);
  }

  // Nurgle Mark: Normal Dmg ≥3 时 D6 5+ 减 1
  const hasNurgle = hasMarkOfChaos(defender, 'NURGLE');
  if (hasNurgle && isNormalDmg && incomingDamage >= 3) {
    const roll = Math.floor(Math.random() * 6) + 1;
    if (roll >= 5) {
      reducedDamage -= 1;
      logs.push(`[纳垢印记] ${defender.name}：D6 [${roll}] ≥ 5，普通伤害 -1！`);
    } else {
      logs.push(`[纳垢印记] ${defender.name}：D6 [${roll}] < 5，减免失败。`);
    }
  }

  // Unleash Daemon (Anointed): 永久 4+ Dmg -1
  if (defender.unleashDaemonActive && incomingDamage >= 4) {
    reducedDamage -= 1;
    logs.push(`[释放恶魔] ${defender.name}：4+ 伤害 -1！`);
  }

  // 确保伤害不低于 0
  reducedDamage = Math.max(0, reducedDamage);

  return { reducedDamage, logs };
}

// ==========================================
//   特工类型检测辅助函数
// ==========================================

/**
 * 检测特工是否是特定类型
 * @param {Object} op - Operative 对象
 * @param {string} type - 特工类型 (如 'sm_captain', 'pm_champion', 'leg_aspiring_champion')
 * @returns {boolean}
 */
export function isOperativeType(op, type) {
  return op.operativeType === type;
}

/**
 * 检测特工是否有特定的一次性能力可用
 * @param {Object} op - Operative 对象
 * @param {string} abilityName - 能力名称
 * @returns {boolean}
 */
export function isAbilityAvailable(op, abilityName) {
  return op.isOncePerBattleAvailable(abilityName);
}

/**
 * 标记一次性能力已使用
 * @param {Object} op - Operative 对象
 * @param {string} abilityName - 能力名称
 */
export function markAbilityUsed(op, abilityName) {
  op.markOncePerBattleUsed(abilityName);
}
