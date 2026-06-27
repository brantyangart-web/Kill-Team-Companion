import { gameState, wizardState } from './state.js';
import { playSound } from './audio.js';
import { Operative, Weapon, translateRule, getEffectiveTs } from './models.js';
import {
  getEnemyFaction, getDiceClass, getCpForFaction, setCpForFaction,
  getFactionDisplayName, getFactionCssSuffix, hasFactionTrait, getFactionThemeVar, getActivePloys, setActivePloys,
  getTeamSlot
} from '../rules/faction.js';
import {
  hasChapterTactic, hasMarkOfChaos
} from '../rules/abilities.js';
import {
  isPloyActive, isFirefightPloyActive, getCombatDoctrineChoice, isIgnoreInjuredPenalties,
  isContagionActive, isLumberingDeathActive, isBloodForBloodGodActive, isImplacableActive,
  isQuicksilverSpeedActive, isFickleFatesActive, isIndomitusActive, activateFirefightPloy,
  isPloyActive as isPloyActiveCheck, getPloy
} from '../rules/ploys.js';
import { getAssetPath } from './paths.js';
import { showDamageAnimation } from './damageAnimation.js';
import { activeRuleSet } from '../rules/ruleSets.js';
import { evaluatePloyInteractions, getOperativeAvatarUrl } from './ui.js';
import { applyWeaponRules, parseWeaponRule, weaponHasRule, getWeaponRuleParam } from '../rules/weapons.js';
import { resolveRuleQueue } from './ruleEngine.js';


/**
 * 近战武器暴击阈值：支持 Lethal x+ 规则 (如 Lethal 5+)，默认 6。
 * 与射击侧一致，阈值由声明式注册表解析。
 * @param {Object} weapon - 武器对象 (需有 rules 数组)
 * @returns {number} 暴击阈值 (5 或 6)
 */
function meleeCritThreshold(weapon) {
  return weaponMods(weapon).critThreshold ?? 6;
}

/**
 * 取武器在指定上下文下的所有规则修饰符（声明式注册表的统一入口）。
 * combat.js 各结算阶段按需读取返回的 mods 字段应用。
 * @param {Object} weapon - 武器实例
 * @param {Object} [ctx] - 规则上下文 (retainedCrits / defenderPoisoned / ...)
 * @returns {Object} 聚合后的 modifiers
 */
function weaponMods(weapon, ctx = {}) {
  return applyWeaponRules(weapon, ctx);
}

/**
 * 阵营派生规则注入：把阵营被动（混沌印记/章战术）授予的武器规则列出来。
 * 由 factionMechanicsEnabled 门控。注入后随基础规则一起走注册表，统一判定。
 *
 * 映射 (文档/阵营规则):
 *   Khorne  + 近战      → Severe
 *   Tzeentch + 远程     → Severe
 *   Aggressive + 近战   → Rending
 *   Siege Specialist + 远程 → Saturate
 *   Sharpshooter + 爆弹 + 未移动 → Accurate 1 + Severe
 * @param {Object} attacker - 攻击方 Operative
 * @param {Object} weapon - 武器实例
 * @returns {string[]} 注入的规则字符串
 */
function injectedFactionRules(attacker, weapon) {
  if (!activeRuleSet().factionMechanicsEnabled) return [];
  const isMelee = !weapon.isRanged;
  const rules = [];
  if (hasMarkOfChaos(attacker, 'KHORNE') && isMelee) rules.push('Severe');
  if (hasMarkOfChaos(attacker, 'TZEENTCH') && !isMelee) rules.push('Severe');
  if (hasChapterTactic(attacker, 'aggressive') && isMelee) rules.push('Rending');
  if (hasChapterTactic(attacker, 'siege_specialist') && !isMelee) rules.push('Saturate');
  const isBoltWeapon = /bolt/i.test(weapon.name);
  const notMoved = attacker && attacker.actionsPerformed.length === 0;
  if (hasChapterTactic(attacker, 'sharpshooter') && isBoltWeapon && notMoved) {
    rules.push('Accurate 1', 'Severe');
  }
  // 注入来自 activeDebuffs/buffs (模块化 ploy) 的武器规则
  if (attacker && attacker.activeDebuffs) {
    attacker.activeDebuffs.forEach(d => {
      if (d.target === 'weapon_rule' && d.extra_rule) {
        if (d.rule === 'combat_doctrine') {
          const choice = getCombatDoctrineChoice(attacker.faction);
          if (choice === 'assault' && isMelee) {
            rules.push(d.extra_rule);
          } else if ((choice === 'devastator' || choice === 'tactical') && !isMelee) {
            rules.push(d.extra_rule);
          }
        } else {
          rules.push(d.extra_rule);
        }
      }
    });
  }
  return rules;
}

/**
 * 构建含阵营派生规则的"有效武器"对象（rules = 基础规则 + 注入规则）。
 * 供 weaponMods 统一判定，使阵营派生的 Severe/Rending/Saturate/Accurate 与基础规则同源。
 * @param {Object} weapon
 * @param {Object} attacker
 * @returns {Object} 新武器对象（共享 weapon 其它字段，rules 合并）
 */
function effectiveWeapon(weapon, attacker) {
  const extra = injectedFactionRules(attacker, weapon);
  return extra.length ? { ...weapon, rules: [...(weapon.rules || []), ...extra] } : weapon;
}

// UI callbacks
const ui = {};
export function initCombatUiCallbacks(callbacks) {
  Object.assign(ui, callbacks);
}

// Import toast for replacing alert()
let showToast;
let trapFocus;
let releaseFocusTrap;
export function initCombatAccessibility(fns) {
  showToast = fns.showToast;
  trapFocus = fns.trapFocus;
  releaseFocusTrap = fns.releaseFocusTrap;
}

// Accessibility: check reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Skip animation state
let skipDiceAnimation = false;
let diceAnimationTimeouts = [];

export function skipCurrentDiceAnimation() {
  skipDiceAnimation = true;
  diceAnimationTimeouts.forEach(id => clearTimeout(id));
  diceAnimationTimeouts = [];
}

function scheduleTimeout(fn, delay) {
  const id = setTimeout(fn, delay);
  diceAnimationTimeouts.push(id);
  return id;
}

// ==========================================
//   Standard 规则: 击杀回调系统
// ==========================================

/**
 * 触发击杀后的特殊能力
 * @param {Object} killer - 击杀者 Operative
 * @param {Object} victim - 被击杀者 Operative
 * @param {string} killType - 击杀类型 'shoot' | 'fight'
 * @param {number} [damageDealt] - 造成的伤害量 (用于 Grandfather's Blessing)
 */
function triggerKillAbilities(killer, victim, killType, damageDealt = 0) {
  if (!activeRuleSet().hasKillCallbacks) return;

  ui.addLog(`\n>>> 击杀回调检测...`);

  // === 1. In the Eyes of the Gods (LEG Aspiring Champion) ===
  // 击杀敌人后 APL +1 直到该激活结束
  if (killer.operativeType === 'leg_aspiring_champion') {
    const prevApl = killer.apl;
    killer.apl = Math.min(killer.apl + 1, 5); // 上限 5
    killer._eyesOfGodsActive = true; // 标记，激活结束后重置
    ui.addLog(`[诸神之眼] ${killer.name} 击杀敌人！APL +1 (${prevApl} → ${killer.apl})，直到本次激活结束。`);
    if (showToast) showToast(`⚡ 诸神之眼：APL +1 (${killer.apl})`, 'success');
  }

  // === 2. Soul Gorge (LEG Chosen) ===
  // 近战击杀后恢复 D3+1 伤口
  if (killer.operativeType === 'leg_chosen' && killType === 'fight') {
    const roll = Math.floor(Math.random() * 3) + 1; // D3
    const healAmount = roll + 1; // D3+1
    const healed = killer.healWounds(healAmount);
    ui.addLog(`[灵魂吞噬] ${killer.name} 近战击杀！恢复 ${healed} 点伤口 (D3+1 = ${healAmount})。`);
    if (showToast) showToast(`💚 灵魂吞噬：恢复 ${healed} 伤口`, 'success');
  }

  // === 3. Horrifying Dismemberment (LEG Shrivetalon) ===
  // 击杀后 3" 内另一敌人 APL -1 直到其下次激活结束
  if (killer.operativeType === 'leg_shrivetalon') {
    // 简化实现：由于没有物理距离检测，让玩家选择目标
    // 在实际游戏中，玩家需要测量距离
    ui.addLog(`[恐怖肢解] ${killer.name} 击杀！3" 内另一敌人 APL -1 (直到其下次激活结束)。`);
    // 这里可以弹出一个选择框让玩家选择目标
    // 简化：自动应用到第一个存活的敌人
    const enemies = gameState.operatives.filter(o => o.teamSlot !== killer.teamSlot && !o.isDead);
    if (enemies.length > 0) {
      const target = enemies[0]; // 简化：选第一个
      target.apl = Math.max(1, target.apl - 1);
      target._horrifyingDismembermentActive = true;
      ui.addLog(`  → ${target.name} APL -1 (${target.apl})，直到其下次激活结束。`);
    }
  }

  // === 4. Grandfather's Blessing (PM Champion) ===
  // 7" 内中毒敌人受伤时回血 (≤3/TP)
  // 这个能力是在敌人受伤时触发，不是击杀时
  // 但我们可以在击杀时检测是否有 PM Champion 在附近
  if (victim.poisonTokens > 0) {
    const pmChampions = gameState.operatives.filter(o =>
      o.teamSlot === killer.teamSlot &&
      o.operativeType === 'pm_champion' &&
      !o.isDead &&
      o.woundsRegainedThisTP < 3
    );
    // 简化：假设距离在 7" 内
    for (const champion of pmChampions) {
      const healAmount = Math.min(damageDealt, 3 - champion.woundsRegainedThisTP);
      if (healAmount > 0) {
        const healed = champion.healWounds(healAmount);
        champion.woundsRegainedThisTP += healed;
        ui.addLog(`[祖父祝福] ${champion.name} 响应！恢复 ${healed} 点伤口 (本 TP 已回 ${champion.woundsRegainedThisTP}/3)。`);
      }
    }
  }

  ui.addLog(`>>> 击杀回调完成。`);
}

// ==========================================
//          Modal Control
// ==========================================

export function openModal() {
  const modal = document.getElementById('combat-modal');
  modal.style.display = 'flex';
  document.getElementById('modal-btn-next').disabled = true;
  if (trapFocus) trapFocus(modal);
}

export function closeModal() {
  playSound('click');
  
  // 通用清理：移除本次向导会话期间注入的所有临时 Buff / Debuffs
  if (wizardState.addedDebuffs) {
    wizardState.addedDebuffs.forEach(({ operative, debuff }) => {
      if (operative.activeDebuffs) {
        operative.activeDebuffs = operative.activeDebuffs.filter(d => d !== debuff);
      }
    });
    wizardState.addedDebuffs = [];
  }

  document.getElementById('combat-modal').style.display = 'none';
  if (releaseFocusTrap) releaseFocusTrap();
  skipDiceAnimation = false;
  diceAnimationTimeouts = [];
  ui.renderOperatives();
  ui.updateActivePanel();
}

export function nextModalStep() {
  playSound('click');

  if (wizardState.actionType === 'shoot') {
    if (wizardState.step === 3) {
      if (!wizardState.inRangeAndVisible) {
        playSound('alert');
        if (showToast) showToast('目标不可见或超出武器射程，无法进行射击行动！', 'error');
        return;
      }
      if (wizardState.inCoverConcealed) {
        playSound('alert');
        if (showToast) showToast('目标处于隐蔽状态且在掩体中，无法对其进行射击 (L185)！', 'error');
        return;
      }
      // L111: 特工在敌方控制范围内时不能射击
      if (wizardState.enemyInControlRange) {
        playSound('alert');
        if (showToast) showToast('有敌方特工处于你的控制范围内，无法进行射击行动 (L111)！', 'error');
        return;
      }

      evaluatePloyInteractions('before_shoot_roll', wizardState.attacker, () => {
        // 重置蝇云标志，由 before_shoot_defense 计谋系统重新评估
        wizardState.cloudOfFliesActive = false;
        // 串联防守方计谋判定（三、蝇云等对防守方的效果）
        evaluatePloyInteractions('before_shoot_defense', wizardState.defender, () => {
          wizardState.step++;
          renderShootStep();
        });
      });
      return;
    } else if (wizardState.step === 4) {
      if (wizardState.mode === 'manual') {
        parseManualAttack();
      }
      if (wizardState.attackRolls.length === 0) {
        if (showToast) showToast('请先完成攻击掷骰！', 'error');
        return;
      }
      // Step 4→5：攻击骰已知，串联防守方触发（含 Indomitus）
      wizardState.indomitusBonus = false;
      evaluatePloyInteractions('before_defense_roll', wizardState.defender, () => {
        wizardState.step++;
        renderShootStep();
      });
      return;
    } else if (wizardState.step === 5 && wizardState.mode === 'manual') {
      parseManualDefense();
      const inputEl = document.getElementById('manual-def-dice-val');
      if (inputEl && inputEl.value.trim() !== '' && wizardState.defenseRolls.length === 0) {
        if (showToast) showToast('请输入有效的防御骰点数！格式: 5, 2 (1-6逗号隔开)', 'error');
        return;
      }
    }
  } else if (wizardState.actionType === 'fight') {
      if (wizardState.step === 4) {
        if (wizardState.mode === 'manual') {
          parseManualMelee();
        } else {
          // 在进入伤害分配阶段前，根据经过重投阶段修正的 allRolls 重构 activeDice
          wizardState.activeAttackerDice = wizardState.allAttackerRolls
            .filter(d => d.isSuccess)
            .map(d => ({ val: d.val, isCrit: d.isCrit, used: false }));
            
          wizardState.activeDefenderDice = wizardState.allDefenderRolls
            .filter(d => d.isSuccess)
            .map(d => ({ val: d.val, isCrit: d.isCrit, used: false }));
        }
        
        if (wizardState.activeAttackerDice.length === 0 && wizardState.activeDefenderDice.length === 0) {
          // Allow transitioning to Step 5 even if both missed, so the UI can show "双方未命中"
        }
      }
    if (wizardState.step === 3) {
      if (!wizardState.inMeleeRange) {
        playSound('alert');
        if (showToast) showToast('目标必须在 1 英寸（1🔺）交战距离内，才能进行近战搏斗！', 'error');
        return;
      }
      if (wizardState.hasFallenBack) {
        playSound('alert');
        if (showToast) showToast('已执行退却的特工，本回合无法执行格斗动作！', 'error');
        return;
      }

      evaluatePloyInteractions('before_fight_roll', wizardState.attacker, () => {
        wizardState.step++;
        renderFightStep();
      });
      return;
    }
  }

  wizardState.step++;

  if (wizardState.actionType === 'shoot') {
      renderShootStep();
    } else if (wizardState.actionType === 'fight') {
      renderFightStep();
    }
}

// ==========================================
//          Shoot Wizard
// ==========================================

export function openShootWizard() {
  playSound('click');
  const op = gameState.activeAgent;
  if (!op) return;
  
  evaluatePloyInteractions('before_shoot', op, () => {
    // L15/L111: 隐蔽单位不能射击，除非携带 Silent 武器 (L239)
    const hasSilentWeapon = op.weapons.some(w => weaponMods(w).canShootWhileConcealed);
    if (op.hasConceal && !hasSilentWeapon) {
      playSound('alert');
      if (typeof showToast !== 'undefined') showToast('隐蔽单位不能射击 (需先切为交战，或携带 Silent 武器)！', 'error');
      else alert('隐蔽单位不能射击 (需先切为交战，或携带 Silent 武器)！');
      return;
    }

  const modalContent = document.querySelector('#combat-modal .modal-content');
  if (modalContent) {
    modalContent.style.backgroundImage = `linear-gradient(rgba(11, 17, 32, 0.85), rgba(11, 17, 32, 0.95)), url("${getAssetPath('assets/images/backgrounds/bg_shoot_action.jpg')}")`;
    modalContent.style.backgroundSize = 'cover';
    modalContent.style.backgroundPosition = 'center';
  }

  window.pushStateSnapshot?.(`Start Shoot: ${op.name}`);

  Object.assign(wizardState, {
    actionType: 'shoot',
    step: 1,
    attacker: op,
    defender: null,
    weapon: op.weapons.filter(w => w.isRanged)[0] || null,
    inRangeAndVisible: true,
    inCoverConcealed: false,
    inCover: false,
    cloudOfFliesActive: false,
    indomitusBonus: false,
    enemyInControlRange: false,
    mode: gameState.globalRollMode,
    attRerollIndex: -1,
    defRerollIndex: -1,
    attackRolls: [],
    defenseRolls: [],
    attackRerolledIndices: [],
    weaponRerollUsed: false,
    weaponRerollRule: null,
    stunApplied: false,
    shockTriggered: false,
    drRolls: [],
  });

  if (!wizardState.weapon) {
    if (showToast) showToast('该特工没有配备任何远程武器！', 'warning');
    return;
  }

  // 多目标/重投类武器规则检测（声明式注册表；当前为日志提示，完整交互待后续）
  const preMods = weaponMods(wizardState.weapon);
  if (preMods.aoeRadius) {
    ui.addLog(`[激流] ${wizardState.weapon.name}：Torrent 规则生效！当前简化为仅对主目标射击。完整多目标选择待后续版本实现。`);
  }
  if (preMods.aoePrimarySecondary) {
    ui.addLog(`[爆炸] ${wizardState.weapon.name}：Blast 规则生效！当前简化为仅对主目标。完整 AoE 待后续版本实现。`);
  }
  if (preMods.rerollOneAttackDie) {
    ui.addLog(`[平衡] ${wizardState.weapon.name}：Balanced 规则生效！可重投 1 个攻击骰（需手动操作）。`);
  }
  if (preMods.rerollSpecificValue) {
    ui.addLog(`[不息] ${wizardState.weapon.name}：Ceaseless 规则生效！可重投投出特定值的骰子（需手动操作）。`);
  }
  if (preMods.rerollAnyAttackDice) {
    ui.addLog(`[无情] ${wizardState.weapon.name}：Relentless 规则生效！可重投任意攻击骰（需手动操作）。`);
  }

  // Limited x 规则: 追踪使用次数（参数由注册表解析）
  const limitedParam = getWeaponRuleParam(wizardState.weapon, 'Limited');
  if (limitedParam) {
    const limitVal = parseInt(limitedParam);
    const opId = wizardState.attacker.id;
    const wName = wizardState.weapon.name;
    if (!gameState.limitedWeaponUsage[opId]) gameState.limitedWeaponUsage[opId] = {};
    const usedCount = gameState.limitedWeaponUsage[opId][wName] || 0;
    if (usedCount >= limitVal) {
      ui.addLog(`[有限] ${wName}：已达使用上限 (${usedCount}/${limitVal})！此武器已耗尽。`);
      if (showToast) showToast(`⚠️ ${wName} 已耗尽 (${usedCount}/${limitVal})！`, 'warning');
    } else {
      // 记录本次使用
      gameState.limitedWeaponUsage[opId][wName] = usedCount + 1;
      ui.addLog(`[有限] ${wName}：使用 ${usedCount + 1}/${limitVal} 次。`);
    }
  }

  // Seek (纯，非 Seek Light): 隐蔽单位不能利用地形掩体（注册表区分 Seek / Seek Light）
  const seekMods = weaponMods(wizardState.weapon);
  const hasSeek = seekMods.concealNoCover && !seekMods.onlyLightTerrain;
  if (hasSeek) {
    ui.addLog(`[寻的] ${wizardState.weapon.name}：Seek 规则生效！隐蔽单位不能利用地形掩体。`);
  }

  const rangeParam = getWeaponRuleParam(wizardState.weapon, 'Range');
  if (rangeParam) {
    ui.addLog(`[射程] ${wizardState.weapon.name}：Range ${rangeParam}" 规则生效！有最大射程限制（当前未检查）。`);
  }

  openModal();
  renderShootStep();
  });
}

