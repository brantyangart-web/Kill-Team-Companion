import { gameState, wizardState, GAG_MESSAGES, hasUsableOperatives, switchSides, endTurningPoint, startCounteractActivation, skipCounteract } from './state.js';
import { playSound } from './audio.js';
import { SM_TEMPLATES, PM_TEMPLATES, LEG_TEMPLATES, RULE_TEXTS } from './constants.js';
import { Weapon, Operative, translateRule } from './models.js';
import {
  getEnemyFaction, getDiceClass, getCpForFaction, setCpForFaction,
  getVpForFaction, setVpForFaction, getFactionDisplayName, getFactionCssSuffix,
  hasFactionTrait, getActivePloys, setActivePloys, getFaction, getTeamSlot,
  getTeamCssClass, getFactionThemeVar
} from '../rules/faction.js';
import { getAssetPath } from './paths.js';

// Accessibility: check reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// ==========================================
//           Mission Type Data
// ==========================================

const MISSION_LABELS = {
  'seize_ground': '夺取阵地 (Seize Ground)',
  'recovery': '物资回收 (Recovery)',
  'breakthrough': '突破防线 (Breakthrough)',
  'custom': '自定义 (Custom)'
};

const MISSION_DESCRIPTIONS = {
  'seize_ground': '<b style="color:var(--imperial-gold);">夺取阵地：</b>棋盘上通常摆放 3 个目标点。每回合结束时，根据控制的目标数量与局势获得 VP。',
  'recovery': '<b style="color:var(--imperial-gold);">物资回收：</b>棋盘上散布遗物/情报标记。通过移动或激活动作拾取，并护送携带者回到己方部署区以完成回收。',
  'breakthrough': '<b style="color:var(--imperial-gold);">突破防线：</b>派遣特工穿越战场，进入敌方部署区以获取 VP。先抵达敌方阵地者得分。',
  'custom': '<b style="color:var(--imperial-gold);">自定义任务：</b>根据实体任务卡或自定规则，自由勾选各项得分条件。'
};

// 每个任务类型对应的目标 checklist (5 项)
const MISSION_OBJECTIVES = {
  'seize_ground': [
    '控制中央目标点 (+1 VP)',
    '控制左翼目标点 (+1 VP)',
    '控制右翼目标点 (+1 VP)',
    '控制目标数量多于对手 (+1 VP)',
    '消灭对方半数以上特工 (+1 VP)'
  ],
  'recovery': [
    '拾取 1 枚遗物/情报 (+1 VP)',
    '拾取 2 枚及以上遗物/情报 (+1 VP)',
    '将遗物送回己方部署区 (+1 VP)',
    '阻止对手完成回收 (+1 VP)',
    '消灭敌方携带遗物的特工 (+1 VP)'
  ],
  'breakthrough': [
    '1 名特工进入敌方部署区 (+1 VP)',
    '2+ 名特工进入敌方部署区 (+1 VP)',
    '控制敌方部署区内的目标 (+1 VP)',
    '阻滞敌方推进（敌方无人进入你部署区）(+1 VP)',
    '歼灭敌方后卫力量 (+1 VP)'
  ],
  'custom': [
    '控制 1+ 目标点 (+1 VP)',
    '控制目标多于对手 (+1 VP)',
    '完成特定任务动作 (+1 VP)',
    '本回合秘密任务 1 (+1 VP)',
    '本回合秘密任务 2 (+1 VP)'
  ]
};

export function updateMissionDesc() {
  const select = document.getElementById('mission-type');
  const desc = document.getElementById('mission-desc');
  if (select && desc) {
    desc.innerHTML = MISSION_DESCRIPTIONS[select.value] || '';
  }
}

export function updateRulesVersion() {
  const select = document.getElementById('rules-version');
  const desc = document.getElementById('rules-version-desc');
  if (select) {
    gameState.rulesVersion = select.value;
  }
  if (desc) {
    if (gameState.rulesVersion === 'lite') {
      desc.innerHTML = '<b style="color:var(--sm-accent);">Lite 规则：</b>简化版规则，隐藏 Advance（前进）行动，Dash 固定 3"，适合新手快速上手。';
    } else {
      desc.innerHTML = '<b style="color:var(--imperial-gold);">Standard 规则：</b>完整版规则，包含所有行动（Advance/Dash/Fall Back），适合有经验的玩家。';
    }
  }
  // 更新 Advance 行的可见性 (隐藏整行，包括帮助按钮)
  const advanceBtn = document.getElementById('action-advance');
  if (advanceBtn) {
    const advanceRow = advanceBtn.closest('.action-btn-row');
    if (advanceRow) {
      advanceRow.style.display = gameState.rulesVersion === 'lite' ? 'none' : '';
    }
  }
}

// ==========================================
//           Toast Notification System
// ==========================================

let toastIdCounter = 0;

export function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) {
    // Fallback if container doesn't exist
    console.warn(`[Toast ${type}]:`, message);
    return;
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
  toast.textContent = message;
  toast.id = `toast-${++toastIdCounter}`;

  container.appendChild(toast);

  // Auto-dismiss
  const timer = setTimeout(() => {
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 300);
  }, duration);

  // Click to dismiss
  toast.addEventListener('click', () => {
    clearTimeout(timer);
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 300);
  });
}

