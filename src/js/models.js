import { playSound } from './audio.js';
import { gameState, wizardState } from './state.js';
import { hasFactionTrait, getActivePloys, getFactionDisplayName, getFactionThemeVar } from '../rules/faction.js';
import { isFirefightPloyActive } from '../rules/ploys.js';
import { activeRuleSet } from '../rules/ruleSets.js';

// Cryptographically random d6 roll (1-6). Uint8Array rejection-samples to
// eliminate modulo bias: reject values >= 252 (= 6 * 42, largest multiple of
// 6 that fits in a byte), so all six outcomes are equally probable.
export function rollD6() {
  const buf = new Uint8Array(1);
  let v;
  do { crypto.getRandomValues(buf); v = buf[0]; } while (v >= 252);
  return (v % 6) + 1;
}

// UI callbacks - set during app initialization to avoid circular deps
const ui = {};
export function initModelCallbacks(callbacks) {
  Object.assign(ui, callbacks);
}

// 武器规则关键字中英对照表
const RULE_I18N = {
  'PSYCHIC': '灵能',
  'Saturate': '饱和',
  'Severe': '重伤',
  'Poison': '毒素',
  'Toxic': '剧毒',
  'Piercing Crits 1': '穿甲暴击 1',
  'Torrent 1"': '涌流 1"',
  'Torrent 2"': '涌流 2"',
  'Shock': '震击',
  'Stun': '眩晕',
  'Brutal': '残暴',
  'Indirect Fire': '间接射击',
  'Heavy (Dash only)': '重型(仅冲刺)',
  'Seek Light': '追光',
  'Silent': '静默',
  'Piercing 1': '穿甲 1',
  'Piercing 2': '穿甲 2',
  'Hot': '过热',
  'Lethal 5+': '致命 5+',
  'Blast 1"': '爆炸 1"',
  'Blast 2"': '爆炸 2"',
  'Balanced': '平衡',
  'Ceaseless': '不息',
  'Relentless': '无情',
};

const RULE_DESCRIPTIONS = {
  'PSYCHIC': '【灵能】：每次你执行带有此特殊规则的攻击时，如果你在攻击骰中投出任何未修改的 1，该特工将受到等同于投出 1 数量的致命伤害（在掷骰阶段结算，俗称“爆头”）。',
  'Saturate': '【饱和】：目标在进行防御投骰时，不能保留任何成功的普通骰（只能保留暴击防守，或靠规则强制保留）。',
  'Severe': '【重伤】：如果你没有保留任何暴击命中，你可以将一个普通命中骰变成暴击命中骰。',
  'Poison': '【毒素】：每当你用该武器对敌方特工造成伤害时，目标获得 1 个毒素标记（上限1个）。其每次激活时，受 1 点直接伤害。',
  'Toxic': '【剧毒】：每当目标带有毒素标记时，此武器每次成功造成的伤害 +1。',
  'Piercing Crits 1': '【穿甲暴击 1】：每当你保留 1 个暴击命中，目标的防御骰减少 1 个。',
  'Torrent 1"': '【涌流 1"】：在对主目标射击后，可以对距离主目标 1" 范围内、并且符合可见性等条件的每一个其他特工分别进行一次射击。',
  'Torrent 2"': '【涌流 2"】：同涌流，范围变为 2"。',
  'Shock': '【震击】：在近战中当你打击(Strike)并造成暴击伤害时，你可以立刻丢弃对手 1 个尚未结算的普通成功骰。',
  'Stun': '【眩晕】：暴击命中将使目标 APL -1（不可叠加）。',
  'Brutal': '【残暴】：在近战中，对手只能使用暴击成功骰来进行格挡(Parry)。',
  'Indirect Fire': '【间接射击】：只要目标不在掩蔽(Cover)地形的正后方且可见，就能进行射击，无视交战规则中的地形遮挡惩罚。',
  'Heavy (Dash only)': '【重型(仅冲刺)】：如果该特工在本回合执行了常规移动(Normal Move)或冲锋(Charge)，则无法使用此武器；射击后也不能再执行移动或冲锋（可以冲刺 Dash）。',
  'Seek Light': '【追光】：目标不能因轻型掩体(Light Terrain)而获得掩蔽(Cover)或保留自动防御骰。',
  'Silent': '【静默】：特工在处于“隐蔽(Conceal)”状态下仍然可以开火。',
  'Piercing 1': '【穿甲 1】：每当你进行攻击时，目标的防御骰减少 1 个。',
  'Piercing 2': '【穿甲 2】：目标的防御骰减少 2 个。',
  'Hot': '【过热】：每次攻击投出任何未修改的 1，射击者在攻击后受到 3 点致命伤害。',
  'Lethal 5+': '【致命 5+】：投出 5 和 6 均算作暴击命中。',
  'Blast 1"': '【爆炸 1"】：在对主目标结算完毕后，必须对 1" 内所有特工(无论敌我)分别进行一次该武器的射击。',
  'Blast 2"': '【爆炸 2"】：同爆炸，范围变为 2"。',
  'Balanced': '【平衡】：你可以在本次攻击中重投 1 个骰子。',
  'Ceaseless': '【不息】：你可以在本次攻击中重投任何结果为 1 的骰子。',
  'Relentless': '【无情】：你可以在本次攻击中重投任意数量的骰子。',
};

