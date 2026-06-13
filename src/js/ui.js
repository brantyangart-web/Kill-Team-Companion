import { gameState, wizardState, GAG_MESSAGES, hasUsableOperatives, switchSides, endTurningPoint } from './state.js';
import { playSound } from './audio.js';
import { SM_TEMPLATES, PM_TEMPLATES, RULE_TEXTS } from './constants.js';
import { Weapon, Operative } from './models.js';

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
  if (confirm('确定要重置当前对局吗？所有进度和选择将被清空。')) {
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
  }
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
  if (activeOp && activeOp.defaultAvatar) {
    fallbackUrl = activeOp.defaultAvatar;
  } else {
    const template = SM_TEMPLATES.concat(PM_TEMPLATES).find(t => t.id === opId);
    if (template && template.defaultAvatar) {
      fallbackUrl = template.defaultAvatar;
    }
  }

  const imgUrl = avatarUrl || fallbackUrl;
  return `<div class="op-avatar-slot main-avatar-${opId}" onclick="triggerAvatarUpload(event, '${opId}')">
            <img src="${imgUrl}" class="op-avatar-img" />
          </div>`;
}

export function renderRosterPickers() {
  const smContainer = document.getElementById('sm-roster-picker-list');
  const pmContainer = document.getElementById('pm-roster-picker-list');

  smContainer.innerHTML = '';
  pmContainer.innerHTML = '';

  // 渲染 SM (死亡天使)
  SM_TEMPLATES.forEach(tmpl => {
    const item = document.createElement('div');
    item.className = 'roster-pick-row';
    item.id = `picker-row-${tmpl.id}`;

    const isLeader = tmpl.isLeader;
    const leaderBadge = isLeader ? '<span class="role-badge leader">LEADER</span>' : '<span class="role-badge">SPECIALIST</span>';
    const weaponNames = tmpl.weapons.map(w => w.name.split(' ')[0]).join(' / ');

    const checkedAttr = !isLeader ? 'checked disabled' : '';
    if (!isLeader) {
      item.classList.add('selected');
    }

    const avatarHtml = getAvatarHtml(tmpl.id, 'Space Marine');

    item.innerHTML = `
      <input type="checkbox" class="roster-checkbox" id="check-${tmpl.id}" ${checkedAttr} onchange="toggleSelectSM('${tmpl.id}')">
      ${avatarHtml}
      <div class="roster-op-info">
        <div class="roster-op-name">${tmpl.name} ${leaderBadge}</div>
        <div class="roster-op-weapons">HP: ${tmpl.wounds} | 武器: ${weaponNames}</div>
      </div>
    `;

    // 绑定点击整行勾选
    if (isLeader) {
      item.onclick = (e) => {
        if (e.target.className !== 'roster-checkbox' && !e.target.closest('.op-avatar-slot')) {
          const cb = document.getElementById(`check-${tmpl.id}`);
          cb.checked = !cb.checked;
          toggleSelectSM(tmpl.id);
        }
      };
    }

    smContainer.appendChild(item);
  });

  // 渲染 PM (瘟疫战士)
  PM_TEMPLATES.forEach(tmpl => {
    const item = document.createElement('div');
    item.className = 'roster-pick-row';
    item.id = `picker-row-${tmpl.id}`;

    const isLeader = tmpl.isLeader;
    const leaderBadge = isLeader ? '<span class="role-badge leader" style="border-color:var(--pm-accent); color:var(--pm-accent); background:rgba(132,204,22,0.15)">LEADER</span>' : '<span class="role-badge">SPECIALIST</span>';
    const weaponNames = tmpl.weapons.map(w => w.name.split(' ')[0]).join(' / ');

    // Champion 必选
    const checkedAttr = isLeader ? 'checked disabled' : '';
    if (isLeader) {
      item.classList.add('selected');
    }

    const avatarHtml = getAvatarHtml(tmpl.id, 'Plague Marine');

    item.innerHTML = `
      <input type="checkbox" class="roster-checkbox" id="check-${tmpl.id}" ${checkedAttr} onchange="toggleSelectPM('${tmpl.id}')">
      ${avatarHtml}
      <div class="roster-op-info">
        <div class="roster-op-name">${tmpl.name} ${leaderBadge}</div>
        <div class="roster-op-weapons">HP: ${tmpl.wounds} | 武器: ${weaponNames}</div>
      </div>
    `;

    if (!isLeader) {
      item.onclick = (e) => {
        if (e.target.className !== 'roster-checkbox' && !e.target.closest('.op-avatar-slot')) {
          const cb = document.getElementById(`check-${tmpl.id}`);
          cb.checked = !cb.checked;
          toggleSelectPM(tmpl.id);
        }
      };
    }

    pmContainer.appendChild(item);
  });

  // 初始化计数
  updateSelectionCounts();
}

