import { gameState, wizardState, GAG_MESSAGES, hasUsableOperatives, switchSides, endTurningPoint } from './state.js';
import { playSound } from './audio.js';
import { SM_TEMPLATES, PM_TEMPLATES, RULE_TEXTS } from './constants.js';
import { Weapon, Operative } from './models.js';

// Accessibility: check reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

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
        <button class="modal-btn primary" id="confirm-dialog-ok" style="background: linear-gradient(135deg, var(--red), #991b1b); border-color: #f43f5e;">确认</button>
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

// Warrior duplicate counts (faction → { templateId → count })
const selectedSMCounts = {};
const selectedPMCounts = {};

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

  // Update ploy tags
  const smTags = document.getElementById('sm-ploy-tags');
  smTags.innerHTML = '';
  gameState.smActivePloys.forEach(ploy => {
    const span = document.createElement('span');
    span.className = 'ploy-tag sm';
    span.textContent = ploy === 'bolter_discipline' ? '爆弹惩戒' : ploy;
    smTags.appendChild(span);
  });

  const pmTags = document.getElementById('pm-ploy-tags');
  pmTags.innerHTML = '';
  gameState.pmActivePloys.forEach(ploy => {
    const span = document.createElement('span');
    span.className = 'ploy-tag pm';
    span.textContent = ploy === 'contagious_resilience' ? '传染韧性' : ploy;
    pmTags.appendChild(span);
  });

  // Update Next Phase button visibility inside dash
  const nextBtn = document.getElementById('btn-next-phase');
  if (nextBtn) {
    if (gameState.phase === 'Firefight' && !hasUsableOperatives('Space Marine') && !hasUsableOperatives('Plague Marine')) {
      nextBtn.style.display = 'inline-block';
      nextBtn.textContent = '回合得分结算';
      nextBtn.onclick = showTurnEndScoringOverlay;
    } else {
      nextBtn.style.display = 'none';
    }
  }
}

export function adjustScore(faction, type, amount) {
  playSound('click');
  if (faction === 'sm') {
    if (type === 'vp') gameState.smVp = Math.max(0, gameState.smVp + amount);
    else gameState.smCp = Math.max(0, gameState.smCp + amount);
  } else {
    if (type === 'vp') gameState.pmVp = Math.max(0, gameState.pmVp + amount);
    else gameState.pmCp = Math.max(0, gameState.pmCp + amount);
  }
  updateScoresUI();
}