export function showConfirmDialog(message, onConfirm) {
  // Create a styled confirm dialog instead of native confirm()
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.display = 'flex';
  overlay.setAttribute('role', 'alertdialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', '确认操作');

  overlay.innerHTML = `
    <div class="modal-content" style="max-width: 420px;">
      <div class="modal-header">
        <div class="modal-title">⚠️ 确认操作</div>
      </div>
      <div class="modal-body">
        <p style="font-size: 0.95rem; line-height: 1.6;">${message}</p>
      </div>
      <div class="modal-footer">
        <button class="modal-btn" id="confirm-dialog-cancel">取消</button>
        <button class="modal-btn primary" id="confirm-dialog-ok" style="background: linear-gradient(135deg, var(--red), #5a2020); border-color: #b84c4c;">确认</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  trapFocus(overlay);

  const cleanup = () => {
    releaseFocusTrap();
    overlay.remove();
  };

  overlay.querySelector('#confirm-dialog-cancel').addEventListener('click', () => {
    cleanup();
  });

  overlay.querySelector('#confirm-dialog-ok').addEventListener('click', () => {
    cleanup();
    if (onConfirm) onConfirm();
  });

  // Close on Escape
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      cleanup();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
}

// ==========================================
//           Focus Trap Utility
// ==========================================

let currentFocusTrap = null;
let previousFocusElement = null;

function getFocusableElements(container) {
  return container.querySelectorAll(
    'button:not([disabled]):not([tabindex="-1"]), ' +
    'input:not([disabled]):not([tabindex="-1"]), ' +
    'select:not([disabled]):not([tabindex="-1"]), ' +
    'textarea:not([disabled]):not([tabindex="-1"]), ' +
    'a[href]:not([tabindex="-1"]), ' +
    '[tabindex]:not([tabindex="-1"])'
  );
}

export function trapFocus(element) {
  previousFocusElement = document.activeElement;
  currentFocusTrap = element;

  const focusable = getFocusableElements(element);
  if (focusable.length > 0) {
    focusable[0].focus();
  }

  element._focusTrapHandler = (e) => {
    if (e.key === 'Tab') {
      const focusableEls = getFocusableElements(element);
      if (focusableEls.length === 0) return;
      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  };
  element.addEventListener('keydown', element._focusTrapHandler);
}

export function releaseFocusTrap() {
  if (currentFocusTrap && currentFocusTrap._focusTrapHandler) {
    currentFocusTrap.removeEventListener('keydown', currentFocusTrap._focusTrapHandler);
    delete currentFocusTrap._focusTrapHandler;
  }
  currentFocusTrap = null;

  if (previousFocusElement && previousFocusElement.focus) {
    previousFocusElement.focus();
  }
  previousFocusElement = null;
}

// ==========================================
//           Global Keyboard Handler
// ==========================================

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Close help modal
    const helpModal = document.getElementById('help-modal');
    if (helpModal && helpModal.style.display === 'flex') {
      closeHelpModal();
      return;
    }

    // Close combat modal
    const combatModal = document.getElementById('combat-modal');
    if (combatModal && combatModal.style.display === 'flex') {
      combat.closeModal();
      return;
    }

    // Close death overlay
    const deathOverlay = document.getElementById('death-overlay');
    if (deathOverlay && deathOverlay.style.display === 'flex') {
      confirmOperativeDeath();
      return;
    }
  }
});

// Warrior duplicate counts (slot → { templateId → count })
// slot 0 = team 0 (left), slot 1 = team 1 (right)
const selectedCounts = { 0: {}, 1: {} };

// Combat callbacks - initialized from combat module
const combat = {};
export function initCombatCallbacks(callbacks) {
  Object.assign(combat, callbacks);
}

// ==========================================
//           Logging & Score UI
// ==========================================

export function addLog(text) {
  const logPanel = document.getElementById('battle-log-lines');
  if (!logPanel) return;
  const line = document.createElement('div');
  line.textContent = text;
  logPanel.appendChild(line);
  logPanel.scrollTop = logPanel.scrollHeight;
}

export function updateScoresUI() {
  document.getElementById('sm-vp').textContent = gameState.smVp;
  document.getElementById('sm-cp').textContent = gameState.smCp;
  document.getElementById('pm-vp').textContent = gameState.pmVp;
  document.getElementById('pm-cp').textContent = gameState.pmCp;
  document.getElementById('dash-tp').textContent = gameState.turningPoint;

  let phaseName = gameState.phase;
  if (phaseName === 'Initiative') phaseName = '先攻阶段';
  else if (phaseName === 'Strategy') phaseName = '策略阶段';
  else if (phaseName === 'Firefight') phaseName = '战斗阶段';
  document.getElementById('dash-phase').textContent = phaseName;

  // Update ploy tags (dynamic based on faction)
  const ployNames = {
    'bolter_discipline': '爆弹惩戒',
    'contagious_resilience': '传染韧性',
    'dark_zealotry': '黑暗狂热',
  };
  const smTags = document.getElementById('sm-ploy-tags');
  smTags.innerHTML = '';
  const team0Suffix = getFactionCssSuffix(gameState.teamFactions[0]);
  gameState.smActivePloys.forEach(ploy => {
    const span = document.createElement('span');
    span.className = `ploy-tag ${team0Suffix}`;
    span.textContent = ployNames[ploy] || ploy;
    smTags.appendChild(span);
  });

  const pmTags = document.getElementById('pm-ploy-tags');
  pmTags.innerHTML = '';
  const team1Suffix = getFactionCssSuffix(gameState.teamFactions[1]);
  gameState.pmActivePloys.forEach(ploy => {
    const span = document.createElement('span');
    span.className = `ploy-tag ${team1Suffix}`;
    span.textContent = ployNames[ploy] || ploy;
    pmTags.appendChild(span);
  });

  // Update Next Phase button visibility inside dash
  const nextBtn = document.getElementById('btn-next-phase');
  if (nextBtn) {
    if (gameState.phase === 'Firefight' && !hasUsableOperatives(0) && !hasUsableOperatives(1)) {
      nextBtn.style.display = 'inline-block';
      nextBtn.textContent = '回合得分结算';
      nextBtn.onclick = showTurnEndScoringOverlay;
    } else {
      nextBtn.style.display = 'none';
    }
  }
}

// ---- 更新战斗面板名称/主题 (记分卡标题、战场看板标题/旗帜) ----
export function updateBattlePanelNames() {
  [0, 1].forEach(slot => {
    const faction = gameState.teamFactions[slot];
    const factionData = getFaction(faction);
    const cssSuffix = getFactionCssSuffix(faction);
    const shortName = factionData ? factionData.shortName : faction;
    const fullName = factionData ? `${factionData.shortName} (${factionData.id})` : faction;

    // Score card title
    const titleEl = document.getElementById(`score-card-title-${slot}`);
    if (titleEl) titleEl.textContent = fullName;

    // Score card CSS class (for theme color)
    const cardEl = document.getElementById(`score-card-${slot}`);
    if (cardEl) {
      cardEl.className = `score-card ${cssSuffix}`;
    }

    // Board header name
    const boardNameEl = document.getElementById(`board-header-name-${slot}`);
    if (boardNameEl) boardNameEl.textContent = `${shortName}战队`;

    // Board header image (faction-specific banner)
    const boardImgEl = document.getElementById(`board-header-img-${slot}`);
    if (boardImgEl && factionData && factionData.headerImg) {
      boardImgEl.src = getAssetPath(factionData.headerImg);
      boardImgEl.alt = `${shortName}战队旗帜`;
    }

    // Operative board CSS class (for theme border/glow)
    const boardId = slot === 0 ? 'sm-board' : 'pm-board';
    const boardEl = document.getElementById(boardId);
    if (boardEl) {
      boardEl.className = `operative-board ${cssSuffix}-team`;
    }
  });
}

export function adjustScore(teamOrFaction, type, amount) {
  playSound('click');
  if (type === 'cp') return; // CP 由规则自动管理, 不允许手动调整
  // Accept either 'sm'/'pm' (legacy) or a faction name
  let slot;
  if (teamOrFaction === 'sm') slot = 0;
  else if (teamOrFaction === 'pm') slot = 1;
  else slot = getTeamSlot(teamOrFaction);
  if (slot === 0) gameState.smVp = Math.max(0, gameState.smVp + amount);
  else gameState.pmVp = Math.max(0, gameState.pmVp + amount);
  updateScoresUI();
}

export function confirmReset() {
  showConfirmDialog('确定要重置当前对局吗？所有进度和选择将被清空。', () => {
    playSound('click');
    gameState.turningPoint = 1;
    gameState.phase = 'Initiative';
    gameState.teamFactions = { 0: 'Space Marine', 1: 'Plague Marine' };
    gameState.initiative = 'Space Marine';
    gameState.initiativeSlot = 0;
    gameState.activeTurn = 'Space Marine';
    gameState.activeTurnSlot = 0;
    gameState.smVp = 0;
    gameState.smCp = 2;
    gameState.pmVp = 0;
    gameState.pmCp = 2;
    gameState.smActivePloys = [];
    gameState.pmActivePloys = [];
    gameState.operatives = [];
    gameState.activeAgent = null;
    gameState.gameOver = false;
    gameState.smKillsScored = 0;
    gameState.pmKillsScored = 0;

    document.getElementById('start-screen').style.display = 'flex';
    document.getElementById('global-dash').style.display = 'none';
    document.getElementById('battle-area').style.display = 'none';
    document.getElementById('guidance-banner').style.display = 'none';
    document.getElementById('battle-log-lines').innerHTML = '';

    renderRosterPickers();
  });
}

export function updateGuidance(text) {
  document.getElementById('guidance-text').textContent = text;
}

// ==========================================
//           Roster & Rendering
// ==========================================

export function getOperativeAvatarUrl(opId, faction) {
  const avatarUrl = gameState.customAvatars[opId];
  const cssSuffix = getFactionCssSuffix(faction);
  let fallbackUrl = getAssetPath(`assets/images/defaults/default_${cssSuffix}_avatar.png`);

  const activeOp = gameState.operatives.find(o => o.id === opId);
  const allTemplates = SM_TEMPLATES.concat(PM_TEMPLATES).concat(LEG_TEMPLATES);

  if (activeOp && activeOp.defaultAvatar) {
    fallbackUrl = getAssetPath(activeOp.defaultAvatar);
  } else {
    const template = allTemplates.find(t => t.id === opId);
    if (template && template.defaultAvatar) {
      fallbackUrl = getAssetPath(template.defaultAvatar);
    }
  }

  return avatarUrl || fallbackUrl;
}

export function getAvatarHtml(opId, faction) {
  const imgUrl = getOperativeAvatarUrl(opId, faction);

  const activeOp = gameState.operatives.find(o => o.id === opId);
  const allTemplates = SM_TEMPLATES.concat(PM_TEMPLATES).concat(LEG_TEMPLATES);
  const opName = activeOp ? activeOp.name : (allTemplates.find(t => t.id === opId)?.name || opId);

  return `<div class="op-avatar-slot main-avatar-${opId}">
            <img src="${imgUrl}" class="op-avatar-img" alt="${opName} 头像" loading="lazy" />
          </div>`;
}

// ==========================================
//         Roster Picker (选兵阶段)
//   KT 2024 规则: 1 Leader + 5 Operators = 6 人
//   Leader: 单选 (radio)
//   Operator: 多选 (checkbox), 上限 5, Warrior 可复选
// ==========================================

function buildWeaponSummary(tmpl) {
  return tmpl.weapons.map(w => {
    const shortName = w.name.split(' ')[0];
    const rulesTag = w.rules && w.rules.length > 0 ? ` [${w.rules.map(translateRule).join(',')}]` : '';
    return shortName + rulesTag;
  }).join(' / ');
}

function buildRosterRowHtml(tmpl, faction, isLeader, checked, disabled, toggleFn, badgeStyle, slot) {
  const badge = isLeader
    ? `<span class="role-badge leader" ${badgeStyle ? `style="${badgeStyle}"` : ''}>LEADER</span>`
    : `<span class="role-badge">OPERATOR</span>`;
  const checkedAttr = checked ? 'checked' : '';
  const disabledAttr = disabled ? 'disabled' : '';
  const avatarHtml = getAvatarHtml(tmpl.id, faction);
  const warriorTag = tmpl.isWarrior ? ' <span style="color:#c9a84c; font-size:0.65rem;">[Warrior]</span>' : '';
  const prefix = `s${slot}`;

  // Warrior 使用计数器（可复选多个同型单位），其他使用复选框
  let controlHtml;
  if (tmpl.isWarrior) {
    controlHtml = `
      <div class="warrior-counter" data-warrior-id="${prefix}-${tmpl.id}">
        <button class="warrior-counter-btn minus" onclick="event.stopPropagation(); decrementWarrior(${slot},'${tmpl.id}')" aria-label="减少数量">−</button>
        <span class="warrior-counter-value" id="warrior-count-${prefix}-${tmpl.id}">0</span>
        <button class="warrior-counter-btn plus" onclick="event.stopPropagation(); incrementWarrior(${slot},'${tmpl.id}')" aria-label="增加数量">+</button>
      </div>
    `;
  } else {
    controlHtml = `<input type="checkbox" class="roster-checkbox" id="check-${prefix}-${tmpl.id}" ${checkedAttr} ${disabledAttr}>`;
  }

  return `
    ${controlHtml}
    ${avatarHtml}
    <div class="roster-op-info">
      <div class="roster-op-name">${tmpl.name} ${badge}${warriorTag}</div>
      <div class="roster-op-weapons">Move: ${tmpl.move || 6}" | HP: ${tmpl.wounds} | APL: ${tmpl.apl}</div>
      <div style="font-size:0.65rem; color:#9a9da5; margin-top:2px;">武器: ${buildWeaponSummary(tmpl)}</div>
    </div>
  `;
}

function attachRowClickHandler(rowEl, tmplId, toggleFn, isWarrior = false) {
  rowEl.onclick = (e) => {
    // Skip if clicking on interactive elements
    if (e.target.className !== 'roster-checkbox'
        && !e.target.closest('.op-avatar-slot')
        && !e.target.closest('.warrior-counter')) {
      if (isWarrior) {
        // Clicking row body of a warrior increments by 1
        incrementWarrior(tmplId);
      } else {
        const cb = document.getElementById(`check-${tmplId}`);
        if (cb && !cb.disabled) {
          cb.checked = !cb.checked;
          toggleFn(tmplId);
        }
      }
    }
  };
}

// ---- 根据 template ID 判断所属 slot (0 或 1) ----
function getSlotForTemplateId(id) {
  if (id.startsWith('sm_') || id.startsWith('leg_')) {
    // Check which slot has this faction
    const f0 = gameState.teamFactions[0];
    const f1 = gameState.teamFactions[1];
    if (id.startsWith('sm_')) {
      if (f0 === 'Space Marine') return 0;
      if (f1 === 'Space Marine') return 1;
    } else if (id.startsWith('leg_')) {
      if (f0 === 'Legionary') return 0;
      if (f1 === 'Legionary') return 1;
    }
  } else if (id.startsWith('pm_')) {
    const f0 = gameState.teamFactions[0];
    const f1 = gameState.teamFactions[1];
    if (f0 === 'Plague Marine') return 0;
    if (f1 === 'Plague Marine') return 1;
  }
  // Fallback: check prefix match with current teamFactions
  return 0;
}

// ---- 获取 slot 对应的 templates 数组 ----
function getTemplatesForSlot(slot) {
  const faction = gameState.teamFactions[slot];
  const fData = getFaction(faction);
  if (fData && fData.templates) return fData.templates;
  // Fallback
  if (faction === 'Space Marine') return SM_TEMPLATES;
  if (faction === 'Plague Marine') return PM_TEMPLATES;
  if (faction === 'Legionary') return LEG_TEMPLATES;
  return [];
}

// ---- Warrior 计数器: 增加 / 减少 ----
export function incrementWarrior(slot, id) {
  playSound('click');
  const templates = getTemplatesForSlot(slot);
  const counts = selectedCounts[slot];
  const tmpl = templates.find(t => t.id === id);
  if (!tmpl || !tmpl.isWarrior) return;

  // Operator 上限为 5 (Leader 必占 1 位, 总人数 6)
  const currentOpCount = getOperatorCount(slot);
  if (currentOpCount >= 5) {
    showToast('Operator 数量已达上限 (5 名)！请先减少其他 Operator。', 'warning');
    return;
  }

  counts[id] = (counts[id] || 0) + 1;
  const countEl = document.getElementById(`warrior-count-s${slot}-${id}`);
  if (countEl) countEl.textContent = counts[id];

  const row = document.getElementById(`picker-row-s${slot}-${id}`);
  if (row) {
    if (counts[id] > 0) row.classList.add('selected');
    else row.classList.remove('selected');
  }

  updateSelectionCounts();
  updateOperatorAvailability(slot);
}

export function decrementWarrior(slot, id) {
  playSound('click');
  const counts = selectedCounts[slot];
  if (!counts[id] || counts[id] <= 0) return;

  counts[id]--;
  const countEl = document.getElementById(`warrior-count-s${slot}-${id}`);
  if (countEl) countEl.textContent = counts[id];

  const row = document.getElementById(`picker-row-s${slot}-${id}`);
  if (row && counts[id] <= 0) row.classList.remove('selected');

  updateSelectionCounts();
  updateOperatorAvailability(slot);
}

// ---- 计算当前已选 Operator 数量 (不含 Leader) ----
function getOperatorCount(slot) {
  const templates = getTemplatesForSlot(slot);
  const counts = selectedCounts[slot];
  let count = 0;

  // 非 Warrior Operator (checkbox)
  templates.filter(t => !t.isLeader && !t.isWarrior).forEach(t => {
    if (document.getElementById(`check-s${slot}-${t.id}`)?.checked) count++;
  });

  // Warrior counts
  templates.filter(t => !t.isLeader && t.isWarrior).forEach(t => {
    count += (counts[t.id] || 0);
  });

  return count;
}

// ---- 计算当前已选总人数 (含 Leader) ----
function getSelectedTotal(slot) {
  const templates = getTemplatesForSlot(slot);
  const counts = selectedCounts[slot];
  let leaderCount = 0;

  templates.filter(t => t.isLeader).forEach(t => {
    if (document.getElementById(`check-s${slot}-${t.id}`)?.checked) leaderCount++;
  });

  return leaderCount + getOperatorCount(slot);
}

export function renderRosterPickers() {
  // 重置计数
  selectedCounts[0] = {};
  selectedCounts[1] = {};

  // 渲染两个 slot 的 roster picker
  renderRosterPickerForSlot(0);
  renderRosterPickerForSlot(1);

  updateSelectionCounts();
  updateOperatorAvailability(0);
  updateOperatorAvailability(1);
}

// ---- 渲染单个 slot 的 roster picker ----
function renderRosterPickerForSlot(slot) {
  const faction = gameState.teamFactions[slot];
  const templates = getTemplatesForSlot(slot);
  const cssSuffix = getFactionCssSuffix(faction);
  const themeVar = getFactionThemeVar(faction);
  const factionName = getFactionDisplayName(faction);
  const factionData = getFaction(faction);

  // 更新 roster card 标题和 CSS
  const rosterCard = document.getElementById(`team${slot}-roster-card`);
  const rosterTitle = document.getElementById(`team${slot}-roster-title`);
  if (rosterCard) {
    rosterCard.className = `roster-picker-card ${cssSuffix}`;
  }
  if (rosterTitle) {
    rosterTitle.textContent = factionData ? `${factionData.shortName} (${factionData.id})` : faction;
  }

  const leaders = templates.filter(t => t.isLeader);
  const operators = templates.filter(t => !t.isLeader);

  const leaderSection = document.getElementById(`team${slot}-leader-section`);
  const operatorSection = document.getElementById(`team${slot}-operator-section`);
  if (!leaderSection || !operatorSection) return;
  leaderSection.innerHTML = '';
  operatorSection.innerHTML = '';

  const slotIcon = slot === 0 ? '⚜' : '☠';

  // Leader 分组标题
  leaderSection.innerHTML = `
    <div style="font-size:0.8rem; font-weight:600; color:var(${themeVar}); margin-bottom:6px; padding-left:4px;">
      ${slotIcon} 🎖️ LEADER — 单选 1 名 ${slotIcon}
    </div>
  `;
  leaders.forEach(tmpl => {
    // Auto-check if this is the only leader option
    const autoCheck = leaders.length === 1;
    const row = document.createElement('div');
    row.className = 'roster-pick-row';
    row.id = `picker-row-s${slot}-${tmpl.id}`;
    row.innerHTML = buildRosterRowHtml(tmpl, faction, true, autoCheck, autoCheck, '', '', slot);
    // Use direct click handler
    const cb = row.querySelector('input[type="checkbox"]');
    if (cb) {
      cb.removeAttribute('onchange');
      cb.onclick = (e) => {
        e.stopPropagation();
        if (!cb.disabled) toggleSelect(slot, tmpl.id);
      };
    }
    row.onclick = (e) => {
      if (e.target.className !== 'roster-checkbox' && !e.target.closest('.op-avatar-slot')) {
        const checkbox = row.querySelector('input[type="checkbox"]');
        if (checkbox && !checkbox.disabled) {
          checkbox.checked = !checkbox.checked;
          toggleSelect(slot, tmpl.id);
        }
      }
    };
    leaderSection.appendChild(row);

    // Sync auto-check row styling
    if (autoCheck) {
      row.classList.add('selected');
    }
  });

  // Operator 分组标题
  operatorSection.innerHTML = `
    <div style="font-size:0.8rem; font-weight:600; color:var(${themeVar}); margin:12px 0 6px 4px; display:flex; justify-content:space-between; align-items:center;">
      <span>${slotIcon} 🎯 OPERATORS — 共选 5 名 (Warrior 可用计数器重复选取) ${slotIcon}</span>
      <span id="team${slot}-op-count" style="font-size:0.75rem; color:#9a9da5; font-family:'Pirata One',serif;">0 / 5</span>
    </div>
    <p style="font-size:0.7rem; color:var(--text-muted); margin-bottom:8px; padding-left:4px;">
      ⚠️ 非 Warrior 每种只能带一名。Warrior [Warrior] 可用 +/− 按钮选取最多 5 名同型单位。
    </p>
  `;
  operators.forEach(tmpl => {
    const row = document.createElement('div');
    row.className = 'roster-pick-row';
    row.id = `picker-row-s${slot}-${tmpl.id}`;
    row.innerHTML = buildRosterRowHtml(tmpl, faction, false, false, false, '', '', slot);
    // Attach click handlers
    const cb = row.querySelector('input[type="checkbox"]');
    if (cb && !tmpl.isWarrior) {
      cb.removeAttribute('onchange');
      cb.onclick = (e) => { e.stopPropagation(); toggleSelect(slot, tmpl.id); };
    }
    row.onclick = (e) => {
      if (e.target.className !== 'roster-checkbox'
          && !e.target.closest('.op-avatar-slot')
          && !e.target.closest('.warrior-counter')) {
        if (tmpl.isWarrior) {
          incrementWarrior(slot, tmpl.id);
        } else {
          const checkbox = row.querySelector('input[type="checkbox"]');
          if (checkbox && !checkbox.disabled) {
            checkbox.checked = !checkbox.checked;
            toggleSelect(slot, tmpl.id);
          }
        }
      }
    };
    operatorSection.appendChild(row);
  });
}

// ---- 阵营切换时重新渲染 roster picker ----
export function handleFactionChange(slot) {
  const select = document.getElementById(`team${slot}-faction`);
  if (!select) return;
  gameState.teamFactions[slot] = select.value;
  selectedCounts[slot] = {};  // 清空该 slot 的 warrior 计数
  renderRosterPickerForSlot(slot);
  updateSelectionCounts();
  updateOperatorAvailability(slot);
}

// ---- 通用 Toggle (leader 单选互斥; 非 warrior operator 上限检查) ----
export function toggleSelect(slot, id) {
  playSound('click');
  const templates = getTemplatesForSlot(slot);
  const tmpl = templates.find(t => t.id === id);
  const cb = document.getElementById(`check-s${slot}-${id}`);
  const row = document.getElementById(`picker-row-s${slot}-${id}`);

  if (!tmpl || !cb) return;
  // 禁止取消已选中的 disabled 项 (如唯一 leader)
  if (cb.disabled && cb.checked) return;

  if (tmpl.isLeader) {
    // Leader 单选互斥: 选中时取消其他 leader
    if (cb.checked) {
      templates.filter(t => t.isLeader && t.id !== id).forEach(other => {
        const otherCb = document.getElementById(`check-s${slot}-${other.id}`);
        if (otherCb) {
          otherCb.checked = false;
          document.getElementById(`picker-row-s${slot}-${other.id}`)?.classList.remove('selected');
        }
      });
    }
  } else if (cb.checked) {
    // 非 Warrior operator: 检查 Operator 上限 5 (Leader 必占 1 位)
    const currentOpCount = getOperatorCount(slot);
    if (currentOpCount > 5) {
      cb.checked = false;
      showToast('Operator 数量已达上限 (5 名)！请先减少其他 Operator。', 'warning');
      updateSelectionCounts();
      return;
    }
  }

  if (cb.checked) row?.classList.add('selected');
  else row?.classList.remove('selected');

  updateSelectionCounts();
  updateOperatorAvailability(slot);
}

// ---- 动态禁用: Operator 满 5 个时禁掉未选中的非 Warrior 复选框, Warrior + 按钮也限制 ----
function updateOperatorAvailability(slot) {
  const templates = getTemplatesForSlot(slot);
  const counts = selectedCounts[slot];
  const opCount = getOperatorCount(slot);
  const atOpLimit = opCount >= 5;

  templates.filter(t => !t.isLeader).forEach(tmpl => {
    if (tmpl.isWarrior) {
      const plusBtn = document.querySelector(`#picker-row-s${slot}-${tmpl.id} .warrior-counter-btn.plus`);
      const minusBtn = document.querySelector(`#picker-row-s${slot}-${tmpl.id} .warrior-counter-btn.minus`);
      const currentCount = counts[tmpl.id] || 0;
      if (plusBtn) plusBtn.disabled = atOpLimit;
      if (minusBtn) minusBtn.disabled = currentCount <= 0;
    } else {
      const cb = document.getElementById(`check-s${slot}-${tmpl.id}`);
      if (!cb) return;
      if (atOpLimit && !cb.checked) {
        cb.disabled = true;
      } else {
        cb.disabled = false;
      }
    }
  });
}