export function toggleSelectSM(id) {
  playSound('click');
  const op = SM_TEMPLATES.find(o => o.id === id);
  const cb = document.getElementById(`check-${id}`);

  // 队长互斥限制 (Captain vs Sergeant)
  if (op.isLeader && cb.checked) {
    const otherLeaderId = id === 'sm_1' ? 'sm_2' : 'sm_1';
    const otherCb = document.getElementById(`check-${otherLeaderId}`);
    if (otherCb.checked) {
      otherCb.checked = false;
      // 视觉上移除其他队长的被选状态
      document.getElementById(`picker-row-${otherLeaderId}`).classList.remove('selected');
    }
  }

  const row = document.getElementById(`picker-row-${id}`);
  if (cb.checked) row.classList.add('selected');
  else row.classList.remove('selected');

  updateSelectionCounts();
}

export function toggleSelectPM(id) {
  playSound('click');
  const row = document.getElementById(`picker-row-${id}`);
  const cb = document.getElementById(`check-${id}`);
  if (cb.checked) row.classList.add('selected');
  else row.classList.remove('selected');

  updateSelectionCounts();
}

export function updateSelectionCounts() {
  // 统计 SM
  let smSelected = 0;
  SM_TEMPLATES.forEach(t => {
    if (document.getElementById(`check-${t.id}`).checked) smSelected++;
  });
  document.getElementById('sm-roster-count').textContent = `已选: ${smSelected} / 6 人`;

  // 统计 PM
  let pmSelected = 0;
  PM_TEMPLATES.forEach(t => {
    if (document.getElementById(`check-${t.id}`).checked) pmSelected++;
  });
  document.getElementById('pm-roster-count').textContent = `已选: ${pmSelected} / 6 人`;
}

export function validateRostersAndDeploy() {
  playSound('click');

  const smSelectedIds = [];
  let smLeaderCount = 0;
  SM_TEMPLATES.forEach(t => {
    if (document.getElementById(`check-${t.id}`).checked) {
      smSelectedIds.push(t.id);
      if (t.isLeader) smLeaderCount++;
    }
  });

  const pmSelectedIds = [];
  let pmLeaderCount = 0;
  PM_TEMPLATES.forEach(t => {
    if (document.getElementById(`check-${t.id}`).checked) {
      pmSelectedIds.push(t.id);
      if (t.isLeader) pmLeaderCount++;
    }
  });

  // 校验 SM
  if (smSelectedIds.length !== 6) {
    playSound('alert');
    alert(`星际战士 (死亡天使) 必须刚好选择 6 人！当前选择了 ${smSelectedIds.length} 人。`);
    return;
  }
  if (smLeaderCount !== 1) {
    playSound('alert');
    alert(`星际战士 必须选择且仅选择 1 名队长（Captain 或 Sergeant 二选一）！`);
    return;
  }

  // 校验 PM
  if (pmSelectedIds.length !== 6) {
    playSound('alert');
    alert(`瘟疫守卫 必须刚好选择 6 人！当前选择了 ${pmSelectedIds.length} 人。`);
    return;
  }
  const pmChampionChecked = document.getElementById('check-pm_1').checked;
  if (!pmChampionChecked) {
    playSound('alert');
    alert(`瘟疫守卫 的 冠军队长 (Plague Champion) 是强制出战的 Leader 角色！`);
    return;
  }

  // 校验通过，载入特工列表
  gameState.operatives = [];

  // 加载 SM
  smSelectedIds.forEach(id => {
    const tmpl = SM_TEMPLATES.find(t => t.id === id);
    gameState.operatives.push(new Operative(tmpl.id, tmpl.name, 'Space Marine', tmpl.wounds, tmpl.apl, tmpl.df, tmpl.sv, tmpl.weapons, tmpl.defaultAvatar));
  });

  // 加载 PM
  pmSelectedIds.forEach(id => {
    const tmpl = PM_TEMPLATES.find(t => t.id === id);
    gameState.operatives.push(new Operative(tmpl.id, tmpl.name, 'Plague Marine', tmpl.wounds, tmpl.apl, tmpl.df, tmpl.sv, tmpl.weapons, tmpl.defaultAvatar));
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
    if (isSm && gameState.smActivePloys.includes('bolter_discipline') && !op.isDead) {
      tagHtml = '<span class="card-ploy-tag">双重射击</span>';
    } else if (!isSm && gameState.pmActivePloys.includes('contagious_resilience') && !op.isDead) {
      tagHtml = '<span class="card-ploy-tag" style="border-color:var(--pm-accent); color:var(--pm-accent); background:rgba(132,204,22,0.15);">减伤重投</span>';
    }

    const avatarHtml = getAvatarHtml(op.id, op.faction);

    card.innerHTML = `
      <div class="op-card-top">
        <div class="op-avatar-row">
          ${avatarHtml}
          <span class="op-card-title">${op.name} ${tagHtml}</span>
        </div>
        <span class="op-card-tag">${op.maxApl} APL</span>
      </div>
      <div class="op-card-hp">
        <span>HP (Wounds):</span>
        <span>${op.wounds} / ${op.maxWounds}</span>
      </div>
      <div class="op-hp-bar-container">
        <div class="op-hp-bar" style="width: ${hpPercent}%; background-color: ${hpPercent < 40 ? 'var(--red)' : 'var(--green)'}"></div>
      </div>
      <div class="op-card-stats">
        <span>DF: <strong>${op.df}</strong></span>
        <span>SV: <strong>${op.sv}+</strong></span>
        <span style="font-size: 0.65rem; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px;">
          ${weaponNames}
        </span>
      </div>
    `;

    if (!op.isDead && !op.hasActed && gameState.phase === 'Firefight' && gameState.activeTurn === op.faction && !gameState.activeAgent) {
      card.onclick = () => activateOperative(op.id);
    } else {
      card.onclick = null;
    }

    if (isSm) smList.appendChild(card);
    else pmList.appendChild(card);
  });

  document.getElementById('sm-alive-count').textContent = `${smAlive} / 6 存活`;
  document.getElementById('pm-alive-count').textContent = `${pmAlive} / 6 存活`;
}

