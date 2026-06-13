import { playSound } from './audio.js';
import { getEnemyFaction, getFactionDisplayName, getTeamSlot } from '../rules/faction.js';

// UI callbacks - set during app initialization to avoid circular deps
const ui = {};
export function initUiCallbacks(callbacks) {
  Object.assign(ui, callbacks);
}

// ==========================================
//          游戏核心状态
// ==========================================

export const gameState = {
  turningPoint: 1,
  phase: 'Initiative',
  initiative: 'Space Marine',
  initiativeSlot: 0,     // slot that won initiative (0 or 1)
  activeTurn: 'Space Marine',
  activeTurnSlot: 0,     // slot whose turn it is (0 or 1)
  activeAgent: null,
  pendingActivation: null,  // 预选中的特工 (两步激活: 选择 → 确认)

  // Team Slot 抽象: 0 = 左方战队, 1 = 右方战队
  // smVp/smCp 语义变为 team 0, pmVp/pmCp 语义变为 team 1
  teamFactions: { 0: 'Space Marine', 1: 'Plague Marine' },

  smVp: 0,
  smCp: 2,
  pmVp: 0,
  pmCp: 2,

  smActivePloys: [],
  pmActivePloys: [],

  operatives: [],

  // 新增状态变量
  gameOver: false,
  customAvatars: {},
  smKillsScored: 0,
  pmKillsScored: 0,

  // 任务类型 (mission picker)
  missionType: 'seize_ground',

  // 规则版本 (lite/standard)
  rulesVersion: 'lite'
};

// ==========================================
//       战斗结算引导弹窗状态
// ==========================================

const defaultWizardState = {
  actionType: 'shoot',
  step: 1,
  attacker: null,
  defender: null,
  weapon: null,
  inRangeAndVisible: true,
  inCoverConcealed: false,
  inCover: false,

  mode: 'random',
  attackRolls: [],
  attackCrit: 0,
  attackNorm: 0,
  defenseRolls: [],
  defCrit: 0,
  defNorm: 0,

  attRerollIndex: -1,
  defRerollIndex: -1,
  stunApplied: false,
  shockTriggered: false,

  activeAttackerDice: [],
  activeDefenderDice: [],
  meleeTurn: 'attacker'
};

export let wizardState = { ...defaultWizardState };

export function resetWizardState(overrides = {}) {
  wizardState = { ...defaultWizardState, ...overrides };
}

// ==========================================
//          阵亡吐槽消息
// ==========================================

export const GAG_MESSAGES = [
  "医疗兵默默拿出了骨灰盒，叹气道：『这活我接不了，抬走，下一位！』",
  "他为了信仰流尽了最后一滴血，虽然倒下的姿势实在不够优雅。",
  "战锤世界可没有复活币，老铁一路走好！",
  "这大概就是传说中的『战术性白给』吧……",
  "棋子已变成战场地形/掩体的一部分（大雾）。",
  "纳垢大父叹了口气，表示可以多一碗上好的堆肥了。",
  "帝皇叹了口气，并从垃圾桶里捞了捞他的物理模型。"
];

// ==========================================
//          状态辅助函数
// ==========================================

// Accepts slot (0/1) or faction name; prefers slot for mirror-match safety
export function hasUsableOperatives(slotOrFaction) {
  const slot = typeof slotOrFaction === 'number' ? slotOrFaction : getTeamSlot(slotOrFaction);
  return gameState.operatives.some(op => op.teamSlot === slot && !op.isDead && !op.hasActed);
}

export function endTurningPoint() {
  playSound('click');

  // TP5 上限检测：达到第 5 回合后进入最终结算
  if (gameState.turningPoint >= 5) {
    ui.addLog(`\n========================================`);
    ui.addLog(`>>> 已达第 5 回合上限！进入最终胜负结算！`);
    ui.addLog(`========================================`);
    ui.showTurnEndScoringOverlay(true); // final=true → 不显示"继续下一 TP"
    return;
  }

  gameState.turningPoint += 1;
  gameState.phase = 'Initiative';

  // CP gains moved to startStrategyPhase (rules: gains happen at Strategy phase)

  // Reset active ploys
  gameState.smActivePloys = [];
  gameState.pmActivePloys = [];

  // Reset operatives
  gameState.operatives.forEach(op => {
    if (!op.isDead) {
      op.hasActed = false;
      op.apl = op.currentApl;  // Injured 时 APL -1
      op.actionsPerformed = [];
      op.hasCounteractedThisTP = false; // 每 TP 重置反击限制
    }
  });

  const nextBtn = document.getElementById('btn-next-phase');
  if (nextBtn) nextBtn.style.display = 'none';

  ui.addLog(`\n========================================`);
  ui.addLog(`>>> Turning Point ${gameState.turningPoint} 开始！`);
  ui.addLog(`========================================`);

  ui.startInitiativePhase();
}

