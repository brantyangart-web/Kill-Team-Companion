import { gameState, wizardState } from './state.js';
import { playSound } from './audio.js';
import { Operative, Weapon, translateRule } from './models.js';
import {
  getEnemyFaction, getDiceClass, getCpForFaction, setCpForFaction,
  getFactionDisplayName, getFactionCssSuffix, hasFactionTrait, getActivePloys, setActivePloys,
  getTeamSlot
} from '../rules/faction.js';
import {
  hasChapterTactic, hasMarkOfChaos, getMarksOfChaos,
  calculateAttackModifications, calculateDefenseModifications
} from '../rules/abilities.js';
import { getAssetPath } from './paths.js';

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
  if (gameState.rulesVersion !== 'standard') return;

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
      // Torrent: 自动命中，跳过攻击骰步骤
      const torrentMatch = wizardState.weapon.rules.find(r => r.startsWith('Torrent'));
      if (torrentMatch) {
        const torrentHits = parseInt(torrentMatch.match(/\d+/)?.[0] || wizardState.weapon.attacks);
        wizardState.attackRolls = [];
        wizardState.attackCrit = 0;
        wizardState.attackNorm = torrentHits;
        if (showToast) showToast(`💧 激流 (Torrent): 自动命中 ${torrentHits} 次，跳过攻击骰步骤。`, 'info');
        wizardState.step = 5; // 直接跳到防御骰步骤
        renderShootStep();
        return;
      }
    } else if (wizardState.step === 4 && wizardState.mode === 'manual') {
      parseManualAttack();
      if (wizardState.attackRolls.length === 0) {
        if (showToast) showToast('请输入有效的攻击骰点数！格式: 6, 4, 3, 2 (1-6逗号隔开)', 'error');
        return;
      }
    } else if (wizardState.step === 5 && wizardState.mode === 'manual') {
      parseManualDefense();
      const inputEl = document.getElementById('manual-def-dice-val');
      if (inputEl && inputEl.value.trim() !== '' && wizardState.defenseRolls.length === 0) {
        if (showToast) showToast('请输入有效的防御骰点数！格式: 5, 2 (1-6逗号隔开)', 'error');
        return;
      }
    }
  } else if (wizardState.actionType === 'fight') {
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
  // L15/L111: 隐蔽单位不能射击，除非携带 Silent 武器 (L239)
  const hasSilentWeapon = op.weapons.some(w => w.hasRule && w.hasRule('Silent'));
  if (op.hasConceal && !hasSilentWeapon) {
    playSound('alert');
    if (showToast) showToast('隐蔽单位不能射击 (需先切为交战，或携带 Silent 武器)！', 'error');
    return;
  }

  const modalContent = document.querySelector('#combat-modal .modal-content');
  if (modalContent) {
    modalContent.style.backgroundImage = `linear-gradient(rgba(11, 17, 32, 0.85), rgba(11, 17, 32, 0.95)), url("${getAssetPath('assets/images/backgrounds/bg_shoot_action.png')}")`;
    modalContent.style.backgroundSize = 'cover';
    modalContent.style.backgroundPosition = 'center';
  }

  Object.assign(wizardState, {
    actionType: 'shoot',
    step: 1,
    attacker: op,
    defender: null,
    weapon: op.weapons.filter(w => w.isRanged)[0] || null,
    inRangeAndVisible: true,
    inCoverConcealed: false,
    inCover: false,
    enemyInControlRange: false,
    mode: 'random',
    attRerollIndex: -1,
    defRerollIndex: -1,
    attackRolls: [],
    defenseRolls: [],
    stunApplied: false,
    shockTriggered: false
  });

  if (!wizardState.weapon) {
    if (showToast) showToast('该特工没有配备任何远程武器！', 'warning');
    return;
  }

  // Torrent 规则检测：多目标射击（简化实现：仅对主目标生效，日志提示）
  const hasTorrent = wizardState.weapon.hasRule && wizardState.weapon.hasRule('Torrent');
  if (hasTorrent) {
    ui.addLog(`[激流] ${wizardState.weapon.name}：Torrent 规则生效！当前简化为仅对主目标射击。完整多目标选择待后续版本实现。`);
  }

  // 其他武器关键字检测（日志提示）
  const hasBlast = wizardState.weapon.hasRule && wizardState.weapon.hasRule('Blast');
  if (hasBlast) {
    ui.addLog(`[爆炸] ${wizardState.weapon.name}：Blast 规则生效！当前简化为仅对主目标。完整 AoE 待后续版本实现。`);
  }

  const hasBalanced = wizardState.weapon.hasRule && wizardState.weapon.hasRule('Balanced');
  if (hasBalanced) {
    ui.addLog(`[平衡] ${wizardState.weapon.name}：Balanced 规则生效！可重投 1 个攻击骰（需手动操作）。`);
  }

  const hasCeaseless = wizardState.weapon.hasRule && wizardState.weapon.hasRule('Ceaseless');
  if (hasCeaseless) {
    ui.addLog(`[不息] ${wizardState.weapon.name}：Ceaseless 规则生效！可重投投出特定值的骰子（需手动操作）。`);
  }

  const hasRelentless = wizardState.weapon.hasRule && wizardState.weapon.hasRule('Relentless');
  if (hasRelentless) {
    ui.addLog(`[无情] ${wizardState.weapon.name}：Relentless 规则生效！可重投任意攻击骰（需手动操作）。`);
  }

  const hasLimited = wizardState.weapon.hasRule && wizardState.weapon.hasRule('Limited');
  if (hasLimited) {
    ui.addLog(`[有限] ${wizardState.weapon.name}：Limited 规则生效！每场战斗有使用次数限制（当前未追踪）。`);
  }

  const hasSeek = wizardState.weapon.hasRule && wizardState.weapon.hasRule('Seek');
  if (hasSeek) {
    ui.addLog(`[寻的] ${wizardState.weapon.name}：Seek 规则生效！隐蔽单位不能利用地形掩体。`);
  }

  const hasRange = wizardState.weapon.rules.some(r => r.startsWith('Range'));
  if (hasRange) {
    ui.addLog(`[射程] ${wizardState.weapon.name}：Range 规则生效！有最大射程限制（当前未检查）。`);
  }

  openModal();
  renderShootStep();
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
      const injuredTag = t.isInjured ? ' <span style="color:var(--red); font-size:0.7rem;">[重伤]</span>' : '';
      const poisonTag = t.poisonTokens > 0 ? ' <span style="color:#7ab88a; font-size:0.7rem;">[毒素]</span>' : '';
      listHtml += `
        <div class="weapon-pick-item ${wizardState.defender && wizardState.defender.id === t.id ? 'selected' : ''}" role="button" tabindex="0" onclick="selectShootDefender('${t.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectShootDefender('${t.id}')}">
          <span class="weapon-pick-name">${t.name}${injuredTag}${poisonTag}</span>
          <span class="weapon-pick-stats">HP: ${t.wounds}/${t.maxWounds} | DF:${t.df} | Move:${t.currentMove}"</span>
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
    const isInjuredAttacker = wizardState.attacker.isInjured;
    const hasDashed = wizardState.attacker.actionsPerformed.includes('Dash');
    let listHtml = '<div class="weapon-picker-list">';
    rangedWeapons.forEach((w, idx) => {
      const hitStat = isInjuredAttacker ? `${w.ts}+ <span style="color:var(--red); font-size:0.7rem;">→ ${w.ts + 1}+</span>` : `${w.ts}+`;
      const rangeStr = w.range ? ` | Range: ${w.range}"` : '';
      const rulesStr = w.rules && w.rules.length > 0 ? ` | ${w.rules.map(translateRule).join(', ')}` : '';
      const isHeavy = w.hasRule('Heavy');
      const heavyBlocked = isHeavy && !hasDashed;
      const heavyNote = heavyBlocked ? ' <span style="color:var(--red); font-size:0.65rem;">[需先冲刺]</span>' : '';
      const disabledStyle = heavyBlocked ? 'opacity:0.4; cursor:not-allowed; pointer-events:none;' : '';
      listHtml += `
        <div class="weapon-pick-item ${wizardState.weapon.name === w.name ? 'selected' : ''}" role="button" tabindex="0" style="${disabledStyle}" onclick="${heavyBlocked ? '' : `selectShootWeapon(${idx})`}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();${heavyBlocked ? '' : `selectShootWeapon(${idx})`}}">
          <span class="weapon-pick-name">${w.name}${heavyNote}</span>
          <span class="weapon-pick-stats">A: ${w.attacks} | BS: ${hitStat} | D: ${w.normalDamage}/${w.criticalDamage}${rangeStr}${rulesStr}</span>
        </div>
      `;
    });
    listHtml += '</div>';

    const dashHint = hasDashed ? '' : '<p style="color:var(--text-muted); font-size:0.75rem; margin-bottom:8px;">💡 标注<span style="color:var(--red);">[需先冲刺]</span>的武器为重武器，仅在执行冲刺 (Dash) 后可使用。</p>';
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
    const hasIndirect = w.hasRule('Indirect Fire');
    // Silent 规则: Conceal 状态下也能射击 (不在射程/视线处理，由 Shoot 按钮判定)
    const hasSeekLight = w.hasRule('Seek Light');

    // Indirect Fire: 自动视为在射程和视线内
    const rangeNote = hasIndirect
      ? '<p style="color:#818cf8; font-size:0.75rem;">💡 <b>间接射击</b>：无需视线，射程判定跳过。</p>'
      : '';

    const coverNote = hasSeekLight
      ? '<p style="color:#f59e0b; font-size:0.75rem;">💡 <b>寻光</b>：目标即使在掩体中也无法获得掩体加成。</p>'
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
        <div class="qa-question">1. 目标是否在你的有效视线和射程内？${hasIndirect ? ' <span style="color:#818cf8;">(自动判定为是)</span>' : ''}</div>
        <div class="qa-options">
          <button class="qa-btn ${wizardState.inRangeAndVisible ? 'selected' : ''}" onclick="setQA('inRangeAndVisible', true)" ${hasIndirect ? 'style="pointer-events:none; opacity:0.6;"' : ''}>是 (在射程内)</button>
          <button class="qa-btn ${!wizardState.inRangeAndVisible ? 'selected' : ''}" onclick="setQA('inRangeAndVisible', false)" ${hasIndirect ? 'style="pointer-events:none; opacity:0.6;"' : ''}>否 (无法见/超射程)</button>
        </div>
      </div>

      ${concealCoverCard}

      <div class="qa-card" style="margin-top:10px;">
        <div class="qa-question">3. 目标是否在掩体中 (Cover)？${hasSeekLight ? ' <span style="color:#f59e0b;">(寻光忽略掩体)</span>' : ''}</div>
        <div class="qa-options">
          <button class="qa-btn ${wizardState.inCover ? 'selected' : ''}" onclick="setQA('inCover', true)" ${hasSeekLight ? 'style="pointer-events:none; opacity:0.6;"' : ''}>是 (触发掩体成功保留)</button>
          <button class="qa-btn ${!wizardState.inCover ? 'selected' : ''}" onclick="setQA('inCover', false)" ${hasSeekLight ? 'style="pointer-events:none; opacity:0.6;"' : ''}>否 (开阔地带)</button>
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

    // 自动设置: Indirect Fire → inRangeAndVisible=true; Seek Light → inCover=false
    if (hasIndirect) wizardState.inRangeAndVisible = true;
    if (hasSeekLight) wizardState.inCover = false;

    nextBtn.textContent = '选择掷骰模式';
    nextBtn.disabled = false;
  }

  else if (wizardState.step === 4) {
    title.textContent = '射击结算 - 步骤 4: 攻击方掷骰 (Angels of Death)';

    let rerollHint = '';
    const curCp = getCpForFaction(wizardState.attacker.faction);

    if (wizardState.attackRolls.length > 0) {
      const summaryEffTs = wizardState.weapon.ts + (wizardState.attacker.isInjured ? 1 : 0);
      const injNote = wizardState.attacker.isInjured ? ' <span style="color:var(--red); font-size:0.75rem;">(重伤+1)</span>' : '';
      rerollHint = `
        <div class="roll-summary-block" style="margin-top:10px;">
          🎯 <b>命中统计:</b> 暴击(6点): <span style="color:var(--sm-accent); font-weight:bold;">${wizardState.attackCrit}</span>, 普通命中(${summaryEffTs}+${injNote}): <span style="color:#6a9ad4;">${wizardState.attackNorm}</span>
          ${curCp >= 1 && wizardState.attRerollIndex === -1 ? '<br><span style="color:var(--sm-accent);">💡 战术重投：你可以消耗 1 CP 点击上方任何一个未命中的灰色骰子重投。</span>' : ''}
        </div>
      `;
    }

    const displayEffTs = wizardState.weapon.ts + (wizardState.attacker.isInjured ? 1 : 0);
    const injLabel = wizardState.attacker.isInjured ? ` <span style="color:var(--red); font-size:0.75rem;">(重伤+1 → ${displayEffTs}+)</span>` : '';
    body.innerHTML = `
      ${getShootDuelHeaderHtml()}

      <p style="margin-bottom: 12px;">武器 [${wizardState.weapon.name}]，攻击骰数: <b>${wizardState.weapon.attacks}</b>，命中要求: <b>${displayEffTs}+</b>${injLabel}</p>

      <div class="qa-options" style="margin-bottom: 16px;">
        <button class="qa-btn ${wizardState.mode === 'random' ? 'selected' : ''}" onclick="setRollMode('random')">动画/数字掷骰 (Mode B)</button>
        <button class="qa-btn ${wizardState.mode === 'manual' ? 'selected' : ''}" onclick="setRollMode('manual')">物理骰子录入 (Mode A)</button>
      </div>

      <div class="dice-rolling-area" id="attack-rolling-zone">
        <div class="dice-pool-view" id="attack-dice-pool">
          <span style="color:var(--text-muted); font-size:0.85rem;">等待投骰...</span>
        </div>
        ${wizardState.attackRolls.length === 0 ? '<button class="modal-btn primary" id="btn-roll-attack" onclick="rollAttackDice()">开始顺序掷骰</button>' : ''}
      </div>

      ${rerollHint}

      <div id="manual-attack-input" style="display:none; background:var(--dark-card); padding:12px; border-radius:8px; border:1px solid var(--panel-border);">
        <div class="form-group">
          <label>请输入 ${wizardState.weapon.attacks} 个骰子值（1-6 逗号隔开）：</label>
          <input type="text" id="manual-att-dice-val" value="6, 4, 3, 2" style="margin-top:6px; padding:6px; font-size:1rem; width:100%;">
        </div>
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
    // Saturate 规则：防御方不能保留掩体骰
    // "The defender cannot retain cover saves."
    // 掩体加成（+1 DF 骰、1 自动普通成功）被移除。
    const hasSaturateForDf = wizardState.weapon.hasRule && wizardState.weapon.hasRule('Saturate');
    if (wizardState.inCover && !hasSaturateForDf) {
      coverDesc = `<p style="color:var(--pm-accent); margin-bottom: 4px;">🛡️ 目标在掩体中：自动获得 1 个普通成功，且防御投骰池减 1 (DF = ${dfCount} -> ${dfCount - 1})</p>`;
      dfCount = Math.max(0, dfCount - 1);
    } else if (wizardState.inCover && hasSaturateForDf) {
      coverDesc = `<p style="color:var(--red); margin-bottom: 4px;">🔥 [饱和] 目标在掩体中，但 Saturate 生效：不能保留掩体骰！</p>`;
    }

    // Piercing 规则：防御骰池减少 N 点
    // "Piercing N: defence dice pool reduced by N"
    const piercingMatch = wizardState.weapon.rules.find(r => r.startsWith('Piercing') && !r.startsWith('Piercing Crits'));
    if (piercingMatch) {
      const piercingVal = parseInt(piercingMatch.match(/\d+/)?.[0] || '1');
      const prevDf = dfCount;
      dfCount = Math.max(0, dfCount - piercingVal);
      coverDesc += `<p style="color:#f97316; margin-bottom: 4px;">🔥 <b>穿透 (Piercing ${piercingVal})</b>：DF 池减少 ${piercingVal} (DF = ${prevDf} -> ${dfCount})</p>`;
    }

    // Piercing Crits 规则：同 Piercing 减骰池，但仅当攻击方有暴击成功时生效 (L221)
    const piercingCritsMatch = wizardState.weapon.rules.find(r => r.startsWith('Piercing Crits'));
    if (piercingCritsMatch && wizardState.attackCrit > 0) {
      const pcVal = parseInt(piercingCritsMatch.match(/\d+/)?.[0] || '1');
      const prevDf = dfCount;
      dfCount = Math.max(0, dfCount - pcVal);
      coverDesc += `<p style="color:#f97316; margin-bottom: 4px;">🔥 <b>穿透暴击 (Piercing Crits ${pcVal})</b>：暴击命中，DF 池减少 ${pcVal} (DF = ${prevDf} -> ${dfCount})</p>`;
    }

    let rerollHint = '';
    const curCp = getCpForFaction(wizardState.defender.faction);
    if (wizardState.defenseRolls.length > 0 && dfCount > 0) {
      rerollHint = `
        <div class="roll-summary-block" style="margin-top:10px;">
          🛡️ <b>防守统计:</b> 暴击防守: <span style="color:var(--pm-accent); font-weight:bold;">${wizardState.defCrit}</span>, 普通防守(${wizardState.defender.sv}+): <span style="color:#b0d4ba;">${wizardState.defNorm}</span>
          ${curCp >= 1 && wizardState.defRerollIndex === -1 ? '<br><span style="color:var(--sm-accent);">💡 战术重投：你可以消耗 1 CP 点击上面任何一个未命中的灰色骰子重投。</span>' : ''}
        </div>
      `;
    }

    body.innerHTML = `
      ${getShootDuelHeaderHtml()}

      <p style="margin-bottom: 6px;">防守特工: [${wizardState.defender.name}]，保护要求: <b>${wizardState.defender.sv}+</b></p>
      ${coverDesc}
      <p style="margin-bottom: 12px;">需要投掷的防御骰数: <b>${dfCount}</b></p>

      <div class="dice-rolling-area" id="defense-rolling-zone">
        <div class="dice-pool-view" id="defense-dice-pool">
          <span style="color:var(--text-muted); font-size:0.85rem;">等待投骰...</span>
        </div>
        ${wizardState.defenseRolls.length === 0 ? `<button class="modal-btn primary" id="btn-roll-defense" onclick="rollDefenseDice(${dfCount})">开始顺序防守投骰</button>` : ''}
      </div>

      ${rerollHint}

      <div id="manual-defense-input" style="display:none; background:var(--dark-card); padding:12px; border-radius:8px; border:1px solid var(--panel-border);">
        <div class="form-group">
          <label>请输入 ${dfCount} 个防御骰子值（1-6 逗号隔开）：</label>
          <input type="text" id="manual-def-dice-val" value="5, 2" style="margin-top:6px; padding:6px; font-size:1rem; width:100%;">
        </div>
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
    const hasSevere = wizardState.weapon.hasRule && wizardState.weapon.hasRule('Severe');
    if (hasSevere && wizardState.attackCrit === 0 && wizardState.attackNorm >= 1) {
      wizardState.attackNorm -= 1;
      wizardState.attackCrit += 1;
      ui.addLog(`[严重] ${wizardState.weapon.name}：无暴击保留，升级 1 个普通命中为暴击！`);
    }

    // ---- Stun 规则 (保留阶段触发) ----
    // "If you retain any critical successes, subtract 1 from the APL stat of
    //  the operative this weapon is being used against until the end of its next activation."
    // 如果保留了暴击，目标 APL -1，直到其下一次激活结束。
    const hasStun = wizardState.weapon.hasRule && wizardState.weapon.hasRule('Stun');
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
    const hasSaturate = wizardState.weapon.hasRule && wizardState.weapon.hasRule('Saturate');
    if (hasSaturate && wizardState.inCover && remainingNormSaves > 0) {
      const coverSavesRemoved = Math.min(1, remainingNormSaves);
      remainingNormSaves -= coverSavesRemoved;
      ui.addLog(`[饱和] ${wizardState.weapon.name}：防御方不能保留掩体骰，移除 ${coverSavesRemoved} 个掩体自动成功！`);
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
    let normDmg = wizardState.weapon.normalDamage;
    let critDmg = wizardState.weapon.criticalDamage;
    const hasToxic = wizardState.weapon.hasRule && wizardState.weapon.hasRule('Toxic');
    if (hasToxic && wizardState.defender.poisonTokens > 0) {
      normDmg += 1;
      critDmg += 1;
      ui.addLog(`[剧毒] 目标携带毒素标记，${wizardState.weapon.name} 伤害 +1 (${normDmg}/${critDmg})`);
    }

    // Severe 规则 (基础或来自章战术/混沌印记)：如果保留了暴击，普通伤害升级为暴击伤害
    const hasSevereBase = wizardState.weapon.hasRule && wizardState.weapon.hasRule('Severe');
    const hasSevereFromAbility = wizardState.severeFromAbility;
    if ((hasSevereBase || hasSevereFromAbility) && remainingCrits > 0) {
      const source = hasSevereFromAbility ? '章战术/印记' : '';
      normDmg = critDmg;
      ui.addLog(`[重伤] ${wizardState.weapon.name}：保留暴击，普通伤害升级为暴击伤害 (${normDmg})${source ? ` (${source})` : ''}！`);
    }

    // Devastating 规则：暴击立即额外造成 N 点伤害
    // "immediateCritDmg" — 每个暴击命中额外 +N 伤害
    const devastatingMatch = wizardState.weapon.rules.find(r => r.startsWith('Devastating'));
    if (devastatingMatch && remainingCrits > 0) {
      const devastatingVal = parseInt(devastatingMatch.match(/\d+/)?.[0] || '0');
      if (devastatingVal > 0) {
        critDmg += devastatingVal;
        ui.addLog(`[毁灭] ${wizardState.weapon.name}：暴击额外 +${devastatingVal} 伤害 (${critDmg})！`);
      }
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
    const matchEffTs = wizardState.weapon.ts + (wizardState.attacker.isInjured ? 1 : 0);
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

    let drInputHtml = '';
    if (hasFactionTrait(wizardState.defender.faction, 'disgustingResilience') && attacksRequiringDr > 0) {
      drInputHtml = `
        <div id="manual-dr-container" style="background:var(--dark-card); padding:10px; border-radius:8px; margin-top:8px; border:1px solid var(--panel-border);">
          <label style="font-size:0.75rem; color:var(--text-muted);">录入瘟疫守卫【恶心作呕】的 ${attacksRequiringDr} 个投骰点数 (每次≥3伤害的攻击各投一次, 为空则按随机)：</label>
          <input type="text" id="manual-dr-dice-val" placeholder="例: 4,2,5" style="margin-top:4px; padding:6px; font-size:0.9rem; background:#000; border:1px solid #334155; color:#fff; width:100%;">
        </div>
      `;
    }

    body.innerHTML = `
      ${getShootDuelHeaderHtml()}

      ${matchingHtml}

      <div class="qa-card" style="margin-top:10px;">
        <p style="font-size:0.95rem; font-weight:600; color:#fff;">最终对消计算汇报：</p>
        <p style="margin-top:4px;">- 暴击命中残留: <b>${remainingCrits}</b> 个 (每个伤害: ${critDmg}${hasToxic && wizardState.defender.poisonTokens > 0 ? ' <span style="color:#a78bfa;">[剧毒+1]</span>' : ''})</p>
        <p>- 普通命中残留: <b>${remainingNorms}</b> 个 (每个伤害: ${normDmg}${hasToxic && wizardState.defender.poisonTokens > 0 ? ' <span style="color:#a78bfa;">[剧毒+1]</span>' : ''})</p>
        <p style="color:var(--sm-accent); font-weight:bold; margin-top:8px; font-size:1rem;">分配伤害总计: ${rawDmg} 点</p>
      </div>

      ${drInputHtml}
    `;

    nextBtn.textContent = '完成结算并扣血';
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

export function setRollMode(mode) {
  playSound('click');
  wizardState.mode = mode;
  renderShootStep();

  if (mode === 'manual') {
    document.getElementById('manual-attack-input').style.display = 'block';
    document.getElementById('attack-rolling-zone').style.display = 'none';
    document.getElementById('modal-btn-next').disabled = false;
  } else {
    document.getElementById('manual-attack-input').style.display = 'none';
    document.getElementById('attack-rolling-zone').style.display = 'flex';
    document.getElementById('modal-btn-next').disabled = wizardState.attackRolls.length === 0;
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
    const skipEffTs = wizardState.weapon.ts + (wizardState.attacker.isInjured ? 1 : 0);
    for (let i = currentSettleIndex; i < totalAttacks; i++) {
      const val = Math.floor(Math.random() * 6) + 1;
      finalRolls.push(val);
      const cube = diceCubes[i];
      if (cube) {
        cube.classList.remove('rolling');
        cube.textContent = val;
        if (val === 6) cube.classList.add('crit-dice');
        else if (val < skipEffTs) cube.classList.add('fail-dice');
      }
    }
    wizardState.attackRolls = finalRolls;
    recalculateAttackStats();
    renderShootStep();
  };
  pool.parentElement.appendChild(skipBtn);

  // 2. 滚动起手特效与声音
  ui.triggerCombatVisual("🔥 OPEN FIRE!", "shoot");
  playSound('shoot');

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

      const stepEffTs = wizardState.weapon.ts + (wizardState.attacker.isInjured ? 1 : 0);
      if (val === 6) {
        cube.classList.add('crit-dice');
        playSound('crit');
      } else if (val < stepEffTs) {
        cube.classList.add('fail-dice');
        playSound('click');
      } else {
        playSound('click');
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

export function renderAttackDiceView() {
  const pool = document.getElementById('attack-dice-pool');
  if (!pool) return;
  pool.innerHTML = '';

  const faction = wizardState.attacker.faction;
  const curCp = getCpForFaction(faction);
  const attDiceClass = getDiceClass(faction);
  const renderEffTs = wizardState.weapon.ts + (wizardState.attacker.isInjured ? 1 : 0);

  wizardState.attackRolls.forEach((val, idx) => {
    const d = document.createElement('div');
    let cls = `kt-dice-cube ${attDiceClass}`;
    if (val === 6) cls += ' crit-dice';
    else if (val < renderEffTs) cls += ' fail-dice';

    d.className = cls;
    d.textContent = val;

    const isFail = val < renderEffTs;
    if (isFail && curCp >= 1 && wizardState.attRerollIndex === -1) {
      const badge = document.createElement('div');
      badge.className = 'reroll-indicator';
      badge.textContent = 'R';
      d.appendChild(badge);

      d.onclick = () => rerollSingleAttackDice(idx);
      d.style.cursor = 'pointer';
    } else if (idx === wizardState.attRerollIndex) {
      const badge = document.createElement('div');
      badge.className = 'reroll-indicator';
      badge.style.background = 'var(--green)';
      badge.textContent = '✓';
      d.appendChild(badge);
    }
    pool.appendChild(d);
  });
}

export function rerollSingleAttackDice(idx) {
  playSound('shoot');
  setCpForFaction(wizardState.attacker.faction, getCpForFaction(wizardState.attacker.faction) - 1);
  ui.updateScoresUI();

  wizardState.attRerollIndex = idx;

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
  }, 500);
}

// Brutal 规则已迁移至近战 (melee) 格挡阶段：
// "Your opponent can only block with critical successes"
// 对手只能使用暴击骰进行格挡(Parry)。
// 实现位置：resolveMeleeChoice('parry')

export function recalculateAttackStats() {
  const attacker = wizardState.attacker;
  const weapon = wizardState.weapon;
  const defender = wizardState.defender;
  const injuryPenalty = (attacker && attacker.isInjured) ? 1 : 0;
  const effectiveTs = weapon.ts + injuryPenalty;
  const isMelee = !weapon.isRanged;

  // Lethal 规则：N+ 视为暴击（不仅是 6）
  const lethalMatch = weapon.rules.find(r => r.startsWith('Lethal'));
  const lethalThreshold = lethalMatch ? parseInt(lethalMatch.match(/\d+/)?.[0] || '6') : 6;

  // 基础统计
  let crits = 0;
  let norms = 0;
  wizardState.attackRolls.forEach(val => {
    if (val >= lethalThreshold) crits++;
    else if (val >= effectiveTs) norms++;
  });

  // === Standard 规则: 章战术 + 混沌印记 + Toxic ===

  // Rending 规则：如果保留了暴击，升级 1 个普通命中为暴击
  const hasRendingBase = weapon.hasRule && weapon.hasRule('Rending');
  const hasAggressive = gameState.rulesVersion === 'standard' && hasChapterTactic(attacker, 'aggressive');
  // Aggressive: 近战武器获得 Rending
  const hasRending = hasRendingBase || (hasAggressive && isMelee);
  if (hasRending && crits > 0 && norms > 0) {
    norms -= 1;
    crits += 1;
    ui.addLog(`[撕裂] ${weapon.name}：保留暴击生效，升级 1 个普通命中为暴击！${hasAggressive && !hasRendingBase ? ' (凶猛章战术)' : ''}`);
  }

  // Punishing 规则：如果保留了暴击，保留 1 个失败骰作为普通成功
  const hasPunishing = weapon.hasRule && weapon.hasRule('Punishing');
  if (hasPunishing && crits > 0) {
    const fails = wizardState.attackRolls.filter(val => val < effectiveTs && val !== 6 && val < lethalThreshold).length;
    if (fails > 0) {
      norms += 1;
      ui.addLog(`[惩罚] ${weapon.name}：保留暴击生效，保留 1 个失败骰作为普通成功！`);
    }
  }

  // Accurate 规则：自动保留 N 个普通成功（不投）
  const accurateMatch = weapon.rules.find(r => r.startsWith('Accurate'));
  const hasSharpshooter = gameState.rulesVersion === 'standard' && hasChapterTactic(attacker, 'sharpshooter');
  // Sharpshooter: 未移动时爆弹武器 Accurate 1 + Severe
  const isBoltWeapon = /bolt/i.test(weapon.name);
  const hasnNotMoved = attacker && attacker.actionsPerformed.length === 0;
  const hasAccurateSharpshooter = hasSharpshooter && isBoltWeapon && hasnNotMoved;

  if (accurateMatch || hasAccurateSharpshooter) {
    const accurateVal = accurateMatch ? parseInt(accurateMatch.match(/\d+/)?.[0] || '1') : 1;
    const fails = wizardState.attackRolls.filter(val => val < effectiveTs && val < lethalThreshold).length;
    const upgradeCount = Math.min(accurateVal, fails);
    if (upgradeCount > 0) {
      norms += upgradeCount;
      ui.addLog(`[精准] ${weapon.name}：自动保留 ${upgradeCount} 个普通成功！${hasAccurateSharpshooter && !accurateMatch ? ' (神射手章战术)' : ''}`);
    }
  }

  // === Standard 规则: Toxic 武器规则 (PM) ===
  const hasToxic = weapon.hasRule && weapon.hasRule('Toxic');
  if (hasToxic && defender && defender.poisonTokens > 0) {
    ui.addLog(`[毒素] ${weapon.name}：目标携带毒素标记，Normal/Critical Dmg +1！`);
    // Toxic 效果存储在 wizardState 中供伤害计算使用
    wizardState.toxicBonusActive = true;
  } else {
    wizardState.toxicBonusActive = false;
  }

  // === Standard 规则: Severe from Chapter Tactics / Marks ===
  const hasSevereBase = weapon.hasRule && weapon.hasRule('Severe');
  const hasKhorne = gameState.rulesVersion === 'standard' && hasMarkOfChaos(attacker, 'KHORNE');
  const hasTzeentch = gameState.rulesVersion === 'standard' && hasMarkOfChaos(attacker, 'TZEENTCH');
  // Khorne: 近战 Severe; Tzeentch: 远程 Severe; Sharpshooter + 未移动: 爆弹 Severe
  wizardState.severeFromAbility = !hasSevereBase && (
    (hasKhorne && isMelee) ||
    (hasTzeentch && !isMelee) ||
    (hasSharpshooter && isBoltWeapon && hasnNotMoved)
  );
  if (wizardState.severeFromAbility) {
    const source = hasKhorne ? '恐虐印记' : hasTzeentch ? '奸奇印记' : '神射手章战术';
    ui.addLog(`[重伤] ${attacker.name}：${source}生效，武器获得 Severe！`);
  }

  // === Standard 规则: Siege Specialist — 远程 Saturate ===
  const hasSiegeSpecialist = gameState.rulesVersion === 'standard' && hasChapterTactic(attacker, 'siege_specialist');
  wizardState.saturateFromAbility = hasSiegeSpecialist && !isMelee;
  if (wizardState.saturateFromAbility) {
    ui.addLog(`[攻城专家] ${attacker.name}：远程武器获得 Saturate！`);
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
    const hasSaturateForZeroDf = wizardState.weapon.hasRule && wizardState.weapon.hasRule('Saturate');
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
  playSound('shoot');

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
        playSound('click');
      } else {
        playSound('click');
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

  const faction = wizardState.defender.faction;
  const curCp = getCpForFaction(faction);
  const defDiceClass = getDiceClass(faction);

  wizardState.defenseRolls.forEach((val, idx) => {
    const d = document.createElement('div');
    let cls = `kt-dice-cube ${defDiceClass}`;
    if (val === 6) cls += ' crit-dice';
    else if (val < wizardState.defender.sv) cls += ' fail-dice';

    d.className = cls;
    d.textContent = val;

    const isFail = val < wizardState.defender.sv;
    if (isFail && curCp >= 1 && wizardState.defRerollIndex === -1) {
      const badge = document.createElement('div');
      badge.className = 'reroll-indicator';
      badge.textContent = 'R';
      d.appendChild(badge);

      d.onclick = () => rerollSingleDefenseDice(idx, dfCount);
      d.style.cursor = 'pointer';
    } else if (idx === wizardState.defRerollIndex) {
      const badge = document.createElement('div');
      badge.className = 'reroll-indicator';
      badge.style.background = 'var(--green)';
      badge.textContent = '✓';
      d.appendChild(badge);
    }
    pool.appendChild(d);
  });
}

export function rerollSingleDefenseDice(idx, dfCount) {
  playSound('save');
  setCpForFaction(wizardState.defender.faction, getCpForFaction(wizardState.defender.faction) - 1);
  ui.updateScoresUI();

  wizardState.defRerollIndex = idx;

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

  // Saturate 规则：防御方不能保留掩体骰
  const hasSaturateBase = weapon.hasRule && weapon.hasRule('Saturate');
  // Siege Specialist (攻击方): 远程 Saturate (从攻击骰阶段保存)
  const saturateActive = hasSaturateBase || wizardState.saturateFromAbility;

  // Camo Cloak (SM Eliminator Sniper): 忽略 Saturate
  const hasCamoCloak = gameState.rulesVersion === 'standard' && defender.operativeType === 'sm_eliminator_sniper';
  const saturateIgnored = hasCamoCloak && saturateActive;
  if (saturateIgnored) {
    ui.addLog(`[伪装斗篷] ${defender.name}：忽略 Saturate 规则！`);
  }

  const saturateEffective = saturateActive && !saturateIgnored;
  let norms = (wizardState.inCover && !saturateEffective) ? 1 : 0;

  // Hardy (Chapter Tactic): 防御 5+ 为暴击
  const hasHardy = gameState.rulesVersion === 'standard' && hasChapterTactic(defender, 'hardy');
  // Repulsive Fortitude (PM Warrior): 防御 5+ 算暴击
  const hasRepulsiveFortitude = gameState.rulesVersion === 'standard' && defender.operativeType === 'pm_warrior';
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

  wizardState.defCrit = crits;
  wizardState.defNorm = norms;
}

// ==========================================
//          Manual Input
// ==========================================

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
  playSound('click');
  const attacker = wizardState.attacker;
  const defender = wizardState.defender;

  let manualDrRolls = null;
  const drInput = document.getElementById('manual-dr-dice-val');
  if (drInput && drInput.value.trim() !== '') {
    manualDrRolls = drInput.value.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n >= 1 && n <= 6);
  }

  ui.addLog(`\n--- 射击对决结果 ---`);
  ui.addLog(`[攻击方] ${attacker.name} 使用 ${wizardState.weapon.name} 射击`);
  ui.addLog(`[防守方] ${defender.name}`);

  const actualDamage = defender.applyWounds(dmgPerAttack, manualDrRolls);

  // === Standard 规则: 击杀回调 ===
  if (defender.isDead && gameState.rulesVersion === 'standard') {
    triggerKillAbilities(attacker, defender, 'shoot', actualDamage);
  }

  // Poison 规则：造成 ≥1 伤害且武器有 Poison，defender 获得 poison token
  const hasPoison = wizardState.weapon.hasRule && wizardState.weapon.hasRule('Poison');
  if (hasPoison && actualDamage > 0 && defender.poisonTokens < 1) {
    defender.poisonTokens = 1;
    ui.addLog(`[毒素] ${defender.name} 获得了 1 个毒素标记！下次激活开始时将受到 1 点伤害。`);
  }

  // PSYCHIC 规则：攻击方每投出 1，自己受到 1 点伤害 (Peril)
  const hasPsychic = wizardState.weapon.hasRule && wizardState.weapon.hasRule('PSYCHIC');
  if (hasPsychic) {
    const perilCount = wizardState.attackRolls.filter(r => r === 1).length;
    if (perilCount > 0) {
      ui.addLog(`[灵能反噬] ${wizardState.weapon.name} 引发危险！投出 ${perilCount} 个 1，攻击方受到 ${perilCount} 点伤害。`);
      attacker.applyWounds(perilCount);
    }
  }

  // Hot 规则：使用后投 D6，若 < Hit，反噬 = 结果 × 2
  // "After an operative uses this weapon, roll one D6: if the result is less
  //  than the weapon's Hit stat, inflict damage on that operative equal to
  //  the result multiplied by two."
  const hasHot = wizardState.weapon.hasRule && wizardState.weapon.hasRule('Hot');
  if (hasHot) {
    const hotRoll = Math.floor(Math.random() * 6) + 1;
    const hitStat = wizardState.weapon.ts;
    if (hotRoll < hitStat) {
      const hotDamage = hotRoll * 2;
      ui.addLog(`[过热] ${wizardState.weapon.name}：投出 ${hotRoll} < ${hitStat}，反噬 ${hotDamage} 点伤害！`);
      attacker.applyWounds(hotDamage);
    } else {
      ui.addLog(`[过热] ${wizardState.weapon.name}：投出 ${hotRoll} ≥ ${hitStat}，安全。`);
    }
  }

  attacker.apl -= 1;
  attacker.actionsPerformed.push('Shoot');
  ui.addLog(`[行动点] ${attacker.name} 消耗 1 APL，当前 APL: ${attacker.apl}`);

  closeModal();

  if (actualDamage > 0) {
    setTimeout(() => {
      ui.triggerAvatarHitEffect(defender.id, 'shoot');
    }, 100);
  }
}

// ==========================================
//          Fight Wizard
// ==========================================

export function openFightWizard() {
  playSound('click');
  const op = gameState.activeAgent;
  if (!op) return;

  const modalContent = document.querySelector('#combat-modal .modal-content');
  if (modalContent) {
    modalContent.style.backgroundImage = `linear-gradient(rgba(11, 17, 32, 0.85), rgba(11, 17, 32, 0.95)), url("${getAssetPath('assets/images/backgrounds/bg_melee_action.png')}")`;
    modalContent.style.backgroundSize = 'cover';
    modalContent.style.backgroundPosition = 'center';
  }

  Object.assign(wizardState, {
    actionType: 'fight',
    step: 1,
    attacker: op,
    defender: null,
    weapon: op.weapons.filter(w => !w.isRanged)[0] || null,
    inMeleeRange: true,
    hasFallenBack: false,
    mode: 'random',
    activeAttackerDice: [],
    activeDefenderDice: [],
    meleeTurn: 'attacker',
    meleeLogs: ''
  });

  if (!wizardState.weapon) {
    if (showToast) showToast('该特工没有配备任何近战武器！', 'warning');
    return;
  }

  openModal();
  renderFightStep();
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
      const injuredTag = t.isInjured ? ' <span style="color:var(--red); font-size:0.7rem;">[重伤]</span>' : '';
      const poisonTag = t.poisonTokens > 0 ? ' <span style="color:#7ab88a; font-size:0.7rem;">[毒素]</span>' : '';
      listHtml += `
        <div class="weapon-pick-item ${wizardState.defender && wizardState.defender.id === t.id ? 'selected' : ''}" role="button" tabindex="0" onclick="selectFightDefender('${t.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectFightDefender('${t.id}')}">
          <span class="weapon-pick-name">${t.name}${injuredTag}${poisonTag}</span>
          <span class="weapon-pick-stats">HP: ${t.wounds}/${t.maxWounds} | DF:${t.df}</span>
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

    // Injured 惩罚：武器 Hit -1
    const isInjuredAttacker = wizardState.attacker.isInjured;

    let listHtml = '<div class="weapon-picker-list">';
    meleeWeapons.forEach((w, idx) => {
      const hitStat = isInjuredAttacker ? `${w.ts}+ <span style="color:var(--red); font-size:0.7rem;">→ ${w.ts + 1}+</span>` : `${w.ts}+`;
      const rulesStr = w.rules && w.rules.length > 0 ? ` | ${w.rules.map(translateRule).join(', ')}` : '';
      listHtml += `
        <div class="weapon-pick-item ${wizardState.weapon.name === w.name ? 'selected' : ''}" role="button" tabindex="0" onclick="selectFightWeapon(${idx})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectFightWeapon(${idx})}">
          <span class="weapon-pick-name">${w.name}</span>
          <span class="weapon-pick-stats">A: ${w.attacks} | WS: ${hitStat} | D: ${w.normalDamage}/${w.criticalDamage}${rulesStr}</span>
        </div>
      `;
    });
    listHtml += '</div>';

    body.innerHTML = `
      <p style="margin-bottom:10px;">选择你要使用的近战武器：</p>
      ${listHtml}
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
      <div class="melee-grid" style="margin-bottom: 16px;">
        <div class="melee-pool-card">
          <div class="melee-pool-title">攻击方 (${wizardState.attacker.name})</div>
          <div class="melee-dice-pool" id="melee-att-pool">
            <span style="color:var(--text-muted); font-size:0.8rem;">等待投骰...</span>
          </div>
        </div>

        <div class="melee-pool-card">
          <div class="melee-pool-title">防守方 (${wizardState.defender.name})</div>
          <div class="melee-dice-pool" id="melee-def-pool">
            <span style="color:var(--text-muted); font-size:0.8rem;">等待投骰...</span>
          </div>
        </div>
      </div>

      <button class="btn-large" id="btn-roll-melee" onclick="rollMeleeDice()">开始掷骰</button>
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
    const turnColor = wizardState.meleeTurn === 'attacker' ? '#6a9ad4' : 'var(--pm-accent)';

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
      const opponentHasBrutal = opponentWeaponForParry && opponentWeaponForParry.hasRule && opponentWeaponForParry.hasRule('Brutal');
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
    const skipAttEffTs = wizardState.weapon.ts + (wizardState.attacker.isInjured ? 1 : 0);
    const skipDefEffTs = defMeleeWeapon.ts + (wizardState.defender.isInjured ? 1 : 0);
    for (let i = attSettleIndex; i < totalAttacks; i++) {
      const val = Math.floor(Math.random() * 6) + 1;
      finalAttRolls.push(val);
      const cube = attCubes[i];
      if (cube) {
        cube.classList.remove('rolling');
        cube.textContent = val;
        if (val === 6) cube.classList.add('crit-dice');
        else if (val < skipAttEffTs) cube.classList.add('fail-dice');
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
        else if (val < skipDefEffTs) cube.classList.add('fail-dice');
      }
    }
    finishMeleeRolls();
  };
  // Append to a common parent that holds the button
  const meleeBody = document.getElementById('modal-body');
  if (meleeBody) meleeBody.appendChild(skipBtn);

  ui.triggerCombatVisual("⚔️ MELEE CLASH!", "shoot");
  playSound('shoot');

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

      const attEffTs = wizardState.weapon.ts + (wizardState.attacker.isInjured ? 1 : 0);
      if (val === 6) {
        cube.classList.add('crit-dice');
        playSound('crit');
      } else if (val < attEffTs) {
        cube.classList.add('fail-dice');
        playSound('click');
      } else {
        playSound('click');
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

      const defEffTs = defMeleeWeapon.ts + (wizardState.defender.isInjured ? 1 : 0);
      if (val === 6) {
        cube.classList.add('crit-dice');
        playSound('crit');
      } else if (val < defEffTs) {
        cube.classList.add('fail-dice');
        playSound('click');
      } else {
        playSound('click');
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
    const effectiveAttTs = wizardState.weapon.ts + attInjuryPenalty;
    const effectiveDefTs = defMeleeWeapon.ts + defInjuryPenalty;

    // 存储所有投骰结果（包括失败的）用于重投
    wizardState.allAttackerRolls = finalAttRolls.map((val, idx) => ({
      val,
      isSuccess: val >= effectiveAttTs || val === 6,
      isCrit: val === 6,
      originalIdx: idx
    }));
    wizardState.allDefenderRolls = finalDefRolls.map((val, idx) => ({
      val,
      isSuccess: val >= effectiveDefTs || val === 6,
      isCrit: val === 6,
      originalIdx: idx
    }));

    wizardState.activeAttackerDice = finalAttRolls
      .filter(val => val >= effectiveAttTs || val === 6)
      .map(val => ({ val, isCrit: val === 6, used: false }));

    wizardState.activeDefenderDice = finalDefRolls
      .filter(val => val >= effectiveDefTs || val === 6)
      .map(val => ({ val, isCrit: val === 6, used: false }));

    // 存储有效的 TS 值用于重投计算
    wizardState.meleeEffectiveAttTs = effectiveAttTs;
    wizardState.meleeEffectiveDefTs = effectiveDefTs;
    wizardState.meleeDefWeapon = defMeleeWeapon;

    // 黑暗狂热 (Dark Zealotry) 策略检查: 允许重投 1 个失败骰
    wizardState.darkZealotryUsed = { attacker: false, defender: false };
    const attHasDarkZealotry = hasFactionTrait(wizardState.attacker.faction, 'darkZealotry') &&
      getActivePloys(wizardState.attacker.faction).includes('dark_zealotry');
    const defHasDarkZealotry = hasFactionTrait(wizardState.defender.faction, 'darkZealotry') &&
      getActivePloys(wizardState.defender.faction).includes('dark_zealotry');

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

    nextBtn.disabled = false;
  }

  scheduleTimeout(settleAttackerDice, 1200);
}

// 黑暗狂热: 重投 1 个失败近战骰
export function rerollMeleeDice(side) {
  if (wizardState.darkZealotryUsed[side]) {
    ui.showToast('每方只能使用 1 次黑暗狂热重投！', 'warning');
    return;
  }

  const allRolls = side === 'attacker' ? wizardState.allAttackerRolls : wizardState.allDefenderRolls;
  const failedRolls = allRolls.filter(r => !r.isSuccess);

  if (failedRolls.length === 0) {
    ui.showToast('没有可重投的失败骰！', 'warning');
    return;
  }

  // 随机选择 1 个失败骰重投
  const rerollIdx = Math.floor(Math.random() * failedRolls.length);
  const rerollTarget = failedRolls[rerollIdx];
  const effectiveTs = side === 'attacker' ? wizardState.meleeEffectiveAttTs : wizardState.meleeEffectiveDefTs;

  const newVal = Math.floor(Math.random() * 6) + 1;
  const wasSuccess = newVal >= effectiveTs || newVal === 6;

  playSound('crit');

  // 更新原始投骰记录
  const originalRoll = side === 'attacker'
    ? wizardState.allAttackerRolls[rerollTarget.originalIdx]
    : wizardState.allDefenderRolls[rerollTarget.originalIdx];

  const oldVal = originalRoll.val;
  originalRoll.val = newVal;
  originalRoll.isSuccess = wasSuccess;
  originalRoll.isCrit = newVal === 6;

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

  attPool.innerHTML = '';
  wizardState.activeAttackerDice.forEach(d => {
    let cls = `kt-dice-cube ${attDiceClass}`;
    if (d.isCrit) cls += ' crit-dice';
    const dice = document.createElement('div');
    dice.className = cls;
    dice.textContent = d.val;
    attPool.appendChild(dice);
  });
  if (wizardState.activeAttackerDice.length === 0) {
    const span = document.createElement('span');
    span.style.cssText = 'color:var(--text-muted);font-size:0.85rem;';
    span.textContent = '全部未命中';
    attPool.appendChild(span);
  }

  defPool.innerHTML = '';
  wizardState.activeDefenderDice.forEach(d => {
    let cls = `kt-dice-cube ${defDiceClass}`;
    if (d.isCrit) cls += ' crit-dice';
    const dice = document.createElement('div');
    dice.className = cls;
    dice.textContent = d.val;
    defPool.appendChild(dice);
  });
  if (wizardState.activeDefenderDice.length === 0) {
    const span = document.createElement('span');
    span.style.cssText = 'color:var(--text-muted);font-size:0.85rem;';
    span.textContent = '全部未命中';
    defPool.appendChild(span);
  }
}

// ==========================================
//          Melee Duel Headers
// ==========================================

export function getDuelAvatarHtml(opId, faction) {
  const avatarUrl = gameState.customAvatars[opId];
  const cssSuffix = getFactionCssSuffix(faction);
  let fallbackUrl = getAssetPath(`assets/images/defaults/default_${cssSuffix}_avatar.png`);

  const activeOp = gameState.operatives.find(o => o.id === opId);
  if (activeOp && activeOp.defaultAvatar) {
    fallbackUrl = getAssetPath(activeOp.defaultAvatar);
  } else {
    // Determine the template source based on faction for avatar path
    const idSuffix = opId.replace(/^(sm_|pm_|leg_)/, '');
    const templateAvatar = getAssetPath(`assets/images/operatives/${cssSuffix}/${cssSuffix}_${idSuffix}.png`);
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

  const attHpPct = Math.max(0, (att.wounds / att.maxWounds) * 100);
  const defHpPct = Math.max(0, (def.wounds / def.maxWounds) * 100);

  return `
    <div class="melee-duel-header" style="display:flex; justify-content:space-around; align-items:center; background:rgba(26,29,36,0.4); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:12px; margin-bottom:16px;">
      <!-- Attacker Panel -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; gap:6px; min-width: 0;">
        ${getDuelAvatarHtml(att.id, att.faction)}
        <div style="font-weight:bold; font-size:0.85rem; color:#6a9ad4; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" title="${att.name}">${att.name}</div>
        <div style="font-size:0.7rem; color:var(--text-muted); font-family:'Pirata One',serif; text-transform:uppercase;">攻击方</div>
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
        <div style="font-weight:bold; font-size:0.85rem; color:var(--pm-accent); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" title="${def.name}">${def.name}</div>
        <div style="font-size:0.7rem; color:var(--text-muted); font-family:'Pirata One',serif; text-transform:uppercase;">防守方</div>
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

  const attHpPct = Math.max(0, (att.wounds / att.maxWounds) * 100);
  const defHpPct = Math.max(0, (def.wounds / def.maxWounds) * 100);

  return `
    <div class="melee-duel-header" style="display:flex; justify-content:space-around; align-items:center; background:rgba(26,29,36,0.4); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:12px; margin-bottom:16px;">
      <!-- Attacker Panel -->
      <div style="display:flex; flex-direction:column; align-items:center; flex:1; gap:6px; min-width: 0;">
        ${getDuelAvatarHtml(att.id, att.faction)}
        <div style="font-weight:bold; font-size:0.85rem; color:#6a9ad4; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" title="${att.name}">${att.name}</div>
        <div style="font-size:0.7rem; color:var(--text-muted); font-family:'Pirata One',serif; text-transform:uppercase;">射击方</div>
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
        <div style="font-weight:bold; font-size:0.85rem; color:var(--pm-accent); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:100%;" title="${def.name}">${def.name}</div>
        <div style="font-size:0.7rem; color:var(--text-muted); font-family:'Pirata One',serif; text-transform:uppercase;">防守方</div>
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
    const hasToxicMelee = activeWeapon.hasRule && activeWeapon.hasRule('Toxic');
    if (hasToxicMelee && targetOpponent.poisonTokens > 0) {
      strikeNormDmg += 1;
      strikeCritDmg += 1;
      ui.addLog(`[剧毒] 目标携带毒素标记，${activeWeapon.name} 近战伤害 +1 (${strikeNormDmg}/${strikeCritDmg})`);
    }

    // Severe 规则 (基础或来自章战术/混沌印记)
    const hasSevereBaseMelee = activeWeapon.hasRule && activeWeapon.hasRule('Severe');
    const hasKhorne = gameState.rulesVersion === 'standard' && hasMarkOfChaos(strikeAttacker, 'KHORNE');
    const hasAggressive = gameState.rulesVersion === 'standard' && hasChapterTactic(strikeAttacker, 'aggressive');
    // Khorne: 近战 Severe; Aggressive: 近战 Rending (已在掷骰处理)
    const severeFromAbility = (hasKhorne && isMeleeWeapon);

    // Severe: 如果保留暴击且打击使用暴击骰，普通伤害升级为暴击伤害
    if ((hasSevereBaseMelee || severeFromAbility) && dice.isCrit) {
      strikeNormDmg = strikeCritDmg;
      const source = severeFromAbility && !hasSevereBaseMelee ? ' (恐虐印记)' : '';
      ui.addLog(`[重伤] ${activeWeapon.name}：暴击打击，普通伤害升级为暴击伤害 (${strikeNormDmg})${source}！`);
    }

    const dmg = dice.isCrit ? strikeCritDmg : strikeNormDmg;
    const msg = `> ${side === 'attacker' ? '攻击方' : '防守方'} 执行打击 (Strike)，分配了 ${dmg} 伤害！<br>`;
    wizardState.meleeLogs += msg;

    targetOpponent.applyWounds(dmg);

    // === Standard 规则: 近战击杀回调 ===
    if (targetOpponent.isDead && gameState.rulesVersion === 'standard') {
      const meleeAttacker = side === 'attacker' ? wizardState.attacker : wizardState.defender;
      triggerKillAbilities(meleeAttacker, targetOpponent, 'fight', dmg);
    }

    // Poison 规则：近战造成 ≥1 伤害且武器有 Poison，给予毒素标记
    const hasPoisonMelee = activeWeapon.hasRule && activeWeapon.hasRule('Poison');
    if (hasPoisonMelee && dmg > 0 && targetOpponent.poisonTokens < 1) {
      targetOpponent.poisonTokens = 1;
      ui.addLog(`[毒素] ${targetOpponent.name} 获得了 1 个毒素标记！(来自近战)`);
    }

    // ---- Shock 规则 ----
    // "The first time you strike with a critical success in each sequence,
    //  also discard one of your opponent's unresolved normal successes
    //  (or one of their critical successes if there are none)."
    // 每次序列中第一次暴击打击时，丢弃对手 1 个未解决的普通成功（或暴击成功，若无普通）。
    const hasShockMelee = activeWeapon.hasRule && activeWeapon.hasRule('Shock');
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
    const hasStunMelee = activeWeapon.hasRule && activeWeapon.hasRule('Stun');
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
    ui.triggerCombatVisual("⚔️ STRIKE! -" + dmg, "strike");
  } else {
    // ---- Brutal 规则 ----
    // "Your opponent can only block with critical successes"
    // 当对手使用带 Brutal 的武器攻击时，你只能用暴击骰格挡。
    // 当前 side 是正在执行 parry 的一方；对手 = 攻击发起方。
    const opponentWeapon = side === 'attacker'
      ? (wizardState.defender.weapons.filter(w => !w.isRanged)[0] || null)
      : wizardState.weapon;
    const opponentHasBrutal = opponentWeapon && opponentWeapon.hasRule && opponentWeapon.hasRule('Brutal');
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
    ui.triggerCombatVisual("🛡️ PARRY!", "parry");
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