// ---- 计数显示 ----
export function updateSelectionCounts() {
  const team0Total = getSelectedTotal(0);
  const team0OpCount = getOperatorCount(0);
  const team0CountEl = document.getElementById('team0-roster-count');
  if (team0CountEl) team0CountEl.textContent = `已选: ${team0Total} / 6 人`;
  const team0OpEl = document.getElementById('team0-op-count');
  if (team0OpEl) team0OpEl.textContent = `${team0OpCount} / 5`;

  const team1Total = getSelectedTotal(1);
  const team1OpCount = getOperatorCount(1);
  const team1CountEl = document.getElementById('team1-roster-count');
  if (team1CountEl) team1CountEl.textContent = `已选: ${team1Total} / 6 人`;
  const team1OpEl = document.getElementById('team1-op-count');
  if (team1OpEl) team1OpEl.textContent = `${team1OpCount} / 5`;
}

export function validateRostersAndDeploy() {
  playSound('click');

  // 收集 Team 0 选中的模板和数量（warrior 可 > 1）
  const team0Templates = getTemplatesForSlot(0);
  const team0Entries = []; // { tmpl, count }
  let team0LeaderCount = 0;
  team0Templates.forEach(t => {
    if (t.isWarrior) {
      const count = selectedCounts[0][t.id] || 0;
      if (count > 0) {
        team0Entries.push({ tmpl: t, count });
      }
    } else if (document.getElementById(`check-s0-${t.id}`)?.checked) {
      team0Entries.push({ tmpl: t, count: 1 });
      if (t.isLeader) team0LeaderCount++;
    }
  });
  const team0Total = team0Entries.reduce((sum, e) => sum + e.count, 0);

  // 收集 Team 1 选中的模板和数量
  const team1Templates = getTemplatesForSlot(1);
  const team1Entries = [];
  team1Templates.forEach(t => {
    if (t.isWarrior) {
      const count = selectedCounts[1][t.id] || 0;
      if (count > 0) {
        team1Entries.push({ tmpl: t, count });
      }
    } else if (document.getElementById(`check-s1-${t.id}`)?.checked) {
      team1Entries.push({ tmpl: t, count: 1 });
    }
  });
  const team1Total = team1Entries.reduce((sum, e) => sum + e.count, 0);

  const team0Faction = gameState.teamFactions[0];
  const team1Faction = gameState.teamFactions[1];

  // 校验 Team 0
  if (team0Total !== 6) {
    playSound('alert');
    showToast(`${getFactionDisplayName(team0Faction)} 必须刚好选择 6 人！当前选择了 ${team0Total} 人。`, 'error');
    return;
  }
  if (team0LeaderCount !== 1) {
    playSound('alert');
    showToast(`${getFactionDisplayName(team0Faction)} 必须选择且仅选择 1 名队长！`, 'error');
    return;
  }

  // 校验 Team 1
  if (team1Total !== 6) {
    playSound('alert');
    showToast(`${getFactionDisplayName(team1Faction)} 必须刚好选择 6 人！当前选择了 ${team1Total} 人。`, 'error');
    return;
  }
  const team1LeaderCount = team1Entries.filter(e => e.tmpl.isLeader).reduce((s, e) => s + e.count, 0);
  if (team1LeaderCount !== 1) {
    playSound('alert');
    showToast(`${getFactionDisplayName(team1Faction)} 必须选择且仅选择 1 名队长！`, 'error');
    return;
  }

  // 校验通过，载入特工列表
  gameState.operatives = [];

  // 加载 Team 0
  team0Entries.forEach(({ tmpl, count }) => {
    for (let i = 0; i < count; i++) {
      const uniqueId = count > 1 ? `${tmpl.id}_${i + 1}` : tmpl.id;
      const displayName = count > 1 ? `${tmpl.name} #${i + 1}` : tmpl.name;
      const op = new Operative(uniqueId, displayName, team0Faction, tmpl.wounds, tmpl.apl, tmpl.df, tmpl.sv, tmpl.weapons, tmpl.defaultAvatar, tmpl.move || 6, 0);
      // Standard 规则: 从模板复制 operativeType
      if (tmpl.operativeType) op.operativeType = tmpl.operativeType;
      gameState.operatives.push(op);
    }
  });

  // 加载 Team 1
  team1Entries.forEach(({ tmpl, count }) => {
    for (let i = 0; i < count; i++) {
      const uniqueId = count > 1 ? `${tmpl.id}_${i + 1}` : tmpl.id;
      const displayName = count > 1 ? `${tmpl.name} #${i + 1}` : tmpl.name;
      const op = new Operative(uniqueId, displayName, team1Faction, tmpl.wounds, tmpl.apl, tmpl.df, tmpl.sv, tmpl.weapons, tmpl.defaultAvatar, tmpl.move || 5, 1);
      // Standard 规则: 从模板复制 operativeType
      if (tmpl.operativeType) op.operativeType = tmpl.operativeType;
      gameState.operatives.push(op);
    }
  });

  // 读取任务类型
  const missionSelect = document.getElementById('mission-type');
  if (missionSelect) {
    gameState.missionType = missionSelect.value;
  }
  addLog(`  - 当前任务: ${MISSION_LABELS[gameState.missionType] || gameState.missionType}`);

  // 进入先攻阶段
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('global-dash').style.display = 'grid';
  document.getElementById('battle-area').style.display = 'grid';
  document.getElementById('guidance-banner').style.display = 'flex';

  addLog('>>> 战队挑选部署完毕！');
  addLog(`  - ${getFactionDisplayName(team0Faction)} 登场: ${gameState.operatives.filter(o => o.teamSlot === 0).map(o => o.name).join(', ')}`);
  addLog(`  - ${getFactionDisplayName(team1Faction)} 登场: ${gameState.operatives.filter(o => o.teamSlot === 1).map(o => o.name).join(', ')}`);

  updateBattlePanelNames();
  updateScoresUI();
  renderOperatives();

  // Standard 规则: 部署后选择 Chapter Tactics / Marks of Chaos
  if (gameState.rulesVersion === 'standard') {
    showStandardRulesSelections(() => {
      startInitiativePhase();
    });
  } else {
    startInitiativePhase();
  }
}

// ==========================================
//   Standard 规则: 部署后选择界面
// ==========================================

/**
 * 显示 Standard 规则特有的部署后选择界面
 * Chapter Tactics (SM) 和 Marks of Chaos (LEG)
 * @param {Function} onComplete - 选择完成后的回调
 */
function showStandardRulesSelections(onComplete) {
  const selections = [];

  // 检查各阵营是否需要选择
  const team0Faction = gameState.teamFactions[0];
  const team1Faction = gameState.teamFactions[1];

  // Chapter Tactics for SM
  if (team0Faction === 'Space Marine') {
    selections.push({ teamSlot: 0, type: 'chapterTactics' });
  }
  if (team1Faction === 'Space Marine') {
    selections.push({ teamSlot: 1, type: 'chapterTactics' });
  }

  // Marks of Chaos for Legionary
  if (team0Faction === 'Legionary') {
    selections.push({ teamSlot: 0, type: 'marksOfChaos' });
  }
  if (team1Faction === 'Legionary') {
    selections.push({ teamSlot: 1, type: 'marksOfChaos' });
  }

  if (selections.length === 0) {
    // 没有需要选择的，直接完成
    onComplete();
    return;
  }

  // 依次显示选择界面
  let currentIndex = 0;

  function showNext() {
    if (currentIndex >= selections.length) {
      onComplete();
      return;
    }
    const sel = selections[currentIndex];
    currentIndex++;

    if (sel.type === 'chapterTactics') {
      showChapterTacticsSelection(sel.teamSlot, showNext);
    } else if (sel.type === 'marksOfChaos') {
      showMarksOfChaosSelection(sel.teamSlot, showNext);
    }
  }

  showNext();
}

/**
 * Chapter Tactics 选择界面 (Space Marine)
 * 8 种战术选 2 种 (primary + secondary)
 * Sergeant 可以额外选 1 种
 */
function showChapterTacticsSelection(teamSlot, onComplete) {
  const CHAPTER_TACTICS = [
    { id: 'aggressive', name: 'Aggressive (凶猛)', desc: '近战武器获得 Rending' },
    { id: 'dueler', name: 'Dueler (决斗者)', desc: '普通成功可格挡暴击' },
    { id: 'resolute', name: 'Resolute (坚毅)', desc: '忽略 APL 变化、免疫 Shock' },
    { id: 'stealthy', name: 'Stealthy (隐蔽)', desc: '额外保留 1 个 cover save' },
    { id: 'mobile', name: 'Mobile (机动)', desc: 'Fall Back -1AP，可在控制范围冲锋' },
    { id: 'hardy', name: 'Hardy (坚韧)', desc: '防御 5+ 为暴击；反击时首个 ≥3 Normal Dmg -1' },
    { id: 'sharpshooter', name: 'Sharpshooter (神射手)', desc: '未移动时爆弹武器 Accurate 1 + Severe' },
    { id: 'siege_specialist', name: 'Siege Specialist (攻城专家)', desc: '远程 Saturate；近战敌方不能 assist' },
  ];

  const ops = gameState.operatives.filter(o => o.teamSlot === teamSlot && o.faction === 'Space Marine');
  const factionName = getFactionDisplayName('Space Marine');

  addLog(`\n>>> ${factionName} 部署完毕！请选择 Chapter Tactics (章战术)`);

  // 为每个特工选择章战术
  let opIndex = 0;

  function selectForNextOp() {
    if (opIndex >= ops.length) {
      addLog(`>>> ${factionName} Chapter Tactics 选择完成！`);
      onComplete();
      return;
    }

    const op = ops[opIndex];
    opIndex++;

    // 创建选择弹窗
    const overlay = document.createElement('div');
    overlay.className = 'phase-overlay';
    overlay.style.zIndex = '2000';

    let html = `
      <div style="background: #1e293b; border: 2px solid #60a5fa; border-radius: 12px; padding: 24px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
        <h2 style="color: #60a5fa; margin-bottom: 16px;">📋 ${op.name} — 选择 Chapter Tactics</h2>
        <p style="color: #94a3b8; margin-bottom: 16px;">选择 2 种章战术 (primary + secondary)：</p>
        <div id="ct-options" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px;">
    `;

    CHAPTER_TACTICS.forEach(t => {
      html += `
        <label style="display: flex; align-items: flex-start; gap: 8px; padding: 8px; background: #334155; border-radius: 6px; cursor: pointer;">
          <input type="checkbox" class="ct-checkbox" value="${t.id}" style="margin-top: 3px;">
          <div>
            <div style="color: #e2e8f0; font-weight: bold; font-size: 13px;">${t.name}</div>
            <div style="color: #94a3b8; font-size: 11px;">${t.desc}</div>
          </div>
        </label>
      `;
    });

    html += `
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 8px;">
          <button id="ct-confirm-btn" class="action-btn" style="background: #3b82f6;">确认选择</button>
        </div>
      </div>
    `;

    overlay.innerHTML = html;
    document.body.appendChild(overlay);

    // 限制最多选 2 个
    const checkboxes = overlay.querySelectorAll('.ct-checkbox');
    checkboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        const checked = overlay.querySelectorAll('.ct-checkbox:checked');
        if (checked.length > 2) {
          cb.checked = false;
          showToast('最多选择 2 种章战术！', 'warning');
        }
      });
    });

    // 确认按钮
    overlay.querySelector('#ct-confirm-btn').addEventListener('click', () => {
      const checked = overlay.querySelectorAll('.ct-checkbox:checked');
      const selected = Array.from(checked).map(cb => cb.value);

      if (selected.length !== 2) {
        showToast('请选择恰好 2 种章战术！', 'warning');
        return;
      }

      // 存储选择
      gameState.chapterTacticSelections[op.id] = {
        primary: selected[0],
        secondary: selected[1]
      };

      // 同步到特工对象
      op.chapterTactics = selected;

      addLog(`  - ${op.name}: ${selected.join(', ')}`);
      playSound('click');
      document.body.removeChild(overlay);
      selectForNextOp();
    });
  }

  selectForNextOp();
}

