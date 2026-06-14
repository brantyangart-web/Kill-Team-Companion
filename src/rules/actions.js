/**
 * actions.js — 行动约束矩阵 (Action Constraint Matrix)
 *
 * 集中管理"执行过 A 行动后，能否再执行 B 行动"的判定。
 * 所有互斥逻辑在这里查表，不在 combat.js / ui.js 里散落 if-else。
 *
 * 矩阵值含义:
 *   true    — 允许
 *   false   — 禁止
 *   'heavy' — 仅当持有 Heavy (Dash only) 武器且本激活已 Dash 时允许（Shoot 专属）
 *   'locked'— 互斥锁（做了 Shoot 就锁 Fight，反之亦然；Astartes 规则下）
 */

import { ACTION_COSTS } from './core.js';

// 行: 已执行的行动; 列: 尝试执行的行动
// 注: Move 在 lite 规则中叫 Reposition，这里两者等价
const MATRIX = {
  //             Move  Dash  Adv  FB  Charge Shoot Fight
  'Move':      { Move:false, Dash:false, Advance:false, FallBack:false, Charge:false, Shoot:true,  Fight:true  },
  'Reposition':{ Move:false, Dash:false, Advance:false, FallBack:false, Charge:false, Shoot:true,  Fight:true  },
  'Dash':      { Move:false, Dash:false, Advance:false, FallBack:false, Charge:false, Shoot:'heavy',Fight:false },
  'Advance':   { Move:false, Dash:false, Advance:false, FallBack:false, Charge:false, Shoot:false, Fight:false },
  'FallBack':  { Move:false, Dash:false, Advance:false, FallBack:false, Charge:false, Shoot:false, Fight:false },
  'Charge':    { Move:false, Dash:false, Advance:false, FallBack:false, Charge:false, Shoot:false, Fight:true  },
  'Shoot':     { Move:true,  Dash:true,  Advance:true,  FallBack:true,  Charge:true,  Shoot:true,  Fight:'locked' },
  'Fight':     { Move:true,  Dash:true,  Advance:true,  FallBack:true,  Charge:true,  Shoot:'locked',Fight:true },
};

/**
 * 查询"已执行 performed 后，能否再执行 target"
 * @param {string} performed - 已执行的行动
 * @param {string} target - 想执行的行动
 * @returns {true|false|'heavy'|'locked'}
 */
export function queryCompatibility(performed, target) {
  const row = MATRIX[performed];
  if (!row) return true;  // 未知行动默认允许
  return row[target] ?? true;
}

/**
 * 综合判定: 某特工能否执行指定行动
 *
 * @param {Object} op - Operative 实例
 * @param {string} action - 行动名称 ('Move' | 'Dash' | 'Shoot' | ...)
 * @param {Object} [opts] - 额外上下文
 * @param {boolean} [opts.isLiteMode=true] - lite 模式隐藏 Advance
 * @returns {{allowed: boolean, reason?: string}}
 */
export function canPerformAction(op, action, opts = {}) {
  const isLiteMode = opts.isLiteMode !== false;

  // 0. 通用检查
  if (!op || op.isDead) {
    return { allowed: false, reason: 'OPERATIVE_DEAD' };
  }

  // 0.5 反击限制: 反击时只能执行 Reposition/Move (移动 ≤2")，不能射击/近战/冲锋等
  if (op.counteracting && !['Move', 'Reposition'].includes(action)) {
    return { allowed: false, reason: 'COUNTERACT_ONLY_REPOSITION' };
  }

  // 1. lite 模式隐藏 Advance
  if (action === 'Advance' && isLiteMode) {
    return { allowed: false, reason: 'LITE_MODE_NO_ADVANCE' };
  }

  // 2. APL 检查（用 ACTION_COSTS 查成本）
  const cost = ACTION_COSTS[action] ?? 1;
  if (op.apl < cost) {
    return { allowed: false, reason: 'INSUFFICIENT_APL' };
  }

  // 3. 矩阵兼容性: 已执行的所有行动都必须允许当前行动
  for (const performed of op.actionsPerformed) {
    const compat = queryCompatibility(performed, action);
    if (compat === false) {
      return { allowed: false, reason: `INCOMPATIBLE_WITH_${performed.toUpperCase()}` };
    }
    // 'heavy' 和 'locked' 在外层另外处理
  }

  // 4. 具体行动的额外约束
  switch (action) {
    case 'Charge':
      if (op.hasConceal) return { allowed: false, reason: 'CONCEAL_NO_CHARGE' };
      // 已处于控制范围内不能再冲锋（规则原文: cannot perform if already within control range）
      break;
    case 'FallBack':
      // Fall Back 需要 APL >= 2
      if (op.apl < 2) return { allowed: false, reason: 'FALLBACK_REQUIRES_2APL' };
      break;
    case 'Shoot':
      if (op.hasConceal) {
        // 检查是否有 Silent 武器
        const hasSilent = op.weapons.some(w => w.hasRule && w.hasRule('Silent'));
        if (!hasSilent) return { allowed: false, reason: 'CONCEAL_NO_SHOOT' };
      }
      break;
    default:
      break;
  }

  // 5. Heavy (Dash only) 武器的 Shoot 特殊规则
  if (action === 'Shoot') {
    const hasHeavy = op.weapons.some(w => w.hasRule && w.hasRule('Heavy'));
    const hasDashed = op.actionsPerformed.includes('Dash');
    const allWeaponsHeavy = op.weapons.filter(w => w.isRanged).every(w => w.hasRule && w.hasRule('Heavy'));

    // Heavy 规则: 该激活中移动过就不能用 Heavy 武器
    // Heavy (Dash only) 例外: 只禁止非 Dash 的移动
    const nonDashMove = ['Move', 'Reposition', 'Advance', 'Charge', 'FallBack']
      .some(m => op.actionsPerformed.includes(m));

    if (hasHeavy && !hasDashed && nonDashMove && allWeaponsHeavy) {
      return { allowed: false, reason: 'HEAVY_WEAPON_NEEDS_DASH' };
    }
  }

  // 6. Astartes 互斥锁 (Shoot/Fight 二选一)
  // — 这部分在 ui.js 里由 shootLocked / fightLocked 处理，此处仅返回基础判定
  //   'locked' 状态留给调用方根据 isAstartes 决定

  return { allowed: true };
}

/**
 * 获取行动约束矩阵（只读，用于 UI 调试/可视化）
 */
export function getActionMatrix() {
  return JSON.parse(JSON.stringify(MATRIX));
}
