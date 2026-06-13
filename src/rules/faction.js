/**
 * faction.js — 阵营特性与数据
 *
 * 集中定义每个阵营的：
 *   - 模板数据 (templates)
 *   - 被动特性 (traits)
 *   - 策略 ploys
 *   - 主题色 / 骰子样式
 *
 * 未来扩展 dynamic-factions 时，FACTIONS_DB 将从这里读取，
 * UI 根据 FACTIONS_DB 动态渲染 setup-overlay。
 */

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
  // 未来扩展
  'Legionary': {
    // TBD
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
    themeColor: '#ef4444',
    diceClass: 'pm-dice',
    headerImg: null,  // TBD
    templates: null,
    ploys: [],
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
