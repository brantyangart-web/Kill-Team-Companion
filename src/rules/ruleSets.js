/**
 * ruleSets.js — 规则集 Profile 层 (RuleSet Profiles)
 *
 * 集中定义 lite / standard 两套规则的所有差异。
 * 业务代码通过 activeRuleSet() 查询当前规则集，不再直接判断 gameState.rulesVersion。
 * 新增版本差异时，只改这一个文件。
 *
 * ⚠️ factionMechanicsEnabled 是临时伞标志：
 *   阵营机制（章战术 / 混沌印记 / Toxic / Disgustingly Resilient 等）本属于
 *   团队规则(team rules)，不应由核心版本开关控制。当前 lite=false/standard=true
 *   仅为保持重构前的行为；后续"逐条比对"阶段会逐条核对 faction docs 后解绑。
 */

import { gameState } from '../js/state.js';

export const RULE_SETS = {
  lite: {
    id: 'lite',
    maxTurningPoints: 4,
    hasAdvanceAction: false,
    injuredAplPenalty: 0,            // lite: Injured 只减移动，不减 APL
    injuredMovePenalty: 2,
    hasKillCallbacks: false,         // 击杀回调系统 (Standard 专属)
    hasObjectiveMarkers: false,      // 控制标记系统 (Standard 专属)
    factionMechanicsEnabled: false,  // ⚠️临时伞标志，见上文注释
  },
  standard: {
    id: 'standard',
    maxTurningPoints: 5,
    hasAdvanceAction: true,
    injuredAplPenalty: 1,            // standard: Injured 时 APL -1
    injuredMovePenalty: 2,
    hasKillCallbacks: true,
    hasObjectiveMarkers: true,
    factionMechanicsEnabled: true,
  },
};

/**
 * 当前激活的规则集。
 * 动态读取 gameState.rulesVersion，因此 UI 切换版本后立即生效。
 * @returns {Object} 当前规则集 profile 对象
 */
export function activeRuleSet() {
  return RULE_SETS[gameState.rulesVersion] || RULE_SETS.lite;
}

/**
 * 列出所有可用规则集 id（供 UI 版本切换器枚举）
 * @returns {string[]}
 */
export function listRuleSets() {
  return Object.keys(RULE_SETS);
}
