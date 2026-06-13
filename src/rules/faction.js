/**
 * faction.js — 阵营特性与数据
 *
 * 集中定义每个阵营的：
 *   - 模板数据 (templates)
 *   - 被动特性 (traits)
 *   - 策略 ploys
 *   - 主题色 / 骰子样式
 *   - Helper 函数（替代硬编码 faction 判断）
 *
 * 动态阵营扩展路径 (Dynamic Factions Roadmap):
 *   1. 当前状态：FACTIONS_DB 已定义，UI 已支持 SM/PM/Legionary 双方各选。
 *   2. Helper 函数已就位，combat/state/models/ui 通过 helper 替代硬编码。
 *   3. 新阵营扩展：添加 FACTIONS_DB 条目 + templates + CSS 即可。
 */

import { gameState } from '../js/state.js';

// ==========================================
//        阵营被动特性
// ==========================================

/**
 * 阵营被动特性表 (Passive Traits)
 *
 * 每个特性是一个函数，接收游戏上下文，返回修饰符或行为描述。
 * UI / combat 通过 hasFactionTrait() 查询。
 */
export const FACTION_TRAITS = {
  'Space Marine': {
    // Astartes 双重行动: 可选 2 次 Shoot 或 2 次 Fight（不能混合）
    astartesDoubleAction: true,
    // 没有其他被动（ploys 在 FACTIONS_DB 里定义）
  },
  'Plague Marine': {
    // Disgusting Resilience: 受到 3+ 伤害时 DR 4+ 减免
    // — 具体实现在 models.js Operative.applyWounds 中
    disgustingResilience: true,
  },
  // 混沌星际战士
  'Legionary': {
    // Astartes 双重行动: 可选 2 次 Shoot 或 2 次 Fight（同 SM）
    astartesDoubleAction: true,
    // 黑暗狂热: 每次 Fight 可重投 1 个失败近战骰
    darkZealotry: true,
  },
};

/**
 * 查询阵营是否有某特性
 * @param {string} faction - 阵营 id
 * @param {string} trait - 特性名
 * @returns {boolean}
 */
export function hasFactionTrait(faction, trait) {
  const traits = FACTION_TRAITS[faction];
  if (!traits) return false;
  return Boolean(traits[trait]);
}

/**
 * 获取阵营所有特性
 * @param {string} faction
 * @returns {Object}
 */
export function getFactionTraits(faction) {
  return FACTION_TRAITS[faction] || {};
}

// ==========================================
//        阵营数据库 (FACTIONS_DB)
// ==========================================

/**
 * 完整阵营数据。
 * 注: templates 在此处留空，由 constants.js 的 SM_TEMPLATES / PM_TEMPLATES 填充。
 *     未来引入 dynamic-factions 时，templates 会在此处集中定义。
 */
export const FACTIONS_DB = {
  'Space Marine': {
    id: 'Space Marine',
    name: '死亡天使 (Angels of Death)',
    shortName: '死亡天使',
    themeColor: 'var(--sm-accent)',
    diceClass: 'sm-dice',
    headerImg: './assets/images/headers/faction_header_sm.png',
    // templates 延迟注入（避免循环依赖）
    templates: null,
    ploys: [
      { id: 'bolter_discipline', name: '风暴开火 (Bolter Discipline)', type: 'Strategic', cp: 1, desc: '特工在使用爆弹类武器时可进行第二次射击行动。' },
      { id: 'shock_assault', name: '震慑突击 (Shock Assault)', type: 'Strategic', cp: 1, desc: '冲锋后近战搏斗时获得额外重投。' },
      { id: 'transhuman', name: '极限减伤 (Transhuman Physiology)', type: 'Firefight', cp: 1, desc: '遭到致命一击时可将 1 个暴击伤害降为普通伤害。' },
    ],
  },
  'Plague Marine': {
    id: 'Plague Marine',
    name: '瘟疫守卫 (Plague Marines)',
    shortName: '瘟疫守卫',
    themeColor: 'var(--pm-accent)',
    diceClass: 'pm-dice',
    headerImg: './assets/images/headers/faction_header_pm.png',
    templates: null,
    ploys: [
      { id: 'inexorable_advance', name: '无尽行军 (Inexorable Advance)', type: 'Strategic', cp: 1, desc: '忽略移动减损惩罚，强行推进。' },
      { id: 'malicious_volleys', name: '剧毒喷洒 (Malicious Volleys)', type: 'Strategic', cp: 1, desc: '爆弹武器即使移动过也能双击。' },
      { id: 'contagious_resilience', name: '恶心减伤 (Disgustingly Resilient)', type: 'Firefight', cp: 1, desc: '防守时可以将一枚失败骰改为普通成功。' },
    ],
  },
  'Legionary': {
    id: 'Legionary',
    name: '黑军团 (Legionaries)',
    shortName: '黑军团',
    themeColor: '#8b1a1a',
    diceClass: 'leg-dice',
    headerImg: './assets/images/headers/faction_header_leg.png',
    templates: null,
    ploys: [
      { id: 'dark_zealotry', name: '黑暗狂热 (Dark Zealotry)', type: 'Strategic', cp: 1, desc: '近战搏斗时可重投 1 个失败骰。' },
      { id: 'chaos_glory', name: '混沌荣耀 (Chaos Glory)', type: 'Strategic', cp: 1, desc: ' leader 在 Fight 中获得 +1 攻击。' },
      { id: 'warp_touched', name: '亚空间庇护 (Warp-Touched)', type: 'Firefight', cp: 1, desc: '受到致命伤害时可掷骰 6+ 抵消。' },
    ],
  },
};