export function renderShootStep() {
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');
  const nextBtn = document.getElementById('modal-btn-next');
  const cancelBtn = document.getElementById('modal-btn-cancel');

  nextBtn.onclick = nextModalStep;
  cancelBtn.style.display = 'inline-block';

  if (wizardState.step === 1) {
    title.textContent = '射击结算 - 步骤 1: 选择目标';
    const attackerSlot = wizardState.attacker.teamSlot >= 0 ? wizardState.attacker.teamSlot : getTeamSlot(wizardState.attacker.faction);
    // 规则 L180/L185: Engage 目标可见即可；Conceal 目标需可见且不在掩体 (步骤3 判定)
    // 此处不做预过滤，所有敌方存活单位均列为可选，合法性由步骤3 的判定问题把关
    const targets = gameState.operatives.filter(o => o.teamSlot !== attackerSlot && !o.isDead);

    if (targets.length === 0) {
      body.innerHTML = '<p style="color:var(--red);">场上已无合法的敌方存活目标。</p>';
      nextBtn.disabled = true;
      return;
    }

    let listHtml = '<div class="weapon-picker-list">';
    targets.forEach(t => {
      const injuredTag = t.isInjured ? ' <span style="color:var(--red); font-size:0.75rem;">[重伤]</span>' : '';
      const poisonTag = t.poisonTokens > 0 ? ' <span style="color:#7ab88a; font-size:0.75rem;">[毒素]</span>' : '';
      const avatarUrl = getOperativeAvatarUrl(t.id, t.faction);
      listHtml += `
        <div class="weapon-pick-item ${wizardState.defender && wizardState.defender.id === t.id ? 'selected' : ''}" role="button" tabindex="0" onclick="selectShootDefender('${t.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectShootDefender('${t.id}')}" style="flex-direction: row; justify-content: flex-start; align-items: center; gap: 20px;">
          <img src="${avatarUrl}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid ${t.teamSlot === 0 ? 'var(--sm-accent)' : 'var(--pm-accent)'}; flex-shrink: 0;" alt="Avatar">
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <span class="weapon-pick-name">${t.name}${injuredTag}${poisonTag}</span>
            <div class="weapon-pick-stats">
              <span class="stat-badge" style="color: #ff4444;">Wounds: ${t.wounds}/${t.maxWounds}</span> |
              <span class="stat-badge" style="color: #ffaa00;">Defense: ${t.df}</span> |
              <span class="stat-badge" style="color: #aaffaa;">Move: ${t.currentMove}"</span>
            </div>
          </div>
        </div>
      `;
    });
    listHtml += '</div>';

    body.innerHTML = `
      <p style="margin-bottom:10px;">选择你要射击的敌方特工：</p>
      ${listHtml}
    `;

    nextBtn.textContent = '选择武器';
    nextBtn.disabled = !wizardState.defender;
  }

  else if (wizardState.step === 2) {
    title.textContent = '射击结算 - 步骤 2: 选择武器';
    const rangedWeapons = wizardState.attacker.weapons.filter(w => w.isRanged);
    const hasHeavyRanged = rangedWeapons.some(w => weaponHasRule(w, 'Heavy'));
    // Heavy(仅限冲刺): 该激活只允许 Dash 移动；执行过非 Dash 移动则 Heavy 武器不可用
    const attackerNonDashMove = ['Move', 'Reposition', 'Charge', 'FallBack', 'Advance']
      .some(m => wizardState.attacker.actionsPerformed.includes(m));
    const isInjuredAttacker = wizardState.attacker.isInjured;
    let listHtml = '<div class="weapon-picker-list">';
    rangedWeapons.forEach((w, idx) => {
      const hitStat = isInjuredAttacker ? `${w.ts}+ <span style="color:var(--red); font-size:0.7rem;">→ ${w.ts + 1}+</span>` : `${w.ts}+`;
      const rangeStr = w.range ? ` | Range: ${w.range}"` : '';
      const rulesStr = w.rules && w.rules.length > 0 ? ` | ${w.rules.map(translateRule).join(', ')}` : '';
      const isHeavy = weaponHasRule(w, 'Heavy');
      const heavyBlocked = isHeavy && attackerNonDashMove;
      const heavyNote = heavyBlocked ? ' <span style="color:var(--red); font-size:0.65rem;">[已移动·不可用]</span>' : '';
      const disabledStyle = heavyBlocked ? 'opacity:0.4; cursor:not-allowed; pointer-events:none;' : '';
      listHtml += `
        <div class="weapon-pick-item ${wizardState.weapon.name === w.name ? 'selected' : ''}" role="button" tabindex="0" style="${disabledStyle}" onclick="${heavyBlocked ? '' : `selectShootWeapon(${idx})`}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();${heavyBlocked ? '' : `selectShootWeapon(${idx})`}}">
          <span class="weapon-pick-name">${w.name}${heavyNote}</span>
          <div class="weapon-pick-stats">
            <span class="stat-badge" style="color: #ffaa00;">Attacks: ${w.attacks}</span>
            <span class="stat-badge" style="color: #44aaff;">Skill: ${hitStat}</span>
            <span class="stat-badge" style="color: #ff4444;">Damage: ${w.normalDamage}/${w.criticalDamage}</span>
            ${rangeStr ? `<span class="stat-badge" style="color: #aaaaff;">${rangeStr.replace(' | ', '').replace('| ', '')}</span>` : ''}
            ${rulesStr ? `<span class="stat-badge" style="color: #aaffaa;">${rulesStr.replace(' | ', '').replace('| ', '')}</span>` : ''}
          </div>
        </div>
      `;
    });
    listHtml += '</div>';

    const dashHint = hasHeavyRanged ? '<p style="color:var(--text-muted); font-size:0.75rem; margin-bottom:8px;">💡 重武器 (Heavy 仅限冲刺)：执行过转移/冲锋/后撤后不可用；未移动或仅冲刺时可用。</p>' : '';
    body.innerHTML = `
      <p style="margin-bottom:10px;">选择你要射击使用的武器：</p>
      ${dashHint}
      ${listHtml}
    `;
    nextBtn.textContent = '回答判定问题';
    nextBtn.disabled = false;
  }

  else if (wizardState.step === 3) {
    title.textContent = '射击结算 - 步骤 3: 距离与掩体判定';
    const w = wizardState.weapon;
    const wMods = weaponMods(w);
    const hasIndirect = !!wMods.ignoreRangeAndVisibility;
    // Silent 规则: Conceal 状态下也能射击 (不在射程/视线处理，由 Shoot 按钮判定)
    const hasSeekLight = !!(wMods.concealNoCover && wMods.onlyLightTerrain);
    // Seek / Seek Light 都令目标无法利用地形掩体 (工具不区分轻/重地形，两者行为一致)
    const seekIgnoresCover = !!wMods.concealNoCover;
    const seekLabel = hasSeekLight ? '寻光' : '寻的';

    // Indirect Fire: 自动视为在射程和视线内
    const rangeNote = hasIndirect
      ? '<p style="color:#818cf8; font-size:0.75rem;">💡 <b>间接射击</b>：无需视线，射程判定跳过。</p>'
      : '';

    const coverNote = seekIgnoresCover
      ? `<p style="color:#f59e0b; font-size:0.75rem;">💡 <b>${seekLabel}</b>：目标即使在掩体中也无法获得掩体加成。</p>`
      : '';

    // 隐蔽状态自动判断 (规则 L185)：仅隐蔽目标才需检查掩体
    const defenderIsConcealed = wizardState.defender && wizardState.defender.hasConceal;
    if (!defenderIsConcealed) wizardState.inCoverConcealed = false;

    const concealCoverCard = defenderIsConcealed
      ? `<div class="qa-card" style="margin-top:10px;">
          <div class="qa-question">2. 目标处于<strong>隐蔽</strong>状态，是否在掩体中？<span style="color:#f59e0b; font-size:0.75rem;">(隐蔽目标在掩体中不可射击 — L185)</span></div>
          <div class="qa-options">
            <button class="qa-btn ${wizardState.inCoverConcealed ? 'selected' : ''}" onclick="setQA('inCoverConcealed', true)">是 (无法射击)</button>
            <button class="qa-btn ${!wizardState.inCoverConcealed ? 'selected' : ''}" onclick="setQA('inCoverConcealed', false)">否 (可以选定)</button>
          </div>
        </div>`
      : '<p style="color:#7ab88a; font-size:0.75rem; margin-top:8px;">✓ 目标为交战(Engage)状态：可见即可射击，无需掩体判定 (L180)。</p>';

    body.innerHTML = `
      <p style="margin-bottom: 12px; color:var(--text-muted);">回答以下判定问题以完成结算：</p>
      ${rangeNote}
      ${coverNote}

      <div class="qa-card">
        <div class="qa-question">1. 目标是否在你的有效视线和射程内？${hasIndirect ? ' <span style="color:#818cf8;">（自动判定为是）</span>' : ''}</div>
        <div class="qa-options">
          <button class="qa-btn ${wizardState.inRangeAndVisible ? 'selected' : ''}" onclick="setQA('inRangeAndVisible', true)" ${hasIndirect ? 'style="pointer-events:none; opacity:0.6;"' : ''}>是 (在射程内)</button>
          <button class="qa-btn ${!wizardState.inRangeAndVisible ? 'selected' : ''}" onclick="setQA('inRangeAndVisible', false)" ${hasIndirect ? 'style="pointer-events:none; opacity:0.6;"' : ''}>否 (无法见/超射程)</button>
        </div>
      </div>

      ${concealCoverCard}

      <div class="qa-card" style="margin-top:10px;">
        <div class="qa-question">3. 目标是否在掩体中 (Cover)？${seekIgnoresCover ? ` <span style="color:#f59e0b;">(${seekLabel}忽略掩体)</span>` : ''}</div>
        <div class="qa-options">
          <button class="qa-btn ${wizardState.inCover ? 'selected' : ''}" onclick="setQA('inCover', true)" ${seekIgnoresCover ? 'style="pointer-events:none; opacity:0.6;"' : ''}>是 (触发掩体成功保留)</button>
          <button class="qa-btn ${!wizardState.inCover ? 'selected' : ''}" onclick="setQA('inCover', false)" ${seekIgnoresCover ? 'style="pointer-events:none; opacity:0.6;"' : ''}>否 (开阔地带)</button>
        </div>
      </div>

      <div class="qa-card" style="margin-top:10px;">
        <div class="qa-question">4. 是否有敌方特工处于<strong>你的控制范围内</strong>（1" 内）？<span style="color:#f59e0b; font-size:0.75rem;">(这将阻止射击 — L111)</span></div>
        <div class="qa-options">
          <button class="qa-btn ${wizardState.enemyInControlRange ? 'selected' : ''}" onclick="setQA('enemyInControlRange', true)">是 (无法射击)</button>
          <button class="qa-btn ${!wizardState.enemyInControlRange ? 'selected' : ''}" onclick="setQA('enemyInControlRange', false)">否 (可以射击)</button>
        </div>
      </div>
    `;

    // 自动设置: Indirect Fire → inRangeAndVisible=true; Seek/Seek Light → inCover=false
    if (hasIndirect) wizardState.inRangeAndVisible = true;
    if (seekIgnoresCover) wizardState.inCover = false;

    nextBtn.textContent = '选择掷骰模式';
    nextBtn.disabled = false;
  }

  else if (wizardState.step === 4) {
    title.textContent = '射击结算 - 步骤 4: 攻击方掷骰 (Angels of Death)';

    let rerollHint = '';
    const curCp = getCpForFaction(wizardState.attacker.faction);

    if (wizardState.attackRolls.length > 0) {
      const summaryEffTs = getEffectiveTs(wizardState.weapon, wizardState.attacker);
      const injNote = wizardState.attacker.isInjured ? ' <span style="color:var(--red); font-size:0.75rem;">(重伤+1)</span>' : '';
      const promptBanner = getRerollHintHtml(false);
      rerollHint = `
        <div class="roll-summary-block" style="margin-top:10px;">
          🎯 <b>命中统计:</b> 暴击(6点): <span style="color:var(--sm-accent); font-weight:bold;">${wizardState.attackCrit}</span>, 普通命中(${summaryEffTs}+${injNote}): <span style="color:#6a9ad4;">${wizardState.attackNorm}</span>
        </div>
        ${promptBanner}
      `;
    }

    const displayEffTs = getEffectiveTs(wizardState.weapon, wizardState.attacker);
    const injLabel = wizardState.attacker.isInjured ? ` <span style="color:var(--red); font-size:0.75rem;">(重伤+1 → ${displayEffTs}+)</span>` : '';
    body.innerHTML = `
      ${getShootDuelHeaderHtml()}

      <p style="margin-bottom: 12px;">武器 [${wizardState.weapon.name}]，攻击骰数: <b>${wizardState.weapon.attacks}</b>，命中要求: <b>${displayEffTs}+</b>${injLabel}</p>

      

      <div class="dice-rolling-area" id="attack-rolling-zone" style="display:${wizardState.mode === 'manual' ? 'none' : 'flex'};">
        <div class="dice-pool-view" id="attack-dice-pool">
          <span style="color:var(--text-muted); font-size:0.85rem;">等待投骰...</span>
        </div>
        ${wizardState.attackRolls.length === 0 ? '<button class="modal-btn primary" id="btn-roll-attack" onclick="rollAttackDice()">开始顺序掷骰</button>' : ''}
      </div>

      ${rerollHint}

      <div id="manual-attack-input" style="display:${wizardState.mode === 'manual' ? 'block' : 'none'}; background:var(--dark-card); padding:12px; border-radius:8px; border:1px solid var(--panel-border);">
        ${buildDiceKeypadHtml('manual-att-dice-val', `请录入 ${wizardState.weapon.attacks} 个攻击结果（按实际掷出顺序）`, wizardState.weapon.attacks)}
      </div>
    `;

    if (wizardState.attackRolls.length > 0) {
      nextBtn.disabled = false;
      renderAttackDiceView();
    } else if (wizardState.mode === 'manual') {
      nextBtn.disabled = false;
    } else {
      nextBtn.disabled = true;
    }
    nextBtn.textContent = '防守方投骰';
  }

  else if (wizardState.step === 5) {
    title.textContent = `射击结算 - 步骤 5: 防守方防御掷骰 (${getFactionDisplayName(wizardState.defender.faction)})`;

    let coverDesc = '';
    let dfCount = wizardState.defender.df;
    // Saturate 规则：防御方不能保留掩体骰（基础 + 阵营派生经 effectiveWeapon 注入）
    // "The defender cannot retain cover saves."
    // 掩体加成（+1 DF 骰、1 自动普通成功）被移除。
    const hasSaturateForDf = weaponMods(effectiveWeapon(wizardState.weapon, wizardState.attacker)).coverSavesDisabled;
    if (wizardState.inCover && !hasSaturateForDf) {
      coverDesc = `<p style="color:var(--pm-accent); margin-bottom: 4px;">🛡️ 目标在掩体中：自动获得 1 个普通成功，且防御投骰池减 1 (DF = ${dfCount} -> ${dfCount - 1})</p>`;
      dfCount = Math.max(0, dfCount - 1);
    } else if (wizardState.inCover && hasSaturateForDf) {
      coverDesc = `<p style="color:var(--red); margin-bottom: 4px;">🔥 [饱和] 目标在掩体中，但 Saturate 生效：不能保留掩体骰！</p>`;
    }

    // 蝇云遮蔽 (Cloud of Flies Obscured): 效果等同掩体 — 自动+1普通成功，DF池-1
    if (wizardState.cloudOfFliesActive && !wizardState.inCover) {
      if (!hasSaturateForDf) {
        coverDesc += `<p style="color:#7ab88a; margin-bottom: 4px;">🐝 [蝇云遮蔽] 目标处于 Obscured 状态：自动获得 1 个普通成功，且防御投骰池减 1 (DF = ${dfCount} -> ${dfCount - 1})</p>`;
        dfCount = Math.max(0, dfCount - 1);
      } else {
        coverDesc += `<p style="color:var(--red); margin-bottom: 4px;">🔥 [饱和+蝇云] 目标本应获得蝇云遮蔽，但 Saturate 生效：不能保留掩体骰！</p>`;
      }
    } else if (wizardState.cloudOfFliesActive && wizardState.inCover) {
      // 已在掩体中则蝇云效果不叠加（取最优），仅记录日志
      coverDesc += `<p style="color:#7ab88a; font-size:0.78rem; margin-bottom: 4px;">🐝 蝇云生效，但目标已在掩体中，效果不重复叠加。</p>`;
    }

    // === Ploy: Indomitus — 2+ 失败攻击骰 → SM 防守方获得额外 1 个普通防御成功 ===
    if (wizardState.indomitusBonus) {
      coverDesc += `<p style="color:var(--sm-blue, #4a6a9a); margin-bottom: 4px;">✠ [不屈意志] 攻击方有 2+ 失败骰，${wizardState.defender.name} 保留 1 个失败骰作为普通防御成功。</p>`;
    }

    // Piercing 规则：防御骰池减少 N 点（参数由注册表解析）
    // "Piercing N: defence dice pool reduced by N"
    const piercingParam = getWeaponRuleParam(wizardState.weapon, 'Piercing');
    if (piercingParam) {
      const piercingVal = parseInt(piercingParam);
      const prevDf = dfCount;
      dfCount = Math.max(0, dfCount - piercingVal);
      coverDesc += `<p style="color:#f97316; margin-bottom: 4px;">🔥 <b>穿透 (Piercing ${piercingVal})</b>：DF 池减少 ${piercingVal} (DF = ${prevDf} -> ${dfCount})</p>`;
    }

    // Piercing Crits 规则：同 Piercing 减骰池，但仅当攻击方有暴击成功时生效 (L221)
    const piercingCritsParam = getWeaponRuleParam(wizardState.weapon, 'Piercing Crits');
    if (piercingCritsParam && wizardState.attackCrit > 0) {
      const pcVal = parseInt(piercingCritsParam);
      const prevDf = dfCount;
      dfCount = Math.max(0, dfCount - pcVal);
      coverDesc += `<p style="color:#f97316; margin-bottom: 4px;">🔥 <b>穿透暴击 (Piercing Crits ${pcVal})</b>：暴击命中，DF 池减少 ${pcVal} (DF = ${prevDf} -> ${dfCount})</p>`;
    }

    let rerollHint = '';
    const curCp = getCpForFaction(wizardState.defender.faction);
    if (wizardState.defenseRolls.length > 0 && dfCount > 0) {
      const promptBanner = getRerollHintHtml(true);
      rerollHint = `
        <div class="roll-summary-block" style="margin-top:10px;">
          🛡️ <b>防守统计:</b> 暴击防守: <span style="color:var(--pm-accent); font-weight:bold;">${wizardState.defCrit}</span>, 普通防守(${wizardState.defender.sv}+): <span style="color:#b0d4ba;">${wizardState.defNorm}</span>
        </div>
        ${promptBanner}
      `;
    }

    body.innerHTML = `
      ${getShootDuelHeaderHtml()}

      <p style="margin-bottom: 6px;">防守特工: [${wizardState.defender.name}]，保护要求: <b>${wizardState.defender.sv}+</b></p>
      ${coverDesc}
      <p style="margin-bottom: 12px;">需要投掷的防御骰数: <b>${dfCount}</b></p>

      <div class="dice-rolling-area" id="defense-rolling-zone" style="display:${wizardState.mode === 'manual' ? 'none' : 'flex'};">
        <div class="dice-pool-view" id="defense-dice-pool">
          <span style="color:var(--text-muted); font-size:0.85rem;">等待投骰...</span>
        </div>
        ${wizardState.defenseRolls.length === 0 ? `<button class="modal-btn primary" id="btn-roll-defense" onclick="rollDefenseDice(${dfCount})">开始顺序防守投骰</button>` : ''}
      </div>

      ${rerollHint}

      <div id="manual-defense-input" style="display:${wizardState.mode === 'manual' ? 'block' : 'none'}; background:var(--dark-card); padding:12px; border-radius:8px; border:1px solid var(--panel-border);">
        ${buildDiceKeypadHtml('manual-def-dice-val', `请录入 ${dfCount} 个防御结果（按实际掷出顺序）`, dfCount)}
      </div>
    `;

    if (wizardState.defenseRolls.length > 0 || dfCount === 0) {
      nextBtn.disabled = false;
      renderDefenseDiceView(dfCount);
    } else if (wizardState.mode === 'manual') {
      nextBtn.disabled = false;
    } else {
      nextBtn.disabled = true;
    }
    nextBtn.textContent = '计算伤害与对消';
  }

  else if (wizardState.step === 6) {
    title.textContent = '射击结算 - 步骤 6: 匹配对消与最终扣血';

    // ---- Severe 规则 (保留阶段) ----
    // "If you don't retain any critical successes, you can change one of your
    //  normal successes to a critical success."
    // 如果无暴击保留，升级 1 个普通命中为暴击。
    const step6Mods = weaponMods(effectiveWeapon(wizardState.weapon, wizardState.attacker), { retainedCrits: wizardState.attackCrit });
    const hasSevere = !!(step6Mods.upgradeNormalToCrit && step6Mods.source === 'Severe');
    if (hasSevere && wizardState.attackCrit === 0 && wizardState.attackNorm >= 1) {
      wizardState.attackNorm -= 1;
      wizardState.attackCrit += 1;
      ui.addLog(`[严重] ${wizardState.weapon.name}：无暴击保留，升级 1 个普通命中为暴击！`);
    }

    // ---- Stun 规则 (保留阶段触发) ----
    // "If you retain any critical successes, subtract 1 from the APL stat of
    //  the operative this weapon is being used against until the end of its next activation."
    // 如果保留了暴击，目标 APL -1，直到其下一次激活结束。
    const hasStun = !!weaponMods(wizardState.weapon).targetAplReduction;
    if (hasStun && wizardState.attackCrit > 0 && !wizardState.stunApplied) {
      wizardState.defender.apl = Math.max(0, wizardState.defender.apl - 1);
      wizardState.defender.stunnedUntilEndOfNextActivation = true;
      wizardState.stunApplied = true;
      ui.addLog(`[震慑] ${wizardState.weapon.name}：保留暴击生效，${wizardState.defender.name} APL -1 (直到其下一次激活结束)！`);
      ui.updateActivePanel();
    }

    let remainingCrits = wizardState.attackCrit;
    let remainingNorms = wizardState.attackNorm;
    let remainingCritSaves = wizardState.defCrit;
    let remainingNormSaves = wizardState.defNorm;

    // ---- Saturate 规则 ----
    // "The defender cannot retain cover saves."
    // 防御方不能保留掩体骰（掩体提供的自动普通成功被移除）。
    const hasSaturate = weaponMods(effectiveWeapon(wizardState.weapon, wizardState.attacker)).coverSavesDisabled;
    if (hasSaturate && (wizardState.inCover || wizardState.cloudOfFliesActive) && remainingNormSaves > 0) {
      const coverSavesRemoved = Math.min(1, remainingNormSaves);
      remainingNormSaves -= coverSavesRemoved;
      const saturateSource = wizardState.cloudOfFliesActive && !wizardState.inCover ? '蝇云遮蔽' : '掩体';
      ui.addLog(`[饱和] ${wizardState.weapon.name}：防御方不能保留${saturateSource}骰，移除 ${coverSavesRemoved} 个自动成功！`);
    }

    // Piercing Crits 的效果 (减防御骰池) 已在步骤5 dfCount 计算时处理 (L221)
    // 此处不再后置移除成功防御骰

    const critWithCrit = Math.min(remainingCrits, remainingCritSaves);
    remainingCrits -= critWithCrit;
    remainingCritSaves -= critWithCrit;

    let critWithNormPair = 0;
    if (remainingCrits > 0 && remainingNormSaves >= 2) {
      critWithNormPair = Math.min(remainingCrits, Math.floor(remainingNormSaves / 2));
      remainingCrits -= critWithNormPair;
      remainingNormSaves -= critWithNormPair * 2;
    }

    const normWithNorm = Math.min(remainingNorms, remainingNormSaves);
    remainingNorms -= normWithNorm;
    remainingNormSaves -= normWithNorm;

    const normWithCrit = Math.min(remainingNorms, remainingCritSaves);
    remainingNorms -= normWithCrit;
    remainingCritSaves -= normWithCrit;

    // Toxic 规则：defender 有 poison token 且武器有 Toxic，则 Normal/Crit Dmg 各 +1
    // (阵营机制，由 factionMechanicsEnabled 开关；dmgBonusIfPoisoned 由注册表按 defenderPoisoned 判定)
    let normDmg = wizardState.weapon.normalDamage;
    let critDmg = wizardState.weapon.criticalDamage;
    const hasToxic = activeRuleSet().factionMechanicsEnabled
      && !!weaponMods(wizardState.weapon, { defenderPoisoned: wizardState.defender.poisonTokens > 0 }).dmgBonusIfPoisoned;
    if (hasToxic) {
      normDmg += 1;
      critDmg += 1;
      ui.addLog(`[剧毒] 目标携带毒素标记，${wizardState.weapon.name} 伤害 +1 (${normDmg}/${critDmg})`);
    }

    // 注：Severe 武器规则的正确实现见上方保留阶段 (step 6, attackCrit===0 时升级 1 普通→暴击)。
    // 此处曾有一段错误的"保留暴击→普通伤害升级为暴击伤害"逻辑，与文档不符，已移除。

    // Devastating 规则：暴击立即额外造成 N 点伤害（参数由注册表解析）
    // "immediateCritDmg" — 每个暴击命中额外 +N 伤害
    const devastatingVal = weaponMods(wizardState.weapon).immediateCritDmg || 0;
    if (devastatingVal > 0 && remainingCrits > 0) {
      critDmg += devastatingVal;
      ui.addLog(`[毁灭] ${wizardState.weapon.name}：暴击额外 +${devastatingVal} 伤害 (${critDmg})！`);
    }

    // 构建每次攻击的伤害数组（用于 DR per-attack 结算）
    const dmgPerAttack = [];
    for (let i = 0; i < remainingCrits; i++) dmgPerAttack.push(critDmg);
    for (let i = 0; i < remainingNorms; i++) dmgPerAttack.push(normDmg);
    const rawDmg = dmgPerAttack.reduce((s, v) => s + v, 0);

    // 需要 DR 骰的次数：每次攻击伤害 ≥3
    const attacksRequiringDr = dmgPerAttack.filter(d => d >= 3).length;

    let matchingHtml = `
      <div class="matching-view">
        <div class="matching-row">
          <span class="matching-label">攻击命中</span>
          <div class="matching-dice-list">
    `;
    const matchEffTs = getEffectiveTs(wizardState.weapon, wizardState.attacker);
    const attDiceCls = getDiceClass(wizardState.attacker.faction);
    const defDiceCls = getDiceClass(wizardState.defender.faction);
    for (let i = 0; i < wizardState.attackCrit; i++) matchingHtml += `<div class="kt-dice-cube ${attDiceCls} crit-dice">6</div>`;
    for (let i = 0; i < wizardState.attackNorm; i++) matchingHtml += `<div class="kt-dice-cube ${attDiceCls}">${matchEffTs}</div>`;
    if (wizardState.attackCrit + wizardState.attackNorm === 0) matchingHtml += '<span style="font-size:0.8rem; color:var(--text-muted);">无命中</span>';
    matchingHtml += `
          </div>
        </div>
        <div class="matching-row">
          <span class="matching-label">防御保护</span>
          <div class="matching-dice-list">
    `;
    for (let i = 0; i < wizardState.defCrit; i++) matchingHtml += `<div class="kt-dice-cube ${defDiceCls} crit-dice">6</div>`;
    for (let i = 0; i < wizardState.defNorm; i++) matchingHtml += `<div class="kt-dice-cube ${defDiceCls}">${wizardState.defender.sv}</div>`;
    if (wizardState.defCrit + wizardState.defNorm === 0) matchingHtml += '<span style="font-size:0.8rem; color:var(--text-muted);">无防御成功</span>';
    matchingHtml += `
          </div>
        </div>
      </div>
    `;

    body.innerHTML = `
      ${getShootDuelHeaderHtml()}

      ${matchingHtml}

      <div class="qa-card" style="margin-top:10px;">
        <p style="font-size:0.95rem; font-weight:600; color:#fff;">最终对消计算汇报：</p>
        <p style="margin-top:4px;">- 暴击命中残留: <b>${remainingCrits}</b> 个 (每个伤害: ${critDmg}${hasToxic && wizardState.defender.poisonTokens > 0 ? ' <span style="color:#a78bfa;">[剧毒+1]</span>' : ''})</p>
        <p>- 普通命中残留: <b>${remainingNorms}</b> 个 (每个伤害: ${normDmg}${hasToxic && wizardState.defender.poisonTokens > 0 ? ' <span style="color:#a78bfa;">[剧毒+1]</span>' : ''})</p>
        <p style="color:var(--sm-accent); font-weight:bold; margin-top:8px; font-size:1rem;">分配伤害总计: ${rawDmg} 点</p>
      </div>
    `;

    nextBtn.textContent = '确认射击结果';
    nextBtn.disabled = false;
    nextBtn.onclick = () => confirmShootResult(dmgPerAttack);

    if (rawDmg > 0) {
      setTimeout(() => {
        ui.triggerAvatarHitEffect(wizardState.defender.id, 'shoot');
      }, 150);
    }
  }
}

