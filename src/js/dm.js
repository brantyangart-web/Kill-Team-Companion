import { gameState } from './state.js';
import { renderOperatives, updateActivePanel, updateScoresUI, rollInitiativeOverlay, startStrategyPhase, hidePhaseOverlay } from './ui.js';
import { Operative, Weapon } from './models.js';

// ==========================================
//          State Snapshot Engine
// ==========================================

const MAX_HISTORY = 20;
export const gameStateHistory = [];
export const gameStateFuture = [];

function restorePrototypes(state) {
  if (state.operatives) {
    state.operatives.forEach(op => {
      Object.setPrototypeOf(op, Operative.prototype);
      if (op.weapons) {
        op.weapons.forEach(w => Object.setPrototypeOf(w, Weapon.prototype));
      }
    });
  }
  if (state.activeAgent) {
    const ref = state.operatives.find(o => o.id === state.activeAgent.id);
    if (ref) state.activeAgent = ref;
  }
}

export function pushStateSnapshot(label = 'Auto Snapshot') {
  try {
    const snapshot = structuredClone(gameState);
    gameStateHistory.push({
      label,
      timestamp: new Date().toLocaleTimeString(),
      state: snapshot
    });
    
    if (gameStateHistory.length > MAX_HISTORY) {
      gameStateHistory.shift();
    }
    
    gameStateFuture.length = 0; // Clear redo history on new action
    
    console.log(`[DM System] Snapshot taken: ${label}`);
    updateFloatingButtons();
  } catch (e) {
    console.error('[DM System] Failed to take snapshot:', e);
  }
}

export function popStateSnapshot() {
  if (gameStateHistory.length === 0) {
    alert("没有可撤销的历史记录了 (No history available).");
    return;
  }
  
  // Save current state to future for Redo
  gameStateFuture.push({
    label: 'Redo Snapshot',
    timestamp: new Date().toLocaleTimeString(),
    state: structuredClone(gameState)
  });
  
  const lastSnapshot = gameStateHistory.pop();
  try {
    // Clear and mutate the existing object in place
    const keys = Object.keys(gameState);
    keys.forEach(k => delete gameState[k]);
    Object.assign(gameState, structuredClone(lastSnapshot.state));
    restorePrototypes(gameState);
    
    console.log(`[DM System] Reverted to snapshot: ${lastSnapshot.label}`);
    
    // Force UI Refresh
    if (typeof updateScoresUI === 'function') updateScoresUI();
    if (typeof renderOperatives === 'function') renderOperatives();
    if (typeof updateActivePanel === 'function') updateActivePanel();
    
    if (gameState.phase === 'Initiative' && typeof rollInitiativeOverlay === 'function') rollInitiativeOverlay();
    else if (gameState.phase === 'Strategy' && typeof startStrategyPhase === 'function') startStrategyPhase();
    else if (gameState.phase === 'Firefight' && typeof hidePhaseOverlay === 'function') hidePhaseOverlay();
    
    if (document.getElementById('dm-modal')) {
      renderDMHistoryTab();
    }
    updateFloatingButtons();
  } catch (e) {
    console.error('[DM System] Failed to pop snapshot:', e);
  }
}

export function redoStateSnapshot() {
  if (gameStateFuture.length === 0) return;
  
  // Save current state to history for Undo
  gameStateHistory.push({
    label: 'Undo Snapshot',
    timestamp: new Date().toLocaleTimeString(),
    state: structuredClone(gameState)
  });

  const nextSnapshot = gameStateFuture.pop();
  
  try {
    const keys = Object.keys(gameState);
    keys.forEach(k => delete gameState[k]);
    Object.assign(gameState, structuredClone(nextSnapshot.state));
    restorePrototypes(gameState);
    
    console.log(`[DM System] Redid snapshot: ${nextSnapshot.label}`);
    
    // Force UI Refresh
    if (typeof updateScoresUI === 'function') updateScoresUI();
    if (typeof renderOperatives === 'function') renderOperatives();
    if (typeof updateActivePanel === 'function') updateActivePanel();
    
    if (gameState.phase === 'Initiative' && typeof rollInitiativeOverlay === 'function') rollInitiativeOverlay();
    else if (gameState.phase === 'Strategy' && typeof startStrategyPhase === 'function') startStrategyPhase();
    else if (gameState.phase === 'Firefight' && typeof hidePhaseOverlay === 'function') hidePhaseOverlay();
    
    if (document.getElementById('dm-modal')) {
      renderDMHistoryTab();
    }
    updateFloatingButtons();
  } catch (e) {
    console.error('[DM System] Failed to redo snapshot:', e);
  }
}