export function translateRule(rule) {
  return RULE_I18N[rule] || rule;
}

export function getRuleDescription(rule) {
  return RULE_DESCRIPTIONS[rule] || '暂无此规则的详细说明。';
}

export class Weapon {
  constructor(name, attacks, targetSkill, normalDmg, criticalDmg, isRanged = true, range = null, rules = []) {
    this.name = name;
    this.attacks = attacks;
    this.ts = targetSkill;
    this.normalDamage = normalDmg;
    this.criticalDamage = criticalDmg;
    this.isRanged = isRanged;
    this.range = range; // inches, or null for melee
    this.rules = rules; // e.g. ['Poison', 'Severe', 'Toxic']
  }

  hasRule(ruleName) {
    // Support partial matching for rules with parameters like 'Heavy (Dash only)'
    return this.rules.some(r => r === ruleName || r.startsWith(ruleName + ' '));
  }

  get displayRange() {
    if (this.range === null) return '-';
    return this.range + '"';
  }

  get displayRules() {
    return this.rules.length > 0 ? this.rules.map(r => RULE_I18N[r] || r).join(', ') : '-';
  }
}

export class Operative {
  constructor(id, name, faction, wounds, apl, df, sv, weapons = [], defaultAvatar = '', move = 6, teamSlot = -1) {
    this.id = id;
    this.name = name;
    this.faction = faction;
    this.teamSlot = teamSlot; // 0 or 1, for mirror-match disambiguation
    this.maxWounds = wounds;
    this.wounds = wounds;
    this.maxApl = apl;
    this.apl = apl;
    this.df = df;
    this.sv = sv;
    this.weapons = weapons;
    this.defaultAvatar = defaultAvatar;
    this.maxMove = move;
    this.move = move;

    this.hasActed = false;
    this.isDead = false;
    this.actionsPerformed = [];

    // Poison Token 机制
    this.poisonTokens = 0;
    // Conceal Order (规则 L7: 部署时所有特工默认隐匿)
    this.hasConceal = true;
    // Counteract 标记 (反击激活时为 true, 激活结束后重置)
    this.counteracting = false;
    // Counteract 每 TP 限用 1 次 (per-operative)
    this.hasCounteractedThisTP = false;
    // Order 切换标记 (每个激活可切换 1 次)
    this.orderSwitchedThisActivation = false;

    // === Standard 规则专属字段 ===

    // 特工类型标识 (如 'sm_captain', 'pm_champion', 'leg_aspiring_champion')
    // 用于在战斗结算中触发特殊能力
    this.operativeType = '';

    // 通用状态标签池 (例如 'Poisoned', 'Injured', 'Stunned')
    this.tokens = [];

    // Legionary: 混沌印记 ('KHORNE'/'NURGLE'/'SLAANESH'/'TZEENTCH'/'UNDIVIDED')
    this.marksOfChaos = null;

    // Space Marine: 章战术列表 (primary + secondary + 额外)
    this.chapterTactics = [];

    // Captain: Iron Halo 使用标记 (每战一次)
    this.ironHaloUsed = false;

    // Anointed: Unleash Daemon 激活标记 (每战一次)
    this.unleashDaemonActive = false;

    // Captain: Heroic Leader 每 TP 使用标记
    this.heroicLeaderUsedThisTP = false;

    // 回血追踪 (Champion Grandfather's Blessing 等，每 TP ≤3)
    this.woundsRegainedThisTP = 0;

    // Plaguecaster: Putrescent Vitality 每 TP 限用 1 次
    this.putrescentVitalityUsedThisTP = false;

    // Warrior (LEG): Infernal Pact 使用标记 (每战一次)
    this.infernalPactUsed = false;

    // Shrivetalon: Grisly Mark 使用标记 (每战一次)
    this.grislyMarkUsed = false;

    // 一次性能力已使用标记 (通用)
    this.oncePerBattleAbilitiesUsed = new Set();
  }

