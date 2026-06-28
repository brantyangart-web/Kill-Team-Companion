import { gameState, wizardState, GAG_MESSAGES, hasUsableOperatives, switchSides, endTurningPoint, startCounteractActivation, skipCounteract } from './state.js';
import { playSound } from './audio.js';
import { SM_TEMPLATES, PM_TEMPLATES, LEG_TEMPLATES, RULE_TEXTS } from './constants.js';
import { Weapon, Operative, translateRule, getRuleDescription } from './models.js';
import {
  getEnemyFaction, getDiceClass, getCpForFaction, setCpForFaction,
  getVpForFaction, setVpForFaction, getFactionDisplayName, getFactionCssSuffix,
  hasFactionTrait, getActivePloys, setActivePloys, getFaction, getTeamSlot,
  getTeamCssClass, getFactionThemeVar, getFactionTraits
} from '../rules/faction.js';
import { getAssetPath } from './paths.js';
import {
  PLOY_DATABASE, getAvailablePloys, getPloy, isPloyActive, activatePersistentPloy, activateFirefightPloy,
  isFirefightPloyActive, getUsedPloysThisTP, markPloyUsedThisTP,
  getCombatDoctrineChoice, setCombatDoctrineChoice
} from '../rules/ploys.js';
import { isFinalTurningPoint } from '../rules/strategy.js';
import { activeRuleSet } from '../rules/ruleSets.js';
import { weaponHasRule } from '../rules/weapons.js';

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
  playSound('important_decision');
  const select = document.getElementById('mission-type');
  const desc = document.getElementById('mission-desc');
  if (select && desc) {
    desc.innerHTML = MISSION_DESCRIPTIONS[select.value] || '';
  }
}

export function updateRulesVersion() {
  playSound('important_decision');
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
      advanceRow.style.display = activeRuleSet().hasAdvanceAction ? '' : 'none';
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
  if (text.includes('<') && text.includes('>')) {
    line.innerHTML = text;
  } else {
    line.textContent = text;
  }
  logPanel.appendChild(line);
  logPanel.scrollTop = logPanel.scrollHeight;
}

// ==========================================
//         Visual Event Queue Manager
// ==========================================

const visualQueue = [];
let isVisualQueueProcessing = false;
let renderDamageAnimationFn = null;

export function registerDamageAnimationRenderer(fn) {
  renderDamageAnimationFn = fn;
}

export function queueVisualEvent(event) {
  visualQueue.push(event);
  processNextVisualEvent();
}

