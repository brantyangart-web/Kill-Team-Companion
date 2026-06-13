import { rollD6 } from '../rules/dice.js';

export class Agent {
  constructor({ id, name, faction, wounds, apl, df, sv, weapons = [] }) {
    this.id = id;
    this.name = name;
    this.faction = faction; // 'Space Marine' or 'Plague Marine'
    this.maxWounds = wounds;
    this.wounds = wounds;
    this.maxApl = apl;
    this.apl = apl;
    this.df = df; // Defense (number of defense dice to roll)
    this.sv = sv; // Save target (e.g., 3 means 3+)
    this.weapons = weapons;
    this.hasActed = false;
  }

  reset() {
    this.wounds = this.maxWounds;
    this.apl = this.maxApl;
    this.hasActed = false;
  }

  isPlagueMarine() {
    return this.faction.toLowerCase().includes('plague') || this.faction.toLowerCase().includes('death guard');
  }

  /**
   * Applies damage to the Agent.
   * If the agent is a Plague Marine, rolls Disgustingly Resilient (5+) for each point of damage.
   * @param {number} amount - Total damage points to allocate.
   * @param {function} log - Logging callback function.
   * @param {number[]} [manualDrRolls] - Optional manual rolls for Disgustingly Resilient (for testability / Manual mode).
   * @returns {number} The actual damage taken.
   */
  applyDamage(amount, log = console.log, manualDrRolls = null) {
    if (amount <= 0) {
      log(`[伤害结算] ${this.name} 没有受到伤害。`);
      return 0;
    }

    let actualDamage = 0;
    log(`[伤害结算] ${this.name} 准备分配 ${amount} 点伤害...`);

    if (this.isPlagueMarine()) {
      log(`[阵营特性] 触发瘟疫战士专属能力【恶心作呕 (Disgustingly Resilient)】！对每点伤害进行 5+ 判定。`);
      let rollIndex = 0;
      
      for (let i = 0; i < amount; i++) {
        let rollVal;
        if (manualDrRolls && rollIndex < manualDrRolls.length) {
          rollVal = manualDrRolls[rollIndex++];
          log(`  - 伤害点 #${i + 1}: 手动录入投骰 [${rollVal}]`);
        } else {
          rollVal = rollD6();
          log(`  - 伤害点 #${i + 1}: 投骰结果 [${rollVal}]`);
        }

        if (rollVal >= 5) {
          log(`    -> 成功免除 1 点伤害！ (5+ 成功)`);
        } else {
          log(`    -> 免除失败，扣除 1 点生命值。`);
          actualDamage++;
        }
      }
    } else {
      actualDamage = amount;
    }

    const previousWounds = this.wounds;
    this.wounds = Math.max(0, this.wounds - actualDamage);
    log(`[伤害结算] ${this.name} 实际扣除生命值: ${actualDamage}。 生命值: ${previousWounds} -> ${this.wounds} ${this.wounds === 0 ? '(已阵亡!)' : ''}`);
    return actualDamage;
  }
}