/**
 * Marks of Chaos 选择界面 (Legionary)
 * 5 种混沌印记选 1 种
 */
function showMarksOfChaosSelection(teamSlot, onComplete) {
  const MARKS_OF_CHAOS = [
    { id: 'KHORNE', name: 'Khorne (恐虐)', desc: '近战武器获得 Severe', color: '#dc2626' },
    { id: 'NURGLE', name: 'Nurgle (纳垢)', desc: 'Normal Dmg ≥3 时 D6 5+ 减 1', color: '#16a34a' },
    { id: 'SLAANESH', name: 'Slaanesh (色孽)', desc: 'Move +1"', color: '#d946ef' },
    { id: 'TZEENTCH', name: 'Tzeentch (奸奇)', desc: '远程武器获得 Severe', color: '#3b82f6' },
    { id: 'UNDIVIDED', name: 'Undivided (无分)', desc: '6" 内交战时远程武器获得 Ceaseless', color: '#a855f7' },
  ];

  const ops = gameState.operatives.filter(o => o.teamSlot === teamSlot && o.faction === 'Legionary');
  const factionName = getFactionDisplayName('Legionary');

  addLog(`\n>>> ${factionName} 部署完毕！请选择 Marks of Chaos (混沌印记)`);

  let opIndex = 0;

  function selectForNextOp() {
    if (opIndex >= ops.length) {
      addLog(`>>> ${factionName} Marks of Chaos 选择完成！`);
      onComplete();
      return;
    }

    const op = ops[opIndex];
    opIndex++;

    // 创建选择弹窗
    const overlay = document.createElement('div');
    overlay.className = 'phase-overlay';
    overlay.style.zIndex = '2000';

    let html = `
      <div style="background: #1e293b; border: 2px solid #8b1a1a; border-radius: 12px; padding: 24px; max-width: 500px; width: 90%;">
        <h2 style="color: #ef4444; margin-bottom: 16px;">👹 ${op.name} — 选择混沌印记</h2>
        <p style="color: #94a3b8; margin-bottom: 16px;">选择 1 种混沌印记：</p>
        <div id="moc-options" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
    `;

    MARKS_OF_CHAOS.forEach(m => {
      html += `
        <label style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #334155; border-radius: 8px; cursor: pointer; border: 2px solid transparent;" class="moc-option">
          <input type="radio" name="moc-radio" value="${m.id}" style="width: 18px; height: 18px;">
          <div>
            <div style="color: ${m.color}; font-weight: bold; font-size: 15px;">${m.name}</div>
            <div style="color: #94a3b8; font-size: 12px;">${m.desc}</div>
          </div>
        </label>
      `;
    });

    html += `
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 8px;">
          <button id="moc-confirm-btn" class="action-btn" style="background: #8b1a1a;">确认选择</button>
        </div>
      </div>
    `;

    overlay.innerHTML = html;
    document.body.appendChild(overlay);

    // 选中高亮
    const options = overlay.querySelectorAll('.moc-option');
    options.forEach(opt => {
      const radio = opt.querySelector('input[type="radio"]');
      radio.addEventListener('change', () => {
        options.forEach(o => o.style.borderColor = 'transparent');
        if (radio.checked) {
          opt.style.borderColor = '#ef4444';
        }
      });
    });

    // 确认按钮
    overlay.querySelector('#moc-confirm-btn').addEventListener('click', () => {
      const selected = overlay.querySelector('input[name="moc-radio"]:checked');
      if (!selected) {
        showToast('请选择 1 种混沌印记！', 'warning');
        return;
      }

      const mark = selected.value;

      // 存储选择
      gameState.marksOfChaosSelections[op.id] = mark;

      // 同步到特工对象
      op.marksOfChaos = mark;

      const markName = MARKS_OF_CHAOS.find(m => m.id === mark)?.name || mark;
      addLog(`  - ${op.name}: ${markName}`);
      playSound('click');
      document.body.removeChild(overlay);
      selectForNextOp();
    });
  }

  selectForNextOp();
}

export function renderOperatives() {
  const smList = document.getElementById('sm-ops-list');
  const pmList = document.getElementById('pm-ops-list');

  smList.innerHTML = '';
  pmList.innerHTML = '';

  let smAlive = 0;
  let pmAlive = 0;

  gameState.operatives.forEach(op => {
    const opSlot = op.teamSlot >= 0 ? op.teamSlot : getTeamSlot(op.faction);
    const cssSuffix = getFactionCssSuffix(op.faction);
    if (opSlot === 0 && !op.isDead) smAlive++;
    if (opSlot === 1 && !op.isDead) pmAlive++;

    const card = document.createElement('div');

    let cardClasses = `op-card ${cssSuffix}-theme`;
    if (op.isDead) cardClasses += ' dead';
    else if (op.hasActed) cardClasses += ' activated';

    if (gameState.activeAgent && gameState.activeAgent.id === op.id) {
      cardClasses += ' active-target';
    }

    card.className = cardClasses;

    const hpPercent = (op.wounds / op.maxWounds) * 100;
    const weaponNames = op.weapons.map(w => w.name.split(' ')[0]).join(' / ');

    let tagHtml = '';
    if (hasFactionTrait(op.faction, 'disgustingResilience') && getActivePloys(op.faction).includes('contagious_resilience') && !op.isDead) {
      tagHtml = `<span class="card-ploy-tag" style="border-color:var(${getFactionThemeVar(op.faction)}); color:var(${getFactionThemeVar(op.faction)}); background:rgba(122,184,138,0.15);">减伤重投</span>`;
    }

    // 状态标记：Conceal / Injured / Poison Token
    let statusTagsHtml = '';
    if (!op.isDead) {
      if (op.hasConceal) {
        statusTagsHtml += '<span class="card-ploy-tag" style="border-color:#818cf8; color:#818cf8; background:rgba(129,140,248,0.15); font-size:0.6rem;">隐蔽</span>';
      }
      if (op.isInjured) {
        statusTagsHtml += '<span class="card-ploy-tag" style="border-color:var(--red); color:var(--red); background:rgba(184,76,76,0.15); font-size:0.6rem;">重伤</span>';
      }
      if (op.poisonTokens > 0) {
        statusTagsHtml += '<span class="card-ploy-tag" style="border-color:#7ab88a; color:#7ab88a; background:rgba(122,184,138,0.15); font-size:0.6rem;">毒素×' + op.poisonTokens + '</span>';
      }
    }

    // Conceal 切换按钮：激活开始自由选命令，执行首个行动后锁定 (规则 L57)
    const isSelectable = !op.isDead && !op.hasActed && gameState.phase === 'Firefight' && gameState.activeTurnSlot === op.teamSlot;
    const isActiveAgent = gameState.activeAgent && gameState.activeAgent.id === op.id;
    const orderLocked = op.actionsPerformed.length > 0;  // 执行过任意行动即锁定命令
    const canToggleConceal = (isSelectable || isActiveAgent) && !orderLocked;
    const concealDisabled = (isSelectable || isActiveAgent) && orderLocked;
    const concealBtnHtml = canToggleConceal
      ? `<button class="conceal-toggle-btn" onclick="event.stopPropagation(); toggleConceal('${op.id}')" title="选择命令 (开始行动后锁定)" style="font-size:0.65rem; padding:2px 6px; margin-left:4px; background:${op.hasConceal ? 'rgba(129,140,248,0.3)' : 'transparent'}; border:1px solid #818cf8; color:#818cf8; border-radius:4px; cursor:pointer;">${op.hasConceal ? '🛡️隐蔽' : '🛡️交战'}</button>`
      : concealDisabled
        ? `<button class="conceal-toggle-btn" disabled title="已开始行动，命令锁定" style="font-size:0.65rem; padding:2px 6px; margin-left:4px; background:${op.hasConceal ? 'rgba(129,140,248,0.15)' : 'transparent'}; border:1px solid #475569; color:#64748b; border-radius:4px; cursor:not-allowed; opacity:0.6;">${op.hasConceal ? '🛡️隐蔽(锁)' : '🛡️交战(锁)'}</button>`
        : '';

    const avatarHtml = getAvatarHtml(op.id, op.faction);

    card.innerHTML = `
      <div style="position:absolute;top:3px;right:6px;color:var(--imperial-gold);font-size:10px;opacity:0.4;pointer-events:none;z-index:1;">✦</div>
      <div class="op-card-top">
        <div class="op-avatar-row">
          ${avatarHtml}
          <span class="op-card-title">${op.name} ${tagHtml} ${statusTagsHtml} ${concealBtnHtml}</span>
        </div>
        <span class="op-card-tag">${op.currentApl} APL${op.isInjured && gameState.rulesVersion === 'standard' ? ' <span style="color:var(--red); font-size:0.6rem;">(-1)</span>' : ''}</span>
      </div>
      <div class="op-card-hp">
        <span>HP (Wounds):</span>
        <span>${op.wounds} / ${op.maxWounds}</span>
      </div>
      <div class="op-hp-bar-container">
        <div class="op-hp-bar" style="width: ${hpPercent}%; background-color: ${hpPercent < 40 ? 'var(--red)' : 'var(--green)'}"></div>
      </div>
      <div class="op-card-stats">
        <span>Move: <strong>${op.currentMove}"</strong>${op.isInjured ? ' <span style="color:var(--red); font-size:0.55rem;">(-2)</span>' : ''}</span>
        <span>DF: <strong>${op.df}</strong></span>
        <span>SV: <strong>${op.sv}+</strong></span>
        <span style="font-size: 0.65rem; color: #5a5d65; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px;">
          ${weaponNames}
        </span>
      </div>
    `;

    // Add accessibility attributes
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `${op.name}，HP: ${op.wounds}/${op.maxWounds}，${op.isDead ? '已阵亡' : op.hasActed ? '已激活' : '可激活'}`);

    // 预选高亮
    if (gameState.pendingActivation && gameState.pendingActivation.id === op.id) {
      card.classList.add('pending-activation');
    }

    if (!op.isDead && !op.hasActed && gameState.phase === 'Firefight' && gameState.activeTurnSlot === op.teamSlot && !gameState.activeAgent) {
      card.onclick = () => selectOperative(op.id);
      card.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectOperative(op.id); } };
    } else {
      card.onclick = null;
      card.onkeydown = null;
      if (op.isDead) card.setAttribute('aria-disabled', 'true');
    }

    if (opSlot === 0) smList.appendChild(card);
    else pmList.appendChild(card);
  });

  document.getElementById('sm-alive-count').textContent = `${smAlive} / 6 存活`;
  document.getElementById('pm-alive-count').textContent = `${pmAlive} / 6 存活`;
}

// ==========================================
//           Conceal Order
// ==========================================

export function toggleConceal(opId) {
  playSound('click');
  const op = gameState.operatives.find(o => o.id === opId);
  if (!op || op.isDead) return;
  // 规则 L57: 激活开始选定命令，执行首个行动后锁定
  if (op.actionsPerformed.length > 0) {
    showToast('已开始行动，命令锁定，无法再切换！', 'warning');
    return;
  }
  op.toggleConceal();
  addLog(`[命令切换] ${op.name} ${op.hasConceal ? '进入隐蔽 (Conceal)：在掩体中不可被射击；本激活不能主动射击/冲锋。' : '切换为交战 (Engage)。'}`);
  renderOperatives();
  updateActivePanel();
}

// ==========================================
//           Active Panel
// ==========================================

// ---- 两步激活: 第一步 - 预选特工 ----
export function selectOperative(opId) {
  playSound('click');
  const op = gameState.operatives.find(o => o.id === opId);
  if (!op || op.isDead || op.hasActed) return;
  if (gameState.phase !== 'Firefight' || gameState.activeTurnSlot !== op.teamSlot) return;
  if (gameState.activeAgent) return; // 已有激活中的特工

  // 如果点击的是已经预选的特工, 取消预选
  if (gameState.pendingActivation && gameState.pendingActivation.id === opId) {
    gameState.pendingActivation = null;
  } else {
    gameState.pendingActivation = op;
  }
  renderOperatives();
  updateActivePanel();
}

// ---- 两步激活: 第二步 - 确认激活 ----
export function confirmActivation() {
  const pending = gameState.pendingActivation;
  if (!pending) return;
  gameState.pendingActivation = null;
  activateOperative(pending.id);
}

// ---- 取消预选 ----
export function cancelSelection() {
  playSound('click');
  gameState.pendingActivation = null;
  renderOperatives();
  updateActivePanel();
}

