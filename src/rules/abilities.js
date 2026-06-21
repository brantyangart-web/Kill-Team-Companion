/**
 * abilities.js — 阵营机制查询 (Chapter Tactics / Marks of Chaos)
 *
 * 仅保留 combat.js 实际依赖的查询函数。
 * 旧的 calculateAttackModifications / calculateDefenseModifications /
 * calculateDamageReduction 等函数是死代码（combat.js 有平行实现），已移除。
 *
 * 版本开关由调用方通过 activeRuleSet().factionMechanicsEnabled 控制（见 ruleSets.js），
 * 这两个查询本身不做版本判断。
 */

// ==========================================
//   Chapter Tactics (Space Marine)
// ==========================================

/**
 * 检测特工是否有特定章战术
 * @param {Object} op - Operative 对象
 * @param {string} tacticId - 章战术 ID
 * @returns {boolean}
 */
export function hasChapterTactic(op, tacticId) {
  return Boolean(op && Array.isArray(op.chapterTactics) && op.chapterTactics.includes(tacticId));
}

// ==========================================
//   Marks of Chaos (Legionary)
// ==========================================

/**
 * 检测特工是否有特定混沌印记
 * @param {Object} op - Operative 对象
 * @param {string} markId - 混沌印记 ID
 * @returns {boolean}
 */
export function hasMarkOfChaos(op, markId) {
  return Boolean(op && op.marksOfChaos === markId);
}