window.pushStateSnapshot = pushStateSnapshot;
window.popStateSnapshot = popStateSnapshot;
window.redoStateSnapshot = redoStateSnapshot;

// ==========================================
//               DM UI System
// ==========================================

let activeTab = 'global';

export function initDMSystem() {
  const container = document.createElement('div');
  container.id = 'dm-floating-container';
  container.style.cssText = `
    position: fixed; bottom: 20px; right: 20px;
    display: flex; gap: 10px; align-items: center;
    z-index: 9999;
  `;
  
  const btnStyle = `
    background: linear-gradient(135deg, #7c3aed, #4c1d95);
    color: white; border: 2px solid #a78bfa; border-radius: 50%;
    width: 50px; height: 50px; font-size: 1.2rem; font-weight: bold;
    cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center;
    transition: transform 0.2s, opacity 0.2s;
  `;
  
  const undoBtn = document.createElement('button');
  undoBtn.id = 'dm-undo-btn';
  undoBtn.innerHTML = '⏪';
  undoBtn.title = '撤销 (Undo)';
  undoBtn.style.cssText = btnStyle;
  undoBtn.onmouseover = () => undoBtn.style.transform = 'scale(1.1)';
  undoBtn.onmouseout = () => undoBtn.style.transform = 'scale(1)';
  undoBtn.onclick = popStateSnapshot;
  
  const redoBtn = document.createElement('button');
  redoBtn.id = 'dm-redo-btn';
  redoBtn.innerHTML = '⏩';
  redoBtn.title = '重做 (Redo)';
  redoBtn.style.cssText = btnStyle;
  redoBtn.onmouseover = () => redoBtn.style.transform = 'scale(1.1)';
  redoBtn.onmouseout = () => redoBtn.style.transform = 'scale(1)';
  redoBtn.onclick = redoStateSnapshot;
  
  const dmBtn = document.createElement('button');
  dmBtn.id = 'dm-floating-btn';
  dmBtn.innerHTML = '⚙️';
  dmBtn.title = 'DM 面板';
  dmBtn.style.cssText = btnStyle + ' font-size: 1.5rem; width: 60px; height: 60px;';
  dmBtn.onmouseover = () => dmBtn.style.transform = 'scale(1.1)';
  dmBtn.onmouseout = () => dmBtn.style.transform = 'scale(1)';
  dmBtn.onclick = openDMPanel;
  
  container.appendChild(undoBtn);
  container.appendChild(redoBtn);
  container.appendChild(dmBtn);
  document.body.appendChild(container);
  
  updateFloatingButtons();
  
  const style = document.createElement('style');
  style.textContent = `
    .dm-tab-btn { background: #1e293b; color: #94a3b8; border: 1px solid #334155; padding: 8px 16px; cursor: pointer; transition: 0.2s; border-radius: 4px; font-weight: bold; }
    .dm-tab-btn.active { background: #7c3aed; color: white; border-color: #a78bfa; }
    .dm-tab-btn:hover:not(.active) { background: #334155; color: white; }
    .dm-input { background: #0f172a; color: white; border: 1px solid #334155; padding: 6px; border-radius: 4px; width: 60px; text-align: center; }
    .dm-select { background: #0f172a; color: white; border: 1px solid #334155; padding: 6px; border-radius: 4px; }
    .dm-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #1e293b; }
    .dm-op-card { background: #1e293b; border: 1px solid #334155; padding: 10px; margin-bottom: 10px; border-radius: 6px; }
    .dm-op-header { display: flex; justify-content: space-between; font-weight: bold; color: #e2e8f0; cursor: pointer; }
    .dm-op-body { margin-top: 10px; display: none; gap: 10px; flex-direction: column; }
    .dm-op-card.expanded .dm-op-body { display: flex; }
    .dm-math-btn { background: #334155; color: white; border: none; border-radius: 8px; width: 40px; height: 40px; font-size: 1.5rem; cursor: pointer; transition: 0.1s; display: flex; align-items: center; justify-content: center; }
    .dm-math-btn:hover { background: #475569; }
    .dm-math-btn:active { background: #1e293b; }
    .dm-toggle-btn { flex: 1; padding: 10px; border: none; border-radius: 6px; color: white; font-weight: bold; cursor: pointer; transition: 0.2s; }
    .dm-toggle-btn.engage { background: #ef4444; }
    .dm-toggle-btn.conceal { background: #3b82f6; }
    .dm-toggle-btn.alive { background: #10b981; }
    .dm-toggle-btn.dead { background: #64748b; }
    .dm-tag-btn { background: #1e293b; color: #64748b; border: 1px solid #334155; border-radius: 20px; padding: 6px 14px; font-size: 0.8rem; cursor: pointer; transition: 0.2s; }
    .dm-tag-btn.active { background: rgba(124, 58, 237, 0.2); color: #a78bfa; border-color: #7c3aed; }
  `;
  document.head.appendChild(style);
}