/**
 * 注入阵营模板（避免循环依赖）
 * @param {string} factionId
 * @param {Array} templates
 */
export function injectTemplates(factionId, templates) {
  if (FACTIONS_DB[factionId]) {
    FACTIONS_DB[factionId].templates = templates;
  }
}

/**
 * 获取阵营数据
 * @param {string} factionId
 * @returns {Object|null}
 */
export function getFaction(factionId) {
  return FACTIONS_DB[factionId] || null;
}

/**
 * 列出所有可用阵营 id
 * @returns {string[]}
 */
export function listFactions() {
  return Object.keys(FACTIONS_DB);
}

// ==========================================
//        Helper 函数层
//   替代硬编码 faction 判断，支持动态阵营
// ==========================================

// 阵营 → team slot 映射缓存 (0 = team 0 / 左方, 1 = team 1 / 右方)
// smVp/smCp 语义为 team 0, pmVp/pmCp 语义为 team 1

/**
 * 获取对手阵营
 * @param {string} faction
 * @returns {string} 对手阵营 id
 */
export function getEnemyFaction(faction) {
  const slot0 = gameState.teamFactions[0];
  const slot1 = gameState.teamFactions[1];
  if (faction === slot0) return slot1;
  if (faction === slot1) return slot0;
  // fallback: 如果 faction 不在 teamFactions 中（不应该发生），返回对手
  return slot0 === faction ? slot1 : slot0;
}

/**
 * 获取阵营所在 team slot (0 或 1)
 * @param {string} faction
 * @returns {number} 0 或 1, 未找到返回 -1
 */
export function getTeamSlot(faction) {
  if (gameState.teamFactions[0] === faction) return 0;
  if (gameState.teamFactions[1] === faction) return 1;
  return -1;
}

/**
 * 读取阵营 CP
 * @param {string} faction
 * @returns {number}
 */
export function getCpForFaction(faction) {
  return getTeamSlot(faction) === 0 ? gameState.smCp : gameState.pmCp;
}

/**
 * 设置阵营 CP
 * @param {string} faction
 * @param {number} val
 */
export function setCpForFaction(faction, val) {
  if (getTeamSlot(faction) === 0) gameState.smCp = val;
  else gameState.pmCp = val;
}

/**
 * 读取阵营 VP
 * @param {string} faction
 * @returns {number}
 */
export function getVpForFaction(faction) {
  return getTeamSlot(faction) === 0 ? gameState.smVp : gameState.pmVp;
}

/**
 * 设置阵营 VP
 * @param {string} faction
 * @param {number} val
 */
export function setVpForFaction(faction, val) {
  if (getTeamSlot(faction) === 0) gameState.smVp = val;
  else gameState.pmVp = val;
}

/**
 * 返回 CSS 骰子类名
 * @param {string} faction
 * @returns {string} 如 'sm-dice', 'pm-dice', 'leg-dice'
 */
export function getDiceClass(faction) {
  const f = FACTIONS_DB[faction];
  return f ? f.diceClass : 'sm-dice';
}

/**
 * 返回阵营显示短名（用于 UI 日志和标签）
 * @param {string} faction
 * @returns {string}
 */
export function getFactionDisplayName(faction) {
  const f = FACTIONS_DB[faction];
  return f ? f.shortName : faction;
}

/**
 * 返回阵营 CSS 后缀（用于 score-card, roster-picker-card 等 class）
 * SM → 'sm', PM → 'pm', Legionary → 'leg'
 * @param {string} faction
 * @returns {string}
 */
export function getFactionCssSuffix(faction) {
  if (faction === 'Space Marine') return 'sm';
  if (faction === 'Plague Marine') return 'pm';
  if (faction === 'Legionary') return 'leg';
  return 'sm'; // fallback
}

/**
 * 返回阵营主题 CSS 变量名（如 '--sm-accent'）
 * @param {string} faction
 * @returns {string}
 */
export function getFactionThemeVar(faction) {
  const suffix = getFactionCssSuffix(faction);
  return `--${suffix}-accent`;
}

/**
 * 获取阵营活跃 ploy 列表引用
 * @param {string} faction
 * @returns {Array}
 */
export function getActivePloys(faction) {
  return getTeamSlot(faction) === 0 ? gameState.smActivePloys : gameState.pmActivePloys;
}

/**
 * 设置阵营活跃 ploy 列表
 * @param {string} faction
 * @param {Array} ploys
 */
export function setActivePloys(faction, ploys) {
  if (getTeamSlot(faction) === 0) gameState.smActivePloys = ploys;
  else gameState.pmActivePloys = ploys;
}

/**
 * 获取阵营 team 对应的 operative-board CSS 类名
 * @param {string} faction
 * @returns {string} 如 'sm-team', 'pm-team', 'leg-team'
 */
export function getTeamCssClass(faction) {
  return `${getFactionCssSuffix(faction)}-team`;
}