  /** Injured: HP 低于一半时 Move -2", 武器 Hit -1, APL -1 */
  get isInjured() {
    return this.wounds > 0 && this.wounds < this.maxWounds / 2;
  }

  /** 是否忽略重伤（Injured）减益 */
  get ignoreInjuredPenalties() {
    // 1. Angels of Death (Space Marine): "无所畏惧" (and_they_shall_know_no_fear)
    if (this.faction === 'Space Marine' && isFirefightPloyActive('and_they_shall_know_no_fear', 'Space Marine')) {
      return true;
    }
    // 2. Legionary: "坚定不移" (implacable) 对 NURGLE 标记特工生效
    if (this.faction === 'Legionary' && this.marksOfChaos === 'NURGLE' && isFirefightPloyActive('implacable', 'Legionary')) {
      return true;
    }
    return false;
  }

  /** 当前有效 APL（Injured 时按规则集减值：standard -1，lite 无 APL 惩罚，并计入 activeDebuffs 修正） */
  get currentApl() {
    const injuredAplPenalty = activeRuleSet().injuredAplPenalty;
    const hasPenalty = this.isInjured && !this.ignoreInjuredPenalties;
    let apl = this.maxApl - (hasPenalty ? injuredAplPenalty : 0);
    if (this.activeDebuffs) {
      for (const d of this.activeDebuffs) {
        if (d.stat === 'apl') {
          apl += d.modifier;
        }
      }
    }
    return Math.max(0, apl);
  }

  /** 当前有效 Move（Injured 时 -2"，Slaanesh Mark +1"） */
  get currentMove() {
    const hasPenalty = this.isInjured && !this.ignoreInjuredPenalties;
    let move = this.maxMove - (hasPenalty ? activeRuleSet().injuredMovePenalty : 0);
    // Slaanesh Mark of Chaos +1" Move（阵营机制，由 factionMechanicsEnabled 开关）
    if (activeRuleSet().factionMechanicsEnabled && this.marksOfChaos === 'SLAANESH') {
      move += 1;
    }
    // 计谋/Debuff 数值修正
    if (this.activeDebuffs) {
      for (const d of this.activeDebuffs) {
        if (d.stat === 'move') {
          move += d.modifier;
        }
      }
    }
    return Math.max(0, move);
  }

  /** 控制标记判定时的有效 APL (Icon Bearer +1) */
  getEffectiveAplForMarkerControl() {
    let apl = this.currentApl;
    // Icon Bearer (PM/LEG) 控制标记时 APL +1（阵营机制，由 factionMechanicsEnabled 开关）
    if (activeRuleSet().factionMechanicsEnabled) {
      if (this.operativeType === 'pm_icon_bearer' || this.operativeType === 'leg_icon_bearer') {
        apl += 1;
      }
    }
    return apl;
  }

  /**
   * 回复伤口 (Standard 规则)
   * @param {number} amount - 回血量
   * @returns {number} 实际回血量
   */
  healWounds(amount) {
    if (this.isDead || amount <= 0) return 0;
    const missing = this.maxWounds - this.wounds;
    const actual = Math.min(amount, missing);
    if (actual > 0) {
      this.wounds += actual;
      ui.addLog(`[治疗] ${this.name} 恢复 ${actual} 点伤口 (${this.wounds}/${this.maxWounds})`);
    }
    return actual;
  }

  /**
   * 检测是否有一次性能力可用
   * @param {string} abilityName - 能力名称
   * @returns {boolean}
   */
  isOncePerBattleAvailable(abilityName) {
    return !this.oncePerBattleAbilitiesUsed.has(abilityName);
  }

  /**
   * 标记一次性能力已使用
   * @param {string} abilityName - 能力名称
   */
  markOncePerBattleUsed(abilityName) {
    this.oncePerBattleAbilitiesUsed.add(abilityName);
  }

  /** 切换 Conceal Order */
  toggleConceal() {
    this.hasConceal = !this.hasConceal;
  }

  reset() {
    this.wounds = this.maxWounds;
    this.apl = this.maxApl;
    this.move = this.maxMove;
    this.hasActed = false;
    this.isDead = false;
    this.actionsPerformed = [];
    this.poisonTokens = 0;
    this.hasConceal = true;
    this.counteracting = false;
    this.orderSwitchedThisActivation = false;
    // Standard 规则: TP 重置
    this.heroicLeaderUsedThisTP = false;
    this.woundsRegainedThisTP = 0;
    this.putrescentVitalityUsedThisTP = false;
  }