// ==========================================
//           Active Panel
// ==========================================

export function activateOperative(opId) {
  playSound('click');
  const op = gameState.operatives.find(o => o.id === opId);
  if (!op || op.isDead || op.hasActed) return;

  gameState.activeAgent = op;
  op.apl = op.maxApl;
  op.actionsPerformed = [];

  addLog(`[激活] ${op.name} 开始激活，获得 ${op.apl} APL！`);

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
    const maxShoots = (op.faction === 'Space Marine' && gameState.smActivePloys.includes('bolter_discipline')) ? 2 : 1;
    const hasShotLimit = shootCount >= maxShoots;

    const hasFought = op.actionsPerformed.includes('Fight');

    document.getElementById('action-move').disabled = op.apl < 1 || hasMoved || hasCharged;
    document.getElementById('action-charge').disabled = op.apl < 1 || hasMoved || hasCharged || hasFought;
    document.getElementById('action-shoot').disabled = op.apl < 1 || hasShotLimit || hasCharged;
    document.getElementById('action-fight').disabled = op.apl < 1 || hasFought;

    const hasBolterDiscipline = op.faction === 'Space Marine' && gameState.smActivePloys.includes('bolter_discipline');
    const hasContagiousResilience = op.faction === 'Plague Marine' && gameState.pmActivePloys.includes('contagious_resilience');

    const ployDisplay = document.getElementById('active-ploys-display');
    if (ployDisplay) {
        const ploysText = [];
        if (hasBolterDiscipline) ploysText.push('<span style="color:gold;">🔥 爆弹惩戒生效中</span>');
        if (hasContagiousResilience) ploysText.push('<span style="color:var(--pm-accent);">🛡️ 传染韧性生效中</span>');
        ployDisplay.innerHTML = ploysText.length > 0 ? ploysText.join(' | ') : '';
    }

    const shootBtnText = document.querySelector('#action-shoot span:first-child');
    if (shootBtnText) {
        if (hasBolterDiscipline) {
            shootBtnText.innerHTML = `💥 射击 [${shootCount < 2 ? 2 - shootCount : 0}次剩余]`;
        } else {
            shootBtnText.innerHTML = `💥 射击 (Shoot)`;
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
  document.getElementById('phase-overlay').style.display = 'flex';
}

export function hidePhaseOverlay() {
  document.getElementById('phase-overlay').style.display = 'none';
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
        overlayBox.innerHTML += `
          <div style="border-top:1px solid var(--panel-border); margin-top:16px; padding-top:16px; width:100%;">
            <p style="color:var(--sm-accent); font-weight:bold; margin-bottom:10px;">👑 【${winnerCN}】选择首发玩家：</p>
            <div style="display:flex; gap:10px;">
              <button class="qa-btn" onclick="selectTurnOrder('Space Marine')">死亡天使先攻 (Astartes First)</button>
              <button class="qa-btn" onclick="selectTurnOrder('Plague Marine')">瘟疫守卫先攻 (Death Guard First)</button>
            </div>
          </div>
        `;
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
      <div class="ploy-choice-card ${gameState.smActivePloys.includes('bolter_discipline') ? 'selected' : ''}" onclick="buyPloy('sm')">
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

      <div class="ploy-choice-card ${gameState.pmActivePloys.includes('contagious_resilience') ? 'selected' : ''}" onclick="buyPloy('pm')">
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
      if (gameState.smCp < 1) { playSound('alert'); alert('死亡天使 CP 不足！'); return; }
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
      if (gameState.pmCp < 1) { playSound('alert'); alert('瘟疫守卫 CP 不足！'); return; }
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
  document.getElementById('help-modal').style.display = 'flex';
}

export function closeHelpModal() {
  playSound('click');
  document.getElementById('help-modal').style.display = 'none';
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
  }

  addLog(`[阵亡提示] 特工 ${op.name} 已阵亡！请在物理沙盘中移除模型。`);
}

export function confirmOperativeDeath() {
  playSound('click');
  const overlay = document.getElementById('death-overlay');
  if (overlay) {
    overlay.style.display = 'none';
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
  // 1. 触发震屏
  document.body.classList.remove('intense-shake');
  void document.body.offsetWidth; // 触发回流以重新播放 CSS 动画
  document.body.classList.add('intense-shake');
  setTimeout(() => {
    document.body.classList.remove('intense-shake');
  }, 400);

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
