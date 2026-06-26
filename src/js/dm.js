import { gameState } from './state.js';
import { renderOperatives, updateActivePanel, updateScoresUI, rollInitiativeOverlay, startStrategyPhase, hidePhaseOverlay } from './ui.js';

// ==========================================
//          State Snapshot Engine
// ==========================================

const MAX_HISTORY = 20;
export const gameStateHistory = [];

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
    
    console.log(`[DM System] Snapshot taken: ${label}`);
  } catch (e) {
    console.error('[DM System] Failed to take snapshot:', e);
  }
}

export function popStateSnapshot() {
  if (gameStateHistory.length === 0) {
    alert("No history available to undo.");
    return;
  }
  
  const lastSnapshot = gameStateHistory.pop();
  try {
    // Clear and mutate the existing object in place
    const keys = Object.keys(gameState);
    keys.forEach(k => delete gameState[k]);
    Object.assign(gameState, structuredClone(lastSnapshot.state));
    
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
  } catch (e) {
    console.error('[DM System] Failed to pop snapshot:', e);
  }
}

window.pushStateSnapshot = pushStateSnapshot;
window.popStateSnapshot = popStateSnapshot;

// ==========================================
//               DM UI System
// ==========================================

let activeTab = 'global';

export function initDMSystem() {
  const btn = document.createElement('button');
  btn.id = 'dm-floating-btn';
  btn.innerHTML = '⚙️ DM';
  btn.style.cssText = `
    position: fixed; bottom: 20px; right: 20px;
    background: linear-gradient(135deg, #7c3aed, #4c1d95);
    color: white; border: 2px solid #a78bfa; border-radius: 50%;
    width: 50px; height: 50px; font-size: 0.9rem; font-weight: bold;
    cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    z-index: 9999; display: flex; align-items: center; justify-content: center;
    transition: transform 0.2s;
  `;
  btn.onmouseover = () => btn.style.transform = 'scale(1.1)';
  btn.onmouseout = () => btn.style.transform = 'scale(1)';
  btn.onclick = openDMPanel;
  document.body.appendChild(btn);
  
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
  `;
  document.head.appendChild(style);
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
  
  let html = '';
  gameState.operatives.forEach((op, idx) => {
    const isDead = op.isDead ? '<span style="color:#ef4444;">[阵亡]</span>' : '';
    html += `
      <div class="dm-op-card" id="dm-op-card-${idx}">
        <div class="dm-op-header" onclick="document.getElementById('dm-op-card-${idx}').classList.toggle('expanded')">
          <span>${op.name} ${isDead}</span>
          <span style="color:#64748b;">HP: ${op.wounds}/${op.maxWounds} ▼</span>
        </div>
        <div class="dm-op-body">
          <div class="dm-row">
            <span>生命值 (Wounds)</span>
            <input type="number" class="dm-input" id="dm-op-hp-${idx}" value="${op.wounds}">
          </div>
          <div class="dm-row">
            <span>行动力 (APL)</span>
            <input type="number" class="dm-input" id="dm-op-apl-${idx}" value="${op.apl}">
          </div>
          <div class="dm-row">
            <span>接战状态 (Order)</span>
            <select class="dm-select" id="dm-op-order-${idx}">
              <option value="engage" ${!op.hasConceal?'selected':''}>交战 (Engage)</option>
              <option value="conceal" ${op.hasConceal?'selected':''}>隐蔽 (Conceal)</option>
            </select>
          </div>
          <div class="dm-row">
            <span>存活状态</span>
            <select class="dm-select" id="dm-op-dead-${idx}">
              <option value="false" ${!op.isDead?'selected':''}>存活 (Alive)</option>
              <option value="true" ${op.isDead?'selected':''}>阵亡 (Dead)</option>
            </select>
          </div>
          <button class="dm-tab-btn" style="background:#10b981; color:white; width: 100%; margin-top:5px;" onclick="window.applyDMOperative(${idx})">保存特工数据</button>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

window.applyDMOperative = function(idx) {
  const op = gameState.operatives[idx];
  if (!op) return;
  pushStateSnapshot(`DM Edit: Operative (${op.name})`);
  
  op.wounds = parseInt(document.getElementById(`dm-op-hp-${idx}`).value, 10);
  op.apl = parseInt(document.getElementById(`dm-op-apl-${idx}`).value, 10);
  op.hasConceal = document.getElementById(`dm-op-order-${idx}`).value === 'conceal';
  op.isDead = document.getElementById(`dm-op-dead-${idx}`).value === 'true';
  
  if (op.wounds <= 0) op.isDead = true;
  
  if (typeof renderOperatives === 'function') renderOperatives();
  alert(`${op.name} updated!`);
  renderDMTabContent();
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