function updateFloatingButtons() {
  const undoBtn = document.getElementById('dm-undo-btn');
  const redoBtn = document.getElementById('dm-redo-btn');
  if (undoBtn) {
    undoBtn.style.opacity = gameStateHistory.length > 0 ? '1' : '0.5';
    undoBtn.style.pointerEvents = gameStateHistory.length > 0 ? 'auto' : 'none';
  }
  if (redoBtn) {
    redoBtn.style.opacity = gameStateFuture.length > 0 ? '1' : '0.5';
    redoBtn.style.pointerEvents = gameStateFuture.length > 0 ? 'auto' : 'none';
  }
}

function openDMPanel() {
  const existing = document.getElementById('dm-modal');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'dm-modal';
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.8); z-index: 10000;
    display: flex; align-items: center; justify-content: center;
  `;

  const content = document.createElement('div');
  content.style.cssText = `
    background: #0f172a; width: 500px; max-width: 90%; max-height: 85vh;
    border: 1px solid #7c3aed; border-radius: 8px; box-shadow: 0 0 30px rgba(124, 58, 237, 0.3);
    display: flex; flex-direction: column; overflow: hidden;
  `;

  const header = document.createElement('div');
  header.style.cssText = 'padding: 15px; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; background: #1e293b;';
  header.innerHTML = '<div style="color: #a78bfa; font-size: 1.2rem; font-weight: bold;">⚔️ Dungeon Master Panel</div>';
  
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '✖';
  closeBtn.style.cssText = 'background: transparent; color: #ef4444; border: none; font-size: 1.2rem; cursor: pointer;';
  closeBtn.onclick = () => overlay.remove();
  header.appendChild(closeBtn);

  const tabs = document.createElement('div');
  tabs.style.cssText = 'display: flex; gap: 10px; padding: 15px; border-bottom: 1px solid #334155;';
  tabs.innerHTML = `
    <button class="dm-tab-btn ${activeTab==='global'?'active':''}" data-tab="global">全局设定 (Global)</button>
    <button class="dm-tab-btn ${activeTab==='operatives'?'active':''}" data-tab="operatives">特工数据 (Operatives)</button>
    <button class="dm-tab-btn ${activeTab==='history'?'active':''}" data-tab="history">历史与撤销 (History)</button>
  `;
  
  const body = document.createElement('div');
  body.id = 'dm-body';
  body.style.cssText = 'padding: 20px; overflow-y: auto; flex-grow: 1;';

  content.appendChild(header);
  content.appendChild(tabs);
  content.appendChild(body);
  overlay.appendChild(content);
  document.body.appendChild(overlay);

  tabs.querySelectorAll('.dm-tab-btn').forEach(btn => {
    btn.onclick = (e) => {
      tabs.querySelectorAll('.dm-tab-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      activeTab = e.target.getAttribute('data-tab');
      renderDMTabContent();
    };
  });

  renderDMTabContent();
}

function renderDMTabContent() {
  const body = document.getElementById('dm-body');
  if (!body) return;
  body.innerHTML = '';
  
  if (activeTab === 'global') renderDMGlobalTab(body);
  else if (activeTab === 'operatives') renderDMOperativesTab(body);
  else if (activeTab === 'history') renderDMHistoryTab(body);
}

function renderDMGlobalTab(container) {
  const t1 = gameState.teamFactions[0] || 'Team 1';
  const t2 = gameState.teamFactions[1] || 'Team 2';


  container.innerHTML = `
    <div class="dm-row">
      <span>当前回合 (Turning Point)</span>
      <input type="number" class="dm-input" id="dm-tp" value="${gameState.turningPoint}" min="1">
    </div>
    <div class="dm-row">
      <span>游戏阶段 (Phase)</span>
      <select class="dm-select" id="dm-phase">
        <option value="Initiative" ${gameState.phase==='Initiative'?'selected':''}>先攻阶段 (Initiative)</option>
        <option value="Strategy" ${gameState.phase==='Strategy'?'selected':''}>策略阶段 (Strategy)</option>
        <option value="Firefight" ${gameState.phase==='Firefight'?'selected':''}>交火阶段 (Firefight)</option>
      </select>
    </div>
    <div class="dm-row">
      <span>当前行动方 (Active Turn)</span>
      <select class="dm-select" id="dm-active-turn">
        <option value="0" ${gameState.activeTurnSlot===0?'selected':''}>${t1}</option>
        <option value="1" ${gameState.activeTurnSlot===1?'selected':''}>${t2}</option>
      </select>
    </div>
    <h4 style="margin-top:20px; color:#94a3b8; border-bottom:1px solid #334155; padding-bottom:5px;">${t1} 资源</h4>
    <div class="dm-row">
      <span>胜利点数 (VP)</span>
      <input type="number" class="dm-input" id="dm-smVp" value="${gameState.smVp}">
    </div>
    <div class="dm-row">
      <span>命令点数 (CP)</span>
      <input type="number" class="dm-input" id="dm-smCp" value="${gameState.smCp}">
    </div>
    <h4 style="margin-top:20px; color:#94a3b8; border-bottom:1px solid #334155; padding-bottom:5px;">${t2} 资源</h4>
    <div class="dm-row">
      <span>胜利点数 (VP)</span>
      <input type="number" class="dm-input" id="dm-pmVp" value="${gameState.pmVp}">
    </div>
    <div class="dm-row">
      <span>命令点数 (CP)</span>
      <input type="number" class="dm-input" id="dm-pmCp" value="${gameState.pmCp}">
    </div>
    
    <div style="margin-top: 20px; text-align: center;">
      <button id="dm-save-global" class="dm-tab-btn" style="background:#10b981; color:white;">应用设定 (Apply Changes)</button>
    </div>
  `;

  document.getElementById('dm-save-global').onclick = () => {
    pushStateSnapshot('DM Edit: Global Settings');
    gameState.turningPoint = parseInt(document.getElementById('dm-tp').value, 10) || 1;
    gameState.phase = document.getElementById('dm-phase').value;
    gameState.activeTurnSlot = parseInt(document.getElementById('dm-active-turn').value, 10);
    gameState.activeTurn = gameState.teamFactions[gameState.activeTurnSlot];
    
    gameState.smVp = parseInt(document.getElementById('dm-smVp').value, 10) || 0;
    gameState.smCp = parseInt(document.getElementById('dm-smCp').value, 10) || 0;
    gameState.pmVp = parseInt(document.getElementById('dm-pmVp').value, 10) || 0;
    gameState.pmCp = parseInt(document.getElementById('dm-pmCp').value, 10) || 0;
    
    if (typeof updateScoresUI === 'function') updateScoresUI();
    if (typeof updateActivePanel === 'function') updateActivePanel();
    
    if (gameState.phase === 'Initiative' && typeof rollInitiativeOverlay === 'function') rollInitiativeOverlay();
    else if (gameState.phase === 'Strategy' && typeof startStrategyPhase === 'function') startStrategyPhase();
    else if (gameState.phase === 'Firefight' && typeof hidePhaseOverlay === 'function') hidePhaseOverlay();
    
    alert('全局设定已生效！');
  };
}

function renderDMOperativesTab(container) {
  if (!gameState.operatives || gameState.operatives.length === 0) {
    container.innerHTML = '<p style="color:#ef4444;">No operatives found.</p>';
    return;
  }
  
  let html = '<div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">';
  gameState.operatives.forEach((op, idx) => {
    const isDead = op.isDead ? '<span style="color:#ef4444; font-size:0.8em; display:block;">[阵亡]</span>' : '';
    html += `
      <div class="dm-op-card" style="cursor:pointer; display:flex; flex-direction:column; align-items:center; padding:10px; background:#1e293b; border:1px solid #334155; border-radius:6px; margin:0;" onclick="window.openFocusedEditView(${idx})">
        <img src="${op.defaultAvatar}" style="width:50px; height:50px; border-radius:50%; object-fit:cover; margin-bottom:5px; border:2px solid ${op.teamSlot === 0 ? '#3b82f6' : '#ef4444'};">
        <div style="font-weight:bold; font-size:0.85rem; text-align:center; color:#e2e8f0; line-height:1.2;">${op.name}</div>
        <div style="color:#94a3b8; font-size:0.75rem; text-align:center; margin-top:4px;">HP: ${op.wounds}/${op.maxWounds} ${isDead}</div>
      </div>
    `;
  });
  html += '</div>';
  container.innerHTML = html;
}

window.openFocusedEditView = function(idx) {
  const op = gameState.operatives[idx];
  if (!op) return;
  const container = document.getElementById('dm-body');
  
  const TAG_TYPES = [
    { id: 'Poisoned', label: '☠️ 毒素标记 (Poison)' },
    { id: 'Injured', label: '🩸 受伤 (Injured)' },
    { id: 'Stunned', label: '💫 眩晕 (Stunned)' },
    { id: 'Burning', label: '🔥 燃烧 (Burning)' }
  ];

  const tagsHtml = TAG_TYPES.map(tag => {
    let active = false;
    if (tag.id === 'Poisoned') {
      active = op.poisonTokens > 0;
    } else {
      active = op.tokens && op.tokens.includes(tag.id);
    }
    return `<button class="dm-tag-btn ${active ? 'active' : ''}" onclick="window.toggleDMOpTag(${idx}, '${tag.id}')">${tag.label}${tag.id === 'Poisoned' && op.poisonTokens > 1 ? ' x' + op.poisonTokens : ''}</button>`;
  }).join('');

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; margin-bottom:15px; align-items:center;">
      <button class="dm-tab-btn" onclick="renderDMTabContent()">⬅ 返回列表</button>
      <div style="font-weight:bold; color:#e2e8f0; font-size:1.1rem;">编辑特工数据</div>
    </div>
    <div style="display:flex; flex-direction:column; align-items:center; background:#1e293b; padding:20px; border-radius:8px; border:1px solid #334155;">
      <img src="${op.defaultAvatar}" style="width:100px; height:100px; border-radius:50%; object-fit:cover; margin-bottom:10px; border:3px solid ${op.teamSlot === 0 ? '#3b82f6' : '#ef4444'};">
      <div style="font-weight:bold; font-size:1.2rem; color:white; margin-bottom:5px; text-align:center;">${op.name}</div>
      <div style="color:#94a3b8; font-size:0.9rem; margin-bottom:20px;">${op.faction}</div>
      
      <div style="display:flex; gap:30px; width:100%; justify-content:center; margin-bottom:20px;">
        <!-- Wounds -->
        <div style="display:flex; flex-direction:column; align-items:center;">
          <div style="color:#94a3b8; font-size:0.8rem; margin-bottom:5px;">生命值 (Wounds)</div>
          <div style="display:flex; align-items:center; gap:10px;">
            <button class="dm-math-btn" onclick="window.adjustDMOpStat(${idx}, 'wounds', -1)">-</button>
            <div style="font-size:1.5rem; font-weight:bold; color:white; min-width:40px; text-align:center;">${op.wounds}</div>
            <button class="dm-math-btn" onclick="window.adjustDMOpStat(${idx}, 'wounds', 1)">+</button>
          </div>
        </div>
        <!-- APL -->
        <div style="display:flex; flex-direction:column; align-items:center;">
          <div style="color:#94a3b8; font-size:0.8rem; margin-bottom:5px;">行动力 (APL)</div>
          <div style="display:flex; align-items:center; gap:10px;">
            <button class="dm-math-btn" onclick="window.adjustDMOpStat(${idx}, 'apl', -1)">-</button>
            <div style="font-size:1.5rem; font-weight:bold; color:white; min-width:30px; text-align:center;">${op.apl}</div>
            <button class="dm-math-btn" onclick="window.adjustDMOpStat(${idx}, 'apl', 1)">+</button>
          </div>
        </div>
      </div>
      
      <div style="width:100%; display:flex; justify-content:space-between; gap:10px; margin-bottom:20px;">
        <button class="dm-toggle-btn ${op.hasConceal ? 'conceal' : 'engage'}" onclick="window.toggleDMOpOrder(${idx})">
          ${op.hasConceal ? '🛡️ 隐蔽 (Conceal)' : '⚔️ 交战 (Engage)'}
        </button>
        <button class="dm-toggle-btn ${op.isDead ? 'dead' : 'alive'}" onclick="window.toggleDMOpDead(${idx})">
          ${op.isDead ? '💀 阵亡 (Dead)' : '💖 存活 (Alive)'}
        </button>
      </div>
      
      <div style="width:100%; border-top:1px solid #334155; padding-top:15px;">
        <div style="color:#94a3b8; font-size:0.9rem; margin-bottom:10px; text-align:center;">状态标签池 (Status Tags)</div>
        <div style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center;">
          ${tagsHtml}
        </div>
      </div>
    </div>
  `;
};