export function activateOperative(opId) {
  playSound('click');
  const op = gameState.operatives.find(o => o.id === opId);
  if (!op || op.isDead || op.hasActed) return;

  gameState.activeAgent = op;
  gameState.pendingActivation = null;
  op.actionsPerformed = [];
  op.orderSwitchedThisActivation = false;

  // Poison Token 伤害：携带毒素标记的特工在激活开始时受到 1 点伤害
  if (op.poisonTokens > 0) {
    const prevHp = op.wounds;
    addLog(`[毒素] ${op.name} 携带毒素标记，激活开始受到 1 点伤害！`);
    op.applyWounds(1);
    showToast(`☠️ ${op.name} 毒素发作：受到 1 点伤害 (${prevHp} → ${op.wounds})`, 'warning');
    // 如果因此阵亡则不再继续激活
    if (op.isDead) {
      renderOperatives();
      updateActivePanel();
      return;
    }
  }

  // Injured 时 APL -1（使用 currentApl getter）
  op.apl = op.currentApl;

  const injuredNote = op.isInjured ? (gameState.rulesVersion === 'standard' ? ' (Injured: APL -1)' : ' (Injured: Move -2")') : '';
  addLog(`[激活] ${op.name} 开始激活，获得 ${op.apl} APL！${injuredNote}`);

  renderOperatives();
  updateActivePanel();
}

export function updateActivePanel() {
  const content = document.getElementById('active-panel-content');
  const empty = document.getElementById('active-panel-empty');
  const statusTitle = document.getElementById('active-panel-status');
  const activeCard = document.getElementById('active-panel');

  // ---- 回合指示器 ----
  const turnIndicator = document.getElementById('turn-indicator');
  const turnIndicatorFaction = document.getElementById('turn-indicator-faction');
  const turnIndicatorLabel = document.querySelector('.turn-indicator-label');
  if (turnIndicator && gameState.phase === 'Firefight') {
    turnIndicator.style.display = 'flex';
    const cn = getFactionDisplayName(gameState.activeTurn);
    if (turnIndicatorFaction) turnIndicatorFaction.textContent = cn;
    turnIndicator.className = `turn-indicator ${getFactionCssSuffix(gameState.activeTurn)}-turn`;
    if (turnIndicatorLabel) {
      if (gameState.activeAgent) {
        turnIndicatorLabel.textContent = ' — 正在行动';
      } else if (gameState.pendingActivation) {
        turnIndicatorLabel.textContent = ' — 请确认激活';
      } else {
        turnIndicatorLabel.textContent = '的回合 — 请选择特工';
      }
    }
  } else if (turnIndicator) {
    turnIndicator.style.display = 'none';
  }

  // ---- 预选激活预览面板 ----
  const pendingPanel = document.getElementById('pending-activation-panel');
  if (pendingPanel) {
    if (gameState.pendingActivation && !gameState.activeAgent) {
      pendingPanel.style.display = 'flex';
      const pop = gameState.pendingActivation;
      const pendingAvatar = document.getElementById('pending-op-avatar');
      if (pendingAvatar) pendingAvatar.innerHTML = getAvatarHtml(pop.id, pop.faction);
      document.getElementById('pending-op-name').textContent = pop.name;
      document.getElementById('pending-op-faction').textContent = getFactionDisplayName(pop.faction);
      document.getElementById('pending-op-move').textContent = pop.currentMove + '"';
      document.getElementById('pending-op-hp').textContent = `${pop.wounds}/${pop.maxWounds}`;
      document.getElementById('pending-op-apl').textContent = pop.currentApl;
    } else {
      pendingPanel.style.display = 'none';
    }
  }

  // ---- 高亮当前行动方队伍面板，对手面板置灰 ----
  const smBoard = document.getElementById('sm-board');
  const pmBoard = document.getElementById('pm-board');
  const isFirefight = gameState.phase === 'Firefight';
  const activeSlot = gameState.activeTurnSlot;
  const smIsActive = isFirefight && activeSlot === 0;
  const pmIsActive = isFirefight && activeSlot === 1;
  if (smBoard) {
    smBoard.classList.toggle('active-turn', smIsActive);
    smBoard.classList.toggle('inactive-turn', isFirefight && !smIsActive);
  }
  if (pmBoard) {
    pmBoard.classList.toggle('active-turn', pmIsActive);
    pmBoard.classList.toggle('inactive-turn', isFirefight && !pmIsActive);
  }

  if (gameState.activeAgent) {
    content.style.display = 'flex';
    empty.style.display = 'none';

    const op = gameState.activeAgent;
    statusTitle.textContent = '当前激活特工';

    const avatarContainer = document.getElementById('active-op-avatar-container');
    if (avatarContainer) {
      avatarContainer.innerHTML = getAvatarHtml(op.id, op.faction);
    }

    activeCard.className = `active-card ${getFactionCssSuffix(op.faction)}-active`;
    document.getElementById('active-op-name').textContent = op.name;
    document.getElementById('active-op-faction').textContent = getFactionDisplayName(op.faction);

    const dots = document.getElementById('active-apl-dots');
    dots.innerHTML = '';
    for (let i = 0; i < op.maxApl; i++) {
      const dot = document.createElement('div');
      dot.className = 'apl-dot' + (i < op.apl ? ' active' : '');
      dots.appendChild(dot);
    }

    const hasMoved = op.actionsPerformed.includes('Move');
    const hasCharged = op.actionsPerformed.includes('Charge');
    const hasAdvanced = op.actionsPerformed.includes('Advance');
    const hasDashed = op.actionsPerformed.includes('Dash');
    // Heavy (Dash only) 武器例外：Dash 后仍可用 Heavy 武器射击
    const hasHeavyWeapon = op.weapons.some(w => w.hasRule('Heavy'));
    const hasFallenBack = op.actionsPerformed.includes('FallBack');

    const shootCount = op.actionsPerformed.filter(a => a === 'Shoot').length;
    const fightCount = op.actionsPerformed.filter(a => a === 'Fight').length;
    const hasShot = shootCount > 0;
    const hasFought = fightCount > 0;

    // Astartes 双重行动规则: 可选择 2 Shoot 或 2 Fight (但不能混合)
    const isAstartes = hasFactionTrait(op.faction, 'astartesDoubleAction');
    const isCounteracting = op.counteracting === true;

    // 爆弹惩戒 (Bolter Discipline) 策略: 激活后允许 2 次射击
    const hasBolterDiscipline = getActivePloys(op.faction).includes('bolter_discipline');
    const canDoubleAction = isAstartes || hasBolterDiscipline;

    // 任意移动行动标记 (Move/Charge/Advance/Dash/FallBack 均阻止其他移动行动)
    const hasAnyMove = hasMoved || hasCharged || hasAdvanced || hasDashed || hasFallenBack;
    // Advance/FallBack 后不能再 Shoot/Fight；Dash 后 Fight 不能，Shoot 仅 Heavy 武器可
    const noCombatAfterMove = hasAdvanced || hasFallenBack;
    const shootBlockedAfterDash = hasDashed && !hasHeavyWeapon;

    // Counteract 模式下: 仅 1 次行动, 禁止冲锋, 移动不超过 2"
    const maxShoots = isCounteracting ? 1 : (canDoubleAction ? 2 : 1);
    const maxFights = isCounteracting ? 1 : (canDoubleAction ? 2 : 1);

    // 互斥约束：做了 Shoot 就不能 Fight，做了 Fight 就不能 Shoot
    const shootLocked = (canDoubleAction && !isCounteracting) && hasFought;
    const fightLocked = (canDoubleAction && !isCounteracting) && hasShot;
    const shootLimitReached = shootCount >= maxShoots;
    const fightLimitReached = fightCount >= maxFights;

    // 移动行动: 一旦执行过任意移动，所有其他移动行动均禁用
    document.getElementById('action-move').disabled = op.apl < 1 || hasAnyMove || isCounteracting;
    // Charge 禁用条件: Counteract / 已耗尽APL / 已执行任意移动 / 已近战 / 已射击 / Conceal 标记 (隐蔽不能冲锋)
    document.getElementById('action-charge').disabled = isCounteracting ? true : (op.apl < 1 || hasAnyMove || hasFought || hasShot || op.hasConceal);
    // Advance: 同 Charge，且不能 Counteract
    document.getElementById('action-advance').disabled = op.apl < 1 || hasAnyMove || hasFought || hasShot || isCounteracting;
    // Dash: 同 Advance
    document.getElementById('action-dash').disabled = op.apl < 1 || hasAnyMove || hasFought || hasShot || isCounteracting;
    // Fall Back: lite 规则下消耗 2 APL，同 Advance 的其他约束
    document.getElementById('action-fallback').disabled = op.apl < 2 || hasAnyMove || hasFought || hasShot || isCounteracting;
    // Shoot: 原有约束 + Advance/FallBack 后不能射击 + Dash 后仅 Heavy 武器可射
    // 特殊规则: 若所有武器都是 Heavy (Dash only)，未 Dash 时 Shoot 禁用；Dash 后 Shoot 可用
    const shootHeavyBlocked = hasHeavyWeapon && !hasDashed && op.weapons.every(w => w.hasRule('Heavy'));
    // Conceal 命令: 不能射击 (除非携带 Silent 武器)
    const hasSilentWeapon = op.weapons.some(w => w.hasRule('Silent'));
    const shootConcealBlocked = op.hasConceal && !hasSilentWeapon;
    document.getElementById('action-shoot').disabled = op.apl < 1 || shootLimitReached || shootLocked || hasCharged || noCombatAfterMove || shootBlockedAfterDash || shootHeavyBlocked || shootConcealBlocked;
    // Fight: 原有约束 + Advance/Dash/FallBack 后都不能近战
    document.getElementById('action-fight').disabled = op.apl < 1 || fightLimitReached || fightLocked || noCombatAfterMove || hasDashed;

    const hasContagiousResilience = hasFactionTrait(op.faction, 'disgustingResilience') && getActivePloys(op.faction).includes('contagious_resilience');
    const doubleActionLabel = hasBolterDiscipline && !isAstartes ? '爆弹惩戒' : 'Astartes';

    const ployDisplay = document.getElementById('active-ploys-display');
    if (ployDisplay) {
        const ploysText = [];
        if (isCounteracting) ploysText.push('<span style="color:#f97316;">⚡ 反击 (Counteract): 仅限 1 次行动, 移动≤2", 不可冲锋</span>');
        if (hasAdvanced) ploysText.push('<span style="color:#f59e0b;">🏃💨 已前进 (Advance): 不能再射击/近战</span>');
        if (hasDashed) ploysText.push(`<span style="color:#f59e0b;">💨💨 已冲刺 (Dash): 不能再近战${hasHeavyWeapon ? '，仅 Heavy 武器可射击' : '，不能射击'}</span>`);
        if (hasFallenBack) ploysText.push('<span style="color:#f59e0b;">🔙 已撤退 (Fall Back): 不能再射击/近战</span>');
        if (hasShot && !isCounteracting && canDoubleAction) ploysText.push(`<span style="color:#6a9ad4;">💥 ${doubleActionLabel}: 已射击×${shootCount}，锁定近战</span>`);
        if (hasFought && !isCounteracting && canDoubleAction) ploysText.push(`<span style="color:#f87171;">⚔️ ${doubleActionLabel}: 已近战×${fightCount}，锁定射击</span>`);
        if (hasContagiousResilience) ploysText.push('<span style="color:var(--pm-accent);">🛡️ 传染韧性生效中</span>');
        if (hasBolterDiscipline && !isAstartes) ploysText.push('<span style="color:#fbbf24;">🔥 爆弹惩戒: 可射击 2 次</span>');
        const hasDarkZealotry = hasFactionTrait(op.faction, 'darkZealotry') && getActivePloys(op.faction).includes('dark_zealotry');
        if (hasDarkZealotry) ploysText.push('<span style="color:#c94444;">⚔️ 黑暗狂热: 近战可重投 1 个失败骰</span>');
        ployDisplay.innerHTML = ploysText.length > 0 ? ploysText.join(' | ') : '';
    }

    const shootBtnText = document.querySelector('#action-shoot span:first-child');
    if (shootBtnText) {
        if (canDoubleAction) {
            const remaining = maxShoots - shootCount;
            const lockedNote = shootLocked ? ' (已锁定)' : '';
            shootBtnText.innerHTML = `💥 射击 [${remaining > 0 ? remaining : 0}次剩余${lockedNote}]`;
        } else {
            shootBtnText.innerHTML = `💥 射击 (Shoot)`;
        }
    }

    const fightBtnText = document.querySelector('#action-fight span:first-child');
    if (fightBtnText) {
        if (canDoubleAction) {
            const remaining = maxFights - fightCount;
            const lockedNote = fightLocked ? ' (已锁定)' : '';
            fightBtnText.innerHTML = `⚔️ 近战 [${remaining > 0 ? remaining : 0}次剩余${lockedNote}]`;
        } else {
            fightBtnText.innerHTML = `⚔️ 近战 (Fight)`;
        }
    }

    updateGuidance(`【特工行动】${op.name} 剩余 APL: ${op.apl}。可执行移动/冲锋/前进/冲刺/撤退/射击/近战，或点击下方按钮结束。`);
  } else if (gameState.pendingActivation) {
    // 预选状态 - 显示预览面板（已在上方处理），隐藏空面板
    content.style.display = 'none';
    empty.style.display = 'none';
    statusTitle.textContent = '等待确认';
    activeCard.className = 'active-card';
    updateGuidance(`【预选确认】已选中【${gameState.pendingActivation.name}】。请在右侧面板点击「确认激活」或「取消」。`);
  } else {
    content.style.display = 'none';
    empty.style.display = 'block';
    statusTitle.textContent = '等待特工激活';
    activeCard.className = 'active-card';

    const nextSlot = gameState.activeTurnSlot;
    const nextFaction = gameState.teamFactions[nextSlot];
    const cn = getFactionDisplayName(nextFaction);

    const hasUsable = hasUsableOperatives(nextSlot);
    if (hasUsable) {
      const sideName = nextSlot === 0 ? '左边' : '右边';
      updateGuidance(`【激活提示】请从${sideName}【${cn}】战队卡片列表中选择点击发亮的特工卡片，载入动作。`);
    } else {
      const oppSlot = 1 - nextSlot;
      if (hasUsableOperatives(oppSlot)) {
        updateGuidance(`【激活换边】因为当前轮次已无可用单位，权能自动转回另一方。请继续点击激活。`);
      } else {
        updateGuidance('【激活结束】双方所有特工已耗尽激活！请点击右上角的回合推进至下一TP。');
      }
    }
  }
}