export function confirmReset() {
  showConfirmDialog('确定要重置当前对局吗？所有进度和选择将被清空。', () => {
    playSound('click');
    gameState.turningPoint = 1;
    gameState.phase = 'Initiative';
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

export function getAvatarHtml(opId, faction) {
  const avatarUrl = gameState.customAvatars[opId];
  let fallbackUrl = faction === 'Space Marine' ? 'assets/images/defaults/default_sm_avatar.png' : 'assets/images/defaults/default_pm_avatar.png';

  const activeOp = gameState.operatives.find(o => o.id === opId);
  const opName = activeOp ? activeOp.name : (SM_TEMPLATES.concat(PM_TEMPLATES).find(t => t.id === opId)?.name || opId);

  if (activeOp && activeOp.defaultAvatar) {
    fallbackUrl = activeOp.defaultAvatar;
  } else {
    const template = SM_TEMPLATES.concat(PM_TEMPLATES).find(t => t.id === opId);
    if (template && template.defaultAvatar) {
      fallbackUrl = template.defaultAvatar;
    }
  }

  const imgUrl = avatarUrl || fallbackUrl;
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
    const rulesTag = w.rules && w.rules.length > 0 ? ` [${w.rules.join(',')}]` : '';
    return shortName + rulesTag;
  }).join(' / ');
}

function buildRosterRowHtml(tmpl, faction, isLeader, checked, disabled, toggleFn, badgeStyle) {
  const badge = isLeader
    ? `<span class="role-badge leader" ${badgeStyle ? `style="${badgeStyle}"` : ''}>LEADER</span>`
    : `<span class="role-badge">OPERATOR</span>`;
  const checkedAttr = checked ? 'checked' : '';
  const disabledAttr = disabled ? 'disabled' : '';
  const avatarHtml = getAvatarHtml(tmpl.id, faction);
  const warriorTag = tmpl.isWarrior ? ' <span style="color:#fbbf24; font-size:0.65rem;">[Warrior]</span>' : '';

  // Warrior 使用计数器（可复选多个同型单位），其他使用复选框
  let controlHtml;
  if (tmpl.isWarrior) {
    controlHtml = `
      <div class="warrior-counter" data-warrior-id="${tmpl.id}">
        <button class="warrior-counter-btn minus" onclick="event.stopPropagation(); decrementWarrior('${tmpl.id}')" aria-label="减少数量">−</button>
        <span class="warrior-counter-value" id="warrior-count-${tmpl.id}">0</span>
        <button class="warrior-counter-btn plus" onclick="event.stopPropagation(); incrementWarrior('${tmpl.id}')" aria-label="增加数量">+</button>
      </div>
    `;
  } else {
    controlHtml = `<input type="checkbox" class="roster-checkbox" id="check-${tmpl.id}" ${checkedAttr} ${disabledAttr} onchange="${toggleFn}('${tmpl.id}')">`;
  }

  return `
    ${controlHtml}
    ${avatarHtml}
    <div class="roster-op-info">
      <div class="roster-op-name">${tmpl.name} ${badge}${warriorTag}</div>
      <div class="roster-op-weapons">Move: ${tmpl.move || 6}" | HP: ${tmpl.wounds} | APL: ${tmpl.apl}</div>
      <div style="font-size:0.65rem; color:#94a3b8; margin-top:2px;">武器: ${buildWeaponSummary(tmpl)}</div>
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

// ---- Warrior 计数器: 增加 / 减少 ----
export function incrementWarrior(id) {
  playSound('click');
  const isSM = SM_TEMPLATES.some(t => t.id === id);
  const faction = isSM ? 'sm' : 'pm';
  const templates = isSM ? SM_TEMPLATES : PM_TEMPLATES;
  const counts = isSM ? selectedSMCounts : selectedPMCounts;
  const tmpl = templates.find(t => t.id === id);
  if (!tmpl || !tmpl.isWarrior) return;

  // Operator 上限为 5 (Leader 必占 1 位, 总人数 6)
  const currentOpCount = getOperatorCount(faction);
  if (currentOpCount >= 5) {
    showToast('Operator 数量已达上限 (5 名)！请先减少其他 Operator。', 'warning');
    return;
  }

  counts[id] = (counts[id] || 0) + 1;
  const countEl = document.getElementById(`warrior-count-${id}`);
  if (countEl) countEl.textContent = counts[id];

  const row = document.getElementById(`picker-row-${id}`);
  if (row) {
    if (counts[id] > 0) row.classList.add('selected');
    else row.classList.remove('selected');
  }

  updateSelectionCounts();
  updateOperatorAvailability(faction);
}

export function decrementWarrior(id) {
  playSound('click');
  const isSM = SM_TEMPLATES.some(t => t.id === id);
  const faction = isSM ? 'sm' : 'pm';
  const counts = isSM ? selectedSMCounts : selectedPMCounts;
  if (!counts[id] || counts[id] <= 0) return;

  counts[id]--;
  const countEl = document.getElementById(`warrior-count-${id}`);
  if (countEl) countEl.textContent = counts[id];

  const row = document.getElementById(`picker-row-${id}`);
  if (row && counts[id] <= 0) row.classList.remove('selected');

  updateSelectionCounts();
  updateOperatorAvailability(faction);
}

// ---- 计算当前已选 Operator 数量 (不含 Leader) ----
function getOperatorCount(faction) {
  const templates = faction === 'sm' ? SM_TEMPLATES : PM_TEMPLATES;
  const counts = faction === 'sm' ? selectedSMCounts : selectedPMCounts;
  let count = 0;

  // 非 Warrior Operator (checkbox)
  templates.filter(t => !t.isLeader && !t.isWarrior).forEach(t => {
    if (document.getElementById(`check-${t.id}`)?.checked) count++;
  });

  // Warrior counts
  templates.filter(t => !t.isLeader && t.isWarrior).forEach(t => {
    count += (counts[t.id] || 0);
  });

  return count;
}

// ---- 计算当前已选总人数 (含 Leader) ----
function getSelectedTotal(faction) {
  const templates = faction === 'sm' ? SM_TEMPLATES : PM_TEMPLATES;
  let leaderCount = 0;

  templates.filter(t => t.isLeader).forEach(t => {
    if (faction === 'pm') leaderCount = 1; // PM Champion 锁定
    else if (document.getElementById(`check-${t.id}`)?.checked) leaderCount++;
  });

  return leaderCount + getOperatorCount(faction);
}

export function renderRosterPickers() {
  // 重置计数
  Object.keys(selectedSMCounts).forEach(k => delete selectedSMCounts[k]);
  Object.keys(selectedPMCounts).forEach(k => delete selectedPMCounts[k]);

  // ---- SM (死亡天使): 1 Leader + 5 Operators ----
  const smLeaders = SM_TEMPLATES.filter(t => t.isLeader);
  const smOperators = SM_TEMPLATES.filter(t => !t.isLeader);

  const smLeaderSection = document.getElementById('sm-leader-section');
  const smOperatorSection = document.getElementById('sm-operator-section');
  smLeaderSection.innerHTML = '';
  smOperatorSection.innerHTML = '';

  // Leader 分组标题
  smLeaderSection.innerHTML = `
    <div style="font-size:0.8rem; font-weight:600; color:#60a5fa; margin-bottom:6px; padding-left:4px;">
      🎖️ LEADER — 单选 1 名 (3 选 1)
    </div>
  `;
  smLeaders.forEach(tmpl => {
    const row = document.createElement('div');
    row.className = 'roster-pick-row';
    row.id = `picker-row-${tmpl.id}`;
    row.innerHTML = buildRosterRowHtml(tmpl, 'Space Marine', true, false, false, 'toggleSelectSM');
    attachRowClickHandler(row, tmpl.id, toggleSelectSM, false);
    smLeaderSection.appendChild(row);
  });

  // Operator 分组标题
  smOperatorSection.innerHTML = `
    <div style="font-size:0.8rem; font-weight:600; color:#60a5fa; margin:12px 0 6px 4px; display:flex; justify-content:space-between; align-items:center;">
      <span>🎯 OPERATORS — 共选 5 名 (Warrior 可用计数器重复选取)</span>
      <span id="sm-op-count" style="font-size:0.75rem; color:#94a3b8; font-family:'Orbitron',sans-serif;">0 / 5</span>
    </div>
    <p style="font-size:0.7rem; color:var(--text-muted); margin-bottom:8px; padding-left:4px;">
      ⚠️ 非 Warrior 每种只能带一名。Warrior [Warrior] 可用 +/− 按钮选取最多 5 名同型单位。
    </p>
  `;
  smOperators.forEach(tmpl => {
    const row = document.createElement('div');
    row.className = 'roster-pick-row';
    row.id = `picker-row-${tmpl.id}`;
    row.innerHTML = buildRosterRowHtml(tmpl, 'Space Marine', false, false, false, 'toggleSelectSM');
    attachRowClickHandler(row, tmpl.id, toggleSelectSM, tmpl.isWarrior);
    smOperatorSection.appendChild(row);
  });

  // ---- PM (瘟疫守卫): 1 Champion (locked) + 5 Operators ----
  const pmLeaders = PM_TEMPLATES.filter(t => t.isLeader);
  const pmOperators = PM_TEMPLATES.filter(t => !t.isLeader);

  const pmLeaderSection = document.getElementById('pm-leader-section');
  const pmOperatorSection = document.getElementById('pm-operator-section');
  pmLeaderSection.innerHTML = '';
  pmOperatorSection.innerHTML = '';

  // Leader (Champion 必选)
  pmLeaderSection.innerHTML = `
    <div style="font-size:0.8rem; font-weight:600; color:var(--pm-accent); margin-bottom:6px; padding-left:4px;">
      🎖️ LEADER — 必选
    </div>
  `;
  const pmBadgeStyle = 'border-color:var(--pm-accent); color:var(--pm-accent); background:rgba(132,204,22,0.15)';
  pmLeaders.forEach(tmpl => {
    const row = document.createElement('div');
    row.className = 'roster-pick-row selected';
    row.id = `picker-row-${tmpl.id}`;
    row.innerHTML = buildRosterRowHtml(tmpl, 'Plague Marine', true, true, true, 'toggleSelectPM', pmBadgeStyle);
    pmLeaderSection.appendChild(row);
  });

  // Operators
  pmOperatorSection.innerHTML = `
    <div style="font-size:0.8rem; font-weight:600; color:var(--pm-accent); margin:12px 0 6px 4px; display:flex; justify-content:space-between; align-items:center;">
      <span>🎯 OPERATORS — 共选 5 名 (6 类型, Warrior 可重复)</span>
      <span id="pm-op-count" style="font-size:0.75rem; color:#94a3b8; font-family:'Orbitron',sans-serif;">0 / 5</span>
    </div>
    <p style="font-size:0.7rem; color:var(--text-muted); margin-bottom:8px; padding-left:4px;">
      ⚠️ 非 Warrior 每种只能带一名。Warrior [Warrior] 可用 +/− 按钮选取多名同型单位。
    </p>
  `;
  pmOperators.forEach(tmpl => {
    const row = document.createElement('div');
    row.className = 'roster-pick-row';
    row.id = `picker-row-${tmpl.id}`;
    row.innerHTML = buildRosterRowHtml(tmpl, 'Plague Marine', false, false, false, 'toggleSelectPM', pmBadgeStyle);
    attachRowClickHandler(row, tmpl.id, toggleSelectPM, tmpl.isWarrior);
    pmOperatorSection.appendChild(row);
  });

  updateSelectionCounts();
  updateOperatorAvailability('sm');
  updateOperatorAvailability('pm');
}

// ---- SM Toggle (leader 单选互斥; 非 warrior operator 上限检查) ----
export function toggleSelectSM(id) {
  playSound('click');
  const tmpl = SM_TEMPLATES.find(t => t.id === id);
  const cb = document.getElementById(`check-${id}`);
  const row = document.getElementById(`picker-row-${id}`);

  if (!tmpl || !cb) return;

  if (tmpl.isLeader) {
    // Leader 单选互斥: 选中时取消其他 leader
    if (cb.checked) {
      SM_TEMPLATES.filter(t => t.isLeader && t.id !== id).forEach(other => {
        const otherCb = document.getElementById(`check-${other.id}`);
        if (otherCb) {
          otherCb.checked = false;
          document.getElementById(`picker-row-${other.id}`)?.classList.remove('selected');
        }
      });
    }
  } else if (cb.checked) {
    // 非 Warrior operator: 检查 Operator 上限 5 (Leader 必占 1 位)
    const currentOpCount = getOperatorCount('sm');
    if (currentOpCount > 5) {
      cb.checked = false;
      showToast('Operator 数量已达上限 (5 名)！请先减少其他 Operator。', 'warning');
      updateSelectionCounts();
      return;
    }
  }

  if (cb.checked) row.classList.add('selected');
  else row.classList.remove('selected');

  updateSelectionCounts();
  updateOperatorAvailability('sm');
}

// ---- PM Toggle (非 warrior operator 上限检查) ----
export function toggleSelectPM(id) {
  playSound('click');
  const tmpl = PM_TEMPLATES.find(t => t.id === id);
  const cb = document.getElementById(`check-${id}`);
  const row = document.getElementById(`picker-row-${id}`);

  if (!tmpl || !cb) return;
  if (tmpl.isLeader) return; // Champion 锁定, 不可切换

  if (cb.checked) {
    // Operator 上限 5 (Champion 必占 1 位)
    const currentOpCount = getOperatorCount('pm');
    if (currentOpCount > 5) {
      cb.checked = false;
      showToast('Operator 数量已达上限 (5 名)！请先减少其他 Operator。', 'warning');
      updateSelectionCounts();
      return;
    }
  }

  if (cb.checked) row.classList.add('selected');
  else row.classList.remove('selected');

  updateSelectionCounts();
  updateOperatorAvailability('pm');
}

// ---- 动态禁用: Operator 满 5 个时禁掉未选中的非 Warrior 复选框, Warrior + 按钮也限制 ----
function updateOperatorAvailability(faction) {
  const templates = faction === 'sm' ? SM_TEMPLATES : PM_TEMPLATES;
  const counts = faction === 'sm' ? selectedSMCounts : selectedPMCounts;
  const opCount = getOperatorCount(faction);
  const atOpLimit = opCount >= 5;

  templates.filter(t => !t.isLeader).forEach(tmpl => {
    if (tmpl.isWarrior) {
      const plusBtn = document.querySelector(`#picker-row-${tmpl.id} .warrior-counter-btn.plus`);
      const minusBtn = document.querySelector(`#picker-row-${tmpl.id} .warrior-counter-btn.minus`);
      const currentCount = counts[tmpl.id] || 0;
      if (plusBtn) plusBtn.disabled = atOpLimit;
      if (minusBtn) minusBtn.disabled = currentCount <= 0;
    } else {
      const cb = document.getElementById(`check-${tmpl.id}`);
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
  const smTotal = getSelectedTotal('sm');
  const smOpCount = getOperatorCount('sm');
  document.getElementById('sm-roster-count').textContent = `已选: ${smTotal} / 6 人`;
  const smOpEl = document.getElementById('sm-op-count');
  if (smOpEl) smOpEl.textContent = `${smOpCount} / 5`;

  const pmTotal = getSelectedTotal('pm');
  const pmOpCount = getOperatorCount('pm');
  document.getElementById('pm-roster-count').textContent = `已选: ${pmTotal} / 6 人`;
  const pmOpEl = document.getElementById('pm-op-count');
  if (pmOpEl) pmOpEl.textContent = `${pmOpCount} / 5`;
}

export function validateRostersAndDeploy() {
  playSound('click');

  // 收集 SM 选中的模板和数量（warrior 可 > 1）
  const smEntries = []; // { tmpl, count }
  let smLeaderCount = 0;
  SM_TEMPLATES.forEach(t => {
    if (t.isWarrior) {
      const count = selectedSMCounts[t.id] || 0;
      if (count > 0) {
        smEntries.push({ tmpl: t, count });
      }
    } else if (document.getElementById(`check-${t.id}`)?.checked) {
      smEntries.push({ tmpl: t, count: 1 });
      if (t.isLeader) smLeaderCount++;
    }
  });
  const smTotal = smEntries.reduce((sum, e) => sum + e.count, 0);

  // 收集 PM 选中的模板和数量
  const pmEntries = [];
  PM_TEMPLATES.forEach(t => {
    if (t.isWarrior) {
      const count = selectedPMCounts[t.id] || 0;
      if (count > 0) {
        pmEntries.push({ tmpl: t, count });
      }
    } else if (document.getElementById(`check-${t.id}`)?.checked) {
      pmEntries.push({ tmpl: t, count: 1 });
    }
  });
  const pmTotal = pmEntries.reduce((sum, e) => sum + e.count, 0);

  // 校验 SM
  if (smTotal !== 6) {
    playSound('alert');
    showToast(`星际战士 (死亡天使) 必须刚好选择 6 人！当前选择了 ${smTotal} 人。`, 'error');
    return;
  }
  if (smLeaderCount !== 1) {
    playSound('alert');
    showToast(`星际战士 必须选择且仅选择 1 名队长！`, 'error');
    return;
  }

  // 校验 PM
  if (pmTotal !== 6) {
    playSound('alert');
    showToast(`瘟疫守卫 必须刚好选择 6 人！当前选择了 ${pmTotal} 人。`, 'error');
    return;
  }
  const pmChampionChecked = document.getElementById('check-pm_1')?.checked;
  if (!pmChampionChecked) {
    playSound('alert');
    showToast(`瘟疫守卫 的 冠军队长 (Plague Champion) 是强制出战的 Leader 角色！`, 'error');
    return;
  }

  // 校验通过，载入特工列表
  gameState.operatives = [];

  // 加载 SM（Warrior count > 1 时生成多个独立 Operative，id 加后缀区分）
  smEntries.forEach(({ tmpl, count }) => {
    for (let i = 0; i < count; i++) {
      const uniqueId = count > 1 ? `${tmpl.id}_${i + 1}` : tmpl.id;
      const displayName = count > 1 ? `${tmpl.name} #${i + 1}` : tmpl.name;
      gameState.operatives.push(new Operative(uniqueId, displayName, 'Space Marine', tmpl.wounds, tmpl.apl, tmpl.df, tmpl.sv, tmpl.weapons, tmpl.defaultAvatar, tmpl.move || 6));
    }
  });

  // 加载 PM
  pmEntries.forEach(({ tmpl, count }) => {
    for (let i = 0; i < count; i++) {
      const uniqueId = count > 1 ? `${tmpl.id}_${i + 1}` : tmpl.id;
      const displayName = count > 1 ? `${tmpl.name} #${i + 1}` : tmpl.name;
      gameState.operatives.push(new Operative(uniqueId, displayName, 'Plague Marine', tmpl.wounds, tmpl.apl, tmpl.df, tmpl.sv, tmpl.weapons, tmpl.defaultAvatar, tmpl.move || 5));
    }
  });

  // 进入先攻阶段
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('global-dash').style.display = 'grid';
  document.getElementById('battle-area').style.display = 'grid';
  document.getElementById('guidance-banner').style.display = 'flex';

  addLog('>>> 战队挑选部署完毕！');
  addLog(`  - Angels of Death (星际战士) 登场: ${gameState.operatives.filter(o => o.faction === 'Space Marine').map(o => o.name).join(', ')}`);
  addLog(`  - Plague Marines (瘟疫守卫) 登场: ${gameState.operatives.filter(o => o.faction === 'Plague Marine').map(o => o.name).join(', ')}`);

  updateScoresUI();
  renderOperatives();
  startInitiativePhase();
}

export function renderOperatives() {
  const smList = document.getElementById('sm-ops-list');
  const pmList = document.getElementById('pm-ops-list');

  smList.innerHTML = '';
  pmList.innerHTML = '';

  let smAlive = 0;
  let pmAlive = 0;

  gameState.operatives.forEach(op => {
    const isSm = op.faction === 'Space Marine';
    if (isSm && !op.isDead) smAlive++;
    if (!isSm && !op.isDead) pmAlive++;

    const card = document.createElement('div');

    let cardClasses = `op-card ${isSm ? 'sm-theme' : 'pm-theme'}`;
    if (op.isDead) cardClasses += ' dead';
    else if (op.hasActed) cardClasses += ' activated';

    if (gameState.activeAgent && gameState.activeAgent.id === op.id) {
      cardClasses += ' active-target';
    }

    card.className = cardClasses;

    const hpPercent = (op.wounds / op.maxWounds) * 100;
    const weaponNames = op.weapons.map(w => w.name.split(' ')[0]).join(' / ');

    let tagHtml = '';
    if (!isSm && gameState.pmActivePloys.includes('contagious_resilience') && !op.isDead) {
      tagHtml = '<span class="card-ploy-tag" style="border-color:var(--pm-accent); color:var(--pm-accent); background:rgba(132,204,22,0.15);">减伤重投</span>';
    }

    // 状态标记：Conceal / Injured / Poison Token
    let statusTagsHtml = '';
    if (!op.isDead) {
      if (op.hasConceal) {
        statusTagsHtml += '<span class="card-ploy-tag" style="border-color:#818cf8; color:#818cf8; background:rgba(129,140,248,0.15); font-size:0.6rem;">隐蔽</span>';
      }
      if (op.isInjured) {
        statusTagsHtml += '<span class="card-ploy-tag" style="border-color:var(--red); color:var(--red); background:rgba(239,68,68,0.15); font-size:0.6rem;">重伤</span>';
      }
      if (op.poisonTokens > 0) {
        statusTagsHtml += '<span class="card-ploy-tag" style="border-color:#a3e635; color:#a3e635; background:rgba(163,230,53,0.15); font-size:0.6rem;">毒素×' + op.poisonTokens + '</span>';
      }
    }

    // Conceal 切换按钮（仅当特工属于当前回合阵营且未死亡/未激活时可用）
    const canToggleConceal = !op.isDead && !op.hasActed && gameState.phase === 'Firefight' && gameState.activeTurn === op.faction;
    const concealBtnHtml = canToggleConceal
      ? `<button class="conceal-toggle-btn" onclick="event.stopPropagation(); toggleConceal('${op.id}')" title="切换隐蔽状态" style="font-size:0.65rem; padding:2px 6px; margin-left:4px; background:${op.hasConceal ? 'rgba(129,140,248,0.3)' : 'transparent'}; border:1px solid #818cf8; color:#818cf8; border-radius:4px; cursor:pointer;">${op.hasConceal ? '🛡️隐蔽' : '🛡️'}</button>`
      : '';

    const avatarHtml = getAvatarHtml(op.id, op.faction);

    card.innerHTML = `
      <div class="op-card-top">
        <div class="op-avatar-row">
          ${avatarHtml}
          <span class="op-card-title">${op.name} ${tagHtml} ${statusTagsHtml} ${concealBtnHtml}</span>
        </div>
        <span class="op-card-tag">${op.currentApl} APL${op.isInjured ? ' <span style="color:var(--red); font-size:0.6rem;">(-1)</span>' : ''}</span>
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
        <span style="font-size: 0.65rem; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px;">
          ${weaponNames}
        </span>
      </div>
    `;

    // Add accessibility attributes
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `${op.name}，HP: ${op.wounds}/${op.maxWounds}，${op.isDead ? '已阵亡' : op.hasActed ? '已激活' : '可激活'}`);

    if (!op.isDead && !op.hasActed && gameState.phase === 'Firefight' && gameState.activeTurn === op.faction && !gameState.activeAgent) {
      card.onclick = () => activateOperative(op.id);
      card.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activateOperative(op.id); } };
    } else {
      card.onclick = null;
      card.onkeydown = null;
      if (op.isDead) card.setAttribute('aria-disabled', 'true');
    }

    if (isSm) smList.appendChild(card);
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
  if (!op || op.isDead || op.hasActed) return;
  op.toggleConceal();
  addLog(`[隐蔽] ${op.name} ${op.hasConceal ? '进入隐蔽状态 (Conceal Order)，不可被指定为射击/近战目标。' : '解除了隐蔽状态。'}`);
  renderOperatives();
}