export function selectShootDefender(opId) {
  playSound('click');
  wizardState.defender = gameState.operatives.find(o => o.id === opId);
  renderShootStep();
}

export function selectShootWeapon(idx) {
  playSound('click');
  wizardState.weapon = wizardState.attacker.weapons.filter(w => w.isRanged)[idx];
  renderShootStep();
}

export function setQA(prop, val) {
  playSound('click');
  wizardState[prop] = val;
  if (wizardState.actionType === 'fight') {
    renderFightStep();
  } else {
    renderShootStep();
  }
}



// ==========================================
//          Attack Dice
// ==========================================

export function rollAttackDice() {
  const nextBtn = document.getElementById('modal-btn-next');
  const pool = document.getElementById('attack-dice-pool');
  const rollBtn = document.getElementById('btn-roll-attack');

  // 防御性检查：如果已经投过骰子，不允许重复投掷
  if (wizardState.attackRolls.length > 0) return;

  // 重置武器规则重投状态（新一轮投骰；weaponRerollRule 由 recalculateAttackStats 在投完后设置）
  wizardState.weaponRerollUsed = false;
  wizardState.relenlessSelection = [];

  rollBtn.style.display = 'none';
  nextBtn.disabled = true;

  const attDiceClass = getDiceClass(wizardState.attacker.faction);

  // 1. 初始化滚动的占位骰子
  pool.innerHTML = '';
  const totalAttacks = wizardState.weapon.attacks;
  skipDiceAnimation = false;
  diceAnimationTimeouts = [];
  for (let i = 0; i < totalAttacks; i++) {
    const dice = document.createElement('div');
    dice.className = `kt-dice-cube ${attDiceClass} rolling`;
    dice.textContent = '?';
    pool.appendChild(dice);
  }

  // Add skip button
  const skipBtn = document.createElement('button');
  skipBtn.className = 'modal-btn';
  skipBtn.style.cssText = 'padding: 6px 16px; font-size: 0.75rem; margin-top: 8px; min-width: auto;';
  skipBtn.textContent = '跳过动画 (Skip)';
  skipBtn.onclick = () => {
    skipDiceAnimation = true;
    diceAnimationTimeouts.forEach(id => clearTimeout(id));
    diceAnimationTimeouts = [];
    // Settle all remaining dice immediately
    const diceCubes = pool.getElementsByClassName('kt-dice-cube');
    const skipEffTs = getEffectiveTs(wizardState.weapon, wizardState.attacker);
    let hasHitPenaltyFail = false;
    for (let i = currentSettleIndex; i < totalAttacks; i++) {
      const val = Math.floor(Math.random() * 6) + 1;
      finalRolls.push(val);
      const cube = diceCubes[i];
      if (cube) {
        cube.classList.remove('rolling');
        cube.textContent = val;
        if (val === 6) cube.classList.add('crit-dice');
        else if (val < skipEffTs) {
          cube.classList.add('fail-dice');
          if (val >= wizardState.weapon.ts) {
            const badge = document.createElement('div');
            badge.style.cssText = 'position: absolute; bottom: -10px; left: -10px; background: var(--red); border-radius: 50%; width: 22px; height: 22px; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 1.5px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.5); z-index: 5;';
            badge.textContent = '+1';
            badge.title = '因命中减益导致失败';
            cube.appendChild(badge);
            hasHitPenaltyFail = true;
          }
        }
      }
    }
    wizardState.attackRolls = finalRolls;
    recalculateAttackStats();
    renderShootStep();
    if (hasHitPenaltyFail) {
      playSound('epic_fail');
    }
  };
  pool.parentElement.appendChild(skipBtn);

  // 2. 滚动起手特效与声音
  ui.triggerCombatVisual("🔥 OPEN FIRE!", "shoot");
  playSound('dice_roll');

  // 3. 顺序停下 (逐个确定点数并播放音效)
  const finalRolls = [];
  let currentSettleIndex = 0;

  function settleNextDice() {
    if (skipDiceAnimation) return;
    if (currentSettleIndex < totalAttacks) {
      const val = Math.floor(Math.random() * 6) + 1;
      finalRolls.push(val);

      // 更新 DOM
      const diceCubes = pool.getElementsByClassName('kt-dice-cube');
      const cube = diceCubes[currentSettleIndex];
      cube.classList.remove('rolling');
      cube.textContent = val;

      const stepEffTs = getEffectiveTs(wizardState.weapon, wizardState.attacker);
      if (val === 6) {
        cube.classList.add('crit-dice');
        playSound('crit');
      } else if (val < stepEffTs) {
        cube.classList.add('fail-dice');
        playSound('dice_drop');
        if (val >= wizardState.weapon.ts) {
          const badge = document.createElement('div');
          badge.style.cssText = 'position: absolute; bottom: -10px; left: -10px; background: var(--red); border-radius: 50%; width: 22px; height: 22px; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 1.5px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.5); z-index: 5;';
          badge.textContent = '+1';
          badge.title = '因命中减益导致失败';
          cube.appendChild(badge);
          playSound('epic_fail');
        }
      } else {
        playSound('dice_drop');
      }

      currentSettleIndex++;
      scheduleTimeout(settleNextDice, 400);
    } else {
      // 全部掷骰完毕，计算并呈现结果
      wizardState.attackRolls = finalRolls;
      recalculateAttackStats();
      skipBtn.remove();

      const successes = wizardState.attackCrit + wizardState.attackNorm;
      if (successes === 0) {
        playSound('epic_fail');
        ui.triggerCombatVisual("❌ ALL MISSED!", "normal");
      } else if (successes === totalAttacks || wizardState.attackCrit >= 2) {
        playSound('epic_win');
        ui.triggerCombatVisual("✨ EPIC SHOTS!", "shoot");
      }

      renderShootStep();
    }
  }

  // 1200ms 初始翻滚延迟
  scheduleTimeout(settleNextDice, 1200);
}

export function getRerollHintHtml(isDefense = false) {
  const faction = isDefense ? wizardState.defender.faction : wizardState.attacker.faction;
  const curCp = getCpForFaction(faction);
  const wReroll = isDefense ? null : wizardState.weaponRerollRule;
  const wRerollAvail = !isDefense && wReroll && !wizardState.weaponRerollUsed;

  const canCp = curCp >= 1 && (isDefense ? wizardState.defRerollIndex === -1 : wizardState.attRerollIndex === -1);

  if (!canCp && !wRerollAvail) return '';

  let html = `
    <div class="reroll-prompt-banner" style="margin-top:12px; padding:12px; background:rgba(212,175,55,0.06); border:1px solid rgba(212,175,55,0.25); border-radius:8px; text-align:left;">
      <div style="font-weight:bold; color:var(--gold); margin-bottom:6px; font-size:0.85rem; display:flex; align-items:center; gap:6px;">
        <span>💡 可用的重投选项提示:</span>
      </div>
      <ul style="margin:0; padding-left:18px; font-size:0.8rem; color:var(--text-muted); line-height:1.6;">
  `;

  if (canCp) {
    html += `<li><strong style="color:var(--text);">战术重投 (Tactical Reroll)</strong>: 可消耗 1 CP 点击骰子重投 (剩余 CP: ${curCp})。</li>`;
  }

  if (wRerollAvail) {
    if (wReroll === 'Balanced') {
      let source = '武器属性';
      if (wizardState.hasBalancedFromDoctrine) source = '战术/战斗教条';
      else if (wizardState.hasBalancedFromFickle) source = '计谋/命运无常';
      html += `<li><strong style="color:#10b981;">平衡 (Balanced)</strong>: 可<strong>免费</strong>重投 1 个攻击骰 (源自: ${source})。点击带 <span style="background:var(--gold); color:black; padding:1px 4px; border-radius:3px; font-size:0.7rem; font-weight:bold;">B</span> 的骰子并在弹窗中进行选择。</li>`;
    } else if (wReroll === 'Ceaseless') {
      html += `<li><strong style="color:#10b981;">不息 (Ceaseless)</strong>: 点数为 1 的攻击骰可<strong>免费</strong>重投。点击带 <span style="background:var(--gold); color:black; padding:1px 4px; border-radius:3px; font-size:0.7rem; font-weight:bold;">C</span> 的骰子并在弹窗中进行确认。</li>`;
    } else if (wReroll === 'Relentless') {
      html += `<li><strong style="color:#10b981;">无情 (Relentless)</strong>: 可<strong>免费</strong>重投任意数量的攻击骰。依次点击骰子标记为勾选，然后点击下方的【确认重投选中】按钮。</li>`;
    }
  }

  html += `
      </ul>
    </div>
  `;
  return html;
}

export function renderAttackDiceView() {
  const pool = document.getElementById('attack-dice-pool');
  if (!pool) return;
  pool.innerHTML = '';

  const faction = wizardState.attacker.faction;
  const curCp = getCpForFaction(faction);
  const attDiceClass = getDiceClass(faction);
  const renderEffTs = getEffectiveTs(wizardState.weapon, wizardState.attacker);

  // 武器规则免费重投：Relentless(任意) 走点击多选；Balanced(单骰) 走 showRerollModal 弹窗进行明确确认；Ceaseless 走值按钮
  const wReroll = wizardState.weaponRerollRule;
  const wRerollAvail = wReroll && !wizardState.weaponRerollUsed;
  const perDieReroll = wRerollAvail && (wReroll === 'Relentless');
  const sel = wizardState.relenlessSelection || [];

  wizardState.attackRolls.forEach((val, idx) => {
    const d = document.createElement('div');
    let cls = `kt-dice-cube ${attDiceClass}`;
    if (val === 6) cls += ' crit-dice';
    else if (val < renderEffTs) cls += ' fail-dice';
    if (wReroll === 'Relentless' && sel.includes(idx)) cls += ' fail-dice';

    d.className = cls;
    d.textContent = val;

    // Check if failed specifically because of a Hit penalty (renderEffTs > base TS)
    if (val < renderEffTs && val >= wizardState.weapon.ts) {
      const penaltyBadge = document.createElement('div');
      penaltyBadge.style.cssText = 'position: absolute; bottom: -10px; left: -10px; background: var(--red); border-radius: 50%; width: 22px; height: 22px; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 1.5px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.5); z-index: 5;';
      penaltyBadge.textContent = '+1';
      penaltyBadge.title = '因命中减益导致失败';
      d.appendChild(penaltyBadge);
    }

    const hasAlreadyRerolled = (wizardState.attackRerolledIndices || []).includes(idx);

    if (hasAlreadyRerolled) {
      // 已经重投过的骰子，不允许再次重投
      d.style.cursor = 'not-allowed';
      const badge = document.createElement('div');
      badge.className = 'reroll-indicator';
      const isSuccess = val >= renderEffTs;
      badge.style.background = isSuccess ? 'var(--green)' : 'var(--red)';
      badge.textContent = isSuccess ? '✓' : '✖';
      d.appendChild(badge);
    } else if (perDieReroll) {
      // 免费多选重投 (Relentless 单击切换选中)
      d.style.cursor = 'pointer';
      const badge = document.createElement('div');
      badge.className = 'reroll-indicator';
      badge.textContent = sel.includes(idx) ? '✓' : '○';
      d.onclick = () => toggleRelentlessSelect(idx);
      d.appendChild(badge);
    } else {
      // 提供战术/自由/规则重投选择弹窗
      d.style.cursor = 'pointer';
      const badge = document.createElement('div');
      badge.className = 'reroll-indicator';
      
      // 如果 Balanced 规则可用且尚未被使用，且该骰子可以被重投，显示 'B'
      if (wRerollAvail && wReroll === 'Balanced') {
        badge.textContent = 'B';
        badge.style.background = 'var(--gold)';
        badge.style.color = 'black';
      } else if (wRerollAvail && wReroll === 'Ceaseless' && val === 1) {
        badge.textContent = 'C';
        badge.style.background = 'var(--gold)';
        badge.style.color = 'black';
      } else {
        badge.textContent = 'R';
      }
      
      d.appendChild(badge);
      d.onclick = () => showRerollModal(idx, false);
    }
    pool.appendChild(d);
  });

  // Ceaseless 现在改为了单骰点击确认，移除了旧版的按值批量重投按钮

  // Relentless：确认重投选中
  if (wRerollAvail && wReroll === 'Relentless') {
    const hint = document.createElement('p');
    hint.style.cssText = 'color:var(--sm-accent); font-size:0.75rem; margin:8px 0 4px; text-align:center;';
    hint.textContent = `💡 Relentless：点击骰子选择要重投的（已选 ${sel.length}），然后确认`;
    pool.appendChild(hint);
    const btn = document.createElement('button');
    btn.className = 'qa-btn';
    btn.style.cssText = 'padding:6px 18px; font-size:0.8rem; display:block; margin:0 auto;';
    btn.textContent = '确认重投选中';
    btn.disabled = sel.length === 0;
    btn.onclick = () => confirmRelentlessReroll();
    pool.appendChild(btn);
  }
}

export function rerollSingleAttackDice(idx) {
  playSound('dice_roll');
  setCpForFaction(wizardState.attacker.faction, getCpForFaction(wizardState.attacker.faction) - 1);
  ui.updateScoresUI();

  wizardState.attRerollIndex = idx;
  if (!wizardState.attackRerolledIndices) wizardState.attackRerolledIndices = [];
  if (!wizardState.attackRerolledIndices.includes(idx)) {
    wizardState.attackRerolledIndices.push(idx);
  }

  // 单骰子摇晃动画
  const pool = document.getElementById('attack-dice-pool');
  const diceCubes = pool.getElementsByClassName('kt-dice-cube');
  const cube = diceCubes[idx];
  const attDiceClass = getDiceClass(wizardState.attacker.faction);
  cube.className = `kt-dice-cube ${attDiceClass} rolling`;
  cube.innerHTML = '?';

  setTimeout(() => {
    const newVal = Math.floor(Math.random() * 6) + 1;
    ui.addLog(`  - [重投] 攻击方消耗 1 CP重投 D6: [${wizardState.attackRolls[idx]}] -> [${newVal}]`);
    wizardState.attackRolls[idx] = newVal;

    recalculateAttackStats();
    renderShootStep();

    const stepEffTs = getEffectiveTs(wizardState.weapon, wizardState.attacker);
    if (newVal < stepEffTs && newVal >= wizardState.weapon.ts) {
      playSound('epic_fail');
    }
  }, 500);
}

