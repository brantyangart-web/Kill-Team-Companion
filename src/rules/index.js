/**
 * rules/index.js — 规则引擎统一入口
 *
 * 所有规则相关函数都从这里导出。
 * UI / combat 代码 import 时只认这个入口，
 * 未来改内部实现不影响外部调用。
 */

// 核心常量
export {
  CONTROL_RANGE,
  COVER_CLOSE_THRESHOLD,
  ACTION_COSTS,
  getMoveDistance,
  CRIT_VALUE,
  FAIL_VALUE,
  COUNTERACT_MAX_MOVE,
  COUNTERACT_APL,
  isInjured,
  INJURED_MOVE_PENALTY,
  INJURED_HIT_PENALTY,
  TURNING_POINTS_LITE,
  TURNING_POINTS_STANDARD,
  STARTING_CP,
} from './core.js';

// 行动约束矩阵
export {
  canPerformAction,
  queryCompatibility,
  getActionMatrix,
} from './actions.js';

// 武器关键字引擎
export {
  WEAPON_RULES,
  parseWeaponRule,
  applyWeaponRules,
  weaponHasRule,
  getWeaponRuleParam,
} from './weapons.js';

// 阵营特性
export {
  FACTION_TRAITS,
  FACTIONS_DB,
  hasFactionTrait,
  getFactionTraits,
  getFaction,
  listFactions,
  injectTemplates,
} from './faction.js';

// 策略规则
export {
  getCpGain,
  getStartingCp,
  canBuyPloy,
  PLOY_COST,
  canCounteract,
  listCounteractCandidates,
  COMMAND_REROLL_COST,
  canCommandReroll,
  isFinalTurningPoint,
} from './strategy.js';

// Ploy 系统 (官方 25 ploys)
export {
  PLOY_DATABASE,
  getAvailablePloys,
  getPloy,
  isPloyActive,
  activatePersistentPloy,
  activateFirefightPloy,
  isFirefightPloyActive,
  getUsedPloysThisTP,
  markPloyUsedThisTP,
  resetPloysThisTP,
  getCombatDoctrineChoice,
  setCombatDoctrineChoice,
  isIgnoreInjuredPenalties,
  isContagionActive,
  isLumberingDeathActive,
  isBloodForBloodGodActive,
  isImplacableActive,
  isQuicksilverSpeedActive,
  isFickleFatesActive,
  isIndomitusActive,
} from './ploys.js';

// 既有的骰子工具（保留）
export * from './dice.js';