// ==========================================
//           Active Panel
// ==========================================

export function activateOperative(opId) {
  playSound('click');
  const op = gameState.operatives.find(o => o.id === opId);
  if (!op || op.isDead || op.hasActed) return;

  gameState.activeAgent = op;
  op.actionsPerformed = [];

  // Poison Token 伤害：携带毒素标记的特工在激活开始时受到 1 点伤害
  if (op.poisonTokens > 0) {
    addLog(`[Poison] ${op.name} 携带毒素标记，激活开始受到 1 点伤害！`);
    op.applyWounds(1);
    // 如果因此阵亡则不再继续激活
    if (op.isDead) {
      renderOperatives();
      updateActivePanel();
      return;
    }
  }

  // Injured 时 APL -1（使用 currentApl getter）
  op.apl = op.currentApl;

  addLog(`[激活] ${op.name} 开始激活，获得 ${op.apl} APL！${op.isInjured ? ' (Injured: APL -1)' : ''}`);

  renderOperatives();
  updateActivePanel();
}

export function updateActivePanel() {
  const content = document.getElementById('active-panel-content');
  const empty = document.getElementById('active-panel-empty');
  const statusTitle = document.getElementById('active-panel-status');
  const activeCard = document.getElementById('active-panel');

  if (gameState.activeAgent) {
    content.style.display = 'flex';
    empty.style.display = 'none';

    const op = gameState.activeAgent;
    statusTitle.textContent = '当前激活特工';

    const avatarContainer = document.getElementById('active-op-avatar-container');
    if (avatarContainer) {
      avatarContainer.innerHTML = getAvatarHtml(op.id, op.faction);
    }

    activeCard.className = `active-card ${op.faction === 'Space Marine' ? 'sm-active' : 'pm-active'}`;
    document.getElementById('active-op-name').textContent = op.name;
    document.getElementById('active-op-faction').textContent = op.faction === 'Space Marine' ? '死亡天使' : '瘟疫守卫';

    const dots = document.getElementById('active-apl-dots');
    dots.innerHTML = '';
    for (let i = 0; i < op.maxApl; i++) {
      const dot = document.createElement('div');
      dot.className = 'apl-dot' + (i < op.apl ? ' active' : '');
      dots.appendChild(dot);
    }

    const hasMoved = op.actionsPerformed.includes('Move');
    const hasCharged = op.actionsPerformed.includes('Charge');

    const shootCount = op.actionsPerformed.filter(a => a === 'Shoot').length;
    const fightCount = op.actionsPerformed.filter(a => a === 'Fight').length;
    const hasShot = shootCount > 0;
    const hasFought = fightCount > 0;

    // Astartes 双重行动规则: 可选择 2 Shoot 或 2 Fight (但不能混合)
    const isAstartes = true; // 所有 SM 和 PM 都是 Astartes
    const maxShoots = isAstartes ? 2 : 1;
    const maxFights = isAstartes ? 2 : 1;

    // 互斥约束：做了 Shoot 就不能 Fight，做了 Fight 就不能 Shoot
    const shootLocked = isAstartes && hasFought;    // 已近战, 锁定射击
    const fightLocked = isAstartes && hasShot;       // 已射击, 锁定近战
    const shootLimitReached = shootCount >= maxShoots;
    const fightLimitReached = fightCount >= maxFights;

    document.getElementById('action-move').disabled = op.apl < 1 || hasMoved || hasCharged;
    document.getElementById('action-charge').disabled = op.apl < 1 || hasMoved || hasCharged || hasFought;
    document.getElementById('action-shoot').disabled = op.apl < 1 || shootLimitReached || shootLocked || hasCharged;
    document.getElementById('action-fight').disabled = op.apl < 1 || fightLimitReached || fightLocked;

    const hasContagiousResilience = op.faction === 'Plague Marine' && gameState.pmActivePloys.includes('contagious_resilience');

    const ployDisplay = document.getElementById('active-ploys-display');
    if (ployDisplay) {
        const ploysText = [];
        if (hasShot) ploysText.push(`<span style="color:#60a5fa;">💥 Astartes: 已射击×${shootCount}，锁定近战</span>`);
        if (hasFought) ploysText.push(`<span style="color:#f87171;">⚔️ Astartes: 已近战×${fightCount}，锁定射击</span>`);
        if (hasContagiousResilience) ploysText.push('<span style="color:var(--pm-accent);">🛡️ 传染韧性生效中</span>');
        ployDisplay.innerHTML = ploysText.length > 0 ? ploysText.join(' | ') : '';
    }

    const shootBtnText = document.querySelector('#action-shoot span:first-child');
    if (shootBtnText) {
        if (isAstartes) {
            const remaining = maxShoots - shootCount;
            const lockedNote = shootLocked ? ' (已锁定)' : '';
            shootBtnText.innerHTML = `💥 射击 [${remaining > 0 ? remaining : 0}次剩余${lockedNote}]`;
        } else {
            shootBtnText.innerHTML = `💥 射击 (Shoot)`;
        }
    }

    const fightBtnText = document.querySelector('#action-fight span:first-child');
    if (fightBtnText) {
        if (isAstartes) {
            const remaining = maxFights - fightCount;
            const lockedNote = fightLocked ? ' (已锁定)' : '';
            fightBtnText.innerHTML = `⚔️ 近战 [${remaining > 0 ? remaining : 0}次剩余${lockedNote}]`;
        } else {
            fightBtnText.innerHTML = `⚔️ 近战 (Fight)`;
        }
    }

    updateGuidance(`【特工行动】${op.name} 剩余 APL: ${op.apl}。可执行移动/冲锋/射击/近战，或点击下方按钮结束。`);
  } else {
    content.style.display = 'none';
    empty.style.display = 'block';
    statusTitle.textContent = '等待特工激活';
    activeCard.className = 'active-card';

    const nextFaction = gameState.activeTurn;
    const cn = nextFaction === 'Space Marine' ? '死亡天使' : '瘟疫守卫';

    const hasUsable = hasUsableOperatives(nextFaction);
    if (hasUsable) {
      const sideName = nextFaction === 'Space Marine' ? '左边' : '右边';
      updateGuidance(`【激活提示】请从${sideName}【${cn}】战队卡片列表中选择点击发亮的特工卡片，载入动作。`);
    } else {
      const oppFaction = nextFaction === 'Space Marine' ? 'Plague Marine' : 'Space Marine';
      if (hasUsableOperatives(oppFaction)) {
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
  addLog(`  - ${op.name} 执行 [移动 (Move)]，消耗 1 APL。`);
  updateActivePanel();
}

export function performCharge() {
  const op = gameState.activeAgent;
  if (!op || op.apl < 1) return;
  playSound('click');
  op.apl -= 1;
  op.actionsPerformed.push('Charge');
  addLog(`  - ${op.name} 执行 [冲锋 (Charge)] 移动近战位，消耗 1 APL。`);
  updateActivePanel();
}

export function endActivation() {
  playSound('click');
  const op = gameState.activeAgent;
  if (!op) return;
  op.hasActed = true;
  op.apl = 0;
  addLog(`[结束激活] ${op.name} 结束了本次激活。`);
  gameState.activeAgent = null;
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
      <div class="init-team-col sm">
        <h4 style="color:#60a5fa; font-size:0.9rem;">死亡天使先攻骰</h4>
        <div class="dice-pool-view" id="overlay-init-sm-dice">
          <div class="kt-dice-cube sm-dice">?</div>
        </div>
        <div id="overlay-init-sm-val" style="font-weight:bold; font-size: 0.9rem; color:var(--text-muted);">未投骰</div>
      </div>
      <div class="init-team-col pm">
        <h4 style="color:var(--pm-accent); font-size:0.9rem;">瘟疫守卫先攻骰</h4>
        <div class="dice-pool-view" id="overlay-init-pm-dice">
          <div class="kt-dice-cube pm-dice">?</div>
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
  trapFocus(overlay);
}

export function hidePhaseOverlay() {
  document.getElementById('phase-overlay').style.display = 'none';
  releaseFocusTrap();
}

export function rollInitiativeOverlay() {
  const smDiceEl = document.getElementById('overlay-init-sm-dice');
  const pmDiceEl = document.getElementById('overlay-init-pm-dice');
  const rollBtn = document.getElementById('btn-overlay-roll');

  rollBtn.disabled = true;

  // 滚动动画
  smDiceEl.innerHTML = `<div class="kt-dice-cube sm-dice rolling">?</div>`;
  pmDiceEl.innerHTML = `<div class="kt-dice-cube pm-dice rolling">?</div>`;
  playSound('shoot');

  // 顺序停下
  setTimeout(() => {
    const smVal = Math.floor(Math.random() * 6) + 1;
    smDiceEl.innerHTML = `<div class="kt-dice-cube sm-dice ${smVal===6?'crit-dice':''}">${smVal}</div>`;
    playSound('click');
    if (smVal === 6) playSound('crit');

    setTimeout(() => {
      const pmVal = Math.floor(Math.random() * 6) + 1;
      pmDiceEl.innerHTML = `<div class="kt-dice-cube pm-dice ${pmVal===6?'crit-dice':''}">${pmVal}</div>`;
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
        const winner = smVal > pmVal ? 'Space Marine' : 'Plague Marine';
        const winnerCN = winner === 'Space Marine' ? '死亡天使' : '瘟疫守卫';
        playSound('crit');

        document.getElementById('overlay-init-sm-val').textContent = `点数: ${smVal}`;
        document.getElementById('overlay-init-pm-val').textContent = `点数: ${pmVal}`;

        addLog(`  - 先攻判定掷骰：死亡天使 [${smVal}] vs 瘟疫守卫 [${pmVal}]`);
        addLog(`  - 【${winnerCN}】赢得了投骰，准备选择先攻权归属。`);

        const overlayBox = document.getElementById('phase-overlay-content');
        const turnOrderDiv = document.createElement('div');
        turnOrderDiv.style.cssText = 'border-top:1px solid var(--panel-border); margin-top:16px; padding-top:16px; width:100%;';
        turnOrderDiv.innerHTML = `
            <p style="color:var(--sm-accent); font-weight:bold; margin-bottom:10px;">👑 【${winnerCN}】选择首发玩家：</p>
            <div style="display:flex; gap:10px;">
              <button class="qa-btn" onclick="selectTurnOrder('Space Marine')">死亡天使先攻 (Astartes First)</button>
              <button class="qa-btn" onclick="selectTurnOrder('Plague Marine')">瘟疫守卫先攻 (Death Guard First)</button>
            </div>
        `;
        overlayBox.appendChild(turnOrderDiv);
        updateGuidance(`【选择先后】王座归属：【${winnerCN}】玩家获胜，请点击按钮指定本回合先攻。`);
      }
    }, 300);
  }, 700);
}

export function selectTurnOrder(faction) {
  playSound('click');
  gameState.initiative = faction;
  gameState.activeTurn = faction;
  addLog(`  - 确认：【${faction === 'Space Marine' ? '死亡天使' : '瘟疫守卫'}】获得本回合的先攻优势！`);

  startStrategyPhase();
}

export function startStrategyPhase() {
  gameState.phase = 'Strategy';
  updateScoresUI();
  showPhaseOverlay();

  const overlayBox = document.getElementById('phase-overlay-content');

  overlayBox.innerHTML = `
    <h3>Turning Point ${gameState.turningPoint} - 策略阶段</h3>
    <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:12px;">
      在此阶段，双方可以使用命令点 (CP) 激活计策 (Strategic Ploys)。
    </p>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; width:100%; text-align:left; margin-bottom:16px;">
      <div class="ploy-choice-card ${gameState.smActivePloys.includes('bolter_discipline') ? 'selected' : ''}" role="button" tabindex="0" onclick="buyPloy('sm')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();buyPloy('sm')}">
        <div class="ploy-title">
          <span>🔥 爆弹惩戒 (1 CP)</span>
          <span style="font-size:0.75rem; color:#60a5fa;">Astartes</span>
        </div>
        <div class="ploy-desc">
          死亡天使特工本回合激活内，可以使用<b>两次</b>射击行动。
        </div>
        <div style="margin-top:6px; font-weight:bold; font-size:0.75rem; color:var(--sm-accent);">
          ${gameState.smActivePloys.includes('bolter_discipline') ? '● 生效中' : '点击启用'}
        </div>
      </div>

      <div class="ploy-choice-card ${gameState.pmActivePloys.includes('contagious_resilience') ? 'selected' : ''}" role="button" tabindex="0" onclick="buyPloy('pm')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();buyPloy('pm')}">
        <div class="ploy-title">
          <span>🛡️ 传染韧性 (1 CP)</span>
          <span style="font-size:0.75rem; color:var(--pm-accent);">Death Guard</span>
        </div>
        <div class="ploy-desc">
          瘟疫守卫在结算【恶心作呕 (DR)】伤害减免时，可<b>重投第一个失败的减伤骰</b>。
        </div>
        <div style="margin-top:6px; font-weight:bold; font-size:0.75rem; color:var(--pm-accent);">
          ${gameState.pmActivePloys.includes('contagious_resilience') ? '● 生效中' : '点击启用'}
        </div>
      </div>
    </div>

    <button class="btn-large" onclick="proceedToFirefight()" style="padding: 10px 40px; font-size:0.9rem; background:linear-gradient(135deg, var(--green), #065f46); border-color:#059669; box-shadow:none;">
      进入战斗阶段 (Proceed to Firefight)
    </button>
  `;

  updateGuidance('【策略阶段】双方轮流消费 1 CP 采购策略 Ploys。按 Proceed 按钮进入实际交火战斗。');
}

export function buyPloy(faction) {
  if (faction === 'sm') {
    if (gameState.smActivePloys.includes('bolter_discipline')) {
      playSound('click');
      gameState.smActivePloys = [];
      gameState.smCp += 1;
    } else {
      if (gameState.smCp < 1) { playSound('alert'); showToast('死亡天使 CP 不足！', 'warning'); return; }
      playSound('crit');
      gameState.smActivePloys.push('bolter_discipline');
      gameState.smCp -= 1;
      addLog('  - 死亡天使激活策略：【爆弹惩戒】！本回合可双击开火！');
    }
  } else {
    if (gameState.pmActivePloys.includes('contagious_resilience')) {
      playSound('click');
      gameState.pmActivePloys = [];
      gameState.pmCp += 1;
    } else {
      if (gameState.pmCp < 1) { playSound('alert'); showToast('瘟疫守卫 CP 不足！', 'warning'); return; }
      playSound('crit');
      gameState.pmActivePloys.push('contagious_resilience');
      gameState.pmCp -= 1;
      addLog('  - 瘟疫守卫激活策略：【传染韧性】！DR首发失败可重投！');
    }
  }
  startStrategyPhase();
}

export function proceedToFirefight() {
  playSound('click');
  hidePhaseOverlay();
  gameState.phase = 'Firefight';
  updateScoresUI();

  addLog(`\n【战斗阶段开始】Turning Point ${gameState.turningPoint}`);
  addLog(`>>> 首发方【${gameState.activeTurn === 'Space Marine' ? '死亡天使' : '瘟疫守卫'}】可以激活一名特工。`);

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
    modelFaction.textContent = op.faction === 'Space Marine' ? '死亡天使 (Angels of Death)' : '瘟疫守卫 (Plague Marines)';

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

  const smAlive = gameState.operatives.filter(o => o.faction === 'Space Marine' && !o.isDead).length;
  const pmAlive = gameState.operatives.filter(o => o.faction === 'Plague Marine' && !o.isDead).length;

  if (smAlive === 0 && pmAlive === 0) {
    gameState.gameOver = true;
    declareVictory('draw', '双方均全员阵亡，战斗以同归于尽平局告终！');
  } else if (smAlive === 0) {
    gameState.gameOver = true;
    declareVictory('pm', '死亡天使战队全员阵亡！\n瘟疫守卫 (Plague Marines) 成功清剿了残敌，夺取了战场的完全控制权！');
  } else if (pmAlive === 0) {
    gameState.gameOver = true;
    declareVictory('sm', '瘟疫守卫战队全员阵亡！\n死亡天使 (Angels of Death) 肃清了战场，坚守住帝国的光荣防线！');
  }
}

export function declareVictory(winner, text) {
  showPhaseOverlay();
  const overlayBox = document.getElementById('phase-overlay-content');

  let winnerTitle = '🎉 对局结束 🎉';
  let titleColor = 'var(--text-main)';
  if (winner === 'sm') {
    winnerTitle = '🏆 死亡天使 (Angels of Death) 荣获胜利！ 🏆';
    titleColor = '#60a5fa';
  } else if (winner === 'pm') {
    winnerTitle = '🏆 瘟疫守卫 (Plague Marines) 荣获胜利！ 🏆';
    titleColor = 'var(--pm-accent)';
  } else if (winner === 'draw') {
    winnerTitle = '🤝 双方同归于尽 (Match Draw) 🤝';
    titleColor = 'var(--sm-accent)';
  }

  overlayBox.innerHTML = `
    <h3 style="color: ${titleColor}; font-size: 1.4rem; margin-bottom: 12px;">${winnerTitle}</h3>
    <div class="qa-card" style="margin-bottom: 20px; font-size: 0.95rem; text-align: center; line-height: 1.6; border-color: rgba(255,255,255,0.1);">
      <p style="white-space: pre-line; color: var(--text-main);">${text}</p>
    </div>
    <button class="btn-large" onclick="confirmReset()" style="padding: 10px 30px; font-size:0.9rem; background: var(--red); border-color: #f43f5e; width: 100%;">
      返回主菜单并重置对局
    </button>
  `;
}

// ==========================================
//           Turn Scoring
// ==========================================

export function showTurnEndScoringOverlay() {
  gameState.phase = 'TurnEndScoring';
  updateScoresUI();
  showPhaseOverlay();

  // 自动计算击杀 VP (1 VP/击杀)
  const currentSmKills = gameState.operatives.filter(o => o.faction === 'Plague Marine' && o.isDead).length;
  const currentPmKills = gameState.operatives.filter(o => o.faction === 'Space Marine' && o.isDead).length;

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

  const isFinalTP = gameState.turningPoint >= 5;
  const confirmBtnText = isFinalTP ? '确认结算并完成对局' : '确认结算并推进回合';
  const confirmAction = isFinalTP ? 'declareScoreVictory()' : 'confirmTurnEndScoring()';

  overlayBox.innerHTML = `
    <h3 style="font-size:1.3rem; margin-bottom: 8px;">Turning Point ${gameState.turningPoint} - 得分结算</h3>
    <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:15px; text-align:center;">
      每回合结束时，引导玩家计算任务得分，并由系统自动根据击杀数累加击杀 VP（1 击杀 = 1 VP）。
    </p>

    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; width:100%; text-align:left; margin-bottom:16px;">

      <!-- SM 结算 -->
      <div class="init-team-col sm" style="align-items:stretch; background: rgba(59,130,246,0.02); border: 1px solid rgba(59,130,246,0.1);">
        <h4 style="color:#60a5fa; font-size:0.95rem; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:6px; margin-bottom:10px; text-align:center; font-family:'Orbitron',sans-serif;">
          死亡天使 (SM)
        </h4>
        <div style="font-size:0.85rem; display:flex; flex-direction:column; gap:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span>⚔️ 新增击杀得分：</span>
            <span style="font-weight:bold; color:var(--sm-accent);">${gameState.tempSmKillVp} VP <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">(总击杀: ${gameState.tempSmKills})</span></span>
          </div>

          <div class="scoring-checklist-card">
            <div style="font-weight:600; font-size:0.75rem; color:var(--text-muted); margin-bottom:4px; text-transform:uppercase;">任务结算助手 (Objective Checklist)</div>
            <label class="scoring-item">
              <input type="checkbox" ${gameState.tempSmChecklist[0] ? 'checked' : ''} onchange="toggleScoringChecklist('sm', 0)">
              <span>控制1+目标点 (+1 VP)</span>
            </label>
            <label class="scoring-item">
              <input type="checkbox" ${gameState.tempSmChecklist[1] ? 'checked' : ''} onchange="toggleScoringChecklist('sm', 1)">
              <span>控制目标多于对手 (+1 VP)</span>
            </label>
            <label class="scoring-item">
              <input type="checkbox" ${gameState.tempSmChecklist[2] ? 'checked' : ''} onchange="toggleScoringChecklist('sm', 2)">
              <span>完成特定任务动作 (+1 VP)</span>
            </label>
            <label class="scoring-item">
              <input type="checkbox" ${gameState.tempSmChecklist[3] ? 'checked' : ''} onchange="toggleScoringChecklist('sm', 3)">
              <span>本回合秘密任务1 (+1 VP)</span>
            </label>
            <label class="scoring-item">
              <input type="checkbox" ${gameState.tempSmChecklist[4] ? 'checked' : ''} onchange="toggleScoringChecklist('sm', 4)">
              <span>本回合秘密任务2 (+1 VP)</span>
            </label>
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
            <span style="color:#60a5fa;">+${totalSmVpThisTurn} VP</span>
          </div>
        </div>
      </div>

      <!-- PM 结算 -->
      <div class="init-team-col pm" style="align-items:stretch; background: rgba(34,197,94,0.02); border: 1px solid rgba(34,197,94,0.1);">
        <h4 style="color:var(--pm-accent); font-size:0.95rem; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:6px; margin-bottom:10px; text-align:center; font-family:'Orbitron',sans-serif;">
          瘟疫守卫 (PM)
        </h4>
        <div style="font-size:0.85rem; display:flex; flex-direction:column; gap:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span>⚔️ 新增击杀得分：</span>
            <span style="font-weight:bold; color:var(--pm-accent);">${gameState.tempPmKillVp} VP <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">(总击杀: ${gameState.tempPmKills})</span></span>
          </div>

          <div class="scoring-checklist-card">
            <div style="font-weight:600; font-size:0.75rem; color:var(--text-muted); margin-bottom:4px; text-transform:uppercase;">任务结算助手 (Objective Checklist)</div>
            <label class="scoring-item">
              <input type="checkbox" style="accent-color: var(--pm-accent);" ${gameState.tempPmChecklist[0] ? 'checked' : ''} onchange="toggleScoringChecklist('pm', 0)">
              <span>控制1+目标点 (+1 VP)</span>
            </label>
            <label class="scoring-item">
              <input type="checkbox" style="accent-color: var(--pm-accent);" ${gameState.tempPmChecklist[1] ? 'checked' : ''} onchange="toggleScoringChecklist('pm', 1)">
              <span>控制目标多于对手 (+1 VP)</span>
            </label>
            <label class="scoring-item">
              <input type="checkbox" style="accent-color: var(--pm-accent);" ${gameState.tempPmChecklist[2] ? 'checked' : ''} onchange="toggleScoringChecklist('pm', 2)">
              <span>完成特定任务动作 (+1 VP)</span>
            </label>
            <label class="scoring-item">
              <input type="checkbox" style="accent-color: var(--pm-accent);" ${gameState.tempPmChecklist[3] ? 'checked' : ''} onchange="toggleScoringChecklist('pm', 3)">
              <span>本回合秘密任务1 (+1 VP)</span>
            </label>
            <label class="scoring-item">
              <input type="checkbox" style="accent-color: var(--pm-accent);" ${gameState.tempPmChecklist[4] ? 'checked' : ''} onchange="toggleScoringChecklist('pm', 4)">
              <span>本回合秘密任务2 (+1 VP)</span>
            </label>
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
            <span style="color:var(--pm-accent);">+${totalPmVpThisTurn} VP</span>
          </div>
        </div>
      </div>

    </div>

    <button class="btn-large" onclick="${confirmAction}" style="padding: 12px 30px; font-size:0.9rem; background:linear-gradient(135deg, var(--green), #065f46); border-color:#059669; box-shadow:none; width: 100%;">
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
  addLog(`[死亡天使] 新增 ${smGain} VP (任务:${gameState.tempSmObjVp}, 击杀:${gameState.tempSmKillVp}) | 累计 VP: ${gameState.smVp}`);
  addLog(`[瘟疫守卫] 新增 ${pmGain} VP (任务:${gameState.tempPmObjVp}, 击杀:${gameState.tempPmKillVp}) | 累计 VP: ${gameState.pmVp}`);

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

  let winReason = `双方经历五回合激烈交火，战斗正式落幕！\n最终战队积分：\n死亡天使: ${gameState.smVp} VP\n瘟疫守卫: ${gameState.pmVp} VP\n\n`;
  if (gameState.smVp === gameState.pmVp) {
    declareVictory('draw', winReason + '双方得分平分秋色，本局握手言和！');
  } else if (gameState.smVp > gameState.pmVp) {
    declareVictory('sm', winReason + '死亡天使胜利点数更高，赢得最终胜利！');
  } else {
    declareVictory('pm', winReason + '瘟疫守卫胜利点数更高，赢得最终胜利！');
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
    document.body.classList.remove('intense-shake');
    void document.body.offsetWidth; // 触发回流以重新播放 CSS 动画
    document.body.classList.add('intense-shake');
    setTimeout(() => {
      document.body.classList.remove('intense-shake');
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
    el.style.color = '#a3e635'; // 柠檬绿
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