export function showRerollModal(idx, isDefense = false, dfCount = 0) {
  const isRerolledAlready = isDefense
    ? (wizardState.defenseRerolledIndices || []).includes(idx)
    : (wizardState.attackRerolledIndices || []).includes(idx);
  
  if (isRerolledAlready) {
    if (showToast) showToast('该骰子已重投过，根据规则无法再次重投！', 'warning');
    return;
  }

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.display = 'flex';
  overlay.style.zIndex = '3000';
  
  const faction = isDefense ? wizardState.defender.faction : wizardState.attacker.faction;
  const curCp = getCpForFaction(faction);
  const val = isDefense ? wizardState.defenseRolls[idx] : wizardState.attackRolls[idx];
  
  const canCp = curCp >= 1 && (isDefense ? wizardState.defRerollIndex === -1 : wizardState.attRerollIndex === -1);
  
  let optionsHtml = '';
  
  // CP Reroll option
  if (canCp) {
    optionsHtml += `
      <button id="btn-reroll-cp" class="btn-large" style="padding: 10px; font-size:0.9rem;">
        战术重投 (消耗 1 CP, 剩 ${curCp} CP)
      </button>
    `;
  }
  
  // Rule-based free reroll options (only for attack dice)
  if (!isDefense) {
    const wReroll = wizardState.weaponRerollRule;
    const wRerollAvail = wReroll && !wizardState.weaponRerollUsed;
    
    if (wRerollAvail) {
      if (wReroll === 'Balanced') {
        const balancedPloys = wizardState.activeBalancedPloys || [];
        balancedPloys.forEach((bp, bpIdx) => {
          const ployDef = getPloy(bp.rule);
          const ployName = ployDef ? ployDef.name_cn : bp.rule;
          optionsHtml += `
            <button id="btn-reroll-ploy-${bpIdx}" class="btn-large" style="padding: 10px; font-size:0.9rem; background:linear-gradient(135deg, var(--sm-accent, #60a5fa), #1d4ed8); border-color:#2563eb; color:white; font-weight:bold;">
              ${ployName}重投 [Balanced] (免费)
            </button>
          `;
        });
        
        if (wizardState.hasBalancedBase) {
          optionsHtml += `
            <button id="btn-reroll-base-balanced" class="btn-large" style="padding: 10px; font-size:0.9rem; background:linear-gradient(135deg, #10b981, #047857); border-color:#059669; color:white; font-weight:bold;">
              武器平衡规则重投 [Balanced] (免费)
            </button>
          `;
        }
      } else if (wReroll === 'Relentless') {
        optionsHtml += `
          <button id="btn-reroll-relentless" class="btn-large" style="padding: 10px; font-size:0.9rem; background:linear-gradient(135deg, #10b981, #047857); border-color:#059669; color:white; font-weight:bold;">
            无情规则重投 [Relentless] (免费)
          </button>
        `;
      } else if (wReroll === 'Ceaseless') {
        if (val === 1) {
          optionsHtml += `
            <button id="btn-reroll-ceaseless" class="btn-large" style="padding: 10px; font-size:0.9rem; background:linear-gradient(135deg, #10b981, #047857); border-color:#059669; color:white; font-weight:bold;">
              不息规则重投 [Ceaseless] (免费)
            </button>
          `;
        }
      }
    }
  }

  // If no reroll option is available, tell the player
  if (optionsHtml === '') {
    optionsHtml = `<p style="color:var(--red); font-size:0.9rem; margin-bottom:10px;">当前无可用的重投选项（CP不足或已使用过该重投规则）</p>`;
  }

  overlay.innerHTML = `
    <div class="modal-content" style="max-width: 400px; border: 1px solid var(--gold); box-shadow: 0 0 20px rgba(0,0,0,0.8); background: rgba(10,15,28,0.98);">
      <div class="modal-header" style="padding: 12px; background: rgba(10,20,35,0.95); border-bottom: 1px solid var(--gold);">
        <div class="modal-title" style="font-size:1.1rem; color:var(--gold); font-weight:bold;">🎲 选择重投方式</div>
      </div>
      <div class="modal-body" style="padding: 20px; text-align: center;">
        <p style="margin-bottom: 12px; font-size:1rem; color:var(--text-muted);">当前骰值: <strong style="font-size:1.6rem; color:white; font-family:'Pirata One',serif; border: 1px solid rgba(255,255,255,0.15); padding: 4px 12px; border-radius: 4px; background: rgba(255,255,255,0.05); margin-left: 8px;">${val}</strong></p>
        <p style="font-size:0.8rem; color:var(--text-muted); margin-top:-4px; margin-bottom: 20px; line-height: 1.4;">
          请选择要应用于该骰子的重投方式。根据 Kill Team 规则，每个骰子最多只能重投一次。
        </p>
        <div style="display:flex; flex-direction:column; gap:12px; width:100%;">
          ${optionsHtml}
          <button id="btn-reroll-cancel" class="btn-cancel" style="padding: 10px; font-size:0.9rem;">
            取消 (Cancel)
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  if (canCp) {
    document.getElementById('btn-reroll-cp').onclick = () => {
      document.body.removeChild(overlay);
      if (isDefense) {
        rerollSingleDefenseDice(idx, dfCount);
      } else {
        rerollSingleAttackDice(idx);
      }
    };
  }
  
  if (!isDefense) {
    const wReroll = wizardState.weaponRerollRule;
    const wRerollAvail = wReroll && !wizardState.weaponRerollUsed;
    if (wRerollAvail) {
      if (wReroll === 'Balanced') {
        const balancedPloys = wizardState.activeBalancedPloys || [];
        balancedPloys.forEach((bp, bpIdx) => {
          const btn = document.getElementById(`btn-reroll-ploy-${bpIdx}`);
          if (btn) {
            btn.onclick = () => {
              document.body.removeChild(overlay);
              const ployDef = getPloy(bp.rule);
              const label = ployDef ? `${ployDef.name_cn} [Balanced]` : `${bp.rule} [Balanced]`;
              rerollWeaponRuleDice([idx], label);
            };
          }
        });
        
        const btnBaseBalanced = document.getElementById('btn-reroll-base-balanced');
        if (btnBaseBalanced) {
          btnBaseBalanced.onclick = () => {
            document.body.removeChild(overlay);
            rerollWeaponRuleDice([idx], 'Balanced');
          };
        }
      }
      
      const btnRelentless = document.getElementById('btn-reroll-relentless');
      if (btnRelentless) {
        btnRelentless.onclick = () => {
          document.body.removeChild(overlay);
          rerollWeaponRuleDice([idx], 'Relentless');
        };
      }
      
      const btnCeaseless = document.getElementById('btn-reroll-ceaseless');
      if (btnCeaseless) {
        btnCeaseless.onclick = () => {
          document.body.removeChild(overlay);
          rerollWeaponRuleDice([idx], 'Ceaseless');
        };
      }
    }
  }
  
  document.getElementById('btn-reroll-cancel').onclick = () => {
    playSound('click');
    document.body.removeChild(overlay);
  };
}

/**
 * 武器规则免费重投（Balanced 单骰 / Ceaseless 按值多骰 / Relentless 任意多骰）。
 * 不消耗 CP；每轮投骰每条规则最多用一次（wizardState.weaponRerollUsed）。
 */
export function rerollWeaponRuleDice(indices, ruleType) {
  if (wizardState.weaponRerollUsed) return;
  if (!indices || indices.length === 0) return;
  playSound('dice_roll');
  
  if (ruleType === 'Ceaseless') {
    const allOnesRerolled = wizardState.attackRolls.every((val, i) => 
      val !== 1 || (wizardState.attackRerolledIndices && wizardState.attackRerolledIndices.includes(i)) || indices.includes(i)
    );
    if (allOnesRerolled) {
      wizardState.weaponRerollUsed = true;
    }
  } else {
    wizardState.weaponRerollUsed = true;
  }

  if (!wizardState.attackRerolledIndices) wizardState.attackRerolledIndices = [];
  indices.forEach(i => {
    if (!wizardState.attackRerolledIndices.includes(i)) {
      wizardState.attackRerolledIndices.push(i);
    }
  });

  // 播放被重投骰子的滚动摇晃动画
  const pool = document.getElementById('attack-dice-pool');
  if (pool) {
    const diceCubes = pool.getElementsByClassName('kt-dice-cube');
    indices.forEach(idx => {
      const cube = diceCubes[idx];
      if (cube) {
        const attDiceClass = getDiceClass(wizardState.attacker.faction);
        cube.className = `kt-dice-cube ${attDiceClass} rolling`;
        cube.innerHTML = '?';
      }
    });
  }

  setTimeout(() => {
    const oldVals = indices.map(i => wizardState.attackRolls[i]);
    indices.forEach(i => { wizardState.attackRolls[i] = Math.floor(Math.random() * 6) + 1; });
    const newVals = indices.map(i => wizardState.attackRolls[i]);
    ui.addLog(`  - [${ruleType}] 免费重投骰子 [${oldVals.join(',')}] -> [${newVals.join(',')}]`);
    wizardState.relenlessSelection = [];
    
    // Check if any of the new rolls failed specifically due to hit penalty
    const stepEffTs = getEffectiveTs(wizardState.weapon, wizardState.attacker);
    const hasPenaltyFail = newVals.some(v => v < stepEffTs && v >= wizardState.weapon.ts);
    
    recalculateAttackStats();
    renderShootStep();

    if (hasPenaltyFail) {
      playSound('epic_fail');
    }
  }, 500);
}

/** Relentless 多骰选择：点击骰子切换选中态。 */
export function toggleRelentlessSelect(idx) {
  if (wizardState.weaponRerollUsed) return;
  if (!wizardState.relenlessSelection) wizardState.relenlessSelection = [];
  const i = wizardState.relenlessSelection.indexOf(idx);
  if (i >= 0) wizardState.relenlessSelection.splice(i, 1);
  else wizardState.relenlessSelection.push(idx);
  renderAttackDiceView();
}

/** Relentless：确认重投当前选中的骰子。 */
export function confirmRelentlessReroll() {
  const sel = wizardState.relenlessSelection || [];
  if (sel.length === 0) return;
  rerollWeaponRuleDice([...sel], 'Relentless');
}

// Brutal 规则已迁移至近战 (melee) 格挡阶段：
// "Your opponent can only block with critical successes"
// 对手只能使用暴击骰进行格挡(Parry)。
// 实现位置：resolveMeleeChoice('parry')

export function recalculateAttackStats() {
  const attacker = wizardState.attacker;
  const weapon = wizardState.weapon;
  const defender = wizardState.defender;
  const isMelee = !weapon.isRanged;

  // === Ploy: And They Shall Know No Fear — 忽略受伤 Hit +1 惩罚 ===
  const ignoreInjured = isIgnoreInjuredPenalties(attacker?.faction);
  const injuryPenalty = (attacker && attacker.isInjured && !ignoreInjured) ? 1 : 0;
  if (ignoreInjured && attacker?.isInjured) {
    ui.addLog(`[✠ 无所畏惧] 忽略受伤 Hit +1 惩罚`);
  }
  const effectiveTs = getEffectiveTs(weapon, attacker, ignoreInjured);

  // Lethal 规则：N+ 视为暴击（阈值由声明式注册表解析）
  const lethalThreshold = weaponMods(weapon).critThreshold ?? 6;

  // 基础统计
  let crits = 0;
  let norms = 0;
  wizardState.attackRolls.forEach(val => {
    if (val >= lethalThreshold) crits++;
    else if (val >= effectiveTs) norms++;
  });

  // === 保留阶段修饰符（声明式注册表；阵营派生规则经 effectiveWeapon 注入后统一判定） ===
  const injected = injectedFactionRules(attacker, weapon);
  if (injected.length > 0) {
    ui.addLog(`[阵营] ${attacker.name}：阵营规则注入 ${weapon.name}：${injected.join(', ')}`);
  }
  const retainMods = weaponMods(effectiveWeapon(weapon, attacker), { retainedCrits: crits, retainedNorms: norms });

  // Rending (基础 + Aggressive 章战术，已注入)：保留暴击时升级 1 普通→暴击
  if (retainMods.upgradeNormalToCrit && retainMods.source === 'Rending' && crits > 0 && norms > 0) {
    norms -= 1;
    crits += 1;
    ui.addLog(`[撕裂] ${weapon.name}：保留暴击生效，升级 1 个普通命中为暴击！`);
  }

  // Punishing: 保留暴击时保留 1 个失败骰作为普通成功
  if (retainMods.retainOneFailAsNormal && crits > 0) {
    const fails = wizardState.attackRolls.filter(val => val < effectiveTs && val !== 6 && val < lethalThreshold).length;
    if (fails > 0) {
      norms += 1;
      ui.addLog(`[惩罚] ${weapon.name}：保留暴击生效，保留 1 个失败骰作为普通成功！`);
    }
  }

  // Accurate (基础 + Sharpshooter，已注入；注册表合并多实例为 ≤2)
  const accurateVal = retainMods.autoRetainNormal || 0;
  if (accurateVal > 0) {
    const fails = wizardState.attackRolls.filter(val => val < effectiveTs && val < lethalThreshold).length;
    const upgradeCount = Math.min(accurateVal, fails);
    if (upgradeCount > 0) {
      norms += upgradeCount;
      ui.addLog(`[精准] ${weapon.name}：自动保留 ${upgradeCount} 个普通成功！`);
    }
  }

  // 注：Toxic 武器规则的伤害加成在 step6 通过 weaponMods(...).dmgBonusIfPoisoned 处理。
  // 注：阵营派生的 Severe(Khne)/Saturate(Siege) 等已通过 effectiveWeapon 注入，
  //     其效果由 step6 (Severe 升级) 与防御阶段 (Saturate 移除掩体骰) 经 weaponMods 统一应用，
  //     不再使用 severeFromAbility / saturateFromAbility 标志。

  // === 从 activeDebuffs 动态提取赋予武器的重投规则 ===
  const activeWeaponRulePloys = attacker?.activeDebuffs?.filter(d => d.target === 'weapon_rule') || [];
  
  // 查找是否有任何 ploy 属性赋予了 Balanced / Ceaseless / Relentless
  const hasBalancedFromPloys = activeWeaponRulePloys.some(d => d.extra_rule === 'Balanced');
  const hasCeaselessFromPloys = activeWeaponRulePloys.some(d => d.extra_rule === 'Ceaseless');
  const hasRelentlessFromPloys = activeWeaponRulePloys.some(d => d.extra_rule === 'Relentless');

  // 保存这些活跃的重投计谋信息到 wizardState，供重投弹窗动态渲染
  wizardState.activeBalancedPloys = activeWeaponRulePloys.filter(d => d.extra_rule === 'Balanced');

  // === 判定最终武器重投规则 ===
  const hasBalancedBase = !!retainMods.rerollOneAttackDie;
  const hasBalanced = hasBalancedBase || hasBalancedFromPloys;

  wizardState.hasBalancedBase = hasBalancedBase;

  // 命运无常 (Fickle Fates) 升级逻辑：若已有 Balanced 基础属性，则升级为 Relentless
  const hasFickleFatesBalanced = activeWeaponRulePloys.some(d => d.rule === 'fickle_fates' && d.extra_rule === 'Balanced');
  const hasRelentlessFromUpgrade = hasBalancedBase && hasFickleFatesBalanced;

  const isRelentlessActive = (!!retainMods.rerollAnyAttackDice) || hasRelentlessFromPloys || hasRelentlessFromUpgrade;
  const isCeaselessActive = (!!retainMods.rerollSpecificValue) || hasCeaselessFromPloys;

  // Relentless 优先于 Balanced
  wizardState.weaponRerollRule = isRelentlessActive ? 'Relentless'
    : isCeaselessActive ? 'Ceaseless'
    : hasBalanced ? 'Balanced'
    : null;

  if (hasRelentlessFromUpgrade) {
    ui.addLog(`[无情] ${weapon.name}：命运无常 + 已有 Balanced → 升级为 Relentless！`);
  }

  // === Ploy: Blood for the Blood God — 第一次 strike +1 伤害 (非 KHORNE); KHORNE 近战 Dmg +1 ===
  const hasBloodForBloodGod = isBloodForBloodGodActive(attacker?.faction);
  wizardState.bloodBonusActive = false;
  if (hasBloodForBloodGod) {
    const hasKhorneMark = hasMarkOfChaos(attacker, 'KHORNE');
    if (isMelee && hasKhorneMark) {
      // KHORNE: 近战武器 Normal/Critical Dmg +1 (上限 7)
      wizardState.bloodDmgBonus = true;
      ui.addLog(`[🩸 血祭血神] KHORNE 近战 Dmg +1！`);
    } else if (isMelee) {
      // 非 KHORNE: 第一次 strike +1 伤害 (上限 7)
      wizardState.bloodStrikeBonus = true;
      ui.addLog(`[🩸 血祭血神] 非 KHORNE Fight 第一次 strike +1 伤害！`);
    }
  }

  // === Ploy: Quicksilver Speed — 移动后 Fight 敌方 Hit +1 ===
  const hasQuicksilverSpeed = isQuicksilverSpeedActive(defender?.faction);
  if (hasQuicksilverSpeed && isMelee) {
    // 如果 defender 在本 TP 移动过，attacker 的武器 Hit +1
    // 物理沙盘无法自动判断，提示玩家
    wizardState.quicksilverCheck = { target: 'defender', type: 'melee' };
  }
  if (hasQuicksilverSpeed && !isMelee) {
    const hasSlaanesh = hasMarkOfChaos(defender, 'SLAANESH');
    if (hasSlaanesh) {
      // SLAANESH: 被 6" 外射击时 attacker Hit +1
      wizardState.quicksilverCheck = { target: 'defender', type: 'ranged_slaanesh' };
    }
  }

  wizardState.attackCrit = crits;
  wizardState.attackNorm = norms;
}

// ==========================================
//          Defense Dice
// ==========================================

export function rollDefenseDice(dfCount) {
  const nextBtn = document.getElementById('modal-btn-next');
  const pool = document.getElementById('defense-dice-pool');
  const rollBtn = document.getElementById('btn-roll-defense');

  // 防御性检查：如果已经投过骰子，不允许重复投掷
  if (wizardState.defenseRolls.length > 0) return;

  if (dfCount === 0) {
    wizardState.defCrit = 0;
    // Saturate 规则：掩体自动成功被移除
    const hasSaturateForZeroDf = weaponMods(effectiveWeapon(wizardState.weapon, wizardState.attacker)).coverSavesDisabled;
    wizardState.defNorm = (wizardState.inCover && !hasSaturateForZeroDf) ? 1 : 0;
    nextBtn.disabled = false;
    return;
  }

  rollBtn.style.display = 'none';
  nextBtn.disabled = true;

  const defDiceClass = getDiceClass(wizardState.defender.faction);

  pool.innerHTML = '';
  skipDiceAnimation = false;
  diceAnimationTimeouts = [];
  for (let i = 0; i < dfCount; i++) {
    const dice = document.createElement('div');
    dice.className = `kt-dice-cube ${defDiceClass} rolling`;
    dice.textContent = '?';
    pool.appendChild(dice);
  }

  // Add skip button
  const skipBtn = document.createElement('button');
  skipBtn.className = 'modal-btn';
  skipBtn.style.cssText = 'padding: 6px 16px; font-size: 0.75rem; margin-top: 8px; min-width: auto;';
  skipBtn.textContent = '跳过动画 (Skip)';
  skipBtn.onclick = () => {
    skipDiceAnimation = true;
    diceAnimationTimeouts.forEach(id => clearTimeout(id));
    diceAnimationTimeouts = [];
    const diceCubes = pool.getElementsByClassName('kt-dice-cube');
    for (let i = currentSettleIndex; i < dfCount; i++) {
      const val = Math.floor(Math.random() * 6) + 1;
      finalRolls.push(val);
      const cube = diceCubes[i];
      if (cube) {
        cube.classList.remove('rolling');
        cube.textContent = val;
        if (val === 6) cube.classList.add('crit-dice');
        else if (val < wizardState.defender.sv) cube.classList.add('fail-dice');
      }
    }
    wizardState.defenseRolls = finalRolls;
    recalculateDefenseStats();
    renderShootStep();
  };
  pool.parentElement.appendChild(skipBtn);

  ui.triggerCombatVisual("🛡️ INCOMING FIRE!", "parry");
  playSound('dice_roll');

  const finalRolls = [];
  let currentSettleIndex = 0;

  function settleNextDice() {
    if (skipDiceAnimation) return;
    if (currentSettleIndex < dfCount) {
      const val = Math.floor(Math.random() * 6) + 1;
      finalRolls.push(val);

      const diceCubes = pool.getElementsByClassName('kt-dice-cube');
      const cube = diceCubes[currentSettleIndex];
      cube.classList.remove('rolling');
      cube.textContent = val;

      if (val === 6) {
        cube.classList.add('crit-dice');
        playSound('crit');
      } else if (val < wizardState.defender.sv) {
        cube.classList.add('fail-dice');
        playSound('dice_drop');
      } else {
        playSound('dice_drop');
      }

      currentSettleIndex++;
      scheduleTimeout(settleNextDice, 400);
    } else {
      wizardState.defenseRolls = finalRolls;
      recalculateDefenseStats();
      skipBtn.remove();

      const sv = wizardState.defender.sv;
      const rolledSaves = finalRolls.filter(val => val >= sv).length;
      const rolledCrits = finalRolls.filter(val => val === 6).length;

      if (rolledSaves === 0) {
        playSound('epic_fail');
        ui.triggerCombatVisual("💀 DEFENSE BUSTED!", "normal");
      } else if (rolledSaves === dfCount || rolledCrits >= 2) {
        playSound('epic_win');
        ui.triggerCombatVisual("🛡️ SHIELD CLUTCH!", "deflect");
      }

      renderShootStep();
    }
  }

  // 1200ms 初始翻滚延迟
  scheduleTimeout(settleNextDice, 1200);
}

export function renderDefenseDiceView(dfCount) {
  const pool = document.getElementById('defense-dice-pool');
  if (!pool) return;
  pool.innerHTML = '';

  const defDiceClass = getDiceClass(wizardState.defender.faction);

  wizardState.defenseRolls.forEach((val, idx) => {
    const d = document.createElement('div');
    let cls = `kt-dice-cube ${defDiceClass}`;
    if (val === 6) cls += ' crit-dice';
    else if (val < wizardState.defender.sv) cls += ' fail-dice';

    d.className = cls;
    d.textContent = val;

    const hasAlreadyRerolled = (wizardState.defenseRerolledIndices || []).includes(idx);

    if (hasAlreadyRerolled) {
      // 已经重投过的骰子，不允许再次重投，显示绿色勾
      d.style.cursor = 'not-allowed';
      const badge = document.createElement('div');
      badge.className = 'reroll-indicator';
      badge.style.background = 'var(--green)';
      badge.textContent = '✓';
      d.appendChild(badge);
    } else {
      // 所有未重投的防御骰均可点击进行重投（提供战术/自由重投选择弹窗）
      d.style.cursor = 'pointer';
      const badge = document.createElement('div');
      badge.className = 'reroll-indicator';
      badge.textContent = 'R';
      d.appendChild(badge);
      d.onclick = () => showRerollModal(idx, true, dfCount);
    }

    pool.appendChild(d);
  });
}

export function rerollSingleDefenseDice(idx, dfCount) {
  playSound('save');
  setCpForFaction(wizardState.defender.faction, getCpForFaction(wizardState.defender.faction) - 1);
  ui.updateScoresUI();

  wizardState.defRerollIndex = idx;
  if (!wizardState.defenseRerolledIndices) wizardState.defenseRerolledIndices = [];
  if (!wizardState.defenseRerolledIndices.includes(idx)) {
    wizardState.defenseRerolledIndices.push(idx);
  }

  const pool = document.getElementById('defense-dice-pool');
  const diceCubes = pool.getElementsByClassName('kt-dice-cube');
  const cube = diceCubes[idx];
  const defDiceClass = getDiceClass(wizardState.defender.faction);
  cube.className = `kt-dice-cube ${defDiceClass} rolling`;
  cube.innerHTML = '?';

  setTimeout(() => {
    const newVal = Math.floor(Math.random() * 6) + 1;
    ui.addLog(`  - [重投] 防御方消耗 1 CP重投 D6: [${wizardState.defenseRolls[idx]}] -> [${newVal}]`);
    wizardState.defenseRolls[idx] = newVal;

    recalculateDefenseStats();
    renderShootStep();
  }, 500);
}

export function recalculateDefenseStats() {
  const defender = wizardState.defender;
  const weapon = wizardState.weapon;
  const sv = defender.sv;

  // Saturate 规则：防御方不能保留掩体骰（基础 + 阵营派生 Siege Specialist 经 effectiveWeapon 注入）
  const saturateActive = weaponMods(effectiveWeapon(weapon, wizardState.attacker)).coverSavesDisabled;

  // Camo Cloak (SM Eliminator Sniper): 忽略 Saturate
  const hasCamoCloak = activeRuleSet().factionMechanicsEnabled &&defender.operativeType === 'sm_eliminator_sniper';
  const saturateIgnored = hasCamoCloak && saturateActive;
  if (saturateIgnored) {
    ui.addLog(`[伪装斗篷] ${defender.name}：忽略 Saturate 规则！`);
  }

  const saturateEffective = saturateActive && !saturateIgnored;
  // 蝇云遮蔽 (cloudOfFliesActive) 与掩体 (inCover) 效果相同，但不叠加
  const hasObscuredBonus = (wizardState.inCover || (wizardState.cloudOfFliesActive && !wizardState.inCover)) && !saturateEffective;
  let norms = hasObscuredBonus ? 1 : 0;

  // === Ploy: Indomitus — 保留 1 个失败攻击骰作为额外普通防御成功 ===
  if (wizardState.indomitusBonus) {
    norms += 1;
  }

  // Hardy (Chapter Tactic): 防御 5+ 为暴击
  const hasHardy = activeRuleSet().factionMechanicsEnabled &&hasChapterTactic(defender, 'hardy');
  // Repulsive Fortitude (PM Warrior): 防御 5+ 算暴击
  const hasRepulsiveFortitude = activeRuleSet().factionMechanicsEnabled &&defender.operativeType === 'pm_warrior';
  const critAtFive = hasHardy || hasRepulsiveFortitude;

  let crits = 0;
  wizardState.defenseRolls.forEach(val => {
    if (val === 6) {
      crits++;
    } else if (critAtFive && val === 5) {
      crits++;
    } else if (val >= sv) {
      norms++;
    }
  });

  if (hasHardy && crits > 0) {
    ui.addLog(`[坚韧] ${defender.name}：章战术生效，5+ 防御骰算暴击！`);
  }
  if (hasRepulsiveFortitude && crits > 0) {
    ui.addLog(`[厌恶韧性] ${defender.name}：5+ 防御骰算暴击！`);
  }

  // === Ploy: Implacable — Piercing 1 降级为 Piercing Crits 1 (射击防御) ===
  const hasImplacable = isImplacableActive(defender?.faction);
  if (hasImplacable && !weapon.isRanged === false) { // 只在被射击时生效
    const hasPiercing = weaponHasRule(weapon, 'Piercing');
    if (hasPiercing) {
      ui.addLog(`[🛡 坚定不移] Piercing 1 降级为 Piercing Crits 1！`);
      wizardState.piercingDowngraded = true;
    }
  }

  // === Ploy: Implacable (NURGLE) — 忽略受伤减益 ===
  if (hasImplacable && hasMarkOfChaos(defender, 'NURGLE')) {
    wizardState.nurglesIgnoreInjured = true;
    ui.addLog(`[🛡 坚定不移] NURGLE 忽略受伤减益！`);
  }

  // === Ploy: Indomitus — 2+ fails 可丢弃 1 个并保留另 1 个为 normal ===
  const hasIndomitus = isIndomitusActive(defender?.faction);
  wizardState.indomitusAvailable = false;
  if (hasIndomitus) {
    const fails = wizardState.defenseRolls.filter(val => val < sv && val !== 6 && !(critAtFive && val === 5)).length;
    if (fails >= 2) {
      wizardState.indomitusAvailable = true;
      ui.addLog(`[✠ 不屈意志] ${defender.name}：投出 ${fails} 个失败，可使用 Indomitus 效果！`);
    }
  }

  // === Ploy: Transhuman Physiology — 升级 1 个 normal 为 critical (Firefight Ploy) ===
  wizardState.transhumanAvailable = isFirefightPloyActive('transhuman_physiology', defender?.faction);
  if (wizardState.transhumanAvailable && norms > 0) {
    ui.addLog(`[✠ 超人耐力] 可升级 1 个普通成功为暴击成功！`);
  }

  wizardState.defCrit = crits;
  wizardState.defNorm = norms;
}

// ==========================================
//          Manual Input
// ==========================================


export function parseManualMelee() {
  const attInput = document.getElementById('manual-melee-att-val');
  const defInput = document.getElementById('manual-melee-def-val');
  
  if (attInput) {
    const vals = attInput.value.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n >= 1 && n <= 6);
    const attCrit = meleeCritThreshold(wizardState.weapon);
    wizardState.activeAttackerDice = vals.map(n => ({ val: n, isCrit: n >= attCrit, used: false })).sort((a,b) => b.val - a.val);
  }
  if (defInput) {
    const vals = defInput.value.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n >= 1 && n <= 6);
    const defWeapon = wizardState.defender.weapons.filter(w => !w.isRanged)[0] || { ts: 3 }; // fallback
    const defCrit = meleeCritThreshold(defWeapon);
    wizardState.activeDefenderDice = vals.map(n => ({ val: n, isCrit: n >= defCrit, used: false })).sort((a,b) => b.val - a.val);
  }
}

export function parseManualAttack() {
  const inputEl = document.getElementById('manual-att-dice-val');
  if (!inputEl) return;
  const valStr = inputEl.value;
  const rolls = valStr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n >= 1 && n <= 6);
  wizardState.attackRolls = rolls;
  recalculateAttackStats();
}

export function parseManualDefense() {
  const inputEl = document.getElementById('manual-def-dice-val');
  if (!inputEl) return;
  const valStr = inputEl.value;
  const rolls = valStr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n >= 1 && n <= 6);
  wizardState.defenseRolls = rolls;
  recalculateDefenseStats();
}

// ==========================================
//          Shoot Result
// ==========================================

export function confirmShootResult(dmgPerAttack) {
  const attacker = wizardState.attacker;
  const defender = wizardState.defender;

  const attacksRequiringDr = dmgPerAttack.filter(d => d >= 3).length;

  // 1. Pre-Damage Rules Queue (e.g. Disgusting Resilience)
  const preDamageQueue = [];
  if (hasFactionTrait(defender.faction, 'disgustingResilience') && attacksRequiringDr > 0) {
    preDamageQueue.push({
      title: '🦠 恶心无视 (Disgusting Resilience)',
      description: `防守方 <strong>${defender.name}</strong> 具有【恶心无视】特性。<br>本次受到的攻击中包含了 <strong>${attacksRequiringDr}</strong> 次大于等于 3 点的伤害。<br>请投掷 <strong>${attacksRequiringDr}</strong> 个减伤判定骰，每个 4+ 的结果将减免 1 点伤害！`,
      requiresDice: true,
      diceCount: attacksRequiringDr,
      diceThreshold: 4,
      onDiceRolled: (rolls, successes) => {
        let drSuccesses = successes;
        for (let i = 0; i < dmgPerAttack.length && drSuccesses > 0; i++) {
          if (dmgPerAttack[i] >= 3) {
            dmgPerAttack[i] -= 1;
            drSuccesses--;
          }
        }
        ui.addLog(`[恶心无视] ${defender.name} 投掷了 ${attacksRequiringDr} 个减免骰，成功 ${successes} 个，共减免 ${successes} 点伤害！`);
      }
    });
  }

  resolveRuleQueue(preDamageQueue, () => {
    ui.addLog(`\n--- 射击结算阶段 ---`);
    ui.addLog(`[攻击方] ${attacker.name} 使用 ${wizardState.weapon.name} 射击`);
    ui.addLog(`[防守方] ${defender.name}`);

    // === 2. Apply Wounds ===
    const originalTotalDmg = dmgPerAttack.reduce((a, b) => a + b, 0);
    const oldWounds = defender.wounds;
    const actualDamage = defender.applyWounds(dmgPerAttack, 0, '射击攻击');
    const drReduced = originalTotalDmg - actualDamage;

    if (actualDamage > 0 || drReduced > 0) {
      playSound('shoot');
    } else {
      playSound('save');
      ui.triggerCombatVisual("SAVED", "parry");
    }

    // === 3. Post-Damage Rules Queue ===
    const rulesQueue = [];

    const hasPsychic = !!weaponMods(wizardState.weapon).perilOnFailValue;
    if (hasPsychic) {
      const perilCount = wizardState.attackRolls.filter(r => r === 1).length;
      if (perilCount > 0) {
        rulesQueue.push({
          title: '⚠️ 亚空间反噬 (PSYCHIC)',
          description: `灵能武器 <strong>${wizardState.weapon.name}</strong> 引导发生反噬！<br>
                        在进攻投骰中出现了 <strong>${perilCount}</strong> 个【1】。<br>
                        施法特工 <strong>${attacker.name}</strong> 受到 <strong>${perilCount}</strong> 点致命伤害！`,
          onResolve: () => {
            attacker.applyWounds(perilCount, null, 'auto', '亚空间反噬');
            ui.addLog(`[亚空间反噬] ${attacker.name} 受到 ${perilCount} 点致命伤害！`);
          }
        });
      }
    }

    const hasHot = !!weaponMods(wizardState.weapon).selfDamageOnLowRoll;
    if (hasHot) {
      const hitStat = wizardState.weapon.ts;
      rulesQueue.push({
        title: '⚠️ 武器过热 (Hot)',
        description: `武器 <strong>${wizardState.weapon.name}</strong> 具有过热风险。<br>
                      请投掷 1 个判定骰。若结果小于该武器命中阈值 (${hitStat})，射手将受到结果 × 2 的致命伤害！`,
        requiresDice: true,
        diceCount: 1,
        diceIsUnder: hitStat,
        onDiceRolled: (rolls, successes) => {
          const hotRoll = rolls[0];
          if (hotRoll < hitStat) {
            const hotDamage = hotRoll * 2;
            attacker.applyWounds(hotDamage, null, 'auto', '武器过热自伤');
            ui.addLog(`[过热] 判定骰出 [${hotRoll}]，小于 ${hitStat}。${attacker.name} 受到 ${hotDamage} 点伤害！`);
          } else {
            ui.addLog(`[过热] 判定骰出 [${hotRoll}]，安全！`);
          }
        }
      });
    }

    const hasPoison = !!weaponMods(wizardState.weapon).applyPoisonTokenOnDamage;
    if (hasPoison && actualDamage > 0 && defender.poisonTokens < 1) {
      rulesQueue.push({
        title: '☠️ 毒素感染 (Poison)',
        description: `本次攻击造成了伤害，武器的【毒素】特性生效！<br>
                      目标 <strong>${defender.name}</strong> 获得了 1 个毒素标记。<br>
                      在其次激活开始时将自动受到 1 点伤害。`,
        onResolve: () => {
          defender.poisonTokens = 1;
          ui.addLog(`[毒素] ${defender.name} 获得了 1 个毒素标记！`);
        }
      });
    }

    if (defender.isDead && activeRuleSet().hasKillCallbacks) {
      rulesQueue.push({
        title: '💀 击杀确认 (Kill)',
        description: `本次攻击击杀了 <strong>${defender.name}</strong>。<br>正在结算相关的特工战术目标或特性收益...`,
        onResolve: () => {
          triggerKillAbilities(attacker, defender, 'shoot', actualDamage);
        }
      });
    }

    // Run Post-Damage Queue
    resolveRuleQueue(rulesQueue, () => {
      attacker.apl -= 1;
      attacker.actionsPerformed.push('Shoot');
      ui.addLog(`[行动点] ${attacker.name} 消耗 1 APL，当前 APL: ${attacker.apl}`);

      closeModal();

      if (actualDamage > 0) {
        setTimeout(() => {
          ui.triggerAvatarHitEffect(defender.id, 'shoot');
        }, 100);
      }

      const triggerMods = weaponMods(wizardState.weapon);
      const hasBlastRule = !!triggerMods.aoePrimarySecondary;
      const hasTorrentRule = !!triggerMods.aoeRadius;
      if (hasBlastRule || hasTorrentRule) {
        handleBlastTorrentSecondaries(attacker, defender, wizardState.weapon, hasBlastRule, hasTorrentRule);
      }

      const devAoeDist = triggerMods.aoeDistance;
      const devVal = triggerMods.immediateCritDmg || 0;
      if (!hasBlastRule && !hasTorrentRule && devAoeDist && devVal > 0 && wizardState.attackCrit > 0) {
        handleDevastatingAoe(attacker, defender, wizardState.weapon, devVal, devAoeDist, wizardState.attackCrit);
      }
    }); // End of post-damage resolveRuleQueue
  }); // End of pre-damage resolveRuleQueue
}

/**
 * Blast/Torrent 多目标射击处理
 * Blast: 主目标后，对 3" 内每个次要目标射击 (使用相同武器数据)
 * Torrent: 主目标后，选择任意数量额外目标射击
 */
/**
 * 自动结算一次"次要目标"攻击（用于 Blast/Torrent 多目标）。
 * 自包含：独立投攻击骰 + 保留阶段规则 + 防御骰 + 对消级联 + 伤害（暴击/普通分算）。
 * 不走向导 UI，结果直接写入日志并扣血。
 * @param {Object} attacker - 攻击方 Operative
 * @param {Object} weapon - 武器
 * @param {Object} defender - 次要目标 Operative
 */
function autoResolveSecondaryAttack(attacker, weapon, defender) {
  const effectiveTs = getEffectiveTs(weapon, attacker);
  const lethalThreshold = weaponMods(effectiveWeapon(weapon, attacker)).critThreshold ?? 6;

  // 攻击骰
  const rolls = [];
  for (let i = 0; i < weapon.attacks; i++) rolls.push(Math.floor(Math.random() * 6) + 1);
  let aCrit = 0, aNorm = 0;
  rolls.forEach(v => { if (v >= lethalThreshold) aCrit++; else if (v >= effectiveTs) aNorm++; });

  // 保留阶段规则 (基础 + 阵营派生经 effectiveWeapon 注入，与主目标同源)
  const retainMods = weaponMods(effectiveWeapon(weapon, attacker), { retainedCrits: aCrit, retainedNorms: aNorm });
  if (retainMods.autoRetainNormal) {
    const fails = rolls.filter(v => v < effectiveTs && v < lethalThreshold).length;
    aNorm += Math.min(retainMods.autoRetainNormal, fails);
  }
  if (retainMods.upgradeNormalToCrit && retainMods.source === 'Rending' && aCrit > 0 && aNorm > 0) { aNorm -= 1; aCrit += 1; }
  if (retainMods.retainOneFailAsNormal && aCrit > 0) {
    const fails = rolls.filter(v => v < effTs && v !== 6 && v < lethalThreshold).length;
    if (fails > 0) aNorm += 1;
  }
  if (retainMods.upgradeNormalToCrit && retainMods.source === 'Severe' && aCrit === 0 && aNorm >= 1) { aNorm -= 1; aCrit += 1; }

  ui.addLog(`  攻击骰 [${rolls.join(', ')}] → ${aCrit} 暴击, ${aNorm} 普通`);
  if (aCrit + aNorm === 0) { ui.addLog(`  无命中，跳过。`); return; }

  // 防御骰
  const defRolls = [];
  for (let i = 0; i < defender.df; i++) defRolls.push(Math.floor(Math.random() * 6) + 1);
  let dCrit = 0, dNorm = 0;
  defRolls.forEach(v => { if (v === 6) dCrit++; else if (v >= defender.sv) dNorm++; });
  ui.addLog(`  防御骰 [${defRolls.join(', ')}] → ${dCrit} 暴击, ${dNorm} 普通`);

  // 对消级联（与主目标 step6 一致）：暴击攻 vs 暴击防；剩余暴击攻用 2 普通防；普通攻 vs 普通防；剩余普通攻用暴击防
  let remACrit = aCrit, remANorm = aNorm, remDCrit = dCrit, remDNorm = dNorm;
  const cwc = Math.min(remACrit, remDCrit); remACrit -= cwc; remDCrit -= cwc;
  if (remACrit > 0 && remDNorm >= 2) {
    const cwnp = Math.min(remACrit, Math.floor(remDNorm / 2)); remACrit -= cwnp; remDNorm -= cwnp * 2;
  }
  const nwn = Math.min(remANorm, remDNorm); remANorm -= nwn; remDNorm -= nwn;
  const nwc = Math.min(remANorm, remDCrit); remANorm -= nwc; remDCrit -= nwc;

  // 伤害（暴击=criticalDamage，普通=normalDamage；Devastating 每个剩余暴击 +x）
  const devVal = weaponMods(effectiveWeapon(weapon, attacker)).immediateCritDmg || 0;
  const dmgPerAttack = [];
  for (let i = 0; i < remACrit; i++) dmgPerAttack.push(weapon.criticalDamage + devVal);
  for (let i = 0; i < remANorm; i++) dmgPerAttack.push(weapon.normalDamage);
  const totalDmg = dmgPerAttack.reduce((s, v) => s + v, 0);

  if (totalDmg > 0) {
    const oldW = defender.wounds;
    const actual = defender.applyWounds(dmgPerAttack, null, 'auto', '次要目标溅射');
    ui.addLog(`  穿透 ${remACrit}暴击+${remANorm}普通 → ${actual} 伤害 (${oldW}→${defender.wounds} HP)`);
    if (defender.isDead) ui.addLog(`  💀 ${defender.name} 被击杀！`);
  } else {
    ui.addLog(`  全部被格挡！`);
  }
}

function handleBlastTorrentSecondaries(attacker, primaryDefender, weapon, hasBlast, hasTorrent) {
  const allEnemies = gameState.operatives.filter(
    op => op.teamSlot !== attacker.teamSlot && !op.isDead && op.id !== primaryDefender.id
  );

  if (allEnemies.length === 0) return;

  // 获取 Blast/Torrent 参数（半径由注册表解析；Torrent 半径/控制范围过滤属几何，未强制）
  const blastRadiusParam = getWeaponRuleParam(weapon, 'Blast');
  const blastRadius = blastRadiusParam ? parseInt(blastRadiusParam) : 3;
  const torrentRadiusParam = getWeaponRuleParam(weapon, 'Torrent');
  const torrentRadius = torrentRadiusParam ? parseInt(torrentRadiusParam) : null;

  const ruleName = hasBlast ? `Blast ${blastRadius}"` : (torrentRadius ? `Torrent ${torrentRadius}"` : 'Torrent');
  const ruleDesc = hasBlast
    ? `对主目标 ${blastRadius}" 内、可见的每个次要目标射击（距离需自行判断）`
    : `选主目标${torrentRadius ? ` ${torrentRadius}" 内` : ''}、可见、且不在己方控制范围内的任意数量次要目标（距离/控制范围需自行判断）`;

  // 构建次要目标选择 UI
  let targetOptions = allEnemies.map(op =>
    `<label style="display:flex; align-items:center; gap:6px; padding:4px 0; cursor:pointer;">
      <input type="checkbox" value="${op.id}" />
      <span>${op.name} (${op.wounds}/${op.maxWounds} HP)</span>
    </label>`
  ).join('');

  const body = document.getElementById('combat-modal-body') || document.getElementById('modal-body');
  const modal = document.getElementById('combat-modal');
  if (!body || !modal) return;

  body.innerHTML = `
    <h3 style="color:var(--imperial-gold); text-align:center;">${ruleName} 多目标射击</h3>
    <p style="color:var(--text-muted); font-size:0.8rem; text-align:center; margin-bottom:12px;">
      ${ruleDesc}。物理沙盘距离需玩家自行判断。
    </p>
    <div style="max-height:200px; overflow-y:auto; margin-bottom:12px; padding:8px; background:rgba(0,0,0,0.3); border-radius:6px;">
      ${targetOptions}
    </div>
    <div style="display:flex; gap:10px; justify-content:center;">
      <button class="btn-large" onclick="resolveSecondaries(true)" style="padding:8px 24px; font-size:0.85rem; background:linear-gradient(135deg, var(--green), #2a5a3a);">
        ✓ 确认射击
      </button>
      <button class="btn-large" onclick="resolveSecondaries(false)" style="padding:8px 24px; font-size:0.85rem; background:linear-gradient(135deg, var(--text-muted), #555);">
        ✗ 跳过
      </button>
    </div>
  `;
  modal.style.display = 'flex';
}

