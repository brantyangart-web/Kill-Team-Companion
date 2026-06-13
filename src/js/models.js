import { playSound } from './audio.js';
import { gameState } from './state.js';

// UI callbacks - set during app initialization to avoid circular deps
const ui = {};
export function initModelCallbacks(callbacks) {
  Object.assign(ui, callbacks);
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
    return this.rules.includes(ruleName);
  }

  get displayRange() {
    if (this.range === null) return '-';
    return this.range + '"';
  }

  get displayRules() {
    return this.rules.length > 0 ? this.rules.join(', ') : '-';
  }
}

export class Operative {
  constructor(id, name, faction, wounds, apl, df, sv, weapons = [], defaultAvatar = '', move = 6) {
    this.id = id;
    this.name = name;
    this.faction = faction;
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
    // Conceal Order
    this.hasConceal = false;
  }

  /** Injured: HP 低于一半时 Move -2", 武器 Hit -1, APL -1 */
  get isInjured() {
    return this.wounds > 0 && this.wounds < this.maxWounds / 2;
  }

  /** 当前有效 APL（Injured 时 -1） */
  get currentApl() {
    return this.maxApl - (this.isInjured ? 1 : 0);
  }

  /** 当前有效 Move（Injured 时 -2"） */
  get currentMove() {
    return Math.max(0, this.maxMove - (this.isInjured ? 2 : 0));
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
    this.hasConceal = false;
  }

  /**
   * 分配伤害。
   * @param {number|number[]} amountOrAttacks - 总伤害值，或每次攻击的伤害数组（用于 DR per-attack）
   * @param {number[]} [manualDrRolls] - 手动 DR 骰子
   * @returns {number} 实际受到的伤害
   */
  applyWounds(amountOrAttacks, manualDrRolls = null) {
    if (this.isDead) return 0;

    const isPlagueMarine = this.faction === 'Plague Marine';
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

    if (isPlagueMarine) {
      const hasPloyActive = gameState.pmActivePloys.includes('contagious_resilience');
      ui.addLog(`[特性] 触发瘟疫守卫专属【恶心作呕 (DR 4+)】 ${hasPloyActive ? '(已开启传染韧性，允许首个失败重投)' : ''}：`);

      let drRollIndex = 0;
      let hasRerolled = false;

      for (const attackDmg of attackBreakdown) {
        if (attackDmg < 3) {
          // DR 仅在 3+ 伤害攻击时触发
          ui.addLog(`  - 单次攻击伤害 ${attackDmg} (<3)，不触发 DR。`);
          actualDamage += attackDmg;
          continue;
        }

        let roll;
        if (manualDrRolls && drRollIndex < manualDrRolls.length) {
          roll = manualDrRolls[drRollIndex++];
          ui.addLog(`  - 伤害 ${attackDmg} (>=3): 手动录入 DR 骰子 [${roll}]`);
        } else {
          roll = Math.floor(Math.random() * 6) + 1;
          ui.addLog(`  - 伤害 ${attackDmg} (>=3): 投 DR 骰子 [${roll}]`);
        }

        if (roll < 4 && hasPloyActive && !hasRerolled && !manualDrRolls) {
          hasRerolled = true;
          const oldRoll = roll;
          roll = Math.floor(Math.random() * 6) + 1;
          ui.addLog(`    -> [传染韧性] 自动重投失败 [${oldRoll}] -> [${roll}]`);
        }

        if (roll >= 4) {
          const reduced = attackDmg - 1;
          ui.addLog(`    -> 成功！伤害减免 1 点 (${attackDmg} -> ${reduced})`);
          playSound('bubble');
          actualDamage += reduced;
        } else {
          ui.addLog(`    -> 减免失败，受到全额 ${attackDmg} 点伤害。`);
          actualDamage += attackDmg;
          playSound('flesh');
        }
      }
    } else {
      actualDamage = totalIncoming;
      if (actualDamage > 0) playSound('flesh');
    }

    const prevHp = this.wounds;
    this.wounds = Math.max(0, this.wounds - actualDamage);
    ui.addLog(`[分配] ${this.name} 生命值: ${prevHp} -> ${this.wounds} ${this.wounds === 0 ? '(已阵亡!)' : ''}`);

    if (this.wounds === 0) {
      this.isDead = true;
      this.hasActed = true;
      ui.triggerOperativeDeathOverlay(this);
    }
    return actualDamage;
  }
}