window.adjustDMOpStat = function(idx, stat, delta) {
  const op = gameState.operatives[idx];
  if (!op) return;
  pushStateSnapshot(`DM Edit: Adjust ${stat}`);
  op[stat] += delta;
  if (stat === 'wounds') {
    if (op.wounds < 0) op.wounds = 0;
    if (op.wounds > op.maxWounds) op.wounds = op.maxWounds;
    if (op.wounds === 0) op.isDead = true;
    else if (op.isDead && op.wounds > 0) op.isDead = false;
  }
  if (typeof renderOperatives === 'function') renderOperatives();
  if (typeof updateActivePanel === 'function') updateActivePanel();
  window.openFocusedEditView(idx);
};

window.toggleDMOpOrder = function(idx) {
  const op = gameState.operatives[idx];
  if (!op) return;
  pushStateSnapshot(`DM Edit: Toggle Order`);
  op.hasConceal = !op.hasConceal;
  if (typeof renderOperatives === 'function') renderOperatives();
  window.openFocusedEditView(idx);
};

window.toggleDMOpDead = function(idx) {
  const op = gameState.operatives[idx];
  if (!op) return;
  pushStateSnapshot(`DM Edit: Toggle Alive`);
  op.isDead = !op.isDead;
  if (op.isDead) op.wounds = 0;
  if (typeof renderOperatives === 'function') renderOperatives();
  window.openFocusedEditView(idx);
};