/**
 * 解决 Blast/Torrent 次要目标射击
 */
export function resolveSecondaries(confirmed) {
  // 必须先读取 checkbox，再关闭 modal
  const modal = document.getElementById('combat-modal');
  const checkboxes = modal?.querySelectorAll('input[type="checkbox"]:checked');
  const selectedIds = checkboxes ? Array.from(checkboxes).map(cb => cb.value) : [];

  closeModal();

  if (!confirmed) {
    ui.addLog(`[多目标] 跳过次要目标射击。`);
    return;
  }

  if (selectedIds.length === 0) {
    ui.addLog(`[多目标] 未选择任何次要目标。`);
    return;
  }

  const attacker = wizardState.attacker;
  const weapon = wizardState.weapon;

  selectedIds.forEach(targetId => {
    const target = gameState.operatives.find(op => op.id === targetId);
    if (!target || target.isDead) return;

    const ruleLabel = weaponHasRule(weapon, 'Blast') ? 'Blast' : 'Torrent';
    ui.addLog(`\n--- ${ruleLabel} 次要目标: ${target.name} ---`);

    // 每个次要目标独立完整结算（投攻击骰/防御骰/对消/伤害，暴击与普通分算）
    autoResolveSecondaryAttack(attacker, weapon, target);
  });

  ui.renderOperatives?.();
  ui.updateActivePanel?.();
}

/**
 * Devastating 距离前缀 AoE（如 "1" Devastating 1"）：
 * 每次保留暴击时，对目标及距离内可见的其他特工各造成 x 点伤害。
 * 主目标的 per-crit +x 已在 step6 经 critDmg += devVal 处理；此处处理"距离内其他特工"。
 * @param attacker 主攻方
 * @param primaryDefender 主目标
 * @param weapon 武器
 * @param devVal x（每次暴击的伤害）
 * @param aoeDistance 距离前缀（英寸，几何靠玩家自判）
 * @param retainedCrits 主目标保留的暴击数
 */
function handleDevastatingAoe(attacker, primaryDefender, weapon, devVal, aoeDistance, retainedCrits) {
  const allEnemies = gameState.operatives.filter(
    op => op.teamSlot !== attacker.teamSlot && !op.isDead && op.id !== primaryDefender.id
  );
  if (allEnemies.length === 0 || retainedCrits <= 0) return;

  const dmgPerTarget = retainedCrits * devVal;
  const targetOptions = allEnemies.map(op =>
    `<label style="display:flex; align-items:center; gap:6px; padding:4px 0; cursor:pointer;">
      <input type="checkbox" value="${op.id}" />
      <span>${op.name} (${op.wounds}/${op.maxWounds} HP)</span>
    </label>`
  ).join('');

  const body = document.getElementById('combat-modal-body') || document.getElementById('modal-body');
  const modal = document.getElementById('combat-modal');
  if (!body || !modal) return;

  body.innerHTML = `
    <h3 style="color:var(--imperial-gold); text-align:center;">毁灭 (Devastating) 溅射</h3>
    <p style="color:var(--text-muted); font-size:0.8rem; text-align:center; margin-bottom:12px;">
      保留 ${retainedCrits} 个暴击，对主目标 ${aoeDistance}" 内、可见的其他特工各造成 <b>${dmgPerTarget}</b> 点伤害（距离需自行判断）。
    </p>
    <div style="max-height:200px; overflow-y:auto; margin-bottom:12px; padding:8px; background:rgba(0,0,0,0.3); border-radius:6px;">
      ${targetOptions}
    </div>
    <div style="display:flex; gap:10px; justify-content:center;">
      <button class="btn-large" onclick="resolveDevastationAoe(true)" style="padding:8px 24px; font-size:0.85rem; background:linear-gradient(135deg, var(--green), #2a5a3a);">✓ 确认溅射</button>
      <button class="btn-large" onclick="resolveDevastationAoe(false)" style="padding:8px 24px; font-size:0.85rem; background:linear-gradient(135deg, var(--text-muted), #555);">✗ 跳过</button>
    </div>
  `;
  wizardState._devastationAoeDmg = dmgPerTarget;
  modal.style.display = 'flex';
}

export function resolveDevastationAoe(confirmed) {
  const modal = document.getElementById('combat-modal');
  const checkboxes = modal?.querySelectorAll('input[type="checkbox"]:checked');
  const selectedIds = checkboxes ? Array.from(checkboxes).map(cb => cb.value) : [];
  const dmgPerTarget = wizardState._devastationAoeDmg || 0;

  closeModal();

  if (!confirmed) { ui.addLog(`[毁灭] 跳过 AoE 溅射。`); return; }
  if (selectedIds.length === 0) { ui.addLog(`[毁灭] 未选择溅射目标。`); return; }

  ui.addLog(`\n--- Devastating 溅射 (${dmgPerTarget}/目标) ---`);
  selectedIds.forEach(targetId => {
    const target = gameState.operatives.find(op => op.id === targetId);
    if (!target || target.isDead) return;
    const oldW = target.wounds;
    const actual = target.applyWounds(dmgPerTarget, null, 'auto', '毁灭溅射');
    ui.addLog(`  ${target.name}: ${actual} 伤害 (${oldW}→${target.wounds} HP)`);
    if (target.isDead) ui.addLog(`  💀 ${target.name} 被击杀！`);
  });
  ui.renderOperatives?.();
  ui.updateActivePanel?.();
}

// ==========================================
//          Fight Wizard
// ==========================================

export function openFightWizard() {
  playSound('click');
  const op = gameState.activeAgent;
  if (!op) return;

  evaluatePloyInteractions('before_fight', op, () => {
    const modalContent = document.querySelector('#combat-modal .modal-content');
    if (modalContent) {
      modalContent.style.backgroundImage = `linear-gradient(rgba(11, 17, 32, 0.85), rgba(11, 17, 32, 0.95)), url("${getAssetPath('assets/images/backgrounds/bg_melee_action.jpg')}")`;
      modalContent.style.backgroundSize = 'cover';
      modalContent.style.backgroundPosition = 'center';
    }

    window.pushStateSnapshot?.(`Start Fight: ${op.name}`);

    Object.assign(wizardState, {
      actionType: 'fight',
      step: 1,
      attacker: op,
      defender: null,
      weapon: op.weapons.filter(w => !w.isRanged)[0] || null,
      meleeDefWeapon: null, // 防守方近战武器 (步骤 2 选择)
      inMeleeRange: true,
      hasFallenBack: false,
      mode: gameState.globalRollMode,
      activeAttackerDice: [],
      activeDefenderDice: [],
      attackRolls: [],
      defenseRolls: [],
      attackRerolledIndices: [],
      weaponRerollUsed: false,
      weaponRerollRule: null,
      meleeTurn: 'attacker',
      meleeLogs: '',
      drRolls: [],
    });

    if (!wizardState.weapon) {
      if (showToast) showToast('该特工没有配备任何近战武器！', 'warning');
      return;
    }

    openModal();
    renderFightStep();
  });
}

// Note: selectFightDefender is the same pattern as the shoot version but calls renderFightStep
export function selectFightDefender(opId) {
  playSound('click');
  wizardState.defender = gameState.operatives.find(o => o.id === opId);
  renderFightStep();
}

// Note: selectFightWeapon is the same pattern as the shoot version but calls renderFightStep
export function selectFightWeapon(idx) {
  playSound('click');
  wizardState.weapon = wizardState.attacker.weapons.filter(w => !w.isRanged)[idx];
  renderFightStep();
}

export function selectDefFightWeapon(idx) {
  playSound('click');
  wizardState.meleeDefWeapon = wizardState.defender.weapons.filter(w => !w.isRanged)[idx];
  renderFightStep();
}