export function performMove() {
  const op = gameState.activeAgent;
  if (!op || op.apl < 1) return;
  playSound('click');
  op.apl -= 1;
  op.actionsPerformed.push('Move');
  if (op.counteracting) {
    addLog(`  - ${op.name} 执行 [反击移动]，消耗 1 AP。⚠️ 物理沙盘移动不得超过 2"！`);
  } else {
    addLog(`  - ${op.name} 执行 [移动 (Move)]，消耗 1 APL。`);
  }
  updateActivePanel();
}

export function performCharge() {
  const op = gameState.activeAgent;
  if (!op || op.apl < 1) return;
  playSound('click');
  op.apl -= 1;
  op.actionsPerformed.push('Charge');
  addLog(`  - ${op.name} 执行 [冲锋 (Charge)]，移动最多 ${op.currentMove + 2}" 并贴入敌方控制范围，消耗 1 APL。`);
  updateActivePanel();
}

export function performAdvance() {
  const op = gameState.activeAgent;
  if (!op || op.apl < 1) return;
  playSound('click');
  op.apl -= 1;
  op.actionsPerformed.push('Advance');
  addLog(`  - ${op.name} 执行 [前进 (Advance)]，移动距离 +3" (总计 ${op.currentMove + 3}")，但本激活不能再射击/近战。`);
  updateActivePanel();
}

export function performDash() {
  const op = gameState.activeAgent;
  if (!op || op.apl < 1) return;
  playSound('click');
  op.apl -= 1;
  op.actionsPerformed.push('Dash');
  addLog(`  - ${op.name} 执行 [冲刺 (Dash)]，移动最多 3" (lite 规则，且不能攀爬)，本激活不能再射击/近战 (Heavy Dash-only 武器除外)。`);
  updateActivePanel();
}

export function performFallBack() {
  const op = gameState.activeAgent;
  // Fall Back 在 lite 规则中消耗 2 APL
  if (!op || op.apl < 2) {
    if (op) addLog(`  - ❌ ${op.name} APL 不足 (${op.apl}/2)，无法执行撤退 (Fall Back)。`);
    return;
  }
  playSound('click');
  op.apl -= 2;
  op.actionsPerformed.push('FallBack');
  addLog(`  - ${op.name} 执行 [撤退 (Fall Back)]，脱离交战区域 (移动最多 ${op.currentMove}")，消耗 2 APL。本激活不能再射击/近战。`);
  updateActivePanel();
}

export function endActivation() {
  playSound('click');
  const op = gameState.activeAgent;
  if (!op) return;

  // Counteract 激活结束后: 重新标记为 hasActed, 清除 counteracting 标记
  if (op.counteracting) {
    addLog(`[反击结束] ${op.name} 的反击行动完毕。`);
    op.counteracting = false;
  }

  op.hasActed = true;
  op.apl = 0;
  addLog(`[结束激活] ${op.name} 结束了本次激活。`);
  gameState.activeAgent = null;
  gameState.pendingActivation = null;
  switchSides();
}

// ==========================================
//           Phase Flow
// ==========================================

export function startInitiativePhase() {
  gameState.phase = 'Initiative';
  updateScoresUI();
  showPhaseOverlay();

  const overlayBox = document.getElementById('phase-overlay-content');

  overlayBox.innerHTML = `
    <h3>Turning Point ${gameState.turningPoint} - 先攻掷骰</h3>
    <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:10px;">
      游戏开始前，双方通过投掷先攻骰 (Initiative Roll-Off) 判定胜负，胜者决定谁拿先攻手牌。
    </p>

    <div class="init-roll-grid" style="margin-bottom:12px;">
      <div class="init-team-col ${getFactionCssSuffix(gameState.teamFactions[0])}">
        <h4 style="color:var(${getFactionThemeVar(gameState.teamFactions[0])}); font-size:0.9rem;">${getFactionDisplayName(gameState.teamFactions[0])}先攻骰</h4>
        <div class="dice-pool-view" id="overlay-init-sm-dice">
          <div class="kt-dice-cube ${getDiceClass(gameState.teamFactions[0])}">?</div>
        </div>
        <div id="overlay-init-sm-val" style="font-weight:bold; font-size: 0.9rem; color:var(--text-muted);">未投骰</div>
      </div>
      <div class="init-team-col ${getFactionCssSuffix(gameState.teamFactions[1])}">
        <h4 style="color:var(${getFactionThemeVar(gameState.teamFactions[1])}); font-size:0.9rem;">${getFactionDisplayName(gameState.teamFactions[1])}先攻骰</h4>
        <div class="dice-pool-view" id="overlay-init-pm-dice">
          <div class="kt-dice-cube ${getDiceClass(gameState.teamFactions[1])}">?</div>
        </div>
        <div id="overlay-init-pm-val" style="font-weight:bold; font-size: 0.9rem; color:var(--text-muted);">未投骰</div>
      </div>
    </div>

    <button class="btn-large" id="btn-overlay-roll" onclick="rollInitiativeOverlay()" style="padding: 10px 30px; font-size:0.9rem;">开始掷骰判定</button>
  `;

  updateGuidance('【先攻阶段】点击按钮开始判定本回合先手优势权。');
}

export function showPhaseOverlay() {
  const overlay = document.getElementById('phase-overlay');
  overlay.style.display = 'flex';
  const content = document.getElementById('phase-overlay-content');
  if (content) {
    content.classList.add('gothic-panel');
    if (!content.querySelector('.gothic-arch')) {
      content.insertAdjacentHTML('afterbegin', '<div class="gothic-arch"></div>');
    }
  }
  trapFocus(overlay);
}

export function hidePhaseOverlay() {
  document.getElementById('phase-overlay').style.display = 'none';
  releaseFocusTrap();
}

export function hideCounteractOverlay() {
  const overlay = document.getElementById('counteract-overlay');
  if (overlay) overlay.style.display = 'none';
  releaseFocusTrap();
}

// ==========================================
//         Counteract (反击) 挡板
// ==========================================

export function showCounteractOverlay(slotOrFaction) {
  const overlay = document.getElementById('counteract-overlay');
  const content = document.getElementById('counteract-content');
  // Accept slot (0/1) or faction name; prefer slot for mirror-match safety
  const slot = typeof slotOrFaction === 'number' ? slotOrFaction : getTeamSlot(slotOrFaction);
  const faction = gameState.teamFactions[slot];
  const factionDisplayName = getFactionDisplayName(faction);
  const color = `var(${getFactionThemeVar(faction)})`;

  // 找到所有已耗尽 + Engage 标记的特工 (filter by teamSlot for mirror-match safety)
  const eligibleOps = gameState.operatives.filter(op =>
    op.teamSlot === slot && !op.isDead && op.hasActed && !op.hasConceal
  );

  let opListHtml = '';
  eligibleOps.forEach(op => {
    opListHtml += `
      <div class="counteract-op-row" onclick="selectCounteractOperative('${op.id}')" style="
        background: rgba(255,255,255,0.03);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 8px;
        padding: 10px 12px;
        margin-bottom: 6px;
        cursor: pointer;
        transition: all 0.15s;
        display: flex;
        align-items: center;
        gap: 10px;
      " onmouseover="this.style.borderColor='${color}'; this.style.background='rgba(255,255,255,0.06)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.1)'; this.style.background='rgba(255,255,255,0.03)'">
        <div style="width:32px; height:32px; border-radius:50%; background:rgba(255,255,255,0.1); overflow:hidden; flex-shrink:0;">
          <img src="${op.defaultAvatar}" style="width:100%; height:100%; object-fit:cover;" alt="${op.name}" />
        </div>
        <div style="flex:1;">
          <div style="font-weight:600; color:#fff; font-size:0.85rem;">${op.name}</div>
          <div style="font-size:0.7rem; color:var(--text-muted);">HP: ${op.wounds}/${op.maxWounds} | 武器: ${op.weapons.length} 种</div>
        </div>
        <div style="color:${color}; font-size:0.75rem; font-weight:600;">选择 →</div>
      </div>
    `;
  });

  content.innerHTML = `
    <h3 style="color:${color}; margin-bottom:8px;">⚡ 反击时机 (Counteract)</h3>
    <p style="color:var(--text-muted); font-size:0.8rem; margin-bottom:12px; line-height:1.5;">
      【${factionDisplayName}】所有特工已耗尽，但对方仍有未激活特工。<br>
      可选择一名已耗尽的 <b>Engage 标记</b> 特工发动反击：<br>
      <span style="color:#f97316;">• 免费获得 1 AP 执行一个行动 • 移动不得超过 2" • 不可冲锋</span>
    </p>

    <div style="margin-bottom:16px;">
      ${eligibleOps.length > 0 ? opListHtml : '<p style="color:var(--text-muted); text-align:center; padding:20px;">无符合条件的特工 (需要 Engage 标记且存活)</p>'}
    </div>

    <div style="display:flex; gap:10px;">
      <button class="btn-large" onclick="skipCounteract()" style="flex:1; padding:10px 20px; font-size:0.85rem; background:rgba(100,116,139,0.2); border-color:#475569;">
        跳过反击 (Skip)
      </button>
    </div>
  `;

  overlay.style.display = 'flex';
  trapFocus(overlay);
}

export function selectCounteractOperative(opId) {
  playSound('crit');
  startCounteractActivation(opId);
}

export function skipCounteractAction() {
  playSound('click');
  skipCounteract();
}

export function rollInitiativeOverlay() {
  const smDiceEl = document.getElementById('overlay-init-sm-dice');
  const pmDiceEl = document.getElementById('overlay-init-pm-dice');
  const rollBtn = document.getElementById('btn-overlay-roll');

  rollBtn.disabled = true;

  // 滚动动画
  const team0Faction = gameState.teamFactions[0];
  const team1Faction = gameState.teamFactions[1];
  const team0DiceCls = getDiceClass(team0Faction);
  const team1DiceCls = getDiceClass(team1Faction);
  smDiceEl.innerHTML = `<div class="kt-dice-cube ${team0DiceCls} rolling">?</div>`;
  pmDiceEl.innerHTML = `<div class="kt-dice-cube ${team1DiceCls} rolling">?</div>`;
  playSound('shoot');

  // 顺序停下
  setTimeout(() => {
    const smVal = Math.floor(Math.random() * 6) + 1;
    smDiceEl.innerHTML = `<div class="kt-dice-cube ${team0DiceCls} ${smVal===6?'crit-dice':''}">${smVal}</div>`;
    playSound('click');
    if (smVal === 6) playSound('crit');

    setTimeout(() => {
      const pmVal = Math.floor(Math.random() * 6) + 1;
      pmDiceEl.innerHTML = `<div class="kt-dice-cube ${team1DiceCls} ${pmVal===6?'crit-dice':''}">${pmVal}</div>`;
      playSound('click');
      if (pmVal === 6) playSound('crit');

      if (smVal === pmVal) {
        playSound('alert');
        document.getElementById('overlay-init-sm-val').textContent = `平局 [${smVal}]`;
        document.getElementById('overlay-init-pm-val').textContent = `平局 [${pmVal}]`;
        rollBtn.disabled = false;
        rollBtn.textContent = '平局！重新投骰';
        addLog(`  - 先攻判定平局 [${smVal}]，准备重投...`);
      } else {
        const winner = smVal > pmVal ? team0Faction : team1Faction;
        const winnerCN = getFactionDisplayName(winner);
        playSound('crit');

        // 隐藏掷骰按钮 (结果已确定)
        rollBtn.style.display = 'none';

        document.getElementById('overlay-init-sm-val').textContent = `点数: ${smVal}`;
        document.getElementById('overlay-init-pm-val').textContent = `点数: ${pmVal}`;

        addLog(`  - 先攻判定掷骰：${getFactionDisplayName(team0Faction)} [${smVal}] vs ${getFactionDisplayName(team1Faction)} [${pmVal}]`);
        addLog(`  - 【${winnerCN}】赢得了投骰，准备选择先攻权归属。`);

        const overlayBox = document.getElementById('phase-overlay-content');
        const turnOrderDiv = document.createElement('div');
        turnOrderDiv.style.cssText = 'border-top:1px solid var(--panel-border); margin-top:16px; padding-top:16px; width:100%;';
        turnOrderDiv.innerHTML = `
            <p style="color:var(${getFactionThemeVar(winner)}); font-weight:bold; margin-bottom:10px;">👑 【${winnerCN}】选择首发玩家：</p>
            <div id="turn-order-buttons" style="display:flex; gap:10px; margin-bottom:10px;">
              <button class="qa-btn turn-order-btn" data-slot="0" onclick="selectTurnOrder(0)" style="flex:1;">${getFactionDisplayName(team0Faction)}先攻</button>
              <button class="qa-btn turn-order-btn" data-slot="1" onclick="selectTurnOrder(1)" style="flex:1;">${getFactionDisplayName(team1Faction)}先攻</button>
            </div>
            <button id="btn-confirm-turn-order" class="btn-large" onclick="confirmTurnOrder()" style="display:none; padding:10px 30px; font-size:0.9rem; width:100%; margin-top:8px;">
              确认首发选择
            </button>
        `;
        overlayBox.appendChild(turnOrderDiv);
        updateGuidance(`【选择先后】王座归属：【${winnerCN}】玩家获胜，请点击按钮选择首发方并确认。`);
      }
    }, 300);
  }, 700);
}