window.toggleDMOpTag = function(idx, tag) {
  const op = gameState.operatives[idx];
  if (!op) return;
  pushStateSnapshot(`DM Edit: Toggle Tag ${tag}`);
  if (tag === 'Poisoned') {
    if (!op.poisonTokens) op.poisonTokens = 0;
    if (op.poisonTokens > 0) {
      op.poisonTokens = 0;
    } else {
      op.poisonTokens = 1;
    }
  } else {
    if (!op.tokens) op.tokens = [];
    const tagIdx = op.tokens.indexOf(tag);
    if (tagIdx > -1) {
      op.tokens.splice(tagIdx, 1);
    } else {
      op.tokens.push(tag);
    }
  }
  if (typeof renderOperatives === 'function') renderOperatives();
  if (typeof updateActivePanel === 'function') updateActivePanel();
  window.openFocusedEditView(idx);
};

function renderDMHistoryTab(container = document.getElementById('dm-body')) {
  if (!container) return;
  
  let html = `
    <div style="margin-bottom: 20px; padding: 15px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 6px;">
      <button class="dm-tab-btn" style="background:#ef4444; color:white; font-size: 1.1rem; width:100%; padding: 12px;" onclick="window.popStateSnapshot()">
        ⏪ 撤回上一步 (UNDO LAST ACTION)
      </button>
    </div>
    <h4 style="color:#94a3b8; border-bottom:1px solid #334155; padding-bottom:5px;">快照日志 (Snapshot Log)</h4>
    <div style="background: #1e293b; border: 1px solid #334155; border-radius: 6px; padding: 10px; font-family: monospace; font-size: 0.85rem; color: #cbd5e1; max-height: 200px; overflow-y: auto;">
  `;
  
  if (gameStateHistory.length === 0) {
    html += '<div style="color: #64748b; text-align: center;">No history available.</div>';
  } else {
    for (let i = gameStateHistory.length - 1; i >= 0; i--) {
      const snap = gameStateHistory[i];
      html += `<div style="padding: 4px 0; border-bottom: 1px solid rgba(51, 65, 85, 0.5);">[${snap.timestamp}] ${snap.label}</div>`;
    }
  }
  
  html += `</div>`;
  container.innerHTML = html;
}

window.openDMPanel = openDMPanel;