export function renderFightStep() {
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');
  const nextBtn = document.getElementById('modal-btn-next');
  const cancelBtn = document.getElementById('modal-btn-cancel');

  nextBtn.onclick = nextModalStep;
  cancelBtn.style.display = 'inline-block';

  if (wizardState.step === 1) {
    title.textContent = '近战结算 - 步骤 1: 选择目标';
    const attackerSlot = wizardState.attacker.teamSlot >= 0 ? wizardState.attacker.teamSlot : getTeamSlot(wizardState.attacker.faction);
    // 规则 L151: 近战只要求目标在控制范围内，完全不受 Conceal 影响
    const targets = gameState.operatives.filter(o => o.teamSlot !== attackerSlot && !o.isDead);

    if (targets.length === 0) {
      body.innerHTML = '<p style="color:var(--red);">场上已无合法的敌方存活目标。</p>';
      nextBtn.disabled = true;
      return;
    }

    let listHtml = '<div class="weapon-picker-list">';
    targets.forEach(t => {
      const injuredTag = t.isInjured ? ' <span style="color:var(--red); font-size:0.75rem;">[重伤]</span>' : '';
      const poisonTag = t.poisonTokens > 0 ? ' <span style="color:#7ab88a; font-size:0.75rem;">[毒素]</span>' : '';
      const avatarUrl = getOperativeAvatarUrl(t.id, t.faction);
      listHtml += `
        <div class="weapon-pick-item ${wizardState.defender && wizardState.defender.id === t.id ? 'selected' : ''}" role="button" tabindex="0" onclick="selectFightDefender('${t.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectFightDefender('${t.id}')}" style="flex-direction: row; justify-content: flex-start; align-items: center; gap: 20px;">
          <img src="${avatarUrl}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid ${t.teamSlot === 0 ? 'var(--sm-accent)' : 'var(--pm-accent)'}; flex-shrink: 0;" alt="Avatar">
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <span class="weapon-pick-name">${t.name}${injuredTag}${poisonTag}</span>
            <div class="weapon-pick-stats">
              <span class="stat-badge" style="color: #ff4444;">Wounds: ${t.wounds}/${t.maxWounds}</span> |
              <span class="stat-badge" style="color: #ffaa00;">Defense: ${t.df}</span>
            </div>
          </div>
        </div>
      `;
    });
    listHtml += '</div>';

    body.innerHTML = `
      <p style="margin-bottom:10px;">选择你要交战的敌方特工 (必须在交战距离内)：</p>
      ${listHtml}
    `;
    nextBtn.textContent = '判定近战条件';
    nextBtn.disabled = !wizardState.defender;
  }

  else if (wizardState.step === 2) {
    title.textContent = '近战结算 - 步骤 2: 选择近战武器';
    const meleeWeapons = wizardState.attacker.weapons.filter(w => !w.isRanged);
    const defMeleeWeapons = wizardState.defender.weapons.filter(w => !w.isRanged);

    // Injured 惩罚：武器 Hit -1
    const isInjuredAttacker = wizardState.attacker.isInjured;
    const isInjuredDefender = wizardState.defender.isInjured;

    let listHtml = '<div class="weapon-picker-list">';
    meleeWeapons.forEach((w, idx) => {
      const hitStat = isInjuredAttacker ? `${w.ts}+ <span style="color:var(--red); font-size:0.7rem;">→ ${w.ts + 1}+</span>` : `${w.ts}+`;
      const rulesStr = w.rules && w.rules.length > 0 ? ` | ${w.rules.map(translateRule).join(', ')}` : '';
      listHtml += `
        <div class="weapon-pick-item ${wizardState.weapon.name === w.name ? 'selected' : ''}" role="button" tabindex="0" onclick="selectFightWeapon(${idx})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectFightWeapon(${idx})}">
          <span class="weapon-pick-name">${w.name}</span>
          <div class="weapon-pick-stats">
            <span class="stat-badge" style="color: #ffaa00;">Attacks: ${w.attacks}</span>
            <span class="stat-badge" style="color: #44aaff;">Skill: ${hitStat}</span>
            <span class="stat-badge" style="color: #ff4444;">Damage: ${w.normalDamage}/${w.criticalDamage}</span>
            ${rulesStr ? `<span class="stat-badge" style="color: #aaffaa;">${rulesStr.replace(' | ', '').replace('| ', '')}</span>` : ''}
          </div>
        </div>
      `;
    });
    listHtml += '</div>';

    // 防守方武器选择 (规则 L153: 双方各选一把近战武器)
    let defListHtml = '';
    if (defMeleeWeapons.length > 1) {
      defListHtml = `
        <p style="margin:12px 0 8px; color:var(--imperial-gold); font-size:0.85rem;">🛡️ 防守方 (${wizardState.defender.name}) 选择近战武器：</p>
        <div class="weapon-picker-list">
      `;
      defMeleeWeapons.forEach((w, idx) => {
        const hitStat = isInjuredDefender ? `${w.ts}+ <span style="color:var(--red); font-size:0.7rem;">→ ${w.ts + 1}+</span>` : `${w.ts}+`;
        const rulesStr = w.rules && w.rules.length > 0 ? ` | ${w.rules.map(translateRule).join(', ')}` : '';
        const isSelected = wizardState.meleeDefWeapon?.name === w.name;
        defListHtml += `
          <div class="weapon-pick-item ${isSelected ? 'selected' : ''}" role="button" tabindex="0" onclick="selectDefFightWeapon(${idx})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectDefFightWeapon(${idx})}">
            <span class="weapon-pick-name">${w.name}</span>
            <div class="weapon-pick-stats">
              <span class="stat-badge" style="color: #ffaa00;">Attacks: ${w.attacks}</span>
              <span class="stat-badge" style="color: #44aaff;">Skill: ${hitStat}</span>
              <span class="stat-badge" style="color: #ff4444;">Damage: ${w.normalDamage}/${w.criticalDamage}</span>
              ${rulesStr ? `<span class="stat-badge" style="color: #aaffaa;">${rulesStr.replace(' | ', '').replace('| ', '')}</span>` : ''}
            </div>
          </div>
        `;
      });
      defListHtml += '</div>';
    } else if (defMeleeWeapons.length === 1) {
      // 只有一把近战武器，自动选中
      if (!wizardState.meleeDefWeapon) wizardState.meleeDefWeapon = defMeleeWeapons[0];
      defListHtml = `<p style="color:var(--text-muted); font-size:0.8rem; margin-top:8px;">防守方武器: ${defMeleeWeapons[0].name}</p>`;
    }

    body.innerHTML = `
      <p style="margin-bottom:10px;">选择攻击方近战武器：</p>
      ${listHtml}
      ${defListHtml}
    `;
    nextBtn.textContent = '判定交战距离与退却';
    nextBtn.disabled = false;
  }

  else if (wizardState.step === 3) {
    title.textContent = '近战结算 - 步骤 3: 距离与退却判定';
    body.innerHTML = `
      <p style="margin-bottom: 12px; color:var(--text-muted);">回答以下判定问题以完成结算：</p>

      <div class="qa-card">
        <div class="qa-question">1. 目标是否在你的交战距离内（即 1 英寸 / 1🔺 范围内）？</div>
        <div class="qa-options">
          <button class="qa-btn ${wizardState.inMeleeRange ? 'selected' : ''}" onclick="setQA('inMeleeRange', true)">是 (在交战距离内)</button>
          <button class="qa-btn ${!wizardState.inMeleeRange ? 'selected' : ''}" onclick="setQA('inMeleeRange', false)">否 (交战距离不足，无法近战)</button>
        </div>
      </div>

      <div class="qa-card" style="margin-top:10px;">
        <div class="qa-question">2. 本回合该特工是否执行过【退却 (Fall Back)】动作？</div>
        <div class="qa-options">
          <button class="qa-btn ${!wizardState.hasFallenBack ? 'selected' : ''}" onclick="setQA('hasFallenBack', false)">否 (允许近战)</button>
          <button class="qa-btn ${wizardState.hasFallenBack ? 'selected' : ''}" onclick="setQA('hasFallenBack', true)">是 (已退却，无法近战)</button>
        </div>
      </div>
    `;
    nextBtn.textContent = '双方近战掷骰';
    nextBtn.disabled = false;
  }

  else if (wizardState.step === 4) {
    title.textContent = '近战结算 - 步骤 4: 双方近战掷骰';

    body.innerHTML = `
      <div class="melee-grid" style="margin-bottom: 16px; display:${wizardState.mode === 'manual' ? 'none' : 'grid'};" id="melee-rolling-zone">
          <div class="melee-pool-card">
            <div class="melee-pool-title">攻击方 (${wizardState.attacker.name})</div>
            <div class="melee-dice-pool" id="melee-att-pool">
              <span style="color:var(--text-muted); font-size:0.8rem;">等待掷骰...</span>
            </div>
          </div>
  
          <div class="melee-pool-card">
            <div class="melee-pool-title">防守方 (${wizardState.defender.name})</div>
            <div class="melee-dice-pool" id="melee-def-pool">
              <span style="color:var(--text-muted); font-size:0.8rem;">等待掷骰...</span>
            </div>
          </div>
        </div>
  
        <div id="melee-roll-btn-container" style="display:${wizardState.mode === 'manual' ? 'none' : 'flex'}; justify-content:center; margin:12px 0;">
          <button class="btn-large" id="btn-roll-melee" onclick="rollMeleeDice()">点击 掷骰</button>
        </div>

        <div id="manual-melee-input" style="display:${wizardState.mode === 'manual' ? 'block' : 'none'}; background:var(--dark-card); padding:12px; border-radius:8px; border:1px solid var(--panel-border);">
          ${buildDiceKeypadHtml('manual-melee-att-val', `录入攻击方 (${wizardState.attacker.name}) 的 ${wizardState.weapon.attacks} 个掷骰`, wizardState.weapon.attacks)}
          ${buildDiceKeypadHtml('manual-melee-def-val', `录入防守方 (${wizardState.defender.name}) 的 ${wizardState.defender.weapons.filter(w => !w.isRanged)[0]?.attacks || 4} 个掷骰`, wizardState.defender.weapons.filter(w => !w.isRanged)[0]?.attacks || 4)}
        </div>
      `;

    if (wizardState.activeAttackerDice.length > 0 || wizardState.activeDefenderDice.length > 0) {
      nextBtn.disabled = false;
      renderMeleeRollsView();
    } else {
      nextBtn.disabled = true;
    }
    nextBtn.textContent = '进入伤害/格挡分配';
  }

  else if (wizardState.step === 5) {
    title.textContent = '近战结算 - 步骤 5: 伤害与格挡交替分配';

    // 如果当前行动方已经没有任何可用的成功骰，自动将结算权移交给对方
    if (wizardState.meleeTurn === 'attacker' && wizardState.activeAttackerDice.every(d => d.used)) {
      wizardState.meleeTurn = 'defender';
    } else if (wizardState.meleeTurn === 'defender' && wizardState.activeDefenderDice.every(d => d.used)) {
      wizardState.meleeTurn = 'attacker';
    }

    const attackerAlive = wizardState.attacker.wounds > 0;
    const defenderAlive = wizardState.defender.wounds > 0;
    const hasAttDice = wizardState.activeAttackerDice.some(d => !d.used);
    const hasDefDice = wizardState.activeDefenderDice.some(d => !d.used);

    if (!attackerAlive || !defenderAlive || (!hasAttDice && !hasDefDice)) {
      let endReason = '';
      if (!attackerAlive && !defenderAlive) endReason = '双方同归于尽！';
      else if (!attackerAlive) endReason = `攻击方 [${wizardState.attacker.name}] 已阵亡！`;
      else if (!defenderAlive) endReason = `防守方 [${wizardState.defender.name}] 已阵亡！`;
      else endReason = '双方所有成功骰已分配完毕。';

      body.innerHTML = `
        <!-- 双方状态卡 -->
        ${getMeleeDuelHeaderHtml()}

        <div class="qa-card" style="text-align: center; margin-top: 16px;">
          <h4 style="color: var(--sm-accent); margin-bottom: 8px;">战斗结束</h4>
          <p>${endReason}</p>
        </div>

        <div class="melee-interactive-log" id="melee-int-log" style="margin-top:12px; height: 100px;">
          ${wizardState.meleeLogs}
        </div>
      `;

      nextBtn.textContent = '完成近战结算';
      nextBtn.disabled = false;
      nextBtn.onclick = confirmFightResult;
      cancelBtn.style.display = 'none';
      return;
    }

    const attDiceClass = getDiceClass(wizardState.attacker.faction);
    const defDiceClass = getDiceClass(wizardState.defender.faction);

    let attackerDiceHtml = '';
    wizardState.activeAttackerDice.forEach((d, idx) => {
      let cls = `melee-dice-btn ${attDiceClass}`;
      if (d.isCrit) cls += ' crit';
      if (d.used) cls += ' used';

      const isSelected = wizardState.selectedMeleeDice && wizardState.selectedMeleeDice.side === 'attacker' && wizardState.selectedMeleeDice.idx === idx;
      const style = isSelected ? 'outline: 3px solid #6a9ad4; transform: scale(1.15); box-shadow: 0 0 15px rgba(96,165,250,0.8); z-index: 2;' : '';

      attackerDiceHtml += `<button class="${cls}" style="${style}" onclick="chooseMeleeDice('attacker', ${idx})">${d.val}</button>`;
    });
    if (wizardState.activeAttackerDice.length === 0) attackerDiceHtml = '<span style="color:var(--text-muted); font-size:0.8rem;">无成功骰</span>';

    let defenderDiceHtml = '';
    wizardState.activeDefenderDice.forEach((d, idx) => {
      let cls = `melee-dice-btn ${defDiceClass}`;
      if (d.isCrit) cls += ' crit';
      if (d.used) cls += ' used';

      const isSelected = wizardState.selectedMeleeDice && wizardState.selectedMeleeDice.side === 'defender' && wizardState.selectedMeleeDice.idx === idx;
      const style = isSelected ? 'outline: 3px solid var(--pm-accent); transform: scale(1.15); box-shadow: 0 0 15px rgba(74,124,89,0.8); z-index: 2;' : '';

      defenderDiceHtml += `<button class="${cls}" style="${style}" onclick="chooseMeleeDice('defender', ${idx})">${d.val}</button>`;
    });
    if (wizardState.activeDefenderDice.length === 0) defenderDiceHtml = '<span style="color:var(--text-muted); font-size:0.8rem;">无成功骰</span>';

    const turnCN = wizardState.meleeTurn === 'attacker' ? '攻击方' : '防守方';
    const turnFaction = wizardState.meleeTurn === 'attacker' ? wizardState.attacker.faction : wizardState.defender.faction;
    const turnColor = `var(${getFactionThemeVar(turnFaction)})`;

    // 渲染分配动作选择卡
    let choiceCardHtml = '';
    if (wizardState.selectedMeleeDice) {
      const { side, idx } = wizardState.selectedMeleeDice;
      const diceList = side === 'attacker' ? wizardState.activeAttackerDice : wizardState.activeDefenderDice;
      const dice = diceList[idx];

      let activeWeapon;
      if (side === 'attacker') {
        activeWeapon = wizardState.weapon;
      } else {
        activeWeapon = wizardState.defender.weapons.filter(w => !w.isRanged)[0] || new Weapon('重拳 (Fists)', 4, 3, 3, 4, false, null, []);
      }

      const dmg = dice.isCrit ? activeWeapon.criticalDamage : activeWeapon.normalDamage;

      const opponentDiceList = side === 'attacker' ? wizardState.activeDefenderDice : wizardState.activeAttackerDice;
      const hasOpponentDice = opponentDiceList.some(d => !d.used);

      // ---- Brutal 规则视觉提示 ----
      // 对手的武器带 Brutal 时，你只能用暴击骰格挡。
      const opponentWeaponForParry = side === 'attacker'
        ? (wizardState.defender.weapons.filter(w => !w.isRanged)[0] || null)
        : wizardState.weapon;
      const opponentHasBrutal = opponentWeaponForParry && weaponMods(opponentWeaponForParry).defenseBlockRequiresCrit;
      const brutalBlocksParry = opponentHasBrutal && !dice.isCrit;
      const brutalNote = opponentHasBrutal
        ? (dice.isCrit
          ? '<div style="margin-top:8px; font-size:0.75rem; color:#22c55e;">🔥 残暴 (Brutal) 生效：你选择了暴击骰，可以格挡！</div>'
          : '<div style="margin-top:8px; font-size:0.75rem; color:#ef4444;">🔥 残暴 (Brutal) 生效：只能用暴击骰格挡！此骰不可用于 Parry。</div>')
        : '';

      choiceCardHtml = `
        <div class="melee-choice-card" style="position:relative; background: linear-gradient(180deg, #2a2d35, #1e2128); border: 2px solid ${turnColor}; border-radius: 12px; padding: 16px; margin-bottom: 16px; text-align: center; box-shadow: 0 0 20px rgba(0,0,0,0.5);">
          <div style="font-weight: bold; font-size: 0.95rem; margin-bottom: 12px; color: #fff;">
            🎯 已选中点数 <span style="display:inline-block; padding: 2px 8px; border-radius: 4px; background: ${side === 'attacker' ? 'rgba(74,106,154,0.3)' : 'rgba(74,124,89,0.3)'}; color: ${side === 'attacker' ? '#6a9ad4' : 'var(--pm-accent)'}; font-weight: 900; font-family:'Pirata One',serif;">${dice.val}${dice.isCrit ? ' (⚡暴击)' : ''}</span>，请选择分配动作：
          </div>

          <div style="display: flex; gap: 16px; justify-content: center;">
            <button onclick="resolveMeleeChoice('strike')" class="melee-action-btn strike-btn" style="flex: 1; padding: 12px 15px; font-size: 0.95rem; font-weight: bold; color: #fff; background: linear-gradient(135deg, var(--red), #5a2020); border: 2px solid #b84c4c; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 15px rgba(184, 76, 76, 0.3); transition: all 0.2s ease;">
              ⚔️ 打击 (STRIKE)<br>
              <span style="font-size: 0.75rem; font-weight: normal; opacity: 0.9;">造成 ${dmg} 点伤害</span>
            </button>

            <button onclick="resolveMeleeChoice('parry')" class="melee-action-btn parry-btn" ${(!hasOpponentDice || brutalBlocksParry) ? 'disabled style="opacity: 0.4; cursor: not-allowed;"' : ''} style="flex: 1; padding: 12px 15px; font-size: 0.95rem; font-weight: bold; color: #fff; background: linear-gradient(135deg, #4a6a9a, #3a5580); border: 2px solid #6a9ad4; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 15px rgba(74, 106, 154, 0.3); transition: all 0.2s ease;">
              🛡️ 格挡 (PARRY)<br>
              <span style="font-size: 0.75rem; font-weight: normal; opacity: 0.9;">消去对方一个成功骰</span>
            </button>
          </div>

          ${brutalNote}

          <div style="margin-top: 10px;">
            <button onclick="cancelMeleeChoice()" class="modal-btn" style="padding: 4px 12px; font-size: 0.75rem; background: transparent; border: 1px solid rgba(255,255,255,0.2); color: var(--text-muted);">
              取消选择
            </button>
          </div>
        </div>
      `;
    }

    body.innerHTML = `
      <!-- 双方实时血条与头像 -->
      ${getMeleeDuelHeaderHtml()}

      <p style="margin-bottom: 10px; font-weight: bold; text-align: center; color: ${turnColor}; font-size: 1.05rem;">
        👉 当前轮到：【${turnCN}】分配骰子
      </p>

      ${choiceCardHtml}

      <div class="melee-grid" style="margin-bottom: 16px;">
        <div class="melee-pool-card">
          <div class="melee-pool-title" style="display:flex; justify-content:space-between;">
            <span>攻击方成功骰</span>
            <span style="font-size:0.7rem; color:var(--text-muted);">HP: ${wizardState.attacker.wounds}</span>
          </div>
          <div class="melee-dice-pool">
            ${attackerDiceHtml}
          </div>
        </div>

        <div class="melee-pool-card">
          <div class="melee-pool-title" style="display:flex; justify-content:space-between;">
            <span>防守方成功骰</span>
            <span style="font-size:0.7rem; color:var(--text-muted);">HP: ${wizardState.defender.wounds}</span>
          </div>
          <div class="melee-dice-pool">
            ${defenderDiceHtml}
          </div>
        </div>
      </div>

      <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom: 6px;">
        💡 <b>分配指南:</b> 点击你的高亮骰子，若对方有剩余成功骰，可选择格挡(Parry)消去对方一个未使用的成功骰，或选择打击(Strike)对敌方特工造成伤害。
      </div>

      <div class="melee-interactive-log" id="melee-int-log">
        <!-- 滚动记录 -->
      </div>
    `;

    const logPanel = document.getElementById('melee-int-log');
    if (logPanel) {
      logPanel.innerHTML = wizardState.meleeLogs;
      logPanel.scrollTop = logPanel.scrollHeight;
    }

    nextBtn.textContent = '交替进行中...';
    nextBtn.disabled = true;
  }
}