// ---- 两步首发选择: 第一步 - 高亮选中 ----
export function selectTurnOrder(slot) {
  playSound('click');
  const faction = gameState.teamFactions[slot];

  // 高亮选中按钮
  const btns = document.querySelectorAll('.turn-order-btn');
  btns.forEach(btn => {
    if (parseInt(btn.dataset.slot) === slot) {
      btn.classList.add('selected');
      btn.style.background = 'linear-gradient(135deg, var(--imperial-gold), #8a6a1c)';
      btn.style.color = '#000';
      btn.style.borderColor = 'var(--imperial-gold-bright)';
      btn.style.boxShadow = '0 0 12px rgba(201, 168, 76, 0.5)';
    } else {
      btn.classList.remove('selected');
      btn.style.background = '';
      btn.style.color = '';
      btn.style.borderColor = '';
      btn.style.boxShadow = '';
    }
  });

  // 显示确认按钮
  const confirmBtn = document.getElementById('btn-confirm-turn-order');
  if (confirmBtn) {
    confirmBtn.style.display = 'block';
    confirmBtn.dataset.pendingSlot = String(slot);
  }

  const cn = getFactionDisplayName(faction);
  updateGuidance(`【预选首发】已选中【${cn}】为先攻方，请点击确认按钮完成选择。`);
}

// ---- 两步首发选择: 第二步 - 确认 ----
export function confirmTurnOrder() {
  const confirmBtn = document.getElementById('btn-confirm-turn-order');
  const slotStr = confirmBtn && confirmBtn.dataset.pendingSlot;
  if (slotStr === undefined) return;
  const slot = parseInt(slotStr);
  const faction = gameState.teamFactions[slot];

  playSound('crit');
  gameState.initiativeSlot = slot;
  gameState.initiative = faction;
  gameState.activeTurnSlot = slot;
  gameState.activeTurn = faction;
  addLog(`  - 确认：【${getFactionDisplayName(faction)}】获得本回合的先攻优势！`);

  startStrategyPhase();
}

export function startStrategyPhase() {
  const wasPrevPhase = gameState.phase;
  gameState.phase = 'Strategy';

  // ---- 策略阶段 CP 收益 (按规则: 第1回合双方+1, 之后先攻方+1 / 非先攻方+2) ----
  if (wasPrevPhase !== 'Strategy') {
    if (gameState.turningPoint === 1) {
      setCpForFaction(gameState.teamFactions[0], getCpForFaction(gameState.teamFactions[0]) + 1);
      setCpForFaction(gameState.teamFactions[1], getCpForFaction(gameState.teamFactions[1]) + 1);
      addLog(`  💰 第1回合策略阶段：双方各获得 1 CP。`);
    } else {
      const initFaction = gameState.initiative;
      const nonInitFaction = getEnemyFaction(initFaction);
      setCpForFaction(initFaction, getCpForFaction(initFaction) + 1);
      setCpForFaction(nonInitFaction, getCpForFaction(nonInitFaction) + 2);
      addLog(`  💰 TP${gameState.turningPoint} 策略阶段：${getFactionDisplayName(initFaction)}(先攻) +1 CP, ${getFactionDisplayName(nonInitFaction)} +2 CP。`);
    }
  }

  updateScoresUI();
  showPhaseOverlay();

  const overlayBox = document.getElementById('phase-overlay-content');

  overlayBox.innerHTML = `
    <h3>Turning Point ${gameState.turningPoint} - 策略阶段</h3>
    <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:12px;">
      在此阶段，双方可以使用命令点 (CP) 激活计策 (Strategic Ploys)。
    </p>

    <div class="gothic-divider"><span style="color:var(--imperial-gold);font-size:8px;">⬥</span><span style="color:var(--imperial-gold);font-size:14px;">✠</span><span style="color:var(--imperial-gold);font-size:8px;">⬥</span></div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; width:100%; text-align:left; margin-bottom:16px;">
      ${(() => {
        const t0 = gameState.teamFactions[0];
        const t1 = gameState.teamFactions[1];
        const buildPloyCard = (faction, teamKey) => {
          const fn = getFactionDisplayName(faction);
          const themeVar = getFactionThemeVar(faction);
          const ploys = getActivePloys(faction);
          let ployName, ployIcon, ployTag, ployDesc, ployId;
          if (hasFactionTrait(faction, 'astartesDoubleAction')) {
            ployId = 'bolter_discipline'; ployName = '爆弹惩戒'; ployIcon = '🔥'; ployTag = 'Astartes';
            ployDesc = `${fn}特工本回合激活内，可以使用<b>两次</b>射击行动。`;
          } else if (hasFactionTrait(faction, 'disgustingResilience')) {
            ployId = 'contagious_resilience'; ployName = '传染韧性'; ployIcon = '🛡️'; ployTag = 'Death Guard';
            ployDesc = `${fn}在结算【恶心作呕 (DR)】伤害减免时，可<b>重投第一个失败的减伤骰</b>。`;
          } else {
            ployId = 'dark_zealotry'; ployName = '黑暗狂热'; ployIcon = '⚔️'; ployTag = 'Heretic Astartes';
            ployDesc = `${fn}特工在本回合近战搏斗中，可<b>重投 1 个失败骰</b>。`;
          }
          const isSelected = ploys.includes(ployId);
          return `<div class="ploy-choice-card ${isSelected ? 'selected' : ''}" role="button" tabindex="0" onclick="buyPloy('${teamKey}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();buyPloy('${teamKey}')}">
            <div class="ploy-title">
              <span>${ployIcon} ${ployName} (1 CP)</span>
              <span style="font-size:0.75rem; color:var(${themeVar});">${ployTag}</span>
            </div>
            <div class="ploy-desc">${ployDesc}</div>
            <div style="margin-top:6px; font-weight:bold; font-size:0.75rem; color:var(${themeVar});">
              ${isSelected ? '● 生效中' : '点击启用'}
            </div>
          </div>`;
        };
        return buildPloyCard(t0, t0) + buildPloyCard(t1, t1);
      })()}
    </div>

    <button class="btn-large" onclick="proceedToFirefight()" style="padding: 10px 40px; font-size:0.9rem; background:linear-gradient(135deg, var(--green), #2a5a3a); border-color:#4a7c59; box-shadow:none;">
      进入战斗阶段 (Proceed to Firefight)
    </button>
  `;

  updateGuidance('【策略阶段】双方轮流消费 1 CP 采购策略 Ploys。按 Proceed 按钮进入实际交火战斗。');
}

export function buyPloy(teamOrFaction) {
  // Accept 'sm'/'pm' (legacy UI team identifiers) or faction names
  let slot;
  if (teamOrFaction === 'sm') slot = 0;
  else if (teamOrFaction === 'pm') slot = 1;
  else slot = getTeamSlot(teamOrFaction);
  const faction = gameState.teamFactions[slot];
  const factionName = getFactionDisplayName(faction);
  const activePloys = getActivePloys(faction);

  // Ploy selection based on faction traits (simplified for Phase 3)
  // TODO: Phase 4 should read available ploys from FACTIONS_DB[faction].ploys
  let ployId, ployName, ployDesc;
  if (hasFactionTrait(faction, 'astartesDoubleAction')) {
    ployId = 'bolter_discipline';
    ployName = '爆弹惩戒';
    ployDesc = '本回合可双击开火！';
  } else if (hasFactionTrait(faction, 'disgustingResilience')) {
    ployId = 'contagious_resilience';
    ployName = '传染韧性';
    ployDesc = 'DR首发失败可重投！';
  } else {
    // Default fallback for other factions (e.g. Legionary)
    ployId = 'dark_zealotry';
    ployName = '黑暗狂热';
    ployDesc = '近战可重投 1 个失败骰！';
  }

  if (activePloys.includes(ployId)) {
    playSound('click');
    setActivePloys(faction, []);
    setCpForFaction(faction, getCpForFaction(faction) + 1);
  } else {
    if (getCpForFaction(faction) < 1) { playSound('alert'); showToast(`${factionName} CP 不足！`, 'warning'); return; }
    playSound('crit');
    setActivePloys(faction, [ployId]);
    setCpForFaction(faction, getCpForFaction(faction) - 1);
    addLog(`  - ${factionName}激活策略：【${ployName}】！${ployDesc}`);
  }
  startStrategyPhase();
}

export function proceedToFirefight() {
  playSound('click');
  hidePhaseOverlay();
  gameState.phase = 'Firefight';
  updateScoresUI();

  addLog(`\n【战斗阶段开始】Turning Point ${gameState.turningPoint}`);
  addLog(`>>> 首发方【${getFactionDisplayName(gameState.activeTurn)}】可以激活一名特工。`);

  renderOperatives();
  updateActivePanel();
  updateGuidance(`【特工激活期】在两侧列表中点击未激活的特工（高亮）卡片，载入中央控制板执行动作。`);
}

// ==========================================
//           Help Modal
// ==========================================

export function showRuleHelp(actionKey) {
  playSound('click');
  const rule = RULE_TEXTS[actionKey];
  if (!rule) return;
  document.getElementById('help-title').textContent = rule.title;
  document.getElementById('help-body').innerHTML = rule.body;
  const helpModal = document.getElementById('help-modal');
  helpModal.style.display = 'flex';
  trapFocus(helpModal);
}

export function closeHelpModal() {
  playSound('click');
  document.getElementById('help-modal').style.display = 'none';
  releaseFocusTrap();
}

// ==========================================
//           Death & Victory
// ==========================================

export function triggerOperativeDeathOverlay(op) {
  playSound('funeral');

  const overlay = document.getElementById('death-overlay');
  const modelName = document.getElementById('death-model-name');
  const modelFaction = document.getElementById('death-model-faction');
  const gagText = document.getElementById('death-gag-text');

  if (overlay) {
    modelName.textContent = op.name;
    const factionData = getFaction(op.faction);
    modelFaction.textContent = factionData ? `${factionData.shortName} (${factionData.id})` : op.faction;

    const randIdx = Math.floor(Math.random() * GAG_MESSAGES.length);
    gagText.textContent = GAG_MESSAGES[randIdx];

    overlay.style.display = 'flex';
    trapFocus(overlay);
  }

  addLog(`[阵亡提示] 特工 ${op.name} 已阵亡！请在物理沙盘中移除模型。`);
}

export function confirmOperativeDeath() {
  playSound('click');
  const overlay = document.getElementById('death-overlay');
  if (overlay) {
    overlay.style.display = 'none';
    releaseFocusTrap();
  }
  checkVictory();
}

export function checkVictory() {
  if (gameState.gameOver) return;

  const team0Faction = gameState.teamFactions[0];
  const team1Faction = gameState.teamFactions[1];
  const team0Alive = gameState.operatives.filter(o => o.teamSlot === 0 && !o.isDead).length;
  const team1Alive = gameState.operatives.filter(o => o.teamSlot === 1 && !o.isDead).length;

  if (team0Alive === 0 && team1Alive === 0) {
    gameState.gameOver = true;
    declareVictory('draw', '双方均全员阵亡，战斗以同归于尽平局告终！');
  } else if (team0Alive === 0) {
    gameState.gameOver = true;
    declareVictory('pm', `${getFactionDisplayName(team0Faction)}战队全员阵亡！\n${getFactionDisplayName(team1Faction)} 成功清剿了残敌，夺取了战场的完全控制权！`);
  } else if (team1Alive === 0) {
    gameState.gameOver = true;
    declareVictory('sm', `${getFactionDisplayName(team1Faction)}战队全员阵亡！\n${getFactionDisplayName(team0Faction)} 肃清了战场，坚守住光荣防线！`);
  }
}

export function declareVictory(winner, text) {
  showPhaseOverlay();
  const overlayBox = document.getElementById('phase-overlay-content');

  let winnerTitle = '🎉 对局结束 🎉';
  let titleColor = 'var(--text-main)';
  if (winner === 'sm') {
    const winFaction = gameState.teamFactions[0];
    winnerTitle = `🏆 ${getFactionDisplayName(winFaction)} 荣获胜利！ 🏆`;
    titleColor = `var(${getFactionThemeVar(winFaction)})`;
  } else if (winner === 'pm') {
    const winFaction = gameState.teamFactions[1];
    winnerTitle = `🏆 ${getFactionDisplayName(winFaction)} 荣获胜利！ 🏆`;
    titleColor = `var(${getFactionThemeVar(winFaction)})`;
  } else if (winner === 'draw') {
    winnerTitle = '🤝 双方同归于尽 (Match Draw) 🤝';
    titleColor = 'var(--imperial-gold)';
  }

  overlayBox.innerHTML = `
    <h3 style="color: ${titleColor}; font-size: 1.4rem; margin-bottom: 12px;">${winnerTitle}</h3>
    <div class="qa-card" style="margin-bottom: 20px; font-size: 0.95rem; text-align: center; line-height: 1.6; border-color: rgba(255,255,255,0.1);">
      <p style="white-space: pre-line; color: var(--text-main);">${text}</p>
    </div>
    <button class="btn-large" onclick="confirmReset()" style="padding: 10px 30px; font-size:0.9rem; background: var(--red); border-color: #b84c4c; width: 100%;">
      返回主菜单并重置对局
    </button>
  `;
}

// ==========================================
//           Turn Scoring
// ==========================================

export function showTurnEndScoringOverlay(isFinal = false) {
  gameState.phase = 'TurnEndScoring';
  gameState.isFinalScoring = isFinal; // 标记是否为最终结算
  updateScoresUI();
  showPhaseOverlay();

  // 自动计算击杀 VP (1 VP/击杀)
  // team 0 击杀 team 1 的阵亡数 = team 0 的击杀 VP, 反之亦然
  const currentSmKills = gameState.operatives.filter(o => o.teamSlot === 1 && o.isDead).length;
  const currentPmKills = gameState.operatives.filter(o => o.teamSlot === 0 && o.isDead).length;

  const smKillVp = currentSmKills - gameState.smKillsScored;
  const pmKillVp = currentPmKills - gameState.pmKillsScored;

  // 临时结算变量与任务结算助手
  gameState.tempSmChecklist = [false, false, false, false, false];
  gameState.tempPmChecklist = [false, false, false, false, false];
  gameState.tempSmObjManualOffset = 0;
  gameState.tempPmObjManualOffset = 0;
  gameState.tempSmObjVp = 0;
  gameState.tempPmObjVp = 0;
  gameState.tempSmKillVp = smKillVp;
  gameState.tempPmKillVp = pmKillVp;
  gameState.tempSmKills = currentSmKills;
  gameState.tempPmKills = currentPmKills;

  renderTurnEndScoringContent();
  updateGuidance('【回合结算】引导计算 VP：请输入双方本回合完成任务的 VP，并确认得分结算。');
}

