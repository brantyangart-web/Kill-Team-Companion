/**
 * strategy.js — 策略阶段与 CP 经济
 *
 * 包含:
 *   - CP 获取规则 (per TP)
 *   - Ploy 购买判定
 *   - Counteract 状态查询 (per-operative per-TP)
 *   - Command Re-roll 判定
 */

import { STARTING_CP } from './core.js';
import { activeRuleSet } from './ruleSets.js';

// ==========================================
//            CP 经济
// ==========================================

/**
 * 计算策略阶段每方获得的 CP
 * @param {number} turningPoint - 当前 TP 编号 (1-based)
 * @param {boolean} hasInitiative - 是否持有先攻
 * @returns {number}
 *
 * lite 规则原文:
 *   - 开局 2 CP
 *   - TP1 策略阶段: 双方各 +1 CP
 *   - TP2+: 先攻方 +1 CP, 非先攻方 +2 CP
 */
export function getCpGain(turningPoint, hasInitiative) {
  if (turningPoint === 1) return 1;
  return hasInitiative ? 1 : 2;
}

/**
 * 开局 CP（双方相同）
 */
export function getStartingCp() {
  return STARTING_CP;
}

// ==========================================
//            Ploy 系统
// ==========================================

/** Ploy 统一成本 */
export const PLOY_COST = 1;

/**
 * 判定玩家是否能买某 ploy
 * @param {number} currentCp - 当前 CP
 * @param {string[]} activePloys - 本 TP 已激活的 ploy id 列表
 * @param {string} ployId - 想买的 ploy id
 * @returns {{allowed: boolean, reason?: string}}
 */
export function canBuyPloy(currentCp, activePloys, ployId) {
  if (currentCp < PLOY_COST) {
    return { allowed: false, reason: 'INSUFFICIENT_CP' };
  }
  if (activePloys.includes(ployId)) {
    return { allowed: false, reason: 'PLOY_ALREADY_ACTIVE' };
  }
  return { allowed: true };
}

// ==========================================
//            Counteract
// ==========================================

/**
 * 判断某特工能否发动 Counteract
 *
 * lite 规则原文:
 *   "If all your operatives are expended but your opponent's aren't,
 *    when you would activate a ready friendly operative,
 *    one expended friendly operative with an Engage order
 *    can counteract to perform a 1AP action for free.
 *    Each operative can only counteract once per turning point,
 *    and cannot move more than 2" while doing so."
 *
 * @param {Object} op - Operative 实例
 * @param {Object} gameState - 全局状态
 * @returns {{allowed: boolean, reason?: string}}
 */
export function canCounteract(op, gameState) {
  if (!op) return { allowed: false, reason: 'NO_OPERATIVE' };
  if (op.isDead) return { allowed: false, reason: 'OPERATIVE_DEAD' };

  // 必须已耗尽（hasActed = true）才能反击
  if (!op.hasActed) return { allowed: false, reason: 'NOT_EXPENDED' };

  // 必须是 Engage 命令（Conceal 不能反击）
  if (op.hasConceal) return { allowed: false, reason: 'CONCEAL_NO_COUNTERACT' };

  // 每 TP 只能反击一次（per-operative 标记）
  if (op.hasCounteractedThisTP) {
    return { allowed: false, reason: 'ALREADY_COUNTERACTED_THIS_TP' };
  }

  return { allowed: true };
}

/**
 * 列出当前所有可发动 Counteract 的特工
 * @param {string} faction - 阵营
 * @param {Object[]} operatives - 所有 operative
 * @returns {Object[]}
 */
export function listCounteractCandidates(faction, operatives) {
  return operatives.filter(op =>
    op.faction === faction &&
    !op.isDead &&
    op.hasActed &&
    !op.hasConceal &&
    !op.hasCounteractedThisTP
  );
}

// ==========================================
//            Command Re-roll
// ==========================================

/**
 * Command Re-roll 成本: 1 CP 重投 1 颗骰子
 */
export const COMMAND_REROLL_COST = 1;

/**
 * 判定是否能用 Command Re-roll
 * @param {number} currentCp
 * @param {boolean} alreadyRerolledThisSequence - 本次攻击/防御序列是否已用过 CP 重投
 * @returns {{allowed: boolean, reason?: string}}
 */
export function canCommandReroll(currentCp, alreadyRerolledThisSequence) {
  if (currentCp < COMMAND_REROLL_COST) {
    return { allowed: false, reason: 'INSUFFICIENT_CP' };
  }
  // 每次攻击/防御序列只能用 1 次 Command Re-roll
  if (alreadyRerolledThisSequence) {
    return { allowed: false, reason: 'ALREADY_REROLLED_THIS_SEQUENCE' };
  }
  return { allowed: true };
}

// ==========================================
//            TP 流程辅助
// ==========================================

/**
 * 判断当前 TP 是否为最终 TP
 * @param {number} currentTp
 * @returns {boolean}
 */
export function isFinalTurningPoint(currentTp) {
  return currentTp >= activeRuleSet().maxTurningPoints;
}