export function rollMeleeDice() {
  const nextBtn = document.getElementById('modal-btn-next');
  const attPool = document.getElementById('melee-att-pool');
  const defPool = document.getElementById('melee-def-pool');
  const btn = document.getElementById('btn-roll-melee');

  btn.style.display = 'none';
  nextBtn.disabled = true;

  const attDiceClass = getDiceClass(wizardState.attacker.faction);
  const defDiceClass = getDiceClass(wizardState.defender.faction);

  // 1. 初始化滚动的占位骰子
  attPool.innerHTML = '';
  skipDiceAnimation = false;
  diceAnimationTimeouts = [];
  const totalAttacks = wizardState.weapon.attacks;
  for (let i = 0; i < totalAttacks; i++) {
    const dice = document.createElement('div');
    dice.className = `kt-dice-cube ${attDiceClass} rolling`;
    dice.textContent = '?';
    attPool.appendChild(dice);
  }

  const defMeleeWeapon = wizardState.defender.weapons.filter(w => !w.isRanged)[0] || new Weapon('重拳 (Fists)', 3, 3, 3, 4, false);
  const totalDefAttacks = defMeleeWeapon.attacks;
  defPool.innerHTML = '';
  for (let i = 0; i < totalDefAttacks; i++) {
    const dice = document.createElement('div');
    dice.className = `kt-dice-cube ${defDiceClass} rolling`;
    dice.textContent = '?';
    defPool.appendChild(dice);
  }

  // Add skip button
  const skipBtn = document.createElement('button');
  skipBtn.className = 'modal-btn';
  skipBtn.style.cssText = 'padding: 6px 16px; font-size: 0.75rem; margin-top: 8px; min-width: auto;';
  skipBtn.textContent = '跳过动画 (Skip)';
  skipBtn.onclick = () => {
    skipDiceAnimation = true;
    diceAnimationTimeouts.forEach(id => clearTimeout(id));
    diceAnimationTimeouts = [];
    // Settle all remaining attacker dice
    const attCubes = attPool.getElementsByClassName('kt-dice-cube');
    const skipAttEffTs = getEffectiveTs(wizardState.weapon, wizardState.attacker);
    const skipDefEffTs = getEffectiveTs(defMeleeWeapon, wizardState.defender);
    let hasMeleePenaltyFail = false;
    for (let i = attSettleIndex; i < totalAttacks; i++) {
      const val = Math.floor(Math.random() * 6) + 1;
      finalAttRolls.push(val);
      const cube = attCubes[i];
      if (cube) {
        cube.classList.remove('rolling');
        cube.textContent = val;
        if (val === 6) cube.classList.add('crit-dice');
        else if (val < skipAttEffTs) {
          cube.classList.add('fail-dice');
          if (val >= wizardState.weapon.ts) {
            const badge = document.createElement('div');
            badge.style.cssText = 'position: absolute; bottom: -10px; left: -10px; background: var(--red); border-radius: 50%; width: 22px; height: 22px; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 1.5px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.5); z-index: 5;';
            badge.textContent = '+1';
            cube.appendChild(badge);
            hasMeleePenaltyFail = true;
          }
        }
      }
    }
    // Settle all remaining defender dice
    const defCubes = defPool.getElementsByClassName('kt-dice-cube');
    for (let i = defSettleIndex; i < totalDefAttacks; i++) {
      const val = Math.floor(Math.random() * 6) + 1;
      finalDefRolls.push(val);
      const cube = defCubes[i];
      if (cube) {
        cube.classList.remove('rolling');
        cube.textContent = val;
        if (val === 6) cube.classList.add('crit-dice');
        else if (val < skipDefEffTs) {
          cube.classList.add('fail-dice');
          if (val >= defMeleeWeapon.ts) {
            const badge = document.createElement('div');
            badge.style.cssText = 'position: absolute; bottom: -10px; left: -10px; background: var(--red); border-radius: 50%; width: 22px; height: 22px; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 1.5px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.5); z-index: 5;';
            badge.textContent = '+1';
            cube.appendChild(badge);
            hasMeleePenaltyFail = true;
          }
        }
      }
    }
    finishMeleeRolls();
    if (hasMeleePenaltyFail) {
      playSound('epic_fail');
    }
  };
  // Append to a common parent that holds the button
  const meleeBody = document.getElementById('modal-body');
  if (meleeBody) meleeBody.appendChild(skipBtn);

  ui.triggerCombatVisual("⚔️ MELEE CLASH!", "shoot");
  playSound('dice_roll');

  const finalAttRolls = [];
  const finalDefRolls = [];
  let attSettleIndex = 0;
  let defSettleIndex = 0;

  function settleAttackerDice() {
    if (skipDiceAnimation) return;
    if (attSettleIndex < totalAttacks) {
      const val = Math.floor(Math.random() * 6) + 1;
      finalAttRolls.push(val);

      const diceCubes = attPool.getElementsByClassName('kt-dice-cube');
      const cube = diceCubes[attSettleIndex];
      cube.classList.remove('rolling');
      cube.textContent = val;

      const attEffTs = getEffectiveTs(wizardState.weapon, wizardState.attacker);
      if (val === 6) {
        cube.classList.add('crit-dice');
        playSound('crit');
      } else if (val < attEffTs) {
        cube.classList.add('fail-dice');
        playSound('dice_drop');
        if (val >= wizardState.weapon.ts) {
          const badge = document.createElement('div');
          badge.style.cssText = 'position: absolute; bottom: -10px; left: -10px; background: var(--red); border-radius: 50%; width: 22px; height: 22px; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 1.5px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.5); z-index: 5;';
          badge.textContent = '+1';
          cube.appendChild(badge);
          playSound('epic_fail');
        }
      } else {
        playSound('dice_drop');
      }

      attSettleIndex++;
      scheduleTimeout(settleAttackerDice, 400);
    } else {
      // Attacker finished. Start settling Defender.
      settleDefenderDice();
    }
  }

  function settleDefenderDice() {
    if (skipDiceAnimation) return;
    if (defSettleIndex < totalDefAttacks) {
      const val = Math.floor(Math.random() * 6) + 1;
      finalDefRolls.push(val);

      const diceCubes = defPool.getElementsByClassName('kt-dice-cube');
      const cube = diceCubes[defSettleIndex];
      cube.classList.remove('rolling');
      cube.textContent = val;

      const defEffTs = getEffectiveTs(defMeleeWeapon, wizardState.defender);
      if (val === 6) {
        cube.classList.add('crit-dice');
        playSound('crit');
      } else if (val < defEffTs) {
        cube.classList.add('fail-dice');
        playSound('dice_drop');
        if (val >= defMeleeWeapon.ts) {
          const badge = document.createElement('div');
          badge.style.cssText = 'position: absolute; bottom: -10px; left: -10px; background: var(--red); border-radius: 50%; width: 22px; height: 22px; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 1.5px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.5); z-index: 5;';
          badge.textContent = '+1';
          cube.appendChild(badge);
          playSound('epic_fail');
        }
      } else {
        playSound('dice_drop');
      }

      defSettleIndex++;
      scheduleTimeout(settleDefenderDice, 400);
    } else {
      finishMeleeRolls();
    }
  }

  function finishMeleeRolls() {
    skipBtn.remove();
    btn.style.display = 'none';
    // Injured 命中惩罚: TS/WS +1 (6 永远是暴击)
    const attInjuryPenalty = (wizardState.attacker && wizardState.attacker.isInjured) ? 1 : 0;
    const defInjuryPenalty = (wizardState.defender && wizardState.defender.isInjured) ? 1 : 0;
    const effectiveAttTs = getEffectiveTs(wizardState.weapon, wizardState.attacker);
    const effectiveDefTs = getEffectiveTs(defMeleeWeapon, wizardState.defender);
    // 暴击阈值 (支持 Lethal x+，默认 6)，存储供重投路径复用
    const attCritThreshold = meleeCritThreshold(wizardState.weapon);
    const defCritThreshold = meleeCritThreshold(defMeleeWeapon);
    wizardState.meleeAttCritThreshold = attCritThreshold;
    wizardState.meleeDefCritThreshold = defCritThreshold;

    // 存储所有投骰结果（包括失败的）用于重投
    wizardState.allAttackerRolls = finalAttRolls.map((val, idx) => ({
      val,
      isSuccess: val >= effectiveAttTs || val >= attCritThreshold,
      isCrit: val >= attCritThreshold,
      originalIdx: idx
    }));
    wizardState.allDefenderRolls = finalDefRolls.map((val, idx) => ({
      val,
      isSuccess: val >= effectiveDefTs || val >= defCritThreshold,
      isCrit: val >= defCritThreshold,
      originalIdx: idx
    }));

    wizardState.activeAttackerDice = finalAttRolls
      .filter(val => val >= effectiveAttTs || val >= attCritThreshold)
      .map(val => ({ val, isCrit: val >= attCritThreshold, used: false }));

    wizardState.activeDefenderDice = finalDefRolls
      .filter(val => val >= effectiveDefTs || val >= defCritThreshold)
      .map(val => ({ val, isCrit: val >= defCritThreshold, used: false }));

    // 存储有效的 TS 值用于重投计算
    wizardState.meleeEffectiveAttTs = effectiveAttTs;
    wizardState.meleeEffectiveDefTs = effectiveDefTs;
    wizardState.meleeDefWeapon = defMeleeWeapon;

    // Dark Zealotry 已移除 (虚构 ploy，不在官方规则中)
    wizardState.darkZealotryUsed = { attacker: false, defender: false };
    const attHasDarkZealotry = false;
    const defHasDarkZealotry = false;

    const attFailedCount = wizardState.allAttackerRolls.filter(r => !r.isSuccess).length;
    const defFailedCount = wizardState.allDefenderRolls.filter(r => !r.isSuccess).length;

    // 显示重投按钮（如果有失败骰子且策略激活）
    const body = document.getElementById('modal-body');
    if (body && ((attHasDarkZealotry && attFailedCount > 0) || (defHasDarkZealotry && defFailedCount > 0))) {
      const rerollDiv = document.createElement('div');
      rerollDiv.id = 'melee-reroll-section';
      rerollDiv.style.cssText = 'margin-top: 12px; padding: 10px; background: rgba(139, 26, 26, 0.15); border: 1px solid var(--leg-accent, #c94444); border-radius: 8px;';

      let rerollHtml = '<div style="font-weight: bold; color: #c94444; margin-bottom: 8px;">⚔️ 黑暗狂热 (Dark Zealotry) — 可重投 1 个失败骰</div>';

      if (attHasDarkZealotry && attFailedCount > 0) {
        rerollHtml += `<button class="modal-btn" style="margin-right: 8px; background: linear-gradient(135deg, #6a9ad4, #4a7ab4);" onclick="rerollMeleeDice('attacker')">攻击方重投 (${attFailedCount} 个失败)</button>`;
      }
      if (defHasDarkZealotry && defFailedCount > 0) {
        rerollHtml += `<button class="modal-btn" style="background: linear-gradient(135deg, #4a7c59, #2a5c39);" onclick="rerollMeleeDice('defender')">防守方重投 (${defFailedCount} 个失败)</button>`;
      }

      rerollDiv.innerHTML = rerollHtml;
      body.appendChild(rerollDiv);
    }

    // 动画结束后，重新渲染为可点击交互的骰子视图（包含重投角标等）
    renderMeleeRollsView();

    nextBtn.disabled = false;
  }

  scheduleTimeout(settleAttackerDice, 1200);
}

// 黑暗狂热: 重投 1 个失败近战骰
export function rerollMeleeDice(side) {
  if (wizardState.darkZealotryUsed[side]) {
    if (showToast) showToast('每方只能使用 1 次黑暗狂热重投！', 'warning');
    return;
  }

  const allRolls = side === 'attacker' ? wizardState.allAttackerRolls : wizardState.allDefenderRolls;
  const failedRolls = allRolls.filter(r => !r.isSuccess);

  if (failedRolls.length === 0) {
    if (showToast) showToast('没有可重投的失败骰！', 'warning');
    return;
  }

  // 随机选择 1 个失败骰重投
  const rerollIdx = Math.floor(Math.random() * failedRolls.length);
  const rerollTarget = failedRolls[rerollIdx];
  const effectiveTs = side === 'attacker' ? wizardState.meleeEffectiveAttTs : wizardState.meleeEffectiveDefTs;
  const critThreshold = side === 'attacker'
    ? (wizardState.meleeAttCritThreshold || 6)
    : (wizardState.meleeDefCritThreshold || 6);

  const newVal = Math.floor(Math.random() * 6) + 1;
  const wasSuccess = newVal >= effectiveTs || newVal >= critThreshold;

  playSound('crit');

  // 更新原始投骰记录
  const originalRoll = side === 'attacker'
    ? wizardState.allAttackerRolls[rerollTarget.originalIdx]
    : wizardState.allDefenderRolls[rerollTarget.originalIdx];

  const oldVal = originalRoll.val;
  originalRoll.val = newVal;
  originalRoll.isSuccess = wasSuccess;
  originalRoll.isCrit = newVal >= critThreshold;

  // 重新计算成功骰列表
  const allSuccessful = (side === 'attacker' ? wizardState.allAttackerRolls : wizardState.allDefenderRolls)
    .filter(r => r.isSuccess);

  if (side === 'attacker') {
    wizardState.activeAttackerDice = allSuccessful.map(r => ({ val: r.val, isCrit: r.isCrit, used: false }));
  } else {
    wizardState.activeDefenderDice = allSuccessful.map(r => ({ val: r.val, isCrit: r.isCrit, used: false }));
  }

  wizardState.darkZealotryUsed[side] = true;

  const factionName = getFactionDisplayName(side === 'attacker' ? wizardState.attacker.faction : wizardState.defender.faction);
  addLog(`[黑暗狂热] ${factionName} 重投失败骰: [${oldVal}] → [${newVal}]${wasSuccess ? ' ✓命中!' : ' ✗未命中'}`);

  // 移除重投按钮区域
  const rerollSection = document.getElementById('melee-reroll-section');
  if (rerollSection) rerollSection.remove();

  // 重新渲染骰子视图
  renderMeleeRollsView();
}

export function renderMeleeRollsView() {
  const attPool = document.getElementById('melee-att-pool');
  const defPool = document.getElementById('melee-def-pool');
  if (!attPool || !defPool) return;

  const attDiceClass = getDiceClass(wizardState.attacker.faction);
  const defDiceClass = getDiceClass(wizardState.defender.faction);
  
  // 获取武器规则
  const activeAttPloys = wizardState.attacker?.activeDebuffs?.filter(d => d.target === 'weapon_rule') || [];
  const hasAttCeaseless = (wizardState.weapon?.hasRule && wizardState.weapon.hasRule('Ceaseless')) || activeAttPloys.some(p => p.rule === 'lumbering_death' && p.extra_rule === 'Ceaseless' && wizardState.attacker.faction === 'Plague Marine');
  const wAttReroll = hasAttCeaseless ? 'Ceaseless' : 'none';

  // 防守方检测 innate Ceaseless
  const hasDefCeaseless = wizardState.meleeDefWeapon?.hasRule && wizardState.meleeDefWeapon.hasRule('Ceaseless');
  const wDefReroll = hasDefCeaseless ? 'Ceaseless' : 'none';

  attPool.innerHTML = '';
  wizardState.allAttackerRolls.forEach((d, idx) => {
    let cls = `kt-dice-cube ${attDiceClass}`;
    if (d.isCrit) cls += ' crit-dice';
    else if (!d.isSuccess) cls += ' fail-dice';
    
    const dice = document.createElement('div');
    dice.className = cls;
    dice.textContent = d.val;
    
    // 渲染红叉或绿勾
    const hasAlreadyRerolled = (wizardState.attMeleeRerolledIndices || []).includes(idx);
    if (hasAlreadyRerolled) {
      dice.style.cursor = 'not-allowed';
      const badge = document.createElement('div');
      badge.className = 'reroll-indicator';
      badge.style.background = d.isSuccess ? 'var(--green)' : 'var(--red)';
      badge.textContent = d.isSuccess ? '✓' : '✖';
      dice.appendChild(badge);
    } else {
      dice.style.cursor = 'pointer';
      const badge = document.createElement('div');
      badge.className = 'reroll-indicator';
      
      // 检测 Ceaseless
      if (wAttReroll === 'Ceaseless' && d.val === 1) {
        badge.textContent = 'C';
        badge.style.background = 'var(--gold)';
        badge.style.color = 'black';
      } else {
        badge.textContent = 'R';
      }
      dice.appendChild(badge);
      dice.onclick = () => showMeleeRerollModal('attacker', idx, wAttReroll);
    }
    
    attPool.appendChild(dice);
  });
  if (wizardState.allAttackerRolls.length === 0) {
    const span = document.createElement('span');
    span.style.cssText = 'color:var(--text-muted);font-size:0.85rem;';
    span.textContent = '全部未命中';
    attPool.appendChild(span);
  }

  defPool.innerHTML = '';
  wizardState.allDefenderRolls.forEach((d, idx) => {
    let cls = `kt-dice-cube ${defDiceClass}`;
    if (d.isCrit) cls += ' crit-dice';
    else if (!d.isSuccess) cls += ' fail-dice';
    
    const dice = document.createElement('div');
    dice.className = cls;
    dice.textContent = d.val;
    
    // 渲染红叉或绿勾
    const hasAlreadyRerolled = (wizardState.defMeleeRerolledIndices || []).includes(idx);
    if (hasAlreadyRerolled) {
      dice.style.cursor = 'not-allowed';
      const badge = document.createElement('div');
      badge.className = 'reroll-indicator';
      badge.style.background = d.isSuccess ? 'var(--green)' : 'var(--red)';
      badge.textContent = d.isSuccess ? '✓' : '✖';
      dice.appendChild(badge);
    } else {
      dice.style.cursor = 'pointer';
      const badge = document.createElement('div');
      badge.className = 'reroll-indicator';
      
      if (wDefReroll === 'Ceaseless' && d.val === 1) {
        badge.textContent = 'C';
        badge.style.background = 'var(--gold)';
        badge.style.color = 'black';
      } else {
        badge.textContent = 'R';
      }
      dice.appendChild(badge);
      dice.onclick = () => showMeleeRerollModal('defender', idx, wDefReroll);
    }
    
    defPool.appendChild(dice);
  });
  if (wizardState.allDefenderRolls.length === 0) {
    const span = document.createElement('span');
    span.style.cssText = 'color:var(--text-muted);font-size:0.85rem;';
    span.textContent = '全部未命中';
    defPool.appendChild(span);
  }
}