function processNextVisualEvent() {
  if (isVisualQueueProcessing) return;
  if (visualQueue.length === 0) return;

  isVisualQueueProcessing = true;
  const event = visualQueue.shift();

  try {
    if (event.type === 'damage') {
      if (renderDamageAnimationFn) {
        renderDamageAnimationFn(event.data);
      } else {
        console.warn('renderDamageAnimationFn is not registered yet. Auto-advancing visual queue.');
      }
      // Auto-advance after 1400ms (animation duration)
      setTimeout(() => {
        isVisualQueueProcessing = false;
        processNextVisualEvent();
      }, 1400);
    } else if (event.type === 'poison_cutin') {
      effects.playFullCombatEffect(event.data.opId, 'poison', 'POISON', 'poison').then(() => {
        isVisualQueueProcessing = false;
        processNextVisualEvent();
      }).catch(err => {
        console.error('Poison cutin error:', err);
        isVisualQueueProcessing = false;
        processNextVisualEvent();
      });
    } else if (event.type === 'death') {
      renderDeathOverlay(event.data.operative);
      // Do NOT auto-advance. It is advanced when confirmOperativeDeath is called!
    } else if (event.type === 'callback') {
      if (event.data && typeof event.data.fn === 'function') {
        const res = event.data.fn();
        if (res instanceof Promise) {
          res.then(() => {
            isVisualQueueProcessing = false;
            processNextVisualEvent();
          }).catch(err => {
            console.error('Promise callback error:', err);
            isVisualQueueProcessing = false;
            processNextVisualEvent();
          });
          return;
        }
      }
      isVisualQueueProcessing = false;
      processNextVisualEvent();
    }
  } catch (err) {
    console.error('Error in processNextVisualEvent:', err);
    isVisualQueueProcessing = false;
    processNextVisualEvent();
  }
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

  // Update ploy tags (dynamic based on faction) — 显示当前激活的 firefight ploys
  const ployNames = {};
  // 从 PLOY_DATABASE 动态生成名称映射
  Object.values(PLOY_DATABASE).forEach(p => { ployNames[p.id] = p.name_cn; });
  const smTags = document.getElementById('sm-ploy-tags');
  smTags.innerHTML = '';
  const team0Suffix = getFactionCssSuffix(gameState.teamFactions[0]);
  // 显示 firefight ploys + persistent ploys
  const allPloys0 = [...gameState.smActivePloys, ...(gameState.persistentPloys?.[0] || [])];
  allPloys0.forEach(ploy => {
    const span = document.createElement('span');
    span.className = `ploy-tag ${team0Suffix}`;
    span.textContent = ployNames[ploy] || ploy;
    smTags.appendChild(span);
  });

  const pmTags = document.getElementById('pm-ploy-tags');
  pmTags.innerHTML = '';
  const team1Suffix = getFactionCssSuffix(gameState.teamFactions[1]);
  const allPloys1 = [...gameState.pmActivePloys, ...(gameState.persistentPloys?.[1] || [])];
  allPloys1.forEach(ploy => {
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
        boardImgEl.style.objectPosition = "center 47%";
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
  // 先隐藏所有 overlay
  hidePhaseOverlay();
  hideCounteractOverlay();

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
    gameState.persistentPloys = { 0: [], 1: [] };
    gameState.usedPloysThisTP = { 0: {}, 1: {} };
    gameState.combatDoctrineChoice = { 0: null, 1: null };
    gameState.operatives = [];
    gameState.activeAgent = null;
    gameState.pendingActivation = null;
    gameState.gameOver = false;
    gameState.smKillsScored = 0;
    gameState.pmKillsScored = 0;
    gameState.missionType = 'seize_ground';
    gameState.rulesVersion = 'lite';

    document.getElementById('start-screen').style.display = 'flex';
    document.getElementById('global-dash').style.display = 'none';
    document.getElementById('battle-area').style.display = 'none';
    
    const thp = document.getElementById('test-harness-panel');
    if (thp) thp.style.display = 'none';
    
    const btnSandbox = document.getElementById('btn-enter-sandbox');
    if (btnSandbox) btnSandbox.style.display = 'inline-block';
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
  let fallbackUrl = getAssetPath(`assets/images/defaults/default_${cssSuffix}_avatar.jpg`);

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

  return `<div class="op-avatar-slot main-avatar-${opId}" onclick="event.stopPropagation(); window.showDatacard('${opId}')" style="cursor:pointer;" title="查看数据卡">
            <img src="${imgUrl}" class="op-avatar-img" alt="${opName} 头像" loading="lazy" />
          </div>`;
}

// ==========================================
//           Datacard Modal
// ==========================================

export function showDatacard(opId) {
  playSound('click');
  const allTemplates = SM_TEMPLATES.concat(PM_TEMPLATES).concat(LEG_TEMPLATES);
  const activeOp = gameState.operatives.find(o => o.id === opId);
  const tmpl = activeOp || allTemplates.find(t => t.id === opId);
  
  if (!tmpl) return;

  const faction = activeOp ? activeOp.faction : (
    SM_TEMPLATES.find(t => t.id === opId) ? 'Space Marine' :
    PM_TEMPLATES.find(t => t.id === opId) ? 'Plague Marine' : 'Legionary'
  );

  let overlay = document.getElementById('datacard-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'datacard-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:100001;display:flex;justify-content:center;align-items:center;opacity:0;transition:opacity 0.2s ease-in-out;backdrop-filter:blur(5px);';
    overlay.onclick = (e) => {
      if (e.target === overlay) closeDatacard();
    };
    document.body.appendChild(overlay);
  }

  const roleTag = tmpl.isLeader ? '<span style="background:var(--imperial-gold);color:black;padding:2px 6px;border-radius:4px;font-size:0.75rem;font-weight:bold;margin-left:8px;">LEADER</span>' : '<span style="background:var(--panel-border);color:white;padding:2px 6px;border-radius:4px;font-size:0.75rem;margin-left:8px;">OPERATOR</span>';
  const factionColor = getFactionThemeVar(faction);
  const avatarUrl = getOperativeAvatarUrl(opId, faction);

  let rangedHtml = '';
  let meleeHtml = '';
  
  tmpl.weapons.forEach(w => {
    const rulesStr = w.rules && w.rules.length > 0 ? w.rules.map(translateRule).join(', ') : '-';
    const srList = [];
    const critList = [];
    if (w.rules) {
      w.rules.forEach(r => {
        const transR = translateRule(r);
        const clickable = `<span onclick="event.stopPropagation(); window.showRuleTooltip('${r}')" style="cursor:pointer; text-decoration:underline; text-decoration-style:dotted;">${transR}</span>`;
        if (r.startsWith('Lethal') || r.startsWith('Piercing Crits') || r.startsWith('Stun') || r.startsWith('Severe')) {
          critList.push(clickable);
        } else {
          srList.push(clickable);
        }
      });
    }
    const srStr = srList.length > 0 ? srList.join(', ') : '-';
    const critStr = critList.length > 0 ? critList.join(', ') : '-';

    const rowHtml = `
      <tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
        <td style="padding:8px 4px;text-align:left;">${w.name.split(' (')[0]}</td>
        <td style="padding:8px 4px;text-align:center;">${w.attacks}</td>
        <td style="padding:8px 4px;text-align:center;">${w.ts}+</td>
        <td style="padding:8px 4px;text-align:center;">${w.normalDamage}/${w.criticalDamage}</td>
        <td style="padding:8px 4px;text-align:center;font-size:0.8rem;color:var(--text-muted);">${srStr}</td>
        <td style="padding:8px 4px;text-align:center;font-size:0.8rem;color:var(--imperial-gold);">${critStr}</td>
      </tr>
    `;
    if (w.isRanged) rangedHtml += rowHtml;
    else meleeHtml += rowHtml;
  });

  if (!rangedHtml) rangedHtml = '<tr><td colspan="6" style="text-align:center;padding:8px;color:var(--text-muted);">无远程武器</td></tr>';
  if (!meleeHtml) meleeHtml = '<tr><td colspan="6" style="text-align:center;padding:8px;color:var(--text-muted);">无近战武器</td></tr>';

  overlay.innerHTML = `
    <div style="background:var(--bg-dark); border:1px solid ${factionColor}; border-radius:12px; max-width:90%; width:600px; box-shadow:0 0 30px rgba(0,0,0,0.8); overflow:hidden; position:relative;">
      <!-- Header -->
      <div style="background:linear-gradient(135deg, ${factionColor}33, transparent); padding:20px; display:flex; align-items:center; gap:20px; border-bottom:1px solid ${factionColor}66;">
        <img src="${avatarUrl}" style="width:80px;height:80px;border-radius:50%;border:2px solid ${factionColor};object-fit:cover;box-shadow:0 0 10px ${factionColor}66;" />
        <div style="flex-grow:1;">
          <h2 style="margin:0;color:#fff;font-size:1.4rem;">${tmpl.name.split(' (')[0]} ${roleTag}</h2>
          <p style="margin:4px 0 0;color:var(--text-muted);font-size:0.9rem;">${getFactionDisplayName(faction)} / ${tmpl.operativeType}</p>
        </div>
        <button onclick="closeDatacard()" style="position:absolute;top:15px;right:15px;background:none;border:none;color:#999;font-size:1.5rem;cursor:pointer;line-height:1;">&times;</button>
      </div>

      <!-- Stats Grid -->
      <div style="padding:20px;">
        <!-- Abilities -->
        ${(() => {
          const abHtml = getAbilitiesHtml(activeOp || { faction, abilities: tmpl.abilities || [] });
          return abHtml ? `
            <div style="margin-bottom:15px;">
              <h4 style="margin:0 0 8px;color:var(--imperial-gold-bright);font-size:0.95rem;display:flex;align-items:center;gap:6px;"><span>✨</span> 能力与特性</h4>
              <div style="display:flex; gap:6px; flex-wrap:wrap;">
                ${abHtml}
              </div>
            </div>
          ` : '';
        })()}
        
        <div style="display:grid; grid-template-columns:repeat(6, 1fr); gap:10px; margin-bottom:20px;">
          <div style="background:rgba(255,255,255,0.05);padding:10px;border-radius:8px;text-align:center;border:1px solid rgba(255,255,255,0.1);">
            <div style="font-size:0.7rem;color:var(--text-muted);font-weight:bold;">移动 (M)</div>
            <div style="font-size:1.4rem;color:#fff;margin-top:4px;">${tmpl.move || 6}"</div>
          </div>
          <div style="background:rgba(245,158,11,0.1);padding:10px;border-radius:8px;text-align:center;border:1px solid rgba(245,158,11,0.3);">
            <div style="font-size:0.7rem;color:#f59e0b;font-weight:bold;">行动点 (APL)</div>
            <div style="font-size:1.4rem;color:#fff;margin-top:4px;">${tmpl.apl || tmpl.maxApl}</div>
          </div>
          <div style="background:rgba(255,255,255,0.05);padding:10px;border-radius:8px;text-align:center;border:1px solid rgba(255,255,255,0.1);">
            <div style="font-size:0.7rem;color:var(--text-muted);font-weight:bold;">团队激活 (GA)</div>
            <div style="font-size:1.4rem;color:#fff;margin-top:4px;">1</div>
          </div>
          <div style="background:rgba(255,255,255,0.05);padding:10px;border-radius:8px;text-align:center;border:1px solid rgba(255,255,255,0.1);">
            <div style="font-size:0.7rem;color:var(--text-muted);font-weight:bold;">防御 (DF)</div>
            <div style="font-size:1.4rem;color:#fff;margin-top:4px;">${tmpl.df}</div>
          </div>
          <div style="background:rgba(59,130,246,0.1);padding:10px;border-radius:8px;text-align:center;border:1px solid rgba(59,130,246,0.3);">
            <div style="font-size:0.7rem;color:#3b82f6;font-weight:bold;">保护 (SV)</div>
            <div style="font-size:1.4rem;color:#fff;margin-top:4px;">${tmpl.sv}+</div>
          </div>
          <div style="background:rgba(239,68,68,0.1);padding:10px;border-radius:8px;text-align:center;border:1px solid rgba(239,68,68,0.3);">
            <div style="font-size:0.7rem;color:#ef4444;font-weight:bold;">生命 (W)</div>
            <div style="font-size:1.4rem;color:#fff;margin-top:4px;">${tmpl.wounds || tmpl.maxWounds}</div>
          </div>
        </div>

        <!-- Weapons -->
        <h4 style="margin:0 0 10px;color:var(--sm-accent);font-size:1rem;display:flex;align-items:center;gap:6px;"><span>🎯</span> 远程武器 (Ranged Weapons)</h4>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:0.9rem;">
          <thead>
            <tr style="background:rgba(0,0,0,0.3);border-bottom:2px solid rgba(255,255,255,0.1);color:#aaa;">
              <th style="padding:8px 4px;text-align:left;font-weight:600;">武器名称</th>
              <th style="padding:8px 4px;text-align:center;font-weight:600;" title="Attacks">攻击(A)</th>
              <th style="padding:8px 4px;text-align:center;font-weight:600;" title="Ballistic Skill">命中(BS)</th>
              <th style="padding:8px 4px;text-align:center;font-weight:600;" title="Damage">伤害(D)</th>
              <th style="padding:8px 4px;text-align:center;font-weight:600;" title="Special Rules">特殊规则(SR)</th>
              <th style="padding:8px 4px;text-align:center;font-weight:600;color:var(--imperial-gold);" title="Critical Rules">暴击规则(!)</th>
            </tr>
          </thead>
          <tbody>${rangedHtml}</tbody>
        </table>

        <h4 style="margin:0 0 10px;color:var(--pm-accent);font-size:1rem;display:flex;align-items:center;gap:6px;"><span>⚔️</span> 近战武器 (Melee Weapons)</h4>
        <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
          <thead>
            <tr style="background:rgba(0,0,0,0.3);border-bottom:2px solid rgba(255,255,255,0.1);color:#aaa;">
              <th style="padding:8px 4px;text-align:left;font-weight:600;">武器名称</th>
              <th style="padding:8px 4px;text-align:center;font-weight:600;" title="Attacks">攻击(A)</th>
              <th style="padding:8px 4px;text-align:center;font-weight:600;" title="Weapon Skill">命中(WS)</th>
              <th style="padding:8px 4px;text-align:center;font-weight:600;" title="Damage">伤害(D)</th>
              <th style="padding:8px 4px;text-align:center;font-weight:600;" title="Special Rules">特殊规则(SR)</th>
              <th style="padding:8px 4px;text-align:center;font-weight:600;color:var(--imperial-gold);" title="Critical Rules">暴击规则(!)</th>
            </tr>
          </thead>
          <tbody>${meleeHtml}</tbody>
        </table>
      </div>
    </div>
  `;
  
  overlay.style.display = 'flex';
  // Trigger reflow
  void overlay.offsetWidth;
  overlay.style.opacity = '1';
}

export function closeDatacard() {
  const overlay = document.getElementById('datacard-overlay');
  if (overlay) {
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 200);
  }
}

export function showRuleTooltip(ruleKey) {
  const desc = getRuleDescription(ruleKey);
  let tipOverlay = document.getElementById('rule-tip-overlay');
  if (!tipOverlay) {
    tipOverlay = document.createElement('div');
    tipOverlay.id = 'rule-tip-overlay';
    tipOverlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999999;display:flex;justify-content:center;align-items:center;opacity:0;transition:opacity 0.2s;backdrop-filter:blur(3px);';
    tipOverlay.onclick = (e) => {
      if (e.target === tipOverlay) {
        tipOverlay.style.opacity = '0';
        setTimeout(() => { tipOverlay.style.display = 'none'; }, 200);
      }
    };
  }
  
  // Re-append to ensure it's the last element in the DOM (fixes stacking context issues)
  document.body.appendChild(tipOverlay);
  tipOverlay.style.zIndex = '9999999';

  tipOverlay.innerHTML = `
    <div style="background:var(--bg-dark); border:1px solid var(--imperial-gold); border-radius:8px; padding:20px; max-width:80%; width:400px; box-shadow:0 0 20px rgba(0,0,0,0.8);">
      <h4 style="margin:0 0 10px; color:var(--imperial-gold); font-size:1.1rem;">📝 规则解释</h4>
      <p style="color:#ddd; line-height:1.6; font-size:0.95rem; margin:0;">${desc}</p>
      <button onclick="document.getElementById('rule-tip-overlay').click()" style="margin-top:20px; width:100%; padding:10px; background:var(--panel-border); color:#fff; border:none; border-radius:4px; cursor:pointer;">关闭</button>
    </div>
  `;
  tipOverlay.style.display = 'flex';
  void tipOverlay.offsetWidth;
  tipOverlay.style.opacity = '1';
}

window.showDatacard = showDatacard;
window.closeDatacard = closeDatacard;
window.showRuleTooltip = showRuleTooltip;

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

    let tacticsHtml = '';
    if (faction === 'Space Marine') {
      const CT_OPTIONS = [
        { id: 'aggressive', name: '凶猛(Aggressive)' },
        { id: 'dueler', name: '决斗(Dueler)' },
        { id: 'resolute', name: '坚毅(Resolute)' },
        { id: 'stealthy', name: '隐蔽(Stealthy)' },
        { id: 'mobile', name: '机动(Mobile)' },
        { id: 'hardy', name: '坚韧(Hardy)' },
        { id: 'sharpshooter', name: '神射手(Sharpshooter)' },
        { id: 'siege_specialist', name: '攻城专家(Siege)' }
      ];
      let optionsHtml = '';
      CT_OPTIONS.forEach(o => {
        optionsHtml += `<option value="${o.id}">${o.name}</option>`;
      });
      // Default to slightly different ones so they aren't the same
      let optionsHtml2 = '';
      CT_OPTIONS.forEach((o, idx) => {
        const sel = idx === 1 ? 'selected' : '';
        optionsHtml2 += `<option value="${o.id}" ${sel}>${o.name}</option>`;
      });

      tacticsHtml = `
        <div style="margin-top:6px; font-size:0.7rem; display:flex; gap:8px;" onclick="event.stopPropagation()">
          <select id="ct-primary-${prefix}-${tmpl.id}" class="tactic-select" style="background:#1e293b; color:#94a3b8; border:1px solid #475569; border-radius:4px; padding:2px; font-size:0.65rem;">
            ${optionsHtml}
          </select>
          <select id="ct-secondary-${prefix}-${tmpl.id}" class="tactic-select" style="background:#1e293b; color:#94a3b8; border:1px solid #475569; border-radius:4px; padding:2px; font-size:0.65rem;">
            ${optionsHtml2}
          </select>
        </div>
      `;
    } else if (faction === 'Legionary') {
      const MOC_OPTIONS = [
        { id: 'KHORNE', name: 'Khorne (恐虐)' },
        { id: 'NURGLE', name: 'Nurgle (纳垢)' },
        { id: 'SLAANESH', name: 'Slaanesh (色孽)' },
        { id: 'TZEENTCH', name: 'Tzeentch (奸奇)' },
        { id: 'UNDIVIDED', name: 'Undivided (无分)' }
      ];
      let optionsHtml = '';
      MOC_OPTIONS.forEach(o => {
        optionsHtml += `<option value="${o.id}">${o.name}</option>`;
      });
      tacticsHtml = `
        <div style="margin-top:6px; font-size:0.7rem;" onclick="event.stopPropagation()">
          <select id="moc-${prefix}-${tmpl.id}" class="tactic-select" style="background:#1e293b; color:#94a3b8; border:1px solid #8b1a1a; border-radius:4px; padding:2px; font-size:0.65rem;">
            ${optionsHtml}
          </select>
        </div>
      `;
    }

  return `
    ${controlHtml}
    ${avatarHtml}
    <div class="roster-op-info" style="flex: 1;">
      <div class="roster-op-name">${tmpl.name} ${badge}${warriorTag}</div>
      <div class="roster-op-weapons">Move: ${tmpl.move || 6}" | HP: ${tmpl.wounds} | APL: ${tmpl.apl}</div>
      <div style="font-size:0.65rem; color:#9a9da5; margin-top:2px;">武器: ${buildWeaponSummary(tmpl)}</div>
      ${tacticsHtml}
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
    const headerImg = document.getElementById(`team${slot}-header-img`);
    if (rosterCard) {
      rosterCard.className = `roster-picker-card ${cssSuffix} ${cssSuffix}-team`;
    }
    if (rosterTitle) {
      rosterTitle.textContent = factionData ? `${factionData.shortName} (${factionData.id})` : faction;
      rosterTitle.style.color = `var(--${cssSuffix}-accent, #fff)`;
    }
    if (headerImg) {
      if (cssSuffix === 'sm') headerImg.src = getAssetPath('assets/images/headers/faction_header_sm.jpg');
      else if (cssSuffix === 'pm') headerImg.src = getAssetPath('assets/images/headers/faction_header_pm.jpg');
      else if (cssSuffix === 'leg') headerImg.src = getAssetPath('assets/images/headers/faction_header_leg.jpg');
      headerImg.style.objectPosition = 'center 47%';
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
  playSound('important_decision');
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
      op.abilities = tmpl.abilities || [];

      if (team0Faction === 'Space Marine') {
        const pSel = document.getElementById(`ct-primary-s0-${tmpl.id}`);
        const sSel = document.getElementById(`ct-secondary-s0-${tmpl.id}`);
        if (pSel && sSel) {
          op.chapterTactics = [pSel.value, sSel.value];
          gameState.chapterTacticSelections[op.id] = { primary: pSel.value, secondary: sSel.value };
        }
      } else if (team0Faction === 'Legionary') {
        const mSel = document.getElementById(`moc-s0-${tmpl.id}`);
        if (mSel) {
          op.marksOfChaos = mSel.value;
          gameState.marksOfChaosSelections[op.id] = mSel.value;
        }
      }

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
      op.abilities = tmpl.abilities || [];

      if (team1Faction === 'Space Marine') {
        const pSel = document.getElementById(`ct-primary-s1-${tmpl.id}`);
        const sSel = document.getElementById(`ct-secondary-s1-${tmpl.id}`);
        if (pSel && sSel) {
          op.chapterTactics = [pSel.value, sSel.value];
          gameState.chapterTacticSelections[op.id] = { primary: pSel.value, secondary: sSel.value };
        }
      } else if (team1Faction === 'Legionary') {
        const mSel = document.getElementById(`moc-s1-${tmpl.id}`);
        if (mSel) {
          op.marksOfChaos = mSel.value;
          gameState.marksOfChaosSelections[op.id] = mSel.value;
        }
      }

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
  
  const btnSandbox = document.getElementById('btn-enter-sandbox');
  if (btnSandbox) btnSandbox.style.display = 'none';

  addLog('>>> 战队挑选部署完毕！');
  addLog(`  - ${getFactionDisplayName(team0Faction)} 登场: ${gameState.operatives.filter(o => o.teamSlot === 0).map(o => o.name).join(', ')}`);
  addLog(`  - ${getFactionDisplayName(team1Faction)} 登场: ${gameState.operatives.filter(o => o.teamSlot === 1).map(o => o.name).join(', ')}`);

  updateBattlePanelNames();
  updateScoresUI();
  renderOperatives();

  // 部署后选择 Chapter Tactics / Marks of Chaos 已经被集成到界面下拉框中
  // 所以这里直接进入游戏
  startInitiativePhase();
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

  // 排序: 可行动 > 已行动 > 死亡
  const sortedOperatives = [...gameState.operatives].sort((a, b) => {
    const aScore = a.isDead ? 2 : (a.hasActed ? 1 : 0);
    const bScore = b.isDead ? 2 : (b.hasActed ? 1 : 0);
    return aScore - bScore;
  });

  sortedOperatives.forEach(op => {
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
    if (hasFactionTrait(op.faction, 'disgustingResilience') && isFirefightPloyActive('sickening_resilience', op.faction) && !op.isDead) {
      tagHtml = `<span class="card-ploy-tag" style="border-color:var(${getFactionThemeVar(op.faction)}); color:var(${getFactionThemeVar(op.faction)}); background:rgba(122,184,138,0.15);">恶心坚韧</span>`;
    }

    // 状态标记：Injured / Poison Token (Conceal/Engage 由按钮直接显示，不再用标签)
    let statusTagsHtml = '';
    if (!op.isDead) {
      if (op.isInjured) {
        statusTagsHtml += '<span class="card-ploy-tag" style="border-color:var(--red); color:var(--red); background:rgba(184,76,76,0.15); font-size:0.6rem;">重伤</span>';
      }
      if (op.poisonTokens > 0) {
        statusTagsHtml += '<span class="card-ploy-tag" style="border-color:#7ab88a; color:#7ab88a; background:rgba(122,184,138,0.15); font-size:0.6rem;">毒素×' + op.poisonTokens + '</span>';
      }
      if (op.activeDebuffs) {
        op.activeDebuffs.forEach(d => {
          if (d.rule === 'nurglings') {
            statusTagsHtml += '<span class="card-ploy-tag" style="border-color:var(--pm-accent); color:var(--pm-accent); background:rgba(122,184,138,0.15); font-size:0.6rem;">纳格林</span>';
          } else if (d.rule === 'sickening_captivation') {
            statusTagsHtml += '<span class="card-ploy-tag" style="border-color:#818cf8; color:#818cf8; background:rgba(129,140,248,0.15); font-size:0.6rem;">魅惑</span>';
          }
        });
      }

      // 渲染手动挂载的通用 Status Tags
      if (op.tokens && op.tokens.length > 0) {
        const TAG_MAP = {
          'Poisoned': { n: '中毒', c: '#10b981' },
          'Injured': { n: '受伤', c: '#ef4444' },
          'Stunned': { n: '眩晕', c: '#eab308' },
          'Burning': { n: '燃烧', c: '#f97316' }
        };
        op.tokens.forEach(tagId => {
          const t = TAG_MAP[tagId];
          if (t) {
            statusTagsHtml += `<span class="card-ploy-tag" style="border-color:${t.c}; color:${t.c}; background:rgba(30,41,59,0.5); font-size:0.6rem;">${t.n}</span>`;
          }
        });
      }

      // 阵营特有战术标签
      if (op.faction === 'Space Marine' && op.chapterTactics && op.chapterTactics.length === 2) {
        const CT_NAMES = {
          'aggressive': '凶猛', 'dueler': '决斗', 'resolute': '坚毅', 'stealthy': '隐蔽',
          'mobile': '机动', 'hardy': '坚韧', 'sharpshooter': '神射手', 'siege_specialist': '攻城专家'
        };
        const pName = CT_NAMES[op.chapterTactics[0]] || op.chapterTactics[0];
        const sName = CT_NAMES[op.chapterTactics[1]] || op.chapterTactics[1];
        
        const isAdaptiveActive = isPloyActive('adaptive_tactics', 'Space Marine');
        statusTagsHtml += `<span class="card-ploy-tag" style="border-color:#475569; color:#94a3b8; background:#1e293b; font-size:0.6rem;" title="主战术不可更改">主:${pName}</span>`;
        
        if (isAdaptiveActive) {
          statusTagsHtml += `<span class="card-ploy-tag" style="border-color:#60a5fa; color:#60a5fa; background:rgba(96,165,250,0.15); font-size:0.6rem;" title="自适应战术生效中">副:${sName} ⚡</span>`;
        } else {
          statusTagsHtml += `<span class="card-ploy-tag" style="border-color:#475569; color:#94a3b8; background:#1e293b; font-size:0.6rem;" title="默认副战术">副:${sName}</span>`;
        }
      } else if (op.faction === 'Legionary' && op.marksOfChaos) {
        const MOC_NAMES = {
          'KHORNE': { n: '恐虐', c: '#dc2626' }, 'NURGLE': { n: '纳垢', c: '#16a34a' },
          'SLAANESH': { n: '色孽', c: '#d946ef' }, 'TZEENTCH': { n: '奸奇', c: '#3b82f6' },
          'UNDIVIDED': { n: '无分', c: '#a855f7' }
        };
        const moc = MOC_NAMES[op.marksOfChaos];
        if (moc) {
          statusTagsHtml += `<span class="card-ploy-tag" style="border-color:${moc.c}; color:${moc.c}; background:rgba(30,41,59,0.5); font-size:0.6rem;">印记:${moc.n}</span>`;
        }
      }
    }

    // Conceal 切换按钮：激活开始自由选命令，执行首个行动后锁定 (规则 L57)
    const isSelectable = !op.isDead && !op.hasActed && gameState.phase === 'Firefight' && gameState.activeTurnSlot === op.teamSlot;
    const isActiveAgent = gameState.activeAgent && gameState.activeAgent.id === op.id;
    const orderLocked = op.actionsPerformed.length > 0;  // 执行过任意行动即锁定命令
    const canToggleConceal = (isSelectable || isActiveAgent) && !orderLocked;
    const concealDisabled = (isSelectable || isActiveAgent) && orderLocked;
    const concealBtnHtml = canToggleConceal
      ? `<button class="conceal-toggle-btn" onclick="event.stopPropagation(); toggleConceal('${op.id}')" title="选择命令 (开始行动后锁定)" style="white-space:nowrap; font-size:0.65rem; padding:2px 6px; margin-left:4px; background:${op.hasConceal ? 'rgba(129,140,248,0.3)' : 'transparent'}; border:1px solid #818cf8; color:#818cf8; border-radius:4px; cursor:pointer;">${op.hasConceal ? '🛡️隐蔽' : '⚔️交战'}</button>`
      : concealDisabled
        ? `<button class="conceal-toggle-btn" disabled title="已开始行动，命令锁定" style="white-space:nowrap; font-size:0.65rem; padding:2px 6px; margin-left:4px; background:${op.hasConceal ? 'rgba(129,140,248,0.15)' : 'transparent'}; border:1px solid #475569; color:#64748b; border-radius:4px; cursor:not-allowed; opacity:0.6;">${op.hasConceal ? '🛡️隐蔽(锁)' : '⚔️交战(锁)'}</button>`
        : '';

    const avatarHtml = getAvatarHtml(op.id, op.faction);

    let aplModifiersText = '';
    if (op.isInjured && activeRuleSet().injuredAplPenalty > 0) {
      aplModifiersText += ' -1(重伤)';
    }
    if (op.activeDebuffs) {
      op.activeDebuffs.forEach(d => {
        if (d.stat === 'apl' && d.modifier !== 0) {
          const sign = d.modifier > 0 ? '+' : '';
          const ruleName = d.rule === 'nurglings' ? '纳格林' : (d.rule === 'sickening_captivation' ? '魅惑' : d.rule);
          aplModifiersText += ` ${sign}${d.modifier}(${ruleName})`;
        }
      });
    }
    const aplExtraHtml = aplModifiersText ? ` <span style="color:var(--red); font-size:0.6rem;">(${aplModifiersText.trim()})</span>` : '';

    card.innerHTML = `
      <div style="position:absolute;top:3px;right:6px;color:var(--imperial-gold);font-size:10px;opacity:0.4;pointer-events:none;z-index:1;">✦</div>
      <div style="display:flex; flex-direction:row; gap:4px; margin-bottom:8px;">
        <div class="op-avatar-row">
          ${avatarHtml}
          <span class="op-card-title">${op.name} ${tagHtml} ${concealBtnHtml}</span>
        </div>
        <div style="display:flex; align-items:center; gap:4px;">
          ${statusTagsHtml}
          <span class="op-card-tag">${op.currentApl} APL${aplExtraHtml}</span>
        </div>
      </div>
      <div class="op-card-hp">
        <span>HP (Wounds):</span>
        <span>${op.wounds} / ${op.maxWounds}</span>
      </div>
      <div class="op-hp-bar-container">
        <div class="op-hp-bar" style="width: ${hpPercent}%; background-color: ${hpPercent < 40 ? 'var(--red)' : 'var(--green)'}"></div>
      </div>
      <div class="op-card-stats">
        <span>Move: <strong>${op.currentMove}"</strong>${op.isInjured && !op.ignoreInjuredPenalties ? ' <span style="color:var(--red); font-size:0.55rem;">(-2)</span>' : ''}</span>
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
  window.pushStateSnapshot?.(`Toggle Conceal`);
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
    op.applyWounds(1, 0, '毒素发作');
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

  const injuredNote = op.isInjured ? (activeRuleSet().injuredAplPenalty > 0 ? ' (Injured: APL -1)' : ' (Injured: Move -2")') : '';
  addLog(`[激活] ${op.name} 开始激活，获得 ${op.apl} APL！${injuredNote}`);

  renderOperatives();
  updateActivePanel();
}

function getAbilitiesHtml(op) {
  if (!op) return '';
  const factionTraits = getFactionTraits(op.faction);
  const traitKeys = Object.keys(factionTraits).filter(k => factionTraits[k] && RULE_TEXTS[k]);
  
  const opAbilities = op.abilities || [];
  const allAbilities = [...new Set([...traitKeys, ...opAbilities])].filter(k => RULE_TEXTS[k]);
  
  if (allAbilities.length === 0) return '';
  
  return allAbilities.map(k => {
    return `<div class="ability-pill" onclick="showRuleHelp('${k}')">${RULE_TEXTS[k].title}</div>`;
  }).join('');
}

export function updateActivePanel() {
  if (gameState.activeAgent && gameState.activeAgent.isDead) {
    const deadOp = gameState.activeAgent;
    addLog(`[阵亡] ${deadOp.name} 已阵亡，自动结束激活。`);
    endActivation();
    return;
  }
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
      const pAbContainer = document.getElementById('pending-op-abilities');
      if (pAbContainer) pAbContainer.innerHTML = getAbilitiesHtml(pop);
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

    const aplText = document.getElementById('active-op-apl-text');
    if (aplText) aplText.textContent = op.apl;

    const dots = document.getElementById('active-apl-dots');
    dots.innerHTML = '';
    for (let i = 0; i < op.maxApl; i++) {
      const dot = document.createElement('div');
      dot.className = 'apl-dot' + (i < op.apl ? ' active' : '');
      dots.appendChild(dot);
    }

    const aAbContainer = document.getElementById('active-op-abilities');
    if (aAbContainer) aAbContainer.innerHTML = getAbilitiesHtml(op);

    const hasMoved = op.actionsPerformed.includes('Move');
    const hasCharged = op.actionsPerformed.includes('Charge');
    const hasAdvanced = op.actionsPerformed.includes('Advance');
    const hasDashed = op.actionsPerformed.includes('Dash');
    const hasFallenBack = op.actionsPerformed.includes('FallBack');

    const shootCount = op.actionsPerformed.filter(a => a === 'Shoot').length;
    const fightCount = op.actionsPerformed.filter(a => a === 'Fight').length;
    const hasShot = shootCount > 0;
    const hasFought = fightCount > 0;

    // Astartes 双重行动规则: 被动阵营规则 (SM/LEG 可选 2 Shoot 或 2 Fight，不能混合)
    // 注: 这不是 ploy，是免费的被动能力
    const isAstartes = activeRuleSet().factionMechanicsEnabled
      && hasFactionTrait(op.faction, 'astartesDoubleAction');
    const isCounteracting = op.counteracting === true;

    const canDoubleAction = isAstartes;

    // 任意移动行动标记 (Move/Charge/Advance/Dash/FallBack 均阻止其他移动行动)
    const hasAnyMove = hasMoved || hasCharged || hasAdvanced || hasDashed || hasFallenBack;
    // Advance/FallBack 后不能再 Shoot/Fight (lite 无 Advance；保留以兼容 standard)
    const noCombatAfterMove = hasAdvanced || hasFallenBack;
    // 注: lite 中 Dash 与 Reposition 等价，不再阻止后续射击/近战 (文档 L89)。
    // Heavy 武器的 "移动后不可用" 限制属 Heavy 规则本身，单独处理 (见下方 shootHeavyBlocked)。

    // Counteract 模式下: 仅 1 次行动, 禁止冲锋, 移动不超过 2"
    const maxShoots = isCounteracting ? 1 : (canDoubleAction ? 2 : 1);
    const maxFights = isCounteracting ? 1 : (canDoubleAction ? 2 : 1);

    // 互斥约束：
    // 规则允许 1 次射击 + 1 次近战。
    // 如果想要双重射击 (2 次)，则不能有任何近战。
    // 如果想要双重近战 (2 次)，则不能有任何射击。
    // 因此，如果你已经各有 1 次了，或者对方已经有 2 次了，就被锁定。
    const shootLocked = (shootCount >= 1 && fightCount >= 1) || fightCount >= 2;
    const fightLocked = (fightCount >= 1 && shootCount >= 1) || shootCount >= 2;
    
    const shootLimitReached = shootCount >= maxShoots;
    const fightLimitReached = fightCount >= maxFights;

    // 移动行动: 一旦执行过任意移动，所有其他移动行动均禁用 (反击时仍可移动≤2"，不禁用)
    document.getElementById('action-move').disabled = op.apl < 1 || hasAnyMove || op.isDead;
    // Charge 禁用条件: Counteract / 已耗尽APL / 已执行任意移动 / 已近战 / 已射击 / Conceal 标记 (隐蔽不能冲锋)
    document.getElementById('action-charge').disabled = isCounteracting ? true : (op.apl < 1 || hasAnyMove || hasFought || hasShot || op.hasConceal) || op.isDead;
    // Advance: 同 Charge，且不能 Counteract
    document.getElementById('action-advance').disabled = op.apl < 1 || hasAnyMove || hasFought || hasShot || isCounteracting || op.isDead;
    // Dash: 同 Advance
    document.getElementById('action-dash').disabled = op.apl < 1 || hasAnyMove || hasFought || hasShot || isCounteracting || op.isDead;
    // Fall Back: lite 规则下消耗 2 APL，同 Advance 的其他约束
    document.getElementById('action-fallback').disabled = op.apl < 2 || hasAnyMove || hasFought || hasShot || isCounteracting || op.isDead;
    // Shoot: 原有约束 + Advance/FallBack 后不能射击
    // Heavy 规则: Heavy(仅限冲刺) 武器在执行过非 Dash 移动后不可用；若所有远程武器都因此不可用则禁用 Shoot。
    const rangedWeapons = op.weapons.filter(w => w.isRanged);
    const allRangedHeavy = rangedWeapons.length > 0 && rangedWeapons.every(w => weaponHasRule(w, 'Heavy'));
    const nonDashMovePerformed = ['Move', 'Reposition', 'Charge', 'Advance', 'FallBack'].some(m => op.actionsPerformed.includes(m));
    const shootHeavyBlocked = allRangedHeavy && nonDashMovePerformed;
    // Conceal 命令: 不能射击 (除非携带 Silent 武器)
    const hasSilentWeapon = op.weapons.some(w => weaponHasRule(w, 'Silent'));
    const shootConcealBlocked = op.hasConceal && !hasSilentWeapon;
    document.getElementById('action-shoot').disabled = op.apl < 1 || shootLimitReached || shootLocked || hasCharged || noCombatAfterMove || shootHeavyBlocked || shootConcealBlocked || op.isDead;
    // Fight: 原有约束 + Advance/FallBack 后不能近战 (Dash 在 lite 中不限制近战)
    document.getElementById('action-fight').disabled = op.apl < 1 || fightLimitReached || fightLocked || noCombatAfterMove || op.isDead;

    const doubleActionLabel = 'Astartes';

    const ployDisplay = document.getElementById('active-ploys-display');
    if (ployDisplay) {
        const ploysText = [];
        if (isCounteracting) ploysText.push('<span style="color:#f97316;">⚡ 反击 (Counteract): 可执行 1AP 行动 (移动≤2"/射击/近战)，不可冲锋/冲刺/后撤</span>');
        if (hasAdvanced) ploysText.push('<span style="color:#f59e0b;">🏃💨 已前进 (Advance): 不能再射击/近战</span>');
        if (hasDashed) ploysText.push('<span style="color:#f59e0b;">💨💨 已冲刺 (Dash)</span>');
        if (hasFallenBack) ploysText.push('<span style="color:#f59e0b;">🔙 已撤退 (Fall Back): 不能再射击/近战</span>');
        if (hasShot && !isCounteracting && canDoubleAction) ploysText.push(`<span style="color:#6a9ad4;">💥 ${doubleActionLabel}: 已射击×${shootCount}，锁定近战</span>`);
        if (hasFought && !isCounteracting && canDoubleAction) ploysText.push(`<span style="color:#f87171;">⚔️ ${doubleActionLabel}: 已近战×${fightCount}，锁定射击</span>`);

        // 显示持久 ploys 状态
        const persistentKeys = gameState.persistentPloys?.[getTeamSlot(op.faction)] || [];
        if (persistentKeys.includes('and_they_shall_know_no_fear'))
          ploysText.push('<span style="color:#60a5fa;">✠ 无所畏惧: 忽略受伤减益</span>');
        if (persistentKeys.includes('contagion'))
          ploysText.push('<span style="color:var(--pm-accent);">☣ 传染蔓延: 敌方 Move -2", Hit +1</span>');
        if (persistentKeys.includes('lumbering_death'))
          ploysText.push('<span style="color:var(--pm-accent);">🐌 缓慢死神: 移动≤3" 获得 Ceaseless</span>');
        if (persistentKeys.includes('blood_for_the_blood_god'))
          ploysText.push('<span style="color:#c94444;">🩸 血祭血神: 近战 +1 伤害</span>');
        if (persistentKeys.includes('implacable'))
          ploysText.push('<span style="color:#c94444;">🛡 坚定不移: Piercing→Crits, NURGLE 忽略受伤</span>');
        if (persistentKeys.includes('quicksilver_speed'))
          ploysText.push('<span style="color:#c94444;">💨 疾速银影: 移动后 Fight 敌方 Hit +1</span>');
        if (persistentKeys.includes('fickle_fates'))
          ploysText.push('<span style="color:#c94444;">🎲 命运无常: 射击 ready 敌人获 Balanced</span>');
        if (persistentKeys.includes('combat_doctrine'))
          ploysText.push(`<span style="color:#60a5fa;">📋 战斗教条: ${getCombatDoctrineChoice(op.faction) || '未选择'}</span>`);

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

/**
 * 显示移动受限警告弹窗（与 QA 判定界面风格统一）。
 * @param {Object} op - 当前特工
 * @param {string} actionLabel - 行动名称（用于标题）
 * @param {string} maxMoveText - 最大移动距离描述文字
 * @param {Function} onConfirm - 玩家确认后的回调
 */
function showMoveWarningDialog(op, actionLabel, maxMoveText, onConfirm) {
  // 收集所有减益原因
  const reasons = [];
  if (op.isInjured && !op.ignoreInjuredPenalties) {
    reasons.push('🩸 <strong>重伤状态</strong>：移动距离受到限制');
  }
  if (op.activeDebuffs) {
    op.activeDebuffs.filter(d => d.stat === 'move' && d.modifier < 0).forEach(d => {
      const source = d.rule || d.name || '状态减益';
      reasons.push(`☣️ <strong>${source}</strong>：移动力 ${d.modifier}"`);
    });
  }

  const reasonsHtml = reasons.map(r => `<div style="margin-bottom:6px; padding:6px 10px; background:rgba(255,60,60,0.1); border-left:3px solid var(--red); border-radius:4px;">${r}</div>`).join('');

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.cssText = 'display:flex; z-index:3500;';

  overlay.innerHTML = `
    <div class="modal-content" style="max-width:440px; border:1px solid var(--red); box-shadow:0 0 24px rgba(220,50,50,0.4);">
      <div class="modal-header" style="background:rgba(40,10,10,0.97); border-bottom:2px solid var(--red); padding:14px 18px;">
        <div class="modal-title" style="display:flex; align-items:center; gap:10px; color:#ff6b6b;">
          <span style="font-size:1.5rem;">⚠️</span>
          <span>移动受限警告：【${actionLabel}】</span>
        </div>
      </div>
      <div class="modal-body" style="padding:20px;">
        <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:12px;">
          特工：<strong style="color:#fff;">${op.name}</strong>
        </div>

        <div class="qa-card" style="border-color:rgba(220,50,50,0.4); margin-bottom:14px;">
          <div class="qa-question" style="color:#ff6b6b;">⚠️ 该特工移动力当前受到以下效果影响：</div>
          <div style="font-size:0.88rem; line-height:1.7;">${reasonsHtml}</div>
          <div style="margin-top:8px; padding:8px 12px; background:rgba(255,255,255,0.05); border-radius:6px; font-size:0.9rem;">
            📏 <strong>当前最大移动距离：</strong><span style="color:#fbbf24; font-size:1.05rem; font-weight:bold;">${maxMoveText}</span>
          </div>
        </div>

        <div class="qa-card" style="border-color:rgba(255,255,255,0.1);">
          <div class="qa-question">是否确认在此状态下执行【${actionLabel}】？</div>
          <div class="qa-options" style="gap:12px; margin-top:4px;">
            <button id="btn-move-warn-cancel" class="qa-btn" style="border-color:rgba(220,50,50,0.4); color:#ff9999;">
              ✖ 取消行动
            </button>
            <button id="btn-move-warn-confirm" class="qa-btn" style="background:rgba(220,50,50,0.25); border-color:var(--red); color:#ffcccc; font-weight:bold;">
              ✔ 确认执行（移动受限）
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById('btn-move-warn-cancel').onclick = () => {
    playSound('click');
    document.body.removeChild(overlay);
  };

  document.getElementById('btn-move-warn-confirm').onclick = () => {
    playSound('click');
    document.body.removeChild(overlay);
    if (onConfirm) onConfirm();
  };
}

export function performMove() {
  const op = gameState.activeAgent;
  if (!op || op.apl < 1) return;
  window.pushStateSnapshot?.(`Action: Move (${op.name})`);

  const isMoveReduced = (op.activeDebuffs?.some(d => d.stat === 'move' && d.modifier < 0)) || (op.isInjured && !op.ignoreInjuredPenalties);

  const doMove = () => {
    evaluatePloyInteractions('before_move', op, () => {
      playSound('click');
      op.apl -= 1;
      op.actionsPerformed.push('Move');
      if (op.counteracting) {
        addLog(`  - ${op.name} 执行 [反击移动]，消耗 1 AP。⚠️ 物理沙盘移动不得超过 2"！`);
      } else {
        const moveReduced = (op.activeDebuffs?.some(d => d.stat === 'move' && d.modifier < 0)) || (op.isInjured && !op.ignoreInjuredPenalties);
        const moveNotice = moveReduced ? `⚠️ 移动受限，最大移动 ${op.currentMove}"` : `最大移动 ${op.currentMove}"`;
        addLog(`  - ${op.name} 执行 [移动 (Move)]，消耗 1 APL。(${moveNotice})`);
      }
      updateActivePanel();
    });
  };

  if (isMoveReduced) {
    playSound('alert');
    showMoveWarningDialog(op, '移动 (Move)', `${op.currentMove}"`, doMove);
  } else {
    doMove();
  }
}