export function renderTurnEndScoringContent() {
  const overlayBox = document.getElementById('phase-overlay-content');
  const totalSmVpThisTurn = gameState.tempSmKillVp + gameState.tempSmObjVp;
  const totalPmVpThisTurn = gameState.tempPmKillVp + gameState.tempPmObjVp;

  // 动态生成任务目标 checklist (按当前任务类型)
  const objectives = MISSION_OBJECTIVES[gameState.missionType] || MISSION_OBJECTIVES['custom'];
  const missionLabel = MISSION_LABELS[gameState.missionType] || '自定义任务';
  const buildChecklistHtml = (side, checklist, accentColor) => {
    return objectives.map((obj, i) => `
      <label class="scoring-item">
        <input type="checkbox" ${accentColor ? `style="accent-color: ${accentColor};"` : ''} ${checklist[i] ? 'checked' : ''} onchange="toggleScoringChecklist('${side}', ${i})">
        <span>${obj}</span>
      </label>
    `).join('');
  };

  const isFinalTP = gameState.turningPoint >= 5;
  const confirmBtnText = isFinalTP ? '确认结算并完成对局' : '确认结算并推进回合';
  const confirmAction = isFinalTP ? 'declareScoreVictory()' : 'confirmTurnEndScoring()';

  overlayBox.innerHTML = `
    <h3 style="font-size:1.3rem; margin-bottom: 8px;">Turning Point ${gameState.turningPoint} - 得分结算</h3>
    <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:15px; text-align:center;">
      每回合结束时，引导玩家计算任务得分，并由系统自动根据击杀数累加击杀 VP（1 击杀 = 1 VP）。
    </p>

    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; width:100%; text-align:left; margin-bottom:16px;">

      <!-- Team 0 结算 -->
      <div class="init-team-col ${getFactionCssSuffix(team0Faction)}" style="align-items:stretch;">
        <h4 style="color:var(${getFactionThemeVar(team0Faction)}); font-size:0.95rem; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:6px; margin-bottom:10px; text-align:center; font-family:'Pirata One',serif;">
          ${getFactionDisplayName(team0Faction)}
        </h4>
        <div style="font-size:0.85rem; display:flex; flex-direction:column; gap:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span>⚔️ 新增击杀得分：</span>
            <span style="font-weight:bold; color:var(${getFactionThemeVar(team0Faction)});">${gameState.tempSmKillVp} VP <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">(总击杀: ${gameState.tempSmKills})</span></span>
          </div>

          <div class="scoring-checklist-card">
            <div style="font-weight:600; font-size:0.75rem; color:var(--text-muted); margin-bottom:4px; text-transform:uppercase;">
              ${missionLabel} — 任务结算助手
            </div>
            ${buildChecklistHtml('sm', gameState.tempSmChecklist, '')}
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
            <span>🎯 调整任务得分 (Total Obj VP)：</span>
            <div class="val-control">
              <button class="adjust-btn" onclick="adjustScoreTemp('sm', -1)">-</button>
              <span class="val" style="font-size:1.1rem; font-weight:bold; min-width:20px; text-align:center;">${gameState.tempSmObjVp}</span>
              <button class="adjust-btn" onclick="adjustScoreTemp('sm', 1)">+</button>
            </div>
          </div>
          <div style="border-top:1px dashed rgba(255,255,255,0.1); padding-top:8px; display:flex; justify-content:space-between; align-items:center; font-weight:bold; font-size:0.95rem;">
            <span>本回合得分小计：</span>
            <span style="color:var(${getFactionThemeVar(team0Faction)});">+${totalSmVpThisTurn} VP</span>
          </div>
        </div>
      </div>

      <!-- Team 1 结算 -->
      <div class="init-team-col ${getFactionCssSuffix(team1Faction)}" style="align-items:stretch;">
        <h4 style="color:var(${getFactionThemeVar(team1Faction)}); font-size:0.95rem; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:6px; margin-bottom:10px; text-align:center; font-family:'Pirata One',serif;">
          ${getFactionDisplayName(team1Faction)}
        </h4>
        <div style="font-size:0.85rem; display:flex; flex-direction:column; gap:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span>⚔️ 新增击杀得分：</span>
            <span style="font-weight:bold; color:var(${getFactionThemeVar(team1Faction)});">${gameState.tempPmKillVp} VP <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">(总击杀: ${gameState.tempPmKills})</span></span>
          </div>

          <div class="scoring-checklist-card">
            <div style="font-weight:600; font-size:0.75rem; color:var(--text-muted); margin-bottom:4px; text-transform:uppercase;">
              ${missionLabel} — 任务结算助手
            </div>
            ${buildChecklistHtml('pm', gameState.tempPmChecklist, `var(${getFactionThemeVar(team1Faction)})`)}
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
            <span>🎯 调整任务得分 (Total Obj VP)：</span>
            <div class="val-control">
              <button class="adjust-btn" onclick="adjustScoreTemp('pm', -1)">-</button>
              <span class="val" style="font-size:1.1rem; font-weight:bold; min-width:20px; text-align:center;">${gameState.tempPmObjVp}</span>
              <button class="adjust-btn" onclick="adjustScoreTemp('pm', 1)">+</button>
            </div>
          </div>
          <div style="border-top:1px dashed rgba(255,255,255,0.1); padding-top:8px; display:flex; justify-content:space-between; align-items:center; font-weight:bold; font-size:0.95rem;">
            <span>本回合得分小计：</span>
            <span style="color:var(${getFactionThemeVar(team1Faction)});">+${totalPmVpThisTurn} VP</span>
          </div>
        </div>
      </div>

    </div>

    <button class="btn-large" onclick="${confirmAction}" style="padding: 12px 30px; font-size:0.9rem; background:linear-gradient(135deg, var(--green), #2a5a3a); border-color:#4a7c59; box-shadow:none; width: 100%;">
      ${confirmBtnText}
    </button>
  `;
}

export function toggleScoringChecklist(faction, idx) {
  playSound('click');
  if (faction === 'sm') {
    gameState.tempSmChecklist[idx] = !gameState.tempSmChecklist[idx];
    gameState.tempSmObjVp = Math.max(0, gameState.tempSmChecklist.filter(Boolean).length + gameState.tempSmObjManualOffset);
  } else {
    gameState.tempPmChecklist[idx] = !gameState.tempPmChecklist[idx];
    gameState.tempPmObjVp = Math.max(0, gameState.tempPmChecklist.filter(Boolean).length + gameState.tempPmObjManualOffset);
  }
  renderTurnEndScoringContent();
}

export function adjustScoreTemp(faction, amount) {
  playSound('click');
  if (faction === 'sm') {
    gameState.tempSmObjManualOffset += amount;
    gameState.tempSmObjVp = Math.max(0, gameState.tempSmChecklist.filter(Boolean).length + gameState.tempSmObjManualOffset);
  } else {
    gameState.tempPmObjManualOffset += amount;
    gameState.tempPmObjVp = Math.max(0, gameState.tempPmChecklist.filter(Boolean).length + gameState.tempPmObjManualOffset);
  }
  renderTurnEndScoringContent();
}

export function confirmTurnEndScoring() {
  playSound('crit');

  const smGain = gameState.tempSmKillVp + gameState.tempSmObjVp;
  const pmGain = gameState.tempPmKillVp + gameState.tempPmObjVp;

  gameState.smVp += smGain;
  gameState.pmVp += pmGain;

  gameState.smKillsScored = gameState.tempSmKills;
  gameState.pmKillsScored = gameState.tempPmKills;

  addLog(`\n--- Turning Point ${gameState.turningPoint} 回合结算结果 ---`);
  addLog(`[${getFactionDisplayName(gameState.teamFactions[0])}] 新增 ${smGain} VP (任务:${gameState.tempSmObjVp}, 击杀:${gameState.tempSmKillVp}) | 累计 VP: ${gameState.smVp}`);
  addLog(`[${getFactionDisplayName(gameState.teamFactions[1])}] 新增 ${pmGain} VP (任务:${gameState.tempPmObjVp}, 击杀:${gameState.tempPmKillVp}) | 累计 VP: ${gameState.pmVp}`);

  hidePhaseOverlay();
  endTurningPoint();
}

export function declareScoreVictory() {
  playSound('crit');

  const smGain = gameState.tempSmKillVp + gameState.tempSmObjVp;
  const pmGain = gameState.tempPmKillVp + gameState.tempPmObjVp;

  gameState.smVp += smGain;
  gameState.pmVp += pmGain;
  gameState.smKillsScored = gameState.tempSmKills;
  gameState.pmKillsScored = gameState.tempPmKills;

  gameState.gameOver = true;
  updateScoresUI();

  const team0Faction = gameState.teamFactions[0];
  const team1Faction = gameState.teamFactions[1];
  let winReason = `双方经历五回合激烈交火，战斗正式落幕！\n最终战队积分：\n${getFactionDisplayName(team0Faction)}: ${gameState.smVp} VP\n${getFactionDisplayName(team1Faction)}: ${gameState.pmVp} VP\n\n`;
  if (gameState.smVp === gameState.pmVp) {
    declareVictory('draw', winReason + '双方得分平分秋色，本局握手言和！');
  } else if (gameState.smVp > gameState.pmVp) {
    declareVictory('sm', winReason + `${getFactionDisplayName(team0Faction)}胜利点数更高，赢得最终胜利！`);
  } else {
    declareVictory('pm', winReason + `${getFactionDisplayName(team1Faction)}胜利点数更高，赢得最终胜利！`);
  }
}

// ==========================================
//           Avatar Upload
// ==========================================

export function triggerAvatarUpload(event, opId) {
  event.stopPropagation();
  const uploader = document.getElementById('global-avatar-uploader');
  if (uploader) {
    uploader.dataset.targetOpId = opId;
    uploader.value = ''; // 允许重复上传同一张图片
    uploader.click();
  }
}

export function handleAvatarFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  const opId = event.target.dataset.targetOpId;
  if (!opId) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const base64Data = e.target.result;
    gameState.customAvatars[opId] = base64Data;

    // 重新渲染相关界面
    renderRosterPickers();
    renderOperatives();
    updateActivePanel();

    addLog(`[头像上传] 成功更新特工 [${opId}] 的自定义照片！`);
  };
  reader.readAsDataURL(file);
}

// ==========================================
//           Visual Effects
// ==========================================

export function triggerCombatVisual(text, type = 'normal') {
  // 1. 触发震屏 (skip if user prefers reduced motion)
  if (!prefersReducedMotion.matches) {
    const target = document.querySelector('#combat-modal .modal-content') || document.querySelector('.app-container') || document.body;
    target.classList.remove('intense-shake');
    void target.offsetWidth; // 触发回流以重新播放 CSS 动画
    target.classList.add('intense-shake');
    setTimeout(() => {
      target.classList.remove('intense-shake');
    }, 400);
  }

  // 2. 创建悬浮飘字元素
  const el = document.createElement('div');
  el.className = 'impact-effect-text';
  el.textContent = text;

  // 根据类型定制颜色和阴影
  if (type === 'strike') {
    el.style.color = 'var(--red)';
    el.style.textShadow = '0 0 20px rgba(225, 29, 72, 0.85), 0 0 40px #000';
  } else if (type === 'parry') {
    el.style.color = '#38bdf8'; // 天蓝色
    el.style.textShadow = '0 0 20px rgba(56, 189, 248, 0.85), 0 0 40px #000';
  } else if (type === 'shoot') {
    el.style.color = 'var(--sm-accent)';
  } else if (type === 'deflect') {
    el.style.color = '#7ab88a'; // 柠檬绿
    el.style.textShadow = '0 0 20px rgba(163, 230, 53, 0.85), 0 0 40px #000';
  }

  document.body.appendChild(el);
  setTimeout(() => {
    el.remove();
  }, 1800);
}

export function triggerAvatarHitEffect(opId, type) {
  const selectors = [`.duel-avatar-${opId}`, `.main-avatar-${opId}`];
  selectors.forEach(sel => {
    const el = document.querySelector(sel);
    if (!el) return;

    // Remove classes if already running
    el.classList.remove('avatar-hit-flash');
    const oldEffects = el.querySelectorAll('.bullet-hole-effect, .slash-effect');
    oldEffects.forEach(n => n.remove());

    // Trigger reflow
    void el.offsetWidth;

    // Add flash
    el.classList.add('avatar-hit-flash');

    // Add overlay element
    const overlay = document.createElement('div');
    overlay.className = type === 'shoot' ? 'bullet-hole-effect' : 'slash-effect';
    el.appendChild(overlay);

    // Clean up after animation completes
    setTimeout(() => {
      el.classList.remove('avatar-hit-flash');
      overlay.remove();
    }, 900);
  });
}

// ==========================================
//           Dice Utilities
// ==========================================

export function rollDicePool(count) {
  const rolls = [];
  for (let i = 0; i < count; i++) {
    rolls.push(Math.floor(Math.random() * 6) + 1);
  }
  return rolls.sort((a, b) => b - a);
}

export function evaluateAttackRolls(rolls, bs) {
  let criticals = 0;
  let normals = 0;
  let misses = 0;
  for (const val of rolls) {
    if (val === 6) {
      criticals++;
    } else if (val >= bs) {
      normals++;
    } else {
      misses++;
    }
  }
  return { criticals, normals, misses, rolls };
}

export function evaluateDefenseRolls(rolls, sv) {
  let criticals = 0;
  let normals = 0;
  let fails = 0;
  for (const val of rolls) {
    if (val === 6) {
      criticals++;
    } else if (val >= sv) {
      normals++;
    } else {
      fails++;
    }
  }
  return { criticals, normals, fails, rolls };
}