export function showMeleeRerollModal(side, idx, wReroll) {
  const isDefense = side === 'defender';
  const isRerolledAlready = isDefense
    ? (wizardState.defMeleeRerolledIndices || []).includes(idx)
    : (wizardState.attMeleeRerolledIndices || []).includes(idx);
    
  if (isRerolledAlready) {
    if (showToast) showToast('该骰子已重投过，根据规则无法再次重投！', 'warning');
    return;
  }

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.display = 'flex';
  overlay.style.zIndex = '3000';
  
  const faction = isDefense ? wizardState.defender.faction : wizardState.attacker.faction;
  const curCp = getCpForFaction(faction);
  const val = isDefense ? wizardState.allDefenderRolls[idx].val : wizardState.allAttackerRolls[idx].val;
  
  const canCp = curCp >= 1 && (isDefense ? !wizardState.defMeleeCpUsed : !wizardState.attMeleeCpUsed);
  
  let optionsHtml = '';
  
  // CP Reroll option
  if (canCp) {
    optionsHtml += `
      <button id="btn-melee-reroll-cp" class="btn-large" style="padding: 10px; font-size:0.9rem;">
        战术重投 (消耗 1 CP, 剩 ${curCp} CP)
      </button>
    `;
  }
  
  // Rule-based free reroll options
  if (wReroll === 'Ceaseless' && val === 1) {
    optionsHtml += `
      <button id="btn-melee-reroll-ceaseless" class="btn-large" style="padding: 10px; font-size:0.9rem; background:linear-gradient(135deg, #10b981, #047857); border-color:#059669; color:white; font-weight:bold;">
        不息规则重投 [Ceaseless] (免费)
      </button>
    `;
  }

  if (optionsHtml === '') {
    optionsHtml = `<p style="color:var(--red); font-size:0.9rem; margin-bottom:10px;">当前无可用的重投选项（CP不足或不符合条件）</p>`;
  }

  overlay.innerHTML = `
    <div class="modal-content" style="max-width: 400px; border: 1px solid var(--gold); box-shadow: 0 0 20px rgba(0,0,0,0.8); background: rgba(10,15,28,0.98);">
      <div class="modal-header" style="padding: 12px; background: rgba(10,20,35,0.95); border-bottom: 1px solid var(--gold);">
        <div class="modal-title" style="font-size:1.1rem; color:var(--gold); font-weight:bold;">🎲 选择近战重投方式</div>
      </div>
      <div class="modal-body" style="padding: 20px; text-align: center;">
        <p style="margin-bottom: 12px; font-size:1rem; color:var(--text-muted);">当前骰值: <strong style="font-size:1.6rem; color:white; font-family:'Pirata One',serif; border: 1px solid rgba(255,255,255,0.15); padding: 4px 12px; border-radius: 4px; background: rgba(255,255,255,0.05); margin-left: 8px;">${val}</strong></p>
        <p style="font-size:0.8rem; color:var(--text-muted); margin-top:-4px; margin-bottom: 20px; line-height: 1.4;">
          请选择要应用于该骰子的重投方式。
        </p>
        <div style="display:flex; flex-direction:column; gap:12px; width:100%;">
          ${optionsHtml}
          <button id="btn-melee-reroll-cancel" class="btn-cancel" style="padding: 10px; font-size:0.9rem;">
            取消 (Cancel)
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  if (canCp) {
    document.getElementById('btn-melee-reroll-cp').onclick = () => {
      document.body.removeChild(overlay);
      executeMeleeReroll(side, idx, 'cp');
    };
  }
  
  if (wReroll === 'Ceaseless' && val === 1) {
    const btnCeaseless = document.getElementById('btn-melee-reroll-ceaseless');
    if (btnCeaseless) {
      btnCeaseless.onclick = () => {
        document.body.removeChild(overlay);
        executeMeleeReroll(side, idx, 'ceaseless');
      };
    }
  }
  
  document.getElementById('btn-melee-reroll-cancel').onclick = () => {
    playSound('click');
    document.body.removeChild(overlay);
  };
}

export function executeMeleeReroll(side, idx, reason) {
  playSound('dice_roll');
  const faction = side === 'attacker' ? wizardState.attacker.faction : wizardState.defender.faction;
  
  if (reason === 'cp') {
    setCpForFaction(faction, getCpForFaction(faction) - 1);
    if (side === 'attacker') wizardState.attMeleeCpUsed = true;
    else wizardState.defMeleeCpUsed = true;
  }
  
  ui.updateScoresUI();

  if (side === 'attacker') {
    if (!wizardState.attMeleeRerolledIndices) wizardState.attMeleeRerolledIndices = [];
    wizardState.attMeleeRerolledIndices.push(idx);
  } else {
    if (!wizardState.defMeleeRerolledIndices) wizardState.defMeleeRerolledIndices = [];
    wizardState.defMeleeRerolledIndices.push(idx);
  }

  const poolId = side === 'attacker' ? 'melee-att-pool' : 'melee-def-pool';
  const pool = document.getElementById(poolId);
  const diceCubes = pool.getElementsByClassName('kt-dice-cube');
  const cube = diceCubes[idx];
  const diceClass = getDiceClass(faction);
  cube.className = `kt-dice-cube ${diceClass} rolling`;
  cube.innerHTML = '?';

  setTimeout(() => {
    const newVal = Math.floor(Math.random() * 6) + 1;
    const oldRoll = side === 'attacker' ? wizardState.allAttackerRolls[idx] : wizardState.allDefenderRolls[idx];
    const oldVal = oldRoll.val;
    
    // Update the record
    oldRoll.val = newVal;
    const effTs = side === 'attacker' ? wizardState.meleeEffectiveAttTs : wizardState.meleeEffectiveDefTs;
    const critThreshold = side === 'attacker' ? wizardState.meleeAttCritThreshold : wizardState.meleeDefCritThreshold;
    oldRoll.isSuccess = newVal >= effTs || newVal >= critThreshold;
    oldRoll.isCrit = newVal >= critThreshold;

    const label = reason === 'cp' ? 'CP重投' : (reason === 'ceaseless' ? 'Ceaseless' : '重投');
    ui.addLog(`  - [近战${label}] ${side === 'attacker' ? '攻击方' : '防守方'} D6: [${oldVal}] -> [${newVal}]`);
    
    // 重新渲染视图
    renderMeleeRollsView();

    if (!oldRoll.isSuccess) {
      playSound('epic_fail');
    }
  }, 500);
}

// ==========================================
//          Melee Duel Headers
// ==========================================

export function getDuelAvatarHtml(opId, faction) {
  const avatarUrl = gameState.customAvatars[opId];
  const cssSuffix = getFactionCssSuffix(faction);
  let fallbackUrl = getAssetPath(`assets/images/defaults/default_${cssSuffix}_avatar.jpg`);

  const activeOp = gameState.operatives.find(o => o.id === opId);
  if (activeOp && activeOp.defaultAvatar) {
    fallbackUrl = getAssetPath(activeOp.defaultAvatar);
  } else {
    // Determine the template source based on faction for avatar path
    const idSuffix = opId.replace(/^(sm_|pm_|leg_)/, '');
    const templateAvatar = getAssetPath(`assets/images/operatives/${cssSuffix}/${cssSuffix}_${idSuffix}.jpg`);
    // Try to use the template avatar as fallback if available
    // But keep using the default if no match
    fallbackUrl = templateAvatar;
  }

  const imgUrl = avatarUrl || fallbackUrl;
  const opName = activeOp ? activeOp.name : opId;
  return `<div class="op-avatar-slot duel-avatar-${opId}" style="width: 50px; height: 50px; cursor: default; position: relative;">
            <img src="${imgUrl}" class="op-avatar-img" alt="${opName} 头像" loading="lazy" />
          </div>`;
}

export function getMeleeDuelHeaderHtml() {
  const att = wizardState.attacker;
  const def = wizardState.defender;
  const attTheme = getFactionThemeVar(att.faction);
  const defTheme = getFactionThemeVar(def.faction);

  const attHpPct = Math.max(0, (att.wounds / att.maxWounds) * 100);
  const defHpPct = Math.max(0, (def.wounds / def.maxWounds) * 100);

  return `
    <div class="melee-duel-header" style="display:flex; justify-content:space-around; align-items:center; background:rgba(26,29,36,0.4); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:12px; margin-bottom:16px;">
      <!-- Attacker Panel -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; gap:6px; min-width: 0;">
        ${getDuelAvatarHtml(att.id, att.faction)}
        <div style="font-weight:bold; font-size:0.85rem; color:var(${attTheme}); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" title="${att.name}">${att.name}</div>
        <div style="font-size:0.7rem; color:var(${attTheme}); font-family:'Pirata One',serif; text-transform:uppercase;">攻击方</div>
        <!-- HP bar -->
        <div style="width:100%; background:rgba(255,255,255,0.08); height:6px; border-radius:3px; overflow:hidden; margin-top:4px;">
          <div style="background:var(--red); width:${attHpPct}%; height:100%; transition:width 0.3s ease;"></div>
        </div>
        <div style="font-size:0.8rem; font-weight:bold; font-family:'Pirata One',serif; color:var(--red);">${Math.max(0, att.wounds)} / ${att.maxWounds} HP</div>
      </div>

      <!-- VS icon -->
      <div style="display:flex;align-items:center;gap:6px;padding:0 8px;">
        <div style="width:16px;height:1px;background:var(--imperial-gold);"></div>
        <span style="color:var(--imperial-gold);font-size:8px;">⬥</span>
        <span style="font-size:1rem;color:var(--text-muted);font-family:'Pirata One',serif;">VS</span>
        <span style="color:var(--imperial-gold);font-size:8px;">⬥</span>
        <div style="width:16px;height:1px;background:var(--imperial-gold);"></div>
      </div>

      <!-- Defender Panel -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; gap:6px; min-width: 0;">
        ${getDuelAvatarHtml(def.id, def.faction)}
        <div style="font-weight:bold; font-size:0.85rem; color:var(${defTheme}); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" title="${def.name}">${def.name}</div>
        <div style="font-size:0.7rem; color:var(${defTheme}); font-family:'Pirata One',serif; text-transform:uppercase;">防守方</div>
        <!-- HP bar -->
        <div style="width:100%; background:rgba(255,255,255,0.08); height:6px; border-radius:3px; overflow:hidden; margin-top:4px;">
          <div style="background:var(--red); width:${defHpPct}%; height:100%; transition:width 0.3s ease;"></div>
        </div>
        <div style="font-size:0.8rem; font-weight:bold; font-family:'Pirata One',serif; color:var(--red);">${Math.max(0, def.wounds)} / ${def.maxWounds} HP</div>
      </div>
    </div>
  `;
}

export function getShootDuelHeaderHtml() {
  const att = wizardState.attacker;
  const def = wizardState.defender;
  const attTheme = getFactionThemeVar(att.faction);
  const defTheme = getFactionThemeVar(def.faction);

  const attHpPct = Math.max(0, (att.wounds / att.maxWounds) * 100);
  const defHpPct = Math.max(0, (def.wounds / def.maxWounds) * 100);

  return `
    <div class="melee-duel-header" style="display:flex; justify-content:space-around; align-items:center; background:rgba(26,29,36,0.4); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:12px; margin-bottom:16px;">
      <!-- Attacker Panel -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; gap:6px; min-width: 0;">
        ${getDuelAvatarHtml(att.id, att.faction)}
        <div style="font-weight:bold; font-size:0.85rem; color:var(${attTheme}); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" title="${att.name}">${att.name}</div>
        <div style="font-size:0.7rem; color:var(${attTheme}); font-family:'Pirata One',serif; text-transform:uppercase;">射击方</div>
        <!-- HP bar -->
        <div style="width:100%; background:rgba(255,255,255,0.08); height:6px; border-radius:3px; overflow:hidden; margin-top:4px;">
          <div style="background:var(--red); width:${attHpPct}%; height:100%; transition:width 0.3s ease;"></div>
        </div>
        <div style="font-size:0.8rem; font-weight:bold; font-family:'Pirata One',serif; color:var(--red);">${Math.max(0, att.wounds)} / ${att.maxWounds} HP</div>
      </div>

      <!-- VS icon -->
      <div style="display:flex;align-items:center;gap:6px;padding:0 8px;">
        <div style="width:16px;height:1px;background:var(--imperial-gold);"></div>
        <span style="color:var(--imperial-gold);font-size:8px;">⬥</span>
        <span style="font-size:1rem;color:var(--text-muted);font-family:'Pirata One',serif;">VS</span>
        <span style="color:var(--imperial-gold);font-size:8px;">⬥</span>
        <div style="width:16px;height:1px;background:var(--imperial-gold);"></div>
      </div>

      <!-- Defender Panel -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; gap:6px; min-width: 0;">
        ${getDuelAvatarHtml(def.id, def.faction)}
        <div style="font-weight:bold; font-size:0.85rem; color:var(${defTheme}); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" title="${def.name}">${def.name}</div>
        <div style="font-size:0.7rem; color:var(${defTheme}); font-family:'Pirata One',serif; text-transform:uppercase;">防守方</div>
        <!-- HP bar -->
        <div style="width:100%; background:rgba(255,255,255,0.08); height:6px; border-radius:3px; overflow:hidden; margin-top:4px;">
          <div style="background:var(--red); width:${defHpPct}%; height:100%; transition:width 0.3s ease;"></div>
        </div>
        <div style="font-size:0.8rem; font-weight:bold; font-family:'Pirata One',serif; color:var(--red);">${Math.max(0, def.wounds)} / ${def.maxWounds} HP</div>
      </div>
    </div>
  `;
}

// ==========================================
//          Melee Actions
// ==========================================

export function chooseMeleeDice(side, idx) {
  if (side !== wizardState.meleeTurn) {
    playSound('alert');
    if (showToast) showToast('现在不属于你的近战分配回合！', 'warning');
    return;
  }

  const diceList = side === 'attacker' ? wizardState.activeAttackerDice : wizardState.activeDefenderDice;
  const dice = diceList[idx];
  if (dice.used) return;

  wizardState.selectedMeleeDice = { side, idx };
  renderFightStep();
}

export function resolveMeleeChoice(action) {
  if (!wizardState.selectedMeleeDice) return;
  const { side, idx } = wizardState.selectedMeleeDice;

  const diceList = side === 'attacker' ? wizardState.activeAttackerDice : wizardState.activeDefenderDice;
  const dice = diceList[idx];
  if (dice.used) return;

  const targetOpponent = side === 'attacker' ? wizardState.defender : wizardState.attacker;
  const opponentDiceList = side === 'attacker' ? wizardState.activeDefenderDice : wizardState.activeAttackerDice;

  let activeWeapon;
  if (side === 'attacker') {
    activeWeapon = wizardState.weapon;
  } else {
    activeWeapon = wizardState.defender.weapons.filter(w => !w.isRanged)[0] || new Weapon('重拳 (Fists)', 4, 3, 3, 4, false, null, []);
  }

  if (!wizardState.meleeLogs) wizardState.meleeLogs = '';

  if (action === 'strike') {
    dice.used = true;

    // 获取攻击方特工 (用于章战术/印记检测)
    const strikeAttacker = side === 'attacker' ? wizardState.attacker : wizardState.defender;
    const isMeleeWeapon = !activeWeapon.isRanged;

    // Toxic 规则：近战也适用
    let strikeNormDmg = activeWeapon.normalDamage;
    let strikeCritDmg = activeWeapon.criticalDamage;
    // Toxic (近战): 阵营机制，由 factionMechanicsEnabled 开关；dmgBonusIfPoisoned 由注册表按 defenderPoisoned 判定
    const hasToxicMelee = activeRuleSet().factionMechanicsEnabled
      && !!weaponMods(activeWeapon, { defenderPoisoned: targetOpponent.poisonTokens > 0 }).dmgBonusIfPoisoned;
    if (hasToxicMelee) {
      strikeNormDmg += 1;
      strikeCritDmg += 1;
      ui.addLog(`[剧毒] 目标携带毒素标记，${activeWeapon.name} 近战伤害 +1 (${strikeNormDmg}/${strikeCritDmg})`);
    }

    // 注：近战 Severe (基础/Khne 印记) 的正确"保留阶段升级"尚未实现——近战按 die 逐个 strike/parry
    //     结算，无聚合保留阶段。阵营派生规则已改为经 effectiveWeapon 注入，后续补全近战 Severe 时
    //     可统一走 weaponMods(effectiveWeapon(...)).upgradeNormalToCrit。

    const dmg = dice.isCrit ? strikeCritDmg : strikeNormDmg;
    const msg = `> ${side === 'attacker' ? '攻击方' : '防守方'} 执行打击 (Strike)，分配了 ${dmg} 伤害！<br>`;
    wizardState.meleeLogs += msg;

    const oldWounds = targetOpponent.wounds;
    const actualDmg = targetOpponent.applyWounds(dmg, null, 'melee_auto');
    const drReduced = dmg - actualDmg;



    // === Standard 规则: 近战击杀回调 ===
    if (targetOpponent.isDead && activeRuleSet().hasKillCallbacks) {
      const meleeAttacker = side === 'attacker' ? wizardState.attacker : wizardState.defender;
      triggerKillAbilities(meleeAttacker, targetOpponent, 'fight', dmg);
    }

    // Poison 规则：近战造成 ≥1 伤害且武器有 Poison，给予毒素标记
    const hasPoisonMelee = !!weaponMods(activeWeapon).applyPoisonTokenOnDamage;
    if (hasPoisonMelee && dmg > 0 && targetOpponent.poisonTokens < 1) {
      targetOpponent.poisonTokens = 1;
      ui.addLog(`[毒素] ${targetOpponent.name} 获得了 1 个毒素标记！(来自近战)`);
    }

    // ---- Shock 规则 ----
    // "The first time you strike with a critical success in each sequence,
    //  also discard one of your opponent's unresolved normal successes
    //  (or one of their critical successes if there are none)."
    // 每次序列中第一次暴击打击时，丢弃对手 1 个未解决的普通成功（或暴击成功，若无普通）。
    const hasShockMelee = !!weaponMods(activeWeapon).firstCritDiscardsUnresolvedNormal;
    if (hasShockMelee && dice.isCrit && !wizardState.shockTriggered) {
      // 优先丢弃对手的普通成功
      let discardIdx = opponentDiceList.findIndex(d => !d.used && !d.isCrit);
      let discardType = '普通成功';
      if (discardIdx === -1) {
        // 无普通成功，丢弃暴击成功
        discardIdx = opponentDiceList.findIndex(d => !d.used && d.isCrit);
        discardType = '暴击成功';
      }
      if (discardIdx !== -1) {
        opponentDiceList[discardIdx].used = true;
        wizardState.shockTriggered = true;
        const shockMsg = `> [冲击] 暴击打击触发 Shock：丢弃对手 1 个未解决的${discardType} [${opponentDiceList[discardIdx].val}]！<br>`;
        wizardState.meleeLogs += shockMsg;
        ui.addLog(`[冲击] ${activeWeapon.name}：暴击打击触发，丢弃对手 1 个${discardType}！`);
      }
    }

    // ---- Stun 规则 (近战) ----
    // "If you retain any critical successes, subtract 1 from the APL stat
    //  of the operative this weapon is being used against until the end of its next activation."
    // 如果保留了暴击（此处：本次打击使用暴击骰），目标 APL -1。
    const hasStunMelee = !!weaponMods(activeWeapon).targetAplReduction;
    if (hasStunMelee && dice.isCrit && !wizardState.stunApplied) {
      targetOpponent.apl = Math.max(0, targetOpponent.apl - 1);
      targetOpponent.stunnedUntilEndOfNextActivation = true;
      wizardState.stunApplied = true;
      const stunMsg = `> [震慑] 暴击打击触发 Stun：${targetOpponent.name} APL -1 (直到其下一次激活结束)！<br>`;
      wizardState.meleeLogs += stunMsg;
      ui.addLog(`[震慑] ${activeWeapon.name}：暴击打击触发，${targetOpponent.name} APL -1！`);
      ui.updateActivePanel();
    }

    playSound('heavy_strike');
    ui.triggerCombatVisual("-" + dmg + " Wounds", "strike");
  } else {
    // ---- Brutal 规则 ----
    // "Your opponent can only block with critical successes"
    // 当对手使用带 Brutal 的武器攻击时，你只能用暴击骰格挡。
    // 当前 side 是正在执行 parry 的一方；对手 = 攻击发起方。
    const opponentWeapon = side === 'attacker'
      ? (wizardState.defender.weapons.filter(w => !w.isRanged)[0] || null)
      : wizardState.weapon;
    const opponentHasBrutal = opponentWeapon && weaponMods(opponentWeapon).defenseBlockRequiresCrit;
    if (opponentHasBrutal && !dice.isCrit) {
      playSound('alert');
      if (showToast) showToast('残暴 (Brutal)：只能使用暴击骰格挡！', 'warning');
      return;
    }

    let targetIdx = -1;
    if (dice.isCrit) {
      targetIdx = opponentDiceList.findIndex(d => !d.used && d.isCrit);
      if (targetIdx === -1) {
        targetIdx = opponentDiceList.findIndex(d => !d.used);
      }
    } else {
      targetIdx = opponentDiceList.findIndex(d => !d.used && !d.isCrit);
    }

    if (targetIdx === -1) {
      playSound('alert');
      if (showToast) showToast('没有合法的对方骰子可供格挡招架！', 'warning');
      return;
    }

    dice.used = true;
    opponentDiceList[targetIdx].used = true;
    const msg = `> ${side === 'attacker' ? '攻击方' : '防守方'} 执行格挡 (Parry)，消去对方一个骰子 [${opponentDiceList[targetIdx].val}]！<br>`;
    wizardState.meleeLogs += msg;
    playSound('metal_clash');
    ui.triggerCombatVisual("PARRY", "parry");
  }

  const opponentSide = side === 'attacker' ? 'defender' : 'attacker';
  const oppWounds = opponentSide === 'attacker' ? wizardState.attacker.wounds : wizardState.defender.wounds;
  const oppDiceList = opponentSide === 'attacker' ? wizardState.activeAttackerDice : wizardState.activeDefenderDice;
  const oppHasUsable = oppDiceList.some(d => !d.used) && oppWounds > 0;

  const ownWounds = side === 'attacker' ? wizardState.attacker.wounds : wizardState.defender.wounds;
  const ownDiceList = side === 'attacker' ? wizardState.activeAttackerDice : wizardState.activeDefenderDice;
  const ownHasUsable = ownDiceList.some(d => !d.used) && ownWounds > 0;

  if (oppHasUsable && ownHasUsable) {
    wizardState.meleeTurn = opponentSide;
  } else if (oppHasUsable) {
    wizardState.meleeTurn = opponentSide;
  } else if (ownHasUsable) {
    wizardState.meleeTurn = side;
  }

  wizardState.selectedMeleeDice = null;
  renderFightStep();

  if (action === 'strike') {
    ui.triggerAvatarHitEffect(targetOpponent.id, 'melee');
  }
}

export function cancelMeleeChoice() {
  playSound('click');
  wizardState.selectedMeleeDice = null;
  renderFightStep();
}

export function confirmFightResult() {
  playSound('click');
  const attacker = wizardState.attacker;
  const defender = wizardState.defender;

  ui.addLog(`\n--- 近战搏斗结果 ---`);
  ui.addLog(`[双核交锋] ${attacker.name} vs ${defender.name}`);
  ui.addLog(`  - ${attacker.name} 生命值: ${attacker.wounds}/${attacker.maxWounds}`);
  ui.addLog(`  - ${defender.name} 生命值: ${defender.wounds}/${defender.maxWounds}`);

  attacker.apl -= 1;
  attacker.actionsPerformed.push('Fight');
  ui.addLog(`[行动点] ${attacker.name} 消耗 1 APL，当前 APL: ${attacker.apl}`);

  closeModal();
}


// ==========================================
//          Interactive Dice Keypad
// ==========================================
export function buildDiceKeypadHtml(inputId, label, maxDice) {
  return `
    <div class="form-group" style="margin-top:10px;">
      <label>${label}</label>
      <div class="dice-keypad-container">
        <!-- Hidden input to store actual value -->
        <input type="hidden" id="${inputId}" value="" data-max="${maxDice || 99}" onchange="if(window.onKeypadChange) window.onKeypadChange('${inputId}')">
        
        <!-- Display Area -->
        <div class="keypad-display-area" id="display-${inputId}"></div>
        
        <!-- Controls -->
        <div class="keypad-controls">
          <button class="keypad-btn" onclick="handleKeypadBtn('${inputId}', 1)">1</button>
          <button class="keypad-btn" onclick="handleKeypadBtn('${inputId}', 2)">2</button>
          <button class="keypad-btn" onclick="handleKeypadBtn('${inputId}', 3)">3</button>
          <button class="keypad-btn" onclick="handleKeypadBtn('${inputId}', 4)">4</button>
          <button class="keypad-btn" onclick="handleKeypadBtn('${inputId}', 5)">5</button>
          <button class="keypad-btn" onclick="handleKeypadBtn('${inputId}', 6)">6</button>
        </div>
        <div class="keypad-action-row">
          <button class="keypad-btn action-btn" onclick="handleKeypadBtn('${inputId}', 'clear')">Clear</button>
          <button class="keypad-btn action-btn" onclick="handleKeypadBtn('${inputId}', 'back')">⌫ Back</button>
        </div>
      </div>
    </div>
  `;
}

window.handleKeypadBtn = function(inputId, action) {
  if (typeof playSound === 'function') playSound('click');
  const inputEl = document.getElementById(inputId);
  const displayEl = document.getElementById(`display-${inputId}`);
  if (!inputEl || !displayEl) return;

  let currentVals = inputEl.value ? inputEl.value.split(',').map(s => s.trim()) : [];

  const maxDice = parseInt(inputEl.getAttribute('data-max') || '99', 10);
  
  if (action === 'clear') {
    currentVals = [];
  } else if (action === 'back') {
    currentVals.pop();
  } else {
    if (currentVals.length < maxDice) {
      currentVals.push(action.toString());
    } else {
      if (typeof showToast === 'function') showToast(`最多只能录入 ${maxDice} 个骰子`, 'warning');
      else alert(`最多只能录入 ${maxDice} 个骰子`);
      return;
    }
  }

  inputEl.value = currentVals.join(',');
  
  // Render display
  displayEl.innerHTML = currentVals.map(v => `<div class="keypad-die">${v}</div>`).join('');
  
  // Trigger change event to enable 'Next' buttons
  const event = new Event('change');
  inputEl.dispatchEvent(event);
};

window.onKeypadChange = function(inputId) {
  // If we are in attack phase, enable the Next button if there are rolls
  const inputEl = document.getElementById(inputId);
  if (!inputEl) return;
  const rolls = inputEl.value ? inputEl.value.split(',').filter(x => x) : [];
  
  const nextBtn = document.getElementById('modal-btn-next');
  if (nextBtn) {
if (inputId === 'manual-att-dice-val') {
      nextBtn.disabled = rolls.length === 0;
    } else if (inputId === 'manual-def-dice-val') {
      nextBtn.disabled = rolls.length === 0 && !document.getElementById('modal-btn-next').disabledIfNoRolls; 
    } else if (inputId === 'manual-melee-att-val' || inputId === 'manual-melee-def-val') {
      const attInput = document.getElementById('manual-melee-att-val');
      const defInput = document.getElementById('manual-melee-def-val');
      const attRolls = attInput && attInput.value ? attInput.value.split(',').filter(x => x) : [];
      const defRolls = defInput && defInput.value ? defInput.value.split(',').filter(x => x) : [];
      nextBtn.disabled = attRolls.length === 0 && defRolls.length === 0;
    }
  }
};

export function rollDrDice(count) {
  const nextBtn = document.getElementById('modal-btn-next');
  const pool = document.getElementById('dr-dice-pool');
  const rollBtn = document.getElementById('btn-roll-dr');

  if (!pool) return;

  if (wizardState.drRolls && wizardState.drRolls.length > 0) return;

  if (typeof playSound === 'function') playSound('dice_roll');
  if (rollBtn) rollBtn.style.display = 'none';
  
  // contagious_resilience 已移除 (虚构 ploy)。Sickening Resilience 有不同效果 (auto-reduce，不重投)。
  const hasPloyActive = false;
  
  // Animate dice rolling
  if (pool) {
    pool.innerHTML = '';
    const defDiceClass = typeof getDiceClass === 'function' ? getDiceClass(wizardState.defender.faction) : 'nurgle-dice';
    for (let i=0; i<count; i++) {
      const dice = document.createElement('div');
      dice.className = 'kt-dice-cube ' + defDiceClass + ' rolling';
      dice.textContent = '?';
      dice.id = `dr-anim-dice-${i}`;
      pool.appendChild(dice);
    }
  }

  let finalRolls = [];
  let hasRerolled = false;

  setTimeout(() => {
    if (typeof playSound === 'function') playSound('dice_drop');
    for (let i=0; i<count; i++) {
      let roll = Math.floor(Math.random() * 6) + 1;
      let rerolledStr = '';
      
      // Auto reroll first failure if active
      if (roll < 4 && hasPloyActive && !hasRerolled) {
        hasRerolled = true;
        const oldRoll = roll;
        roll = Math.floor(Math.random() * 6) + 1;
        rerolledStr = `[重投 ${oldRoll}->${roll}] `;
        if (typeof ui !== 'undefined' && ui.addLog) {
          ui.addLog(`[溃疡狂热] 自动重投了 1 颗失败的减伤骰子 (${oldRoll} -> ${roll})`);
        }
      }
      
      finalRolls.push(roll);
      
      const diceEl = document.getElementById(`dr-anim-dice-${i}`);
      if (diceEl) {
        diceEl.classList.remove('rolling');
        diceEl.textContent = roll;
        if (roll >= 4) {
          diceEl.classList.add('crit-dice'); // Green/Crit color to show success
        } else {
          diceEl.style.opacity = '0.5'; // Fade out failures
        }
        if (rerolledStr !== '') {
          diceEl.style.outline = "2px solid var(--sm-accent)";
          diceEl.title = rerolledStr;
        }
      }
    }

    wizardState.drRolls = finalRolls;

    if (nextBtn) nextBtn.disabled = false;
  }, 600);
}
window.rollDrDice = rollDrDice;