export function performCharge() {
  const op = gameState.activeAgent;
  if (!op || op.apl < 1) return;
  window.pushStateSnapshot?.(`Action: Charge (${op.name})`);

  const isMoveReduced = (op.activeDebuffs?.some(d => d.stat === 'move' && d.modifier < 0)) || (op.isInjured && !op.ignoreInjuredPenalties);

  const doCharge = () => {
    evaluatePloyInteractions('before_move', op, () => {
      playSound('click');
      op.apl -= 1;
      op.actionsPerformed.push('Charge');
      const moveReduced = (op.activeDebuffs?.some(d => d.stat === 'move' && d.modifier < 0)) || (op.isInjured && !op.ignoreInjuredPenalties);
      const moveNotice = moveReduced ? `⚠️ 移动受限最多 ${op.currentMove + 2}"` : `最多 ${op.currentMove + 2}"`;
      addLog(`  - ${op.name} 执行 [冲锋 (Charge)]，移动${moveNotice} 并贴入敌方控制范围，消耗 1 APL。`);
      updateActivePanel();
    });
  };

  if (isMoveReduced) {
    playSound('alert');
    showMoveWarningDialog(op, '冲锋 (Charge)', `${op.currentMove + 2}"`, doCharge);
  } else {
    doCharge();
  }
}

