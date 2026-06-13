import { playSound } from './audio.js';
import { gameState } from './state.js';

// UI callbacks - set during app initialization to avoid circular deps
const ui = {};
export function initModelCallbacks(callbacks) {
  Object.assign(ui, callbacks);
}

export class Weapon {
  constructor(name, attacks, targetSkill, normalDmg, criticalDmg, isRanged = true) {
    this.name = name;
    this.attacks = attacks;
    this.ts = targetSkill;
    this.normalDamage = normalDmg;
    this.criticalDamage = criticalDmg;
    this.isRanged = isRanged;
  }
}

export class Operative {
  constructor(id, name, faction, wounds, apl, df, sv, weapons = [], defaultAvatar = '') {
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

    this.hasActed = false;
    this.isDead = false;
    this.actionsPerformed = [];
  }

  reset() {
    this.wounds = this.maxWounds;
    this.apl = this.maxApl;
    this.hasActed = false;
    this.isDead = false;
    this.actionsPerformed = [];
  }

  applyWounds(amount, manualDrRolls = null) {
    if (this.isDead) return 0;

    let actualDamage = 0;
    ui.addLog(`[伤害] ${this.name} 准备分配 ${amount} 点伤害...`);

    if (this.faction === 'Plague Marine') {
      const hasPloyActive = gameState.pmActivePloys.includes('contagious_resilience');
      ui.addLog(`[特性] 触发瘟疫守卫专属【恶心作呕 (DR 5+)】 ${hasPloyActive ? '(已开启传染韧性，允许首个失败重投)' : ''}：`);

      let drRollIndex = 0;
      let hasRerolled = false;

      for (let i = 0; i < amount; i++) {
        let roll;
        if (manualDrRolls && drRollIndex < manualDrRolls.length) {
          roll = manualDrRolls[drRollIndex++];
          ui.addLog(`  - 伤害点 #${i+1}: 手动录入骰子 [${roll}]`);
        } else {
          roll = Math.floor(Math.random() * 6) + 1;
          ui.addLog(`  - 伤害点 #${i+1}: 投骰 [${roll}]`);
        }

        if (roll < 5 && hasPloyActive && !hasRerolled && !manualDrRolls) {
          hasRerolled = true;
          const oldRoll = roll;
          roll = Math.floor(Math.random() * 6) + 1;
          ui.addLog(`    -> 🛡️ 触发【传染韧性】！自动重投失败骰 [${oldRoll}] -> [${roll}]`);
        }

        if (roll >= 5) {
          ui.addLog(`    -> 免除该点伤害！`);
          playSound('bubble');
        } else {
          ui.addLog(`    -> 减免失败。`);
          actualDamage++;
          playSound('flesh');
        }
      }
    } else {
      actualDamage = amount;
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