  /**
   * 分配伤害。
   * @param {number|number[]} totalIncoming - 总伤害值，或每次攻击的伤害数组（为了向下兼容数组，会在内部直接求和）
   * @param {number} [preCalculatedDrReduced=0] - 已经被外部减免的伤害值（仅用于传递给伤害动画）
   * @param {string} [reason=''] - 扣血原因（用于在伤害动画上悬浮展示标签）
   * @returns {number} 实际受到的伤害
   */
  applyWounds(totalIncoming, preCalculatedDrReduced = 0, reason = '') {
    if (this.isDead) return 0;

    let hitSound = 'flesh';
    if (reason === '亚空间反噬') {
      hitSound = 'psychic_peril';
    } else if (reason === '武器过热自伤') {
      hitSound = 'plasma_overheat';
    } else if (reason === '毒素发作') {
      hitSound = 'poison_damage';
    } else if (reason === '次要目标溅射') {
      hitSound = 'splash_damage';
    }

    // === Iron Halo (SM Captain) ===
    // 每战一次，忽略 1 个 Normal Dmg（阵营机制，由 factionMechanicsEnabled 开关）
    if (activeRuleSet().factionMechanicsEnabled &&
        this.operativeType === 'sm_captain' &&
        !this.ironHaloUsed &&
        !Array.isArray(totalIncoming)) { // 只对单次伤害触发
      // 弹出确认提示
      const useIronHalo = confirm(`💫 Iron Halo (每战一次)\n\n${this.name} 即将受到 ${totalIncoming} 点伤害。\n是否使用 Iron Halo 忽略本次伤害？`);
      if (useIronHalo) {
        this.ironHaloUsed = true;
        ui.addLog(`[钢铁光环] ${this.name} 使用 Iron Halo！忽略 ${totalIncoming} 点伤害！(每战一次已使用)`);
        if (ui.showToast) ui.showToast('💫 Iron Halo: 伤害已忽略！', 'success');
        return 0;
      }
    }

    let actualIncoming = 0;
    if (Array.isArray(totalIncoming)) {
      actualIncoming = totalIncoming.reduce((s, v) => s + v, 0);
    } else {
      actualIncoming = totalIncoming;
    }

    ui.addLog(`[伤害] ${this.name} 准备分配 ${actualIncoming} 点伤害...`);

    const actualDamage = actualIncoming;

    const prevHp = this.wounds;
    this.wounds = Math.max(0, this.wounds - actualDamage);
    ui.addLog(`[分配] ${this.name} 生命值: ${prevHp} -> ${this.wounds} ${this.wounds === 0 ? '(已阵亡!)' : ''}`);

    // Queue damage animation automatically for any damage taken or reduced
    // (Except for 'melee_auto' which handles its own new anime cut-in visuals)
    if (reason !== 'melee_auto' && ui.queueVisualEvent && ui.getOperativeAvatarUrl && (actualDamage > 0 || preCalculatedDrReduced > 0)) {
      if (reason === '毒素发作') {
        ui.queueVisualEvent({
          type: 'poison_cutin',
          data: { opId: this.id }
        });
      } else {
        const avatarUrl = ui.getOperativeAvatarUrl(this.id, this.faction);
        const themeVar = getFactionThemeVar(this.faction);
      ui.queueVisualEvent({
        type: 'damage',
        data: {
          imageUrl: avatarUrl,
          maxWounds: this.maxWounds,
          currentWounds: prevHp,
          damageAmount: actualDamage,
          themeVar: themeVar,
          drReduced: preCalculatedDrReduced,
          reason: reason,
          hitSound: hitSound
        }
      });
      }
    } else {
      // Fallback when queue manager is not active
      if (actualDamage > 0) {
        playSound(hitSound);
      } else if (preCalculatedDrReduced > 0) {
        playSound('bubble');
      }
    }

    if (this.wounds === 0) {
      this.isDead = true;
      this.hasActed = true;
      ui.triggerOperativeDeathOverlay(this);
    }
    return actualDamage;
  }
}

/**
 * 计算特工装备某武器时的最终命中值 (TS)。
 * 考虑受伤惩罚以及身上的 activeDebuffs（如计谋施加的命中修正）。
 * @param {Object} weapon 
 * @param {Object} operative 
 * @param {boolean} ignoreInjured 是否忽略受伤惩罚
 * @returns {number} 最终的 TS 值
 */
export function getEffectiveTs(weapon, operative, ignoreInjured = false) {
  let ts = weapon.ts;
  const shouldIgnore = ignoreInjured || (operative && operative.ignoreInjuredPenalties);
  if (operative && operative.isInjured && !shouldIgnore) {
    ts += activeRuleSet().injuredTsPenalty;
  }
  if (operative && operative.activeDebuffs) {
    operative.activeDebuffs.forEach(d => {
      if (d.stat === 'hit') {
        ts += d.modifier;
      }
    });
  }
  return ts;
}