export function performAdvance() {
  const op = gameState.activeAgent;
  if (!op || op.apl < 1) return;
  window.pushStateSnapshot?.(`Action: Advance (${op.name})`);

  const isMoveReduced = (op.activeDebuffs?.some(d => d.stat === 'move' && d.modifier < 0)) || (op.isInjured && !op.ignoreInjuredPenalties);

  const doAdvance = () => {
    evaluatePloyInteractions('before_move', op, () => {
      playSound('click');
      op.apl -= 1;
      op.actionsPerformed.push('Advance');
      const moveReduced = (op.activeDebuffs?.some(d => d.stat === 'move' && d.modifier < 0)) || (op.isInjured && !op.ignoreInjuredPenalties);
      const moveNotice = moveReduced ? `⚠️ 移动受限总计 ${op.currentMove + 3}"` : `总计 ${op.currentMove + 3}"`;
      addLog(`  - ${op.name} 执行 [前进 (Advance)]，移动距离 +3" (${moveNotice})，但本激活不能再射击/近战。`);
      updateActivePanel();
    });
  };

  if (isMoveReduced) {
    playSound('alert');
    showMoveWarningDialog(op, '前进 (Advance)', `${op.currentMove + 3}"`, doAdvance);
  } else {
    doAdvance();
  }
}

export function performDash() {
  const op = gameState.activeAgent;
  if (!op || op.apl < 1) return;
  window.pushStateSnapshot?.(`Action: Dash (${op.name})`);
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
  window.pushStateSnapshot?.(`Action: Fall Back (${op.name})`);

  const isMoveReduced = (op.activeDebuffs?.some(d => d.stat === 'move' && d.modifier < 0)) || (op.isInjured && !op.ignoreInjuredPenalties);

  const doFallBack = () => {
    evaluatePloyInteractions('before_move', op, () => {
      playSound('click');
      op.apl -= 2;
      op.actionsPerformed.push('FallBack');
      const moveReduced = (op.activeDebuffs?.some(d => d.stat === 'move' && d.modifier < 0)) || (op.isInjured && !op.ignoreInjuredPenalties);
      const moveNotice = moveReduced ? `⚠️ 移动受限最多 ${op.currentMove}"` : `最多 ${op.currentMove}"`;
      addLog(`  - ${op.name} 执行 [撤退 (Fall Back)]，脱离交战区域 (移动${moveNotice})，消耗 2 APL。本激活不能再射击/近战。`);
      updateActivePanel();
    });
  };

  if (isMoveReduced) {
    playSound('alert');
    showMoveWarningDialog(op, '撤退 (Fall Back)', `${op.currentMove}"`, doFallBack);
  } else {
    doFallBack();
  }
}

