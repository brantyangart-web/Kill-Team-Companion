/**
 * core.js — Kill Team 2024 Lite 核心规则常量
 *
 * 所有"物理规则"的数字常量都放在这里。
 * 修改规则版本（lite/standard）时，统一改这一个文件。
 */

// ==========================================
//            游戏规模
// ==========================================

/** 每个 Turning Point 的回合结构 */
export const TP_STRUCTURE = {
  phases: ['Strategy', 'Firefight'],
};

/** lite 规则：4 个 TP；standard 规则可变 */
export const TURNING_POINTS_LITE = 4;
export const TURNING_POINTS_STANDARD = 5;

/** 开局 CP */
export const STARTING_CP = 2;

// ==========================================
//            距离与控制范围
// ==========================================

/** 控制范围 (Control Range) = 可见 + 1" */
export const CONTROL_RANGE = 1;

/** 掩体判定阈值：与攻击方距离 >= 2" 才算掩体 */
export const COVER_CLOSE_THRESHOLD = 2;

/** 冲锋后若贴上新敌人，无法离开其控制范围 (sticky) */
export const CHARGE_STICKY = true;

// ==========================================
//            行动成本 (APL)
// ==========================================

export const ACTION_COSTS = {
  Reposition: 1,  // lite 规则中的 "Move"
  Dash:        1,
  FallBack:    2,  // lite 规则 Fall Back 成本为 2AP
  Charge:      1,
  Shoot:       1,
  Fight:       1,
  // standard 规则才有（lite 模式隐藏）
  Advance:     1,
};

// ==========================================
//            移动距离
// ==========================================

/**
 * 计算行动的实际移动距离上限
 * @param {Object} op - Operative（必须有 op.currentMove）
 * @param {string} action - 行动名称
 * @returns {number|null} 距离上限（英寸），null 表示该行动无固定距离
 *
 * lite 规则原文:
 *   Reposition: Move 英寸
 *   Dash: 最多 3", 不能攀爬
 *   Fall Back: Move 英寸 (同 Reposition)
 *   Charge: Move + 2"
 */
export function getMoveDistance(op, action) {
  const move = op.currentMove;  // 已考虑 Injured 减值
  switch (action) {
    case 'Reposition':
    case 'Move':
    case 'FallBack':
      return move;
    case 'Dash':
      return 3;  // lite 规则：固定 3"，不能攀爬
    case 'Charge':
      return move + 2;
    case 'Advance':  // standard 规则才有
      return move + 3;
    default:
      return null;
  }
}

// ==========================================
//            骰子规则
// ==========================================

/** D6 面数 */
export const D6_FACES = 6;
/** 骰子结果 = 6 永远为暴击 */
export const CRIT_VALUE = 6;
/** 骰子结果 = 1 永远为失败 */
export const FAIL_VALUE = 1;

// ==========================================
//            Counteract
// ==========================================

/** Counteract 激活时的最大移动距离 */
export const COUNTERACT_MAX_MOVE = 2;

/** Counteract 给予的 APL */
export const COUNTERACT_APL = 1;

// ==========================================
//            受伤 (Wounded / Injured)
// ==========================================

/** 受伤阈值：血量 < max/2 即为 Injured */
export function isInjured(wounds, maxWounds) {
  return wounds > 0 && wounds < maxWounds / 2;
}

/** Injured 移动减值 */
export const INJURED_MOVE_PENALTY = 2;

/** Injured 命中减值 (Hit +1) */
export const INJURED_HIT_PENALTY = 1;
