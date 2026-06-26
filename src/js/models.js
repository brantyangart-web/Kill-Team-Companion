import { playSound } from './audio.js';
import { gameState, wizardState } from './state.js';
import { hasFactionTrait, getActivePloys, getFactionDisplayName, getFactionThemeVar } from '../rules/faction.js';
import { isFirefightPloyActive } from '../rules/ploys.js';
import { activeRuleSet } from '../rules/ruleSets.js';

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
};

export function translateRule(rule) {
  return RULE_I18N[rule] || rule;
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
    let move = this.maxMove - (hasPenalty ? 2 : 0);
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
   * @param {number|number[]} amountOrAttacks - 总伤害值，或每次攻击的伤害数组（用于 DR per-attack）
   * @param {number[]} [drRolls] - 手动录入或系统自动生成的 DR 骰子
   * @param {string} [drSource] - 骰子来源：'manual' (物理录入) | 'auto' (自动代投) | 'melee_auto' (近战自动代投)
   * @param {string} [reason] - 扣血原因（用于在伤害动画上悬浮展示标签）
   * @returns {number} 实际受到的伤害
   */
  applyWounds(amountOrAttacks, drRolls = null, drSource = 'auto', reason = '') {
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
        !Array.isArray(amountOrAttacks)) { // 只对单次伤害触发
      // 弹出确认提示
      const useIronHalo = confirm(`💫 Iron Halo (每战一次)\n\n${this.name} 即将受到 ${amountOrAttacks} 点伤害。\n是否使用 Iron Halo 忽略本次伤害？`);
      if (useIronHalo) {
        this.ironHaloUsed = true;
        ui.addLog(`[钢铁光环] ${this.name} 使用 Iron Halo！忽略 ${amountOrAttacks} 点伤害！(每战一次已使用)`);
        if (ui.showToast) ui.showToast('💫 Iron Halo: 伤害已忽略！', 'success');
        return 0;
      }
    }

    const hasDr = activeRuleSet().factionMechanicsEnabled
      && hasFactionTrait(this.faction, 'disgustingResilience');
    let totalIncoming = 0;
    let attackBreakdown = [];

    if (Array.isArray(amountOrAttacks)) {
      attackBreakdown = amountOrAttacks;
      totalIncoming = amountOrAttacks.reduce((s, v) => s + v, 0);
    } else {
      totalIncoming = amountOrAttacks;
      attackBreakdown = [amountOrAttacks]; // 视为单次攻击
    }

    ui.addLog(`[伤害] ${this.name} 准备分配 ${totalIncoming} 点伤害...`);

    let actualDamage = 0;

    if (hasDr) {
      // Sickening Resilience (firefight ploy)
      const hasPloyActive = isFirefightPloyActive('sickening_resilience', this.faction);
      if (hasPloyActive) {
        ui.addLog(`<span style="color:#7ab88a; font-weight:bold;">[战术特性] 【恶心坚韧】战术当前激活！(无需投骰，对所有 ≥3 伤害的攻击直接自动减免 1 点，最低降至 2)</span>`);
      } else {
        ui.addLog(`[特性] 触发${getFactionDisplayName(this.faction)}专属【恶心作呕 (DR 4+)】：`);
      }

      let drRollIndex = 0;

      for (const attackDmg of attackBreakdown) {
        if (attackDmg < 3) {
          // DR 仅在 3+ 伤害攻击时触发
          ui.addLog(`  - 单次攻击伤害 ${attackDmg} (<3)，不触发 DR。`);
          actualDamage += attackDmg;
          continue;
        }

        if (hasPloyActive) {
          const reduced = Math.max(2, attackDmg - 1);
          ui.addLog(`  - 伤害 ${attackDmg}：【恶心坚韧】自动减免 1 点 -> ${reduced} 伤害`);
          actualDamage += reduced;
          continue;
        }

        let roll;
        let sourceLabel = '';
        let hintLabel = '';
        if (drRolls && drRollIndex < drRolls.length) {
          roll = drRolls[drRollIndex++];
          if (drSource === 'manual') {
            sourceLabel = `<span style="color:#7ab88a; font-weight:bold;">[玩家物理录入]</span> 录入 DR 骰子`;
          } else {
            sourceLabel = `<span style="color:#f59e0b; font-weight:bold;">[系统自动代投]</span> 投 DR 骰子`;
          }
          ui.addLog(`  - 伤害 ${attackDmg} (>=3): ${sourceLabel} [${roll}]`);
        } else {
          roll = Math.floor(Math.random() * 6) + 1;
          if (drSource === 'melee_auto') {
            sourceLabel = `<span style="color:#ef4444; font-weight:bold;">[近战系统代投]</span> 投 DR 骰子`;
          } else {
            sourceLabel = `<span style="color:#f59e0b; font-weight:bold;">[系统自动代投]</span> 投 DR 骰子`;
            hintLabel = ` <span style="font-size:0.75rem; color:var(--text-muted);">(当前为系统代投。若想使用物理骰子，请在设置中切换为“物理录入”模式)</span>`;
          }
          ui.addLog(`  - 伤害 ${attackDmg} (>=3): ${sourceLabel} [${roll}]${hintLabel}`);
        }

        if (roll >= 4) {
          const reduced = attackDmg - 1;
          ui.addLog(`    -> 🛡️ 减免成功！伤害减 1 点 (${attackDmg} -> ${reduced})`);
          actualDamage += reduced;
        } else {
          ui.addLog(`    -> ❌ 减免失败，受到全额 ${attackDmg} 点伤害。`);
          actualDamage += attackDmg;
        }
      }
    } else {
      actualDamage = totalIncoming;
    }

    const prevHp = this.wounds;
    this.wounds = Math.max(0, this.wounds - actualDamage);
    ui.addLog(`[分配] ${this.name} 生命值: ${prevHp} -> ${this.wounds} ${this.wounds === 0 ? '(已阵亡!)' : ''}`);

    // Queue damage animation automatically for any damage taken or reduced
    const drReduced = hasDr ? Math.max(0, totalIncoming - actualDamage) : 0;
    if (ui.queueVisualEvent && ui.getOperativeAvatarUrl && (actualDamage > 0 || drReduced > 0)) {
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
          drReduced: drReduced,
          reason: reason,
          hitSound: hitSound
        }
      });
    } else {
      // Fallback when queue manager is not active
      if (actualDamage > 0) {
        playSound(hitSound);
      } else if (drReduced > 0) {
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
    ts += 1;
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