export function endActivation() {
  playSound('click');
  const op = gameState.activeAgent;
  if (!op) return;
  window.pushStateSnapshot?.(`End Activation: ${op.name}`);

  // 清除 "until_next_activation_end" 类型的 debuff (例如：纳格林引起的 APL -1)
  if (op.activeDebuffs) {
    const initialLen = op.activeDebuffs.length;
    op.activeDebuffs = op.activeDebuffs.filter(d => d.duration !== 'until_next_activation_end');
    if (op.activeDebuffs.length !== initialLen) {
      addLog(`[状态恢复] ${op.name} 身上的临时减益效果（如纳格林）已结束。`);
    }
  }

  if (op.id === gameState.nurglingsTarget) {
    gameState.nurglingsTarget = null;
  }

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
  playSound('dice_roll');

  // 顺序停下
  setTimeout(() => {
    const smVal = Math.floor(Math.random() * 6) + 1;
    smDiceEl.innerHTML = `<div class="kt-dice-cube ${team0DiceCls} ${smVal===6?'crit-dice':''}">${smVal}</div>`;
    playSound('dice_drop');
    setTimeout(() => {
      const pmVal = Math.floor(Math.random() * 6) + 1;
      pmDiceEl.innerHTML = `<div class="kt-dice-cube ${team1DiceCls} ${pmVal===6?'crit-dice':''}">${pmVal}</div>`;
      playSound('dice_drop');
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

  playSound('click');
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
      在此阶段，双方可以使用命令点 (CP) 激活策略计策 (Strategy Ploys)。
      <br>💡 Strategy Ploys 是 STRATEGIC GAMBIT，每个 TP 只能使用一次。
    </p>

    <div class="gothic-divider"><span style="color:var(--imperial-gold);font-size:8px;">⬥</span><span style="color:var(--imperial-gold);font-size:14px;">✠</span><span style="color:var(--imperial-gold);font-size:8px;">⬥</span></div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; width:100%; text-align:left; margin-bottom:16px; max-height:50vh; overflow-y:auto;">
      ${(() => {
        const t0 = gameState.teamFactions[0];
        const t1 = gameState.teamFactions[1];
        return buildTeamColumn(t0) + buildTeamColumn(t1);
      })()}
    </div>

    <button class="btn-large" onclick="proceedToFirefight()" style="padding: 10px 40px; font-size:0.9rem; background:linear-gradient(135deg, var(--green), #2a5a3a); border-color:#4a7c59; box-shadow:none;">
      进入战斗阶段 (Proceed to Firefight)
    </button>
  `;

  updateGuidance('【策略阶段】消费 CP 购买 Strategy Ploys (每个 TP 限用 1 次)。按 Proceed 进入战斗阶段。');
}

function buildTeamColumn(faction) {
  const fn = getFactionDisplayName(faction);
  const themeVar = getFactionThemeVar(faction);
  const cp = getCpForFaction(faction);

  // CP 图标: 每个 CP 一个金色发光圆点
  const cpIcons = cp > 0
    ? Array.from({ length: cp }, () =>
        `<span style="color:var(--imperial-gold); text-shadow:0 0 4px var(--imperial-gold);">⬤</span>`
      ).join('')
    : `<span style="color:var(--text-muted); opacity:0.3;">⬤</span>`;

  const teamHeader = `
    <div style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px;
      background:linear-gradient(135deg, color-mix(in srgb, var(${themeVar}) 15%, transparent), transparent);
      border:1px solid var(${themeVar}); border-radius:8px; margin-bottom:8px;">
      <div style="font-weight:bold; color:var(${themeVar}); font-size:0.95rem; letter-spacing:0.5px;">
        ${fn}
      </div>
      <div style="display:flex; align-items:center; gap:5px;">
        <span style="font-size:0.65rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px;">CP</span>
        <div style="display:flex; gap:3px; font-size:0.85rem;">${cpIcons}</div>
        <span style="font-weight:bold; color:var(--imperial-gold); font-size:0.9rem; min-width:16px; text-align:center;">${cp}</span>
      </div>
    </div>`;

  return `<div>${teamHeader}${buildFactionPloyPanel(faction)}</div>`;
}

function buildFactionPloyPanel(faction) {
  const themeVar = getFactionThemeVar(faction);
  const cp = getCpForFaction(faction);
  const strategyPloys = getAvailablePloys(faction, 'strategy');
  const usedPloys = getUsedPloysThisTP(faction);

  let cards = '';
  for (const ploy of strategyPloys) {
    const isActive = isPloyActive(ploy.id, faction);
    const isUsed = usedPloys[ploy.id];
    const alreadyOwned = isActive || isUsed;
    const canBuy = (!alreadyOwned && cp >= ploy.cp) || alreadyOwned;
    const statusText = isActive ? '● 持续生效中' : (isUsed ? '⊘ 本 TP 已使用' : `${ploy.cp} CP`);
    const statusColor = isActive ? 'var(--green)' : (isUsed ? 'var(--text-muted)' : `var(${themeVar})`);
    const clickHandler = canBuy ? `buyStrategyPloy('${faction}','${ploy.id}')` : '';
    const cursorStyle = canBuy ? 'cursor:pointer;' : 'cursor:not-allowed; opacity:0.6;';
    const doctrineExtra = ploy.id === 'combat_doctrine' && isActive
      ? `<div style="font-size:0.7rem; color:var(--imperial-gold); margin-top:4px;">当前教条: ${getCombatDoctrineChoice(faction) || '未选择'}</div>`
      : '';

    const durationText = ploy.duration === 'persistent'
      ? `<span class="ploy-duration-tag persistent" style="font-size:0.6rem; border:1px solid var(--imperial-gold); color:var(--imperial-gold); padding:1px 4px; border-radius:3px; margin-left:6px; background:rgba(212,175,55,0.1); font-weight:normal; letter-spacing:0;">持续</span>`
      : `<span class="ploy-duration-tag temporary" style="font-size:0.6rem; border:1px solid var(--text-muted); color:var(--text-muted); padding:1px 4px; border-radius:3px; margin-left:6px; font-weight:normal; letter-spacing:0;">单轮</span>`;

    cards += `<div class="ploy-choice-card ${alreadyOwned ? 'selected' : ''}" role="button" tabindex="0"
      style="${cursorStyle}" onclick="${clickHandler}"
      onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();${clickHandler}}">
      <div class="ploy-title">
        <span style="display:flex; align-items:center;">${ploy.name_cn}${durationText}</span>
        <span style="font-size:0.7rem; color:${statusColor};">${statusText}</span>
      </div>
      <div style="font-size:0.65rem; color:var(--text-muted); margin-bottom:2px;">${ploy.name_en}</div>
      <div class="ploy-desc" style="font-size:0.72rem;">${ploy.desc}</div>
      ${doctrineExtra}
    </div>`;
  }

  return `<div style="border:1px solid color-mix(in srgb, var(${themeVar}) 30%, transparent); border-radius:8px; padding:10px;">
    ${cards || '<div style="color:var(--text-muted); font-size:0.75rem;">无可用 Strategy Ploys</div>'}
  </div>`;
}

export function buyStrategyPloy(faction, ployId) {
  const ploy = getPloy(ployId);
  if (!ploy) return;
  const factionName = getFactionDisplayName(faction);
  const cp = getCpForFaction(faction);
  const slot = getTeamSlot(faction);

  // === 切换逻辑: 已激活 → 取消并退回 CP ===
  const isActive = isPloyActive(ployId, faction);
  const isUsed = getUsedPloysThisTP(faction)[ployId];

  if (isActive || isUsed) {
    cancelBuyPloy(faction, ployId);
    return;
  }

  // === 正常购买逻辑 ===
  if (cp < ploy.cp) {
    playSound('alert');
    showToast(`${factionName} CP 不足！需要 ${ploy.cp} CP`, 'warning');
    return;
  }

  window.pushStateSnapshot?.(`Buy Ploy: ${ploy.name_en}`);

  playSound('important_decision');
  setCpForFaction(faction, cp - ploy.cp);

  if (ploy.duration !== 'instant') {
    activatePersistentPloy(ployId, faction);
  } else {
    markPloyUsedThisTP(faction, ployId);
  }

  addLog(`  ✠ ${factionName}激活策略：【${ploy.name_cn} (${ploy.name_en})】(${ploy.cp} CP)`);

  // Combat Doctrine 需要额外选择子选项
  if (ployId === 'combat_doctrine') {
    showCombatDoctrineChoice(faction);
    return;
  }

  // Nurglings 需要选择敌方目标
  if (ployId === 'nurglings') {
    showNurglingsTargetChoice(faction);
    return;
  }

  // Adaptive Tactics 需要全队选择副战术
  if (ployId === 'adaptive_tactics') {
    showAdaptiveTacticTeamSelector(faction);
    return;
  }

  startStrategyPhase();
}

export function cancelBuyPloy(faction, ployId) {
  const ploy = getPloy(ployId);
  if (!ploy) return;
  const slot = getTeamSlot(faction);
  const cp = getCpForFaction(faction);

  // Refund CP
  setCpForFaction(faction, cp + ploy.cp);

  // Remove from used
  if (gameState.usedPloysThisTP?.[slot]) {
    delete gameState.usedPloysThisTP[slot][ployId];
  }
  // Remove from persistent
  if (gameState.persistentPloys?.[slot]) {
    gameState.persistentPloys[slot] = gameState.persistentPloys[slot].filter(p => p !== ployId);
  }

  // Combat Doctrine 取消时同步清除子选择
  if (ployId === 'combat_doctrine') {
    setCombatDoctrineChoice(faction, null);
  }

  // Clear specific ploy state/debuffs
  if (ployId === 'nurglings') {
    if (gameState.nurglingsTarget) {
      const targetId = gameState.nurglingsTarget;
      const targetOp = gameState.operatives.find(o => o.id === targetId);
      if (targetOp && targetOp.activeDebuffs) {
        targetOp.activeDebuffs = targetOp.activeDebuffs.filter(d => d.rule !== 'nurglings');
      }
      gameState.nurglingsTarget = null;
    }
  }

  // Adaptive Tactics 取消时恢复原战术
  if (ployId === 'adaptive_tactics') {
    gameState.operatives.forEach(op => {
      if (op.faction === 'Space Marine' && gameState.chapterTacticSelections && gameState.chapterTacticSelections[op.id]) {
        op.chapterTactics = [
          gameState.chapterTacticSelections[op.id].primary,
          gameState.chapterTacticSelections[op.id].secondary
        ];
      }
    });
    renderOperatives();
  }

  addLog(`  ↩ ${getFactionDisplayName(faction)}取消策略：【${ploy.name_cn}】，退回 ${ploy.cp} CP`);
  playSound('click');
  renderTestHarnessPloyButtons();
  startStrategyPhase();
}

function showCombatDoctrineChoice(faction) {
  const overlayBox = document.getElementById('phase-overlay-content');
  const themeVar = getFactionThemeVar(faction);

  overlayBox.innerHTML = `
    <h3 style="color:var(${themeVar});">选择战斗教条 (Combat Doctrine)</h3>
    <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:16px;">
      选择一个教条。对应场景下所有友军武器获得 Balanced 规则。
    </p>
    <div style="display:flex; flex-direction:column; gap:10px; width:100%; margin-bottom:16px;">
      <div class="ploy-choice-card" role="button" onclick="selectDoctrine('${faction}','devastator')" style="cursor:pointer;">
        <div class="ploy-title"><span>🎯 Devastator Doctrine</span></div>
        <div class="ploy-desc">射击 <b>6" 外</b>目标时武器获得 Balanced</div>
      </div>
      <div class="ploy-choice-card" role="button" onclick="selectDoctrine('${faction}','tactical')" style="cursor:pointer;">
        <div class="ploy-title"><span>📋 Tactical Doctrine</span></div>
        <div class="ploy-desc">射击 <b>6" 内</b>目标时武器获得 Balanced</div>
      </div>
      <div class="ploy-choice-card" role="button" onclick="selectDoctrine('${faction}','assault')" style="cursor:pointer;">
        <div class="ploy-title"><span>⚔️ Assault Doctrine</span></div>
        <div class="ploy-desc"><b>近战或反击</b>时武器获得 Balanced</div>
      </div>
    </div>
  `;
}

export function selectDoctrine(faction, choice) {
  setCombatDoctrineChoice(faction, choice);
  const choiceNames = { devastator: 'Devastator (远程)', tactical: 'Tactical (近程)', assault: 'Assault (近战)' };
  addLog(`  → ${getFactionDisplayName(faction)}选择教条: ${choiceNames[choice]}`);
  playSound('click');
  startStrategyPhase();
}

export function showNurglingsTargetChoice(faction) {
  showPhaseOverlay();
  const overlayBox = document.getElementById('phase-overlay-content');
  const themeVar = getFactionThemeVar(faction);

  // Find all alive enemy operatives
  const enemyOps = gameState.operatives.filter(op => op.faction !== faction && !op.isDead && op.wounds > 0);

  let targetCards = '';
  if (enemyOps.length === 0) {
    targetCards = `<div style="color:var(--text-muted); font-size:0.85rem; text-align:center; padding:20px;">没有存活的敌方特工</div>`;
  } else {
    enemyOps.forEach(op => {
      const poisonText = op.poisonTokens > 0 ? `<span style="color:#7ab88a;">(有毒素标记: ${op.poisonTokens})</span>` : '';
      const rangeReq = op.poisonTokens > 0 ? '7"' : '3"';
      targetCards += `
        <div class="ploy-choice-card" role="button" onclick="selectNurglingsTarget('${faction}','${op.id}')" style="cursor:pointer; margin-bottom:8px;">
          <div class="ploy-title">
            <span>👤 ${op.name}</span>
            <span style="font-size:0.75rem; color:var(--text-muted);">${op.wounds}/${op.maxWounds} HP ${poisonText}</span>
          </div>
          <div class="ploy-desc">判定距离：<b>${rangeReq}</b></div>
        </div>
      `;
    });
  }

  overlayBox.innerHTML = `
    <h3 style="color:var(${themeVar});">纳格林 (Nurglings) - 选择敌方目标</h3>
    <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:16px;">
      选择一个存活的敌方特工，纳格林将会对其进行骚扰。
    </p>
    <div style="display:flex; flex-direction:column; gap:10px; width:100%; margin-bottom:16px; max-height:40vh; overflow-y:auto;">
      ${targetCards}
    </div>
    <div style="display:flex; justify-content:center; width:100%;">
      <button class="btn-large" onclick="cancelBuyPloy('${faction}','nurglings')" style="padding: 10px 40px; font-size:0.9rem; background:rgba(100,116,139,0.2); border-color:#475569;">
        取消购买 (Cancel)
      </button>
    </div>
  `;
}

export function selectNurglingsTarget(faction, targetId) {
  const op = gameState.operatives.find(o => o.id === targetId);
  if (!op) {
    cancelBuyPloy(faction, 'nurglings');
    return;
  }

  const hasPoison = op.poisonTokens > 0;
  const rangeReq = hasPoison ? '7"' : '3"';
  const question = `🎯 物理沙盘测量：\n敌方特工 **${op.name}** 是否在当前友军特工的 **${rangeReq}** 范围内，且彼此可见？\n*(注：该特工${hasPoison ? '带有' : '未带有'}毒素标记，判定范围为 ${rangeReq})*`;

  const ploy = getPloy('nurglings');
  showPloyInteractionDialog(ploy, op, question, (isInRange) => {
    if (isInRange) {
      // 成功：应用 APL -1 debuff，记录 target
      op.activeDebuffs = op.activeDebuffs || [];
      const debuff = {
        target: 'operative_stat',
        stat: 'apl',
        modifier: -1,
        duration: 'until_next_activation_end',
        rule: 'nurglings'
      };
      
      if (!op.activeDebuffs.some(d => d.rule === 'nurglings')) {
        op.activeDebuffs.push(debuff);
      }
      
      gameState.nurglingsTarget = op.id;
      addLog(`  → 纳格林成功干扰了【${op.name}】(APL -1 直到其下次激活结束)`);
      playSound('click');
      renderTestHarnessPloyButtons();
      startStrategyPhase();
    } else {
      // 失败：退回 CP，清除状态
      addLog(`  → 纳格林距离判定失败或玩家取消`);
      cancelBuyPloy(faction, 'nurglings');
    }
  });
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
  queueVisualEvent({
    type: 'death',
    data: { operative: op }
  });
}

function renderDeathOverlay(op) {
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
  isVisualQueueProcessing = false;
  processNextVisualEvent();
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
  const team0Faction = gameState.teamFactions[0];
  const team1Faction = gameState.teamFactions[1];
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

  const isFinalTP = isFinalTurningPoint(gameState.turningPoint);
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

import * as effects from './effects.js';

export function triggerCombatVisual(text, type = 'normal') {
  effects.playTextEffect(text, type);
}

export function triggerAvatarHitEffect(opId, type) {
  effects.playHitEffect(opId, type);
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

// ==========================================
//   Sandbox Test Harness Mode
// ==========================================

export function setupSandboxTestHarness() {
  gameState.operatives = [];
  
  // Set up Team 0 (SM)
  gameState.teamFactions[0] = 'Space Marine';
  const smLeader = SM_TEMPLATES.find(t => t.isLeader);
  const smWarrior = SM_TEMPLATES.find(t => t.isWarrior);
  const smOthers = SM_TEMPLATES.filter(t => !t.isLeader && !t.isWarrior).slice(0, 4);
  
  let idIdx = 1;
  const smTeam = [smLeader, smWarrior, ...smOthers];
  smTeam.forEach(tmpl => {
    if (!tmpl) return;
    const op = new Operative(`sm_${idIdx}`, tmpl.name.split(' (')[0], 'Space Marine', tmpl.wounds, tmpl.apl, tmpl.df, tmpl.sv, tmpl.weapons, tmpl.defaultAvatar, tmpl.move || 6, 0);
    if (tmpl.operativeType) op.operativeType = tmpl.operativeType;
    if (tmpl.abilities) op.abilities = [...tmpl.abilities];
    gameState.operatives.push(op);
    idIdx++;
  });

  // Set up Team 1 (PM)
  gameState.teamFactions[1] = 'Plague Marine';
  const pmLeader = PM_TEMPLATES.find(t => t.isLeader);
  const pmWarrior = PM_TEMPLATES.find(t => t.isWarrior);
  const pmOthers = PM_TEMPLATES.filter(t => !t.isLeader && !t.isWarrior).slice(0, 4);
  
  idIdx = 1;
  const pmTeam = [pmLeader, pmWarrior, ...pmOthers];
  pmTeam.forEach(tmpl => {
    if (!tmpl) return;
    const op = new Operative(`pm_${idIdx}`, tmpl.name.split(' (')[0], 'Plague Marine', tmpl.wounds, tmpl.apl, tmpl.df, tmpl.sv, tmpl.weapons, tmpl.defaultAvatar, tmpl.move || 5, 1);
    if (tmpl.operativeType) op.operativeType = tmpl.operativeType;
    if (tmpl.abilities) op.abilities = [...tmpl.abilities];
    gameState.operatives.push(op);
    idIdx++;
  });
  
  gameState.missionType = 'custom';
  
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('global-dash').style.display = 'grid';
  document.getElementById('battle-area').style.display = 'grid';
  document.getElementById('guidance-banner').style.display = 'flex';
  
  const btnSandbox = document.getElementById('btn-enter-sandbox');
  if (btnSandbox) btnSandbox.style.display = 'none';
  
  const thp = document.getElementById('test-harness-panel');
  if (thp) thp.style.display = 'block';

  renderTestHarnessPloyButtons();
  
  addLog('>>> [TEST MODE] Sandbox Test Harness Initialized!');
  updateBattlePanelNames();
  updateScoresUI();
  renderOperatives();
  
  // Bypass Initiative and Strategy phases, go directly to Firefight
  gameState.tp = 1;
  gameState.initiativeWinner = 0; // Force SM initiative
  
  hidePhaseOverlay();
  proceedToFirefight();
}

export function renderTestHarnessPloyButtons() {
  const container = document.getElementById('debug-ploy-buttons');
  if (!container) return;
  container.innerHTML = '';
  
  // Use a column layout for better readability with descriptions
  container.style.flexDirection = 'column';
  container.style.alignItems = 'flex-start';
  
  // 注入战术快速切换 UI
  const tacticsControlHtml = `
    <div style="width: 100%; border: 1px solid #475569; padding: 8px; border-radius: 6px; margin-bottom: 12px; background: rgba(0,0,0,0.3);">
      <div style="font-size: 0.8rem; font-weight: bold; color: var(--gold); margin-bottom: 6px;">[TEST] 随时更换战术 (Tactics Override)</div>
      
      <!-- Space Marine Tactics -->
      <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px;">
        <span style="font-size: 0.75rem; color: #94a3b8; width: 60px;">SM 战术:</span>
        <select id="debug-sm-primary" style="background:#1e293b; color:#fff; border:1px solid #475569; padding:2px; font-size:0.75rem;">
          <option value="aggressive">凶猛</option>
          <option value="dueler">决斗</option>
          <option value="resolute">坚毅</option>
          <option value="stealthy">隐蔽</option>
          <option value="mobile">机动</option>
          <option value="hardy">坚韧</option>
          <option value="sharpshooter">神射手</option>
          <option value="siege_specialist">攻城专家</option>
        </select>
        <select id="debug-sm-secondary" style="background:#1e293b; color:#fff; border:1px solid #475569; padding:2px; font-size:0.75rem;">
          <option value="aggressive">凶猛</option>
          <option value="dueler">决斗</option>
          <option value="resolute">坚毅</option>
          <option value="stealthy">隐蔽</option>
          <option value="mobile">机动</option>
          <option value="hardy">坚韧</option>
          <option value="sharpshooter">神射手</option>
          <option value="siege_specialist">攻城专家</option>
        </select>
        <button onclick="window.applyDebugTactics('sm')" style="font-size:0.7rem; padding:2px 6px; background:#3b82f6; border:none; color:#fff; border-radius:4px; cursor:pointer;">应用 (Apply)</button>
      </div>

      <!-- Legionary Tactics -->
      <div style="display: flex; gap: 8px; align-items: center;">
        <span style="font-size: 0.75rem; color: #94a3b8; width: 60px;">Leg 印记:</span>
        <select id="debug-leg-moc" style="background:#1e293b; color:#fff; border:1px solid #8b1a1a; padding:2px; font-size:0.75rem;">
          <option value="KHORNE">恐虐 (Khorne)</option>
          <option value="NURGLE">纳垢 (Nurgle)</option>
          <option value="SLAANESH">色孽 (Slaanesh)</option>
          <option value="TZEENTCH">奸奇 (Tzeentch)</option>
          <option value="UNDIVIDED">无分 (Undivided)</option>
        </select>
        <button onclick="window.applyDebugTactics('leg')" style="font-size:0.7rem; padding:2px 6px; background:#dc2626; border:none; color:#fff; border-radius:4px; cursor:pointer;">应用 (Apply)</button>
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', tacticsControlHtml);

  
  Object.values(PLOY_DATABASE).forEach(p => {
    // Only show strategy ploys for the active factions
    if (p.type !== 'strategy') return;
    if (p.faction !== 'Space Marine' && p.faction !== 'Plague Marine' && p.faction !== 'ALL') return;
    
    const factionsToRender = p.faction === 'ALL' ? ['Space Marine', 'Plague Marine'] : [p.faction];
    
    factionsToRender.forEach(fac => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.gap = '12px';
      row.style.marginBottom = '6px';
      row.style.width = '100%';
      
      const btn = document.createElement('button');
      const slot = fac === 'Space Marine' ? 0 : 1;
      const isActive = gameState.persistentPloys && gameState.persistentPloys[slot]?.includes(p.id);
      
      const displayName = p.name_en || p.name_cn || p.id;
      btn.textContent = `${fac === 'Space Marine' ? '[SM]' : '[PM]'} ${displayName} (${isActive ? 'ON' : 'OFF'})`;
      
      btn.style.background = isActive ? 'var(--green)' : 'rgba(255,255,255,0.1)';
      btn.style.color = isActive ? 'white' : 'var(--text-muted)';
      btn.style.border = '1px solid #555';
      btn.style.padding = '4px 8px';
      btn.style.borderRadius = '4px';
      btn.style.cursor = 'pointer';
      btn.style.fontSize = '0.8rem';
      btn.style.minWidth = '220px';
      btn.onclick = () => toggleTestPloy(p.id, fac);
      
      row.appendChild(btn);
      
      // If combat doctrine is ON, show its options dropdown
      if (p.id === 'combat_doctrine' && isActive) {
        const currentChoice = getCombatDoctrineChoice(fac) || 'devastator';
        const select = document.createElement('select');
        select.style.padding = '4px';
        select.style.background = '#1a1d24';
        select.style.color = '#fff';
        select.style.border = '1px solid #555';
        select.style.borderRadius = '4px';
        select.style.fontSize = '0.75rem';
        
        p.options.forEach(opt => {
          const option = document.createElement('option');
          option.value = opt;
          option.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
          if (opt === currentChoice) option.selected = true;
          select.appendChild(option);
        });
        
        const descSpan = document.createElement('span');
        descSpan.style.fontSize = '0.75rem';
        descSpan.style.color = 'var(--text-muted)';
        
        const updateDesc = (choice) => {
          const descs = {
            devastator: '🎯 射击 6" 外目标获得 Balanced (平衡，可重投 1 个攻击骰)',
            tactical: '📋 射击 6" 内目标获得 Balanced (平衡，可重投 1 个攻击骰)',
            assault: '⚔️ 近战或反击获得 Balanced (平衡，可重投 1 个攻击骰)'
          };
          descSpan.innerHTML = ` &nbsp; ${descs[choice] || ''}`;
        };
        
        select.onchange = (e) => {
          setCombatDoctrineChoice(fac, e.target.value);
          addLog(`[TEST MODE] ${fac} Combat Doctrine set to ${e.target.value}`);
          updateDesc(e.target.value);
        };
        
        // Ensure default is set in state if not already
        if (!getCombatDoctrineChoice(fac)) {
          setCombatDoctrineChoice(fac, 'devastator');
        }
        
        updateDesc(getCombatDoctrineChoice(fac) || 'devastator');
        
        row.appendChild(select);
        row.appendChild(descSpan);
      }
      
      // If contagion is ON, show poison token test tool
      if (p.id === 'contagion' && isActive) {
        const enemyFaction = fac === 'Space Marine' ? 'Plague Marine' : 'Space Marine';
        const enemies = gameState.operatives.filter(o => o.faction === enemyFaction && !o.isDead);
        
        const select = document.createElement('select');
        select.style.padding = '4px';
        select.style.background = '#1a1d24';
        select.style.color = '#fff';
        select.style.border = '1px solid #555';
        select.style.borderRadius = '4px';
        select.style.fontSize = '0.75rem';
        
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = '测试：为敌方上毒...';
        select.appendChild(defaultOpt);
        
        enemies.forEach(en => {
          const opt = document.createElement('option');
          opt.value = en.id;
          opt.textContent = `${en.name} (${en.poisonTokens || 0} 毒)`;
          select.appendChild(opt);
        });
        
        const btnPoison = document.createElement('button');
        btnPoison.textContent = '+ 施加剧毒';
        btnPoison.style.padding = '4px 8px';
        btnPoison.style.fontSize = '0.75rem';
        btnPoison.style.background = '#8b5a2b';
        btnPoison.style.color = 'white';
        btnPoison.style.border = '1px solid #555';
        btnPoison.style.borderRadius = '4px';
        btnPoison.style.cursor = 'pointer';
        
        btnPoison.onclick = () => {
          const targetId = select.value;
          if (!targetId) return;
          const target = gameState.operatives.find(o => o.id === targetId);
          if (target) {
            target.poisonTokens = (target.poisonTokens || 0) + 1;
            addLog(`[TEST MODE] 为 ${target.name} 添加了 1 个 Poison Token！当前层数：${target.poisonTokens}`);
            showToast(`已给 ${target.name} 上毒！`, 'warning');
            renderTestHarnessPloyButtons(); // Refresh dropdown texts
          }
        };
        
        row.appendChild(select);
        row.appendChild(btnPoison);
      }
      
      const desc = document.createElement('span');
      desc.textContent = p.desc || '暂无说明';
      desc.style.fontSize = '0.75rem';
      desc.style.color = 'var(--text-muted)';
      desc.style.textAlign = 'left';
      
      row.appendChild(desc);
      container.appendChild(row);
    });
  });
}

// ==========================================
//   Modular Ploy Interactions Engine
// ==========================================

export function evaluatePloyInteractions(triggerEvent, triggerAgent, onComplete) {
  // Find all active ploys that have this trigger
  const activePloys = [];
  const activeFactions = Object.values(gameState.teamFactions || {});
  Object.values(PLOY_DATABASE).forEach(p => {
    if (p.Trigger && p.Trigger.includes(triggerEvent)) {
      // Check if it's active for any faction currently in game
      activeFactions.forEach(faction => {
        if (isPloyActive(p.id, faction)) {
          activePloys.push({ ploy: p, activeFaction: faction });
        }
      });
    }
  });

  if (activePloys.length === 0) {
    if (onComplete) onComplete();
    return;
  }

  let currentPloyIndex = 0;

  function nextPloy() {
    if (currentPloyIndex >= activePloys.length) {
      if (onComplete) onComplete();
      return;
    }
    const current = activePloys[currentPloyIndex++];
    const ploy = current.ploy;
    const activeFaction = current.activeFaction;
    
    // Evaluate hard conditions
    const conditionsPassed = evaluatePloyConditions(ploy, activeFaction, triggerAgent);
    if (!conditionsPassed) {
      nextPloy();
      return;
    }

    // Evaluate interactions (System asking User)
    if (ploy.Interactions && ploy.Interactions.length > 0) {
      evaluateNextInteraction(ploy, activeFaction, triggerAgent, 0, (interactionPassed) => {
        if (interactionPassed) {
          applyPloyEffects(ploy, activeFaction, triggerAgent, nextPloy);
        } else {
          removePloyEffects(ploy, triggerAgent);
          nextPloy();
        }
      });
    } else {
      // No interactions needed, direct effect
      applyPloyEffects(ploy, activeFaction, triggerAgent, nextPloy);
    }
  }

  nextPloy();
}

function removePloyEffects(ploy, targetAgent) {
  if (!targetAgent.activeDebuffs || !ploy.Effects) return;
  const initialLength = targetAgent.activeDebuffs.length;
  targetAgent.activeDebuffs = targetAgent.activeDebuffs.filter(d => {
    // Keep debuffs that do NOT belong to this ploy
    return !ploy.Effects.some(e => e.rule === d.rule && e.stat === d.stat);
  });
  if (targetAgent.activeDebuffs.length !== initialLength) {
    addLog(`[状态恢复] 📏 ${targetAgent.name} 似乎已经脱离了 [${ploy.name_cn}] 的影响范围。`);
  }
}

function evaluatePloyConditions(ploy, activeFaction, triggerAgent) {
  if (!ploy.Conditions) return true;
  for (const cond of ploy.Conditions) {
    if (cond.type === 'is_enemy') {
      if (triggerAgent.faction === activeFaction) return false;
    }
    if (cond.type === 'is_friendly') {
      // 若指定了 cond.faction，直接匹配 triggerAgent.faction（用于 before_shoot_defense 等防守方判定）
      const expectedFaction = cond.faction || activeFaction;
      if (triggerAgent.faction !== expectedFaction) return false;
    }
  }
  return true;
}

function evaluateNextInteraction(ploy, activeFaction, triggerAgent, index, callback) {
  if (index >= ploy.Interactions.length) {
    callback(true);
    return;
  }
  const interaction = ploy.Interactions[index];
  
  if (interaction.type === 'boolean_confirm') {
    const questionText = typeof interaction.question === 'function' ? interaction.question(triggerAgent, typeof wizardState !== 'undefined' ? wizardState : null) : interaction.question;
    
    // If question function returns null, it means conditions aren't met, auto skip
    if (questionText === null) {
      callback(false);
      return;
    }

    showPloyInteractionDialog(ploy, triggerAgent, questionText, (result) => {
      if (result) {
        evaluateNextInteraction(ploy, activeFaction, triggerAgent, index + 1, callback);
      } else {
        callback(false);
      }
    });
  } else {
    evaluateNextInteraction(ploy, activeFaction, triggerAgent, index + 1, callback);
  }
}

export function showPloyInteractionDialog(ploy, targetAgent, question, callback) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.display = 'flex';
  overlay.style.zIndex = '2000';
  
  overlay.innerHTML = `
    <div class="modal-content" style="max-width: 480px; box-shadow: 0 0 20px rgba(0,0,0,0.8); border: 1px solid var(--gold);">
      <div class="modal-header" style="background: rgba(10, 20, 35, 0.95); color: var(--gold); padding: 15px; border-bottom: 2px solid var(--gold);">
        <div class="modal-title" style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:1.4rem;">❓</span> 
          <span>计谋判定：${ploy.name_cn || ploy.name_en}</span>
        </div>
      </div>
      <div class="modal-body" style="padding: 25px 20px;">
        <div style="margin-bottom: 15px; font-size: 0.9rem; color: var(--text-muted);">
          目标特工：<strong style="color:white;">${targetAgent.name}</strong>
        </div>
        <p style="font-size: 1.05rem; line-height: 1.6; margin-bottom: 25px; color: var(--text-color); white-space: pre-wrap;">${question}</p>
        <div style="display:flex; gap: 15px; justify-content: flex-end;">
          <button id="btn-ploy-no" class="btn-cancel" style="padding: 10px 24px; min-width: 100px;">否 (No)</button>
          <button id="btn-ploy-yes" class="btn-confirm" style="padding: 10px 24px; min-width: 100px;">是 (Yes)</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  
  document.getElementById('btn-ploy-yes').onclick = () => {
    playSound('click');
    document.body.removeChild(overlay);
    callback(true);
  };
  
  document.getElementById('btn-ploy-no').onclick = () => {
    playSound('click');
    document.body.removeChild(overlay);
    callback(false);
  };
}

export function showPloyEffectDialog(ploy, targetAgent, effectTexts, callback) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.display = 'flex';
  overlay.style.zIndex = '2001';
  
  const effectListHtml = effectTexts.map(t => `<div style="margin-bottom: 8px;">${t}</div>`).join('');

  // Determine dialog theme color (blue/green/red)
  const isBuff = ploy.faction === targetAgent.faction;
  const themeColor = isBuff ? `var(${getFactionThemeVar(ploy.faction)})` : 'var(--red)';
  const headerBg = isBuff ? 'rgba(10, 20, 35, 0.95)' : 'rgba(35, 10, 10, 0.95)';
  const textColor = isBuff ? '#e0f2fe' : '#ffcccc';
  const boxBg = isBuff ? 'rgba(0, 100, 255, 0.08)' : 'rgba(255, 0, 0, 0.1)';
  const btnBg = isBuff ? 'var(--blue, #2563eb)' : 'var(--red)';
  const titleColor = isBuff ? 'var(--blue, #60a5fa)' : '#ff6b6b';
  const icon = isBuff ? '🛡️' : '⚠️';
  const titleLabel = isBuff ? '能力生效' : '计谋生效';

  overlay.innerHTML = `
    <div class="modal-content" style="max-width: 480px; box-shadow: 0 0 20px rgba(0,0,0,0.8); border: 1px solid ${themeColor};">
      <div class="modal-header" style="background: ${headerBg}; color: ${titleColor}; padding: 15px; border-bottom: 2px solid ${themeColor};">
        <div class="modal-title" style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:1.4rem;">${icon}</span> 
          <span>${titleLabel}：${ploy.name_cn || ploy.name_en}</span>
        </div>
      </div>
      <div class="modal-body" style="padding: 25px 20px;">
        <div style="margin-bottom: 15px; font-size: 0.9rem; color: var(--text-muted);">
          受影响特工：<strong style="color:white;">${targetAgent.name}</strong>
        </div>
        <div style="font-size: 1.05rem; line-height: 1.6; margin-bottom: 25px; color: ${textColor}; background: ${boxBg}; padding: 15px; border-radius: 6px; border: 1px dashed ${themeColor};">
          ${effectListHtml}
        </div>
        <div style="display:flex; justify-content: center;">
          <button id="btn-ploy-ok" class="btn-large" style="padding: 10px 40px; background: ${btnBg}; border: none; font-weight: bold; color: white;">知道了 (OK)</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  
  document.getElementById('btn-ploy-ok').onclick = () => {
    playSound('click');
    document.body.removeChild(overlay);
    if (callback) callback();
  };
}

function applyPloyEffects(ploy, activeFaction, targetAgent, onComplete) {
  if (!ploy.Effects || ploy.Effects.length === 0) {
    if (onComplete) onComplete();
    return;
  }

  targetAgent.activeDebuffs = targetAgent.activeDebuffs || [];
  let effectTexts = [];
  
  ploy.Effects.forEach(effect => {
    // 特殊类型: set_wizard_flag — 设置射击向导状态标志，不写入 activeDebuffs
    if (effect.target === 'set_wizard_flag') {
      if (typeof wizardState !== 'undefined') {
        wizardState[effect.flag] = effect.value;
      }
      addLog(`[计谋生效] 🐝 ${ploy.name_cn} -> ${targetAgent.name} 获得 ${effect.flag} 效果`);
      effectTexts.push(`🐝 <strong>${targetAgent.name}</strong> 处于遮蔽状态 (Obscured)：防御骰池 -1，自动获得 1 个普通防御成功。`);
      return;
    }

    // Prevent duplicate application
    const existing = targetAgent.activeDebuffs && targetAgent.activeDebuffs.find(d => d.rule === effect.rule && d.stat === effect.stat);
    if (existing) return;

    targetAgent.activeDebuffs.push(effect);
    
    // 记录本次向导会话期间注入的临时 Buff
    if (!wizardState.addedDebuffs) wizardState.addedDebuffs = [];
    wizardState.addedDebuffs.push({ operative: targetAgent, debuff: effect });
    
    if (effect.target === 'operative_stat') {
      if (effect.stat === 'move') {
        addLog(`[计谋生效] ${ploy.name_cn} -> ${targetAgent.name} 移动距离修正 ${effect.modifier}"`);
        effectTexts.push(`🔹 移动力受到修正: <strong>${effect.modifier}"</strong> (当前最大移动力变为 <strong>${targetAgent.currentMove}"</strong>)`);
      }
    } else if (effect.target === 'weapon_stat') {
      if (effect.stat === 'hit') {
        addLog(`[计谋生效] ${ploy.name_cn} -> ${targetAgent.name} 射击/近战命中(Hit)受到修正 ${effect.modifier}`);
        effectTexts.push(`🔹 武器受到修正: 命中鉴定 <strong>${effect.modifier > 0 ? '+' + effect.modifier : effect.modifier}</strong>`);
      }
    } else if (effect.target === 'weapon_rule') {
      const choice = getCombatDoctrineChoice(targetAgent.faction);
      const choiceNames = { devastator: 'Devastator (远程)', tactical: 'Tactical (近程)', assault: 'Assault (近战)' };
      const choiceText = choice ? `[教条: ${choiceNames[choice]}]` : '';
      addLog(`[计谋生效] ${ploy.name_cn}${choiceText} -> ${targetAgent.name} 武器获得 ${effect.extra_rule} 规则`);
      effectTexts.push(`🔹 武器获得规则: <strong>${effect.extra_rule}</strong>`);
    }
  });
  
  if (effectTexts.length > 0) {
    showPloyEffectDialog(ploy, targetAgent, effectTexts, onComplete);
  } else {
    if (onComplete) onComplete();
  }
}

export function toggleTestPloy(ployId, faction) {
  const slot = faction === 'Space Marine' ? 0 : 1;
  if (!gameState.persistentPloys) gameState.persistentPloys = {0:[], 1:[]};
  const list = gameState.persistentPloys[slot];
  const idx = list.indexOf(ployId);
  const turningOn = idx < 0;
  
  if (turningOn) {
    list.push(ployId);
    if (ployId === 'nurglings') {
      showNurglingsTargetChoice(faction);
    }
  } else {
    list.splice(idx, 1);
    if (ployId === 'nurglings') {
      if (gameState.nurglingsTarget) {
        const targetId = gameState.nurglingsTarget;
        const targetOp = gameState.operatives.find(o => o.id === targetId);
        if (targetOp && targetOp.activeDebuffs) {
          targetOp.activeDebuffs = targetOp.activeDebuffs.filter(d => d.rule !== 'nurglings');
        }
        gameState.nurglingsTarget = null;
      }
    }
  }
  renderTestHarnessPloyButtons();
  addLog(`[TEST MODE] Ploy ${ployId} toggled to ${turningOn ? 'ON' : 'OFF'}`);
  updateScoresUI();
}

window.showAdaptiveTacticTeamSelector = function(faction) {
  // 查找一个样本以获取当前主战术（全队统一）
  const sampleOp = gameState.operatives.find(o => o.faction === faction && o.chapterTactics);
  if (!sampleOp) {
    startStrategyPhase();
    return;
  }

  showPhaseOverlay();
  const overlayBox = document.getElementById('phase-overlay-content');
  const themeVar = getFactionThemeVar(faction);

  const CT_OPTIONS = [
    { id: 'aggressive', name: '凶猛(Aggressive)' },
    { id: 'dueler', name: '决斗(Dueler)' },
    { id: 'resolute', name: '坚毅(Resolute)' },
    { id: 'stealthy', name: '隐蔽(Stealthy)' },
    { id: 'mobile', name: '机动(Mobile)' },
    { id: 'hardy', name: '坚韧(Hardy)' },
    { id: 'sharpshooter', name: '神射手(Sharpshooter)' },
    { id: 'siege_specialist', name: '攻城专家(Siege)' }
  ];

  // 不包含当前主战术
  const primaryId = sampleOp.chapterTactics[0];
  const availableOptions = CT_OPTIONS.filter(o => o.id !== primaryId);
  const currentSecId = sampleOp.chapterTactics[1];

  let optionsHtml = '';
  availableOptions.forEach(opt => {
    const isSelected = opt.id === currentSecId ? 'selected' : '';
    optionsHtml += `<option value="${opt.id}" ${isSelected}>${opt.name}</option>`;
  });

  overlayBox.innerHTML = `
    <h3 style="color:var(${themeVar});">自适应战术 (Adaptive Tactics)</h3>
    <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:16px;">
      为整个战队选择一个新的副战术（本 TP 结束时自动恢复）。
    </p>
    <div style="display:flex; flex-direction:column; gap:16px; width:100%; margin-bottom:20px; align-items:center;">
      <select id="adaptive-dropdown" style="width: 80%; background:#1e293b; color:#fff; border:1px solid var(${themeVar}); padding:12px; border-radius:6px; font-size:1.1rem; cursor:pointer; text-align:center;">
        ${optionsHtml}
      </select>
    </div>
    <div style="display:flex; justify-content:center; gap:12px; width:100%;">
      <button class="btn-large" onclick="cancelBuyPloy('${faction}', 'adaptive_tactics')" style="padding: 10px 30px; font-size:0.9rem; background:rgba(100,116,139,0.2); border-color:#475569;">
        取消 (Cancel)
      </button>
      <button class="btn-large" onclick="window.confirmAdaptiveTacticSelection('${faction}')" style="padding: 10px 30px; font-size:0.9rem; background:linear-gradient(135deg, #2563eb, #1e40af); border-color:#3b82f6;">
        确认应用 (Apply)
      </button>
    </div>
  `;
};

window.confirmAdaptiveTacticSelection = function(faction) {
  const dropdown = document.getElementById('adaptive-dropdown');
  if (!dropdown) return;
  const selectedValue = dropdown.value;
  const CT_OPTIONS = [
    { id: 'aggressive', name: '凶猛(Aggressive)' },
    { id: 'dueler', name: '决斗(Dueler)' },
    { id: 'resolute', name: '坚毅(Resolute)' },
    { id: 'stealthy', name: '隐蔽(Stealthy)' },
    { id: 'mobile', name: '机动(Mobile)' },
    { id: 'hardy', name: '坚韧(Hardy)' },
    { id: 'sharpshooter', name: '神射手(Sharpshooter)' },
    { id: 'siege_specialist', name: '攻城专家(Siege)' }
  ];

  gameState.operatives.forEach(op => {
    if (op.faction === 'Space Marine' && op.chapterTactics) {
      op.chapterTactics[1] = selectedValue;
    }
  });

  addLog(`  - 自适应战术生效：全队副战术临时更改为 ${CT_OPTIONS.find(o=>o.id===selectedValue).name}`);
  playSound('click');
  
  renderOperatives();
  startStrategyPhase();
};

window.applyDebugTactics = function(factionType) {
  if (factionType === 'sm') {
    const primary = document.getElementById('debug-sm-primary').value;
    const secondary = document.getElementById('debug-sm-secondary').value;
    gameState.operatives.forEach(op => {
      if (op.faction === 'Space Marine') {
        op.chapterTactics = [primary, secondary];
        // 也覆盖初始选择以免被 endTurningPoint 刷回去
        gameState.chapterTacticSelections[op.id] = { primary, secondary };
      }
    });
    addLog(`[TEST MODE] 全体 Space Marine 战术强制替换为: ${primary} / ${secondary}`);
  } else if (factionType === 'leg') {
    const moc = document.getElementById('debug-leg-moc').value;
    gameState.operatives.forEach(op => {
      if (op.faction === 'Legionary') {
        op.marksOfChaos = moc;
        gameState.marksOfChaosSelections[op.id] = moc;
      }
    });
    addLog(`[TEST MODE] 全体 Legionary 印记强制替换为: ${moc}`);
  }
  playSound('click');
  renderOperatives();
};

export function sandboxEndTurningPoint() {
  playSound('click');
  
  let count = 0;
  gameState.operatives.forEach(op => {
    if (!op.isDead && !op.hasActed) {
      op.hasActed = true;
      op.apl = 0;
      count++;
    }
  });
  
  addLog(`[TEST MODE] 手动结束 Turning Point: 强制 ${count} 个未激活特工进入已激活状态，并开始回合结算。`);
  
  gameState.activeAgent = null;
  gameState.pendingActivation = null;
  
  renderOperatives();
  updateActivePanel();
  
  showTurnEndScoringOverlay();
}

// ==========================================
//   交战总结与编辑器 (Combat Summary Modal)
// ==========================================
export function showCombatSummaryModal(actualDamage) {
  const overlay = document.createElement('div');
  overlay.id = 'combat-summary-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:100000;display:flex;justify-content:center;align-items:center;backdrop-filter:blur(5px);';
  
  const w = wizardState || {};
  const p = w.pendingResults || {};
  if (!w.attacker || !w.defender) return;
  
  let flowHtml = '';
  if (w.combatFlow && w.combatFlow.length > 0) {
    w.combatFlow.forEach(log => {
      let color = '#60a5fa'; // default blue
      if (log.phase.includes('Damage')) color = '#ef4444';
      else if (log.phase.includes('Save') || log.phase.includes('Parry')) color = '#10b981';
      else if (log.phase.includes('Rule') || log.phase.includes('Hot') || log.phase.includes('PSYCHIC')) color = '#f59e0b';
      
      flowHtml += `<div style="padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.9rem;"><strong style="color: ${color}; display:inline-block; min-width:80px;">[${log.phase}]</strong> ${log.text}</div>`;
    });
  } else {
    flowHtml = '<div style="color: #94a3b8; padding: 10px;">暂无详细日志 (No detailed logs recorded)</div>';
  }

  const TAG_TYPES = [
    { id: 'Poisoned', label: '☠️ 毒素标记' },
    { id: 'Injured', label: '🩸 受伤' },
    { id: 'Stunned', label: '💫 眩晕' },
    { id: 'Burning', label: '🔥 燃烧' }
  ];

  window.renderCombatSummaryTags = (side) => {
    const tokens = side === 'attacker' ? (p.attackerTokens || []) : (p.defenderTokens || []);
    const poisonCount = side === 'attacker' ? (p.attackerPoisonTokens || 0) : (p.defenderPoisonTokens || 0);
    return TAG_TYPES.map(tag => {
      let active = false;
      if (tag.id === 'Poisoned') {
        active = poisonCount > 0;
      } else {
        active = tokens.includes(tag.id);
      }
      return `<button class="dm-tag-btn ${active ? 'active' : ''}" onclick="window.toggleCombatSummaryTag('${side}', '${tag.id}')" style="margin:4px 2px; padding:4px 8px; font-size:0.75rem;">${tag.label}${tag.id === 'Poisoned' && poisonCount > 0 ? ' x' + poisonCount : ''}</button>`;
    }).join('');
  };

  const getOpAvatarUrl = (op) => {
    if (gameState.customAvatars[op.id]) return gameState.customAvatars[op.id];
    if (op.defaultAvatar) return getAssetPath(op.defaultAvatar);
    const cssSuffix = getFactionCssSuffix(op.faction);
    const idSuffix = op.id.replace(/^(sm_|pm_|leg_)/, '');
    return getAssetPath(`assets/images/operatives/${cssSuffix}/${cssSuffix}_${idSuffix}.jpg`);
  };

  overlay.innerHTML = `
    <div style="background: #0f172a; border: 2px solid #3b82f6; border-radius: 12px; width: 850px; max-width: 95%; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 0 30px rgba(59, 130, 246, 0.4);">
      <div style="padding: 15px 20px; background: linear-gradient(90deg, #1e293b, #0f172a); border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center;">
        <h2 style="color: white; margin: 0; font-size: 1.3rem; display:flex; align-items:center; gap:8px;">
          <span>⚔️</span> 交战总结与编辑 (Combat Summary)
        </h2>
        <div style="color: #94a3b8; font-size: 0.85rem;">可在此处修正预期伤害并附着状态</div>
      </div>
      
      <div style="display: flex; flex: 1; overflow: hidden; flex-direction: row; flex-wrap: wrap;">
        <!-- Left: Combat Flow -->
        <div style="flex: 1; min-width: 300px; padding: 15px; overflow-y: auto; max-height: 65vh; border-right: 1px solid #334155; background: rgba(0,0,0,0.2);">
          <h3 style="color: #94a3b8; font-size: 1rem; margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid #334155; padding-bottom: 8px;">📜 交战流程 (Flow)</h3>
          <div style="color: #e2e8f0; font-family: monospace; line-height: 1.4;">
            ${flowHtml}
          </div>
        </div>
        
        <!-- Right: Editor -->
        <div style="flex: 1; min-width: 350px; padding: 15px; overflow-y: auto; max-height: 65vh; background: #0f172a;" id="combat-summary-editor">
          <!-- Editor Content injected here -->
        </div>
      </div>
      
      <div style="padding: 15px 20px; background: #1e293b; border-top: 1px solid #334155; display: flex; justify-content: flex-end; gap: 10px;">
        <button id="combat-summary-confirm" class="action-btn" style="background: linear-gradient(135deg, #10b981, #059669); border:none; padding: 10px 24px; font-weight:bold; font-size:1.1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">确认并应用 (Confirm & Apply)</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const renderEditor = () => {
    const editor = document.getElementById('combat-summary-editor');
    if (!editor) return;
    editor.innerHTML = `
      <h3 style="color: #94a3b8; font-size: 1rem; margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid #334155; padding-bottom: 8px;">🛠️ 结果编辑 (Edit Results)</h3>
      
      <!-- Attacker -->
      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 15px; margin-bottom: 15px; box-shadow: inset 0 0 10px rgba(0,0,0,0.2);">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
          <img src="${getOpAvatarUrl(w.attacker)}" onclick="window.showDatacard('${w.attacker.id}')" style="width: 48px; height: 48px; border-radius: 50%; border: 2px solid #3b82f6; object-fit: cover; cursor: pointer;" title="查看数据卡">
          <div>
            <div style="font-weight: bold; color: white; font-size: 1.1rem; cursor: pointer;" onclick="window.showDatacard('${w.attacker.id}')" title="查看数据卡">攻击方: ${w.attacker.name}</div>
            <div style="font-size: 0.85rem; color: #94a3b8;">Initial HP: <span style="color:white;">${w.attacker.wounds}</span> / ${w.attacker.maxWounds}</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 6px;">
          <span style="color: #cbd5e1; font-size: 0.95rem;">结算后剩余生命值:</span>
          <div style="display: flex; align-items: center; gap: 12px;">
            <button class="dm-math-btn" onclick="window.adjustCombatSummaryStat('attacker', -1)" style="width:36px; height:36px; font-size:1.4rem;">-</button>
            <div style="display: flex; align-items: baseline; min-width: 80px; justify-content: center;">
              <span style="color: ${p.attackerWounds <= 0 ? '#ef4444' : 'white'}; font-weight: bold; font-size: 1.4rem; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${p.attackerWounds}</span>
              ${(()=>{
                const d = p.attackerWounds - w.attacker.wounds;
                if(d===0) return '';
                return `<span style="color:${d>0?'#10b981':'#ef4444'}; font-size:1rem; margin-left:6px; font-weight:bold;">(${d>0?'+':''}${d})</span>`;
              })()}
            </div>
            <button class="dm-math-btn" onclick="window.adjustCombatSummaryStat('attacker', 1)" style="width:36px; height:36px; font-size:1.4rem;">+</button>
          </div>
        </div>
        <div>
          <div style="font-size:0.8rem; color:#64748b; margin-bottom:4px;">附加状态：</div>
          ${window.renderCombatSummaryTags('attacker')}
        </div>
      </div>

      <!-- Defender -->
      <div style="background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 15px; box-shadow: inset 0 0 10px rgba(0,0,0,0.2);">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
          <img src="${getOpAvatarUrl(w.defender)}" onclick="window.showDatacard('${w.defender.id}')" style="width: 48px; height: 48px; border-radius: 50%; border: 2px solid #ef4444; object-fit: cover; cursor: pointer;" title="查看数据卡">
          <div>
            <div style="font-weight: bold; color: white; font-size: 1.1rem; cursor: pointer;" onclick="window.showDatacard('${w.defender.id}')" title="查看数据卡">防守方: ${w.defender.name}</div>
            <div style="font-size: 0.85rem; color: #94a3b8;">Initial HP: <span style="color:white;">${w.defender.wounds}</span> / ${w.defender.maxWounds}</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 6px;">
          <span style="color: #cbd5e1; font-size: 0.95rem;">结算后剩余生命值:</span>
          <div style="display: flex; align-items: center; gap: 12px;">
            <button class="dm-math-btn" onclick="window.adjustCombatSummaryStat('defender', -1)" style="width:36px; height:36px; font-size:1.4rem;">-</button>
            <div style="display: flex; align-items: baseline; min-width: 80px; justify-content: center;">
              <span style="color: ${p.defenderWounds <= 0 ? '#ef4444' : 'white'}; font-weight: bold; font-size: 1.4rem; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${p.defenderWounds}</span>
              ${(()=>{
                const d = p.defenderWounds - w.defender.wounds;
                if(d===0) return '';
                return `<span style="color:${d>0?'#10b981':'#ef4444'}; font-size:1rem; margin-left:6px; font-weight:bold;">(${d>0?'+':''}${d})</span>`;
              })()}
            </div>
            <button class="dm-math-btn" onclick="window.adjustCombatSummaryStat('defender', 1)" style="width:36px; height:36px; font-size:1.4rem;">+</button>
          </div>
        </div>
        <div>
          <div style="font-size:0.8rem; color:#64748b; margin-bottom:4px;">附加状态：</div>
          ${window.renderCombatSummaryTags('defender')}
        </div>
      </div>
    `;
  };

  window.adjustCombatSummaryStat = (side, delta) => {
    playSound('click');
    const key = side === 'attacker' ? 'attackerWounds' : 'defenderWounds';
    const op = side === 'attacker' ? w.attacker : w.defender;
    p[key] += delta;
    if (p[key] < 0) p[key] = 0;
    if (p[key] > op.maxWounds) p[key] = op.maxWounds;
    renderEditor();
  };

  window.toggleCombatSummaryTag = (side, tagId) => {
    playSound('click');
    if (tagId === 'Poisoned') {
      const key = side === 'attacker' ? 'attackerPoisonTokens' : 'defenderPoisonTokens';
      if (!p[key]) p[key] = 0;
      if (p[key] > 0) {
        p[key] = 0;
      } else {
        p[key] = 1;
      }
    } else {
      const tokens = side === 'attacker' ? p.attackerTokens : p.defenderTokens;
      const idx = tokens.indexOf(tagId);
      if (idx > -1) tokens.splice(idx, 1);
      else tokens.push(tagId);
    }
    renderEditor();
  };

  renderEditor();

  document.getElementById('combat-summary-confirm').onclick = () => {
    playSound('click');
    overlay.remove();
    if (typeof window.applyFinalCombatResults === 'function') {
      window.applyFinalCombatResults();
    }
  };
}