// ---- 判断是否有可用于 Counteract 的特工 (已耗尽 + Engage 标记 + 本 TP 未反击过) ----
// Accepts slot (0/1) or faction name; prefers slot for mirror-match safety
export function hasCounteractOperatives(slotOrFaction) {
  const slot = typeof slotOrFaction === 'number' ? slotOrFaction : getTeamSlot(slotOrFaction);
  return gameState.operatives.some(op =>
    op.teamSlot === slot && !op.isDead && op.hasActed && !op.hasConceal && !op.hasCounteractedThisTP
  );
}

export function switchSides() {
  // Use slot-based tracking for mirror-match safety
  const currentSlot = gameState.activeTurnSlot;
  const nextSlot = 1 - currentSlot;
  const nextFaction = gameState.teamFactions[nextSlot];
  const currentFaction = gameState.teamFactions[currentSlot];
  const nextHasReady = hasUsableOperatives(nextSlot);
  const currentHasReady = hasUsableOperatives(currentSlot);

  if (nextHasReady) {
    // Normal alternation
    gameState.activeTurnSlot = nextSlot;
    gameState.activeTurn = nextFaction;
    ui.addLog(`>>> 交替轮转：轮到【${getFactionDisplayName(nextFaction)}】选择特工激活。`);
  } else if (currentHasReady) {
    // Next has no ready, current still has ready → next may counteract
    gameState.activeTurnSlot = nextSlot;
    gameState.activeTurn = nextFaction;
    if (hasCounteractOperatives(nextSlot)) {
      ui.addLog(`>>> 【${getFactionDisplayName(nextFaction)}】无可用特工，但可发动反击 (Counteract)！`);
      ui.showCounteractOverlay(nextSlot);
    } else {
      ui.addLog(`>>> 【${getFactionDisplayName(nextFaction)}】已无可用特工且无反击机会。轮到【${getFactionDisplayName(currentFaction)}】继续。`);
      // Turn passes back to current slot (who still has ready units)
      gameState.activeTurnSlot = currentSlot;
      gameState.activeTurn = currentFaction;
    }
  } else {
    // Neither side has ready operatives
    ui.addLog(`>>> 双方全部特工激活完毕。准备开始回合得分结算。`);
    ui.showTurnEndScoringOverlay();
  }
  ui.renderOperatives();
  ui.updateActivePanel();
}

// ---- 玩家跳过 Counteract ----
export function skipCounteract() {
  const passingSlot = gameState.activeTurnSlot;
  const opponentSlot = 1 - passingSlot;
  const passingFaction = gameState.teamFactions[passingSlot];
  const opponentFaction = gameState.teamFactions[opponentSlot];

  ui.addLog(`>>> 【${getFactionDisplayName(passingFaction)}】选择跳过反击。`);

  if (hasUsableOperatives(opponentSlot)) {
    // Opponent continues
    gameState.activeTurnSlot = opponentSlot;
    gameState.activeTurn = opponentFaction;
    ui.addLog(`>>> 轮到【${getFactionDisplayName(opponentFaction)}】继续激活。`);
  } else {
    // Opponent also has no ready → turn ends
    ui.addLog(`>>> 双方均已无法激活。回合得分结算开始。`);
    ui.showTurnEndScoringOverlay();
  }
  ui.renderOperatives();
  ui.updateActivePanel();
}

// ---- 开始 Counteract 激活 (选定特工后调用) ----
export function startCounteractActivation(opId) {
  const op = gameState.operatives.find(o => o.id === opId);
  if (!op) return;

  // Mark as temporarily "not acted" so it can be activated
  op.hasActed = false;
  op.apl = 1; // Counteract gives exactly 1AP
  op.counteracting = true; // Flag to enforce counteract restrictions
  op.hasCounteractedThisTP = true; // 本 TP 已反击，不可再次反击
  op.actionsPerformed = [];

  gameState.activeAgent = op;

  ui.addLog(`>>> 【${op.name}】发动反击！获得 1 AP（移动不超过 2"）。`);
  ui.hideCounteractOverlay();
  ui.renderOperatives();
  ui.updateActivePanel();
}
