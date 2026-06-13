import { playSound } from './audio.js';

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
  activeTurn: 'Space Marine',
  activeAgent: null,
  pendingActivation: null,  // 预选中的特工 (两步激活: 选择 → 确认)

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
  pmKillsScored: 0
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

export function hasUsableOperatives(faction) {
  return gameState.operatives.some(op => op.faction === faction && !op.isDead && !op.hasActed);
}

export function endTurningPoint() {
  playSound('click');
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
    }
  });

  const nextBtn = document.getElementById('btn-next-phase');
  if (nextBtn) nextBtn.style.display = 'none';

  ui.addLog(`\n========================================`);
  ui.addLog(`>>> Turning Point ${gameState.turningPoint} 开始！`);
  ui.addLog(`========================================`);

  ui.startInitiativePhase();
}

// ---- 判断是否有可用于 Counteract 的特工 (已耗尽 + Engage 标记, 即 hasConceal=false) ----
export function hasCounteractOperatives(faction) {
  return gameState.operatives.some(op =>
    op.faction === faction && !op.isDead && op.hasActed && !op.hasConceal
  );
}

export function switchSides() {
  const nextFaction = gameState.activeTurn === 'Space Marine' ? 'Plague Marine' : 'Space Marine';
  const nextHasReady = hasUsableOperatives(nextFaction);
  const currentHasReady = hasUsableOperatives(gameState.activeTurn);
  const factionName = f => f === 'Space Marine' ? '死亡天使' : '瘟疫守卫';

  if (nextHasReady) {
    // Normal alternation
    gameState.activeTurn = nextFaction;
    ui.addLog(`>>> 交替轮转：轮到【${factionName(nextFaction)}】选择特工激活。`);
  } else if (currentHasReady) {
    // Next has no ready, current still has ready → next may counteract
    gameState.activeTurn = nextFaction;
    if (hasCounteractOperatives(nextFaction)) {
      ui.addLog(`>>> 【${factionName(nextFaction)}】无可用特工，但可发动反击 (Counteract)！`);
      ui.showCounteractOverlay(nextFaction);
    } else {
      ui.addLog(`>>> 【${factionName(nextFaction)}】已无可用特工且无法反击。轮到【${factionName(gameState.activeTurn === nextFaction ? gameState.activeTurn : nextFaction)}】继续。`);
      // Turn passes to opponent (who still has ready units)
      gameState.activeTurn = nextFaction === 'Space Marine' ? 'Plague Marine' : 'Space Marine';
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
  const passingFaction = gameState.activeTurn;
  const opponentFaction = passingFaction === 'Space Marine' ? 'Plague Marine' : 'Space Marine';
  const factionName = f => f === 'Space Marine' ? '死亡天使' : '瘟疫守卫';

  ui.addLog(`>>> 【${factionName(passingFaction)}】选择跳过反击。`);

  if (hasUsableOperatives(opponentFaction)) {
    // Opponent continues
    gameState.activeTurn = opponentFaction;
    ui.addLog(`>>> 轮到【${factionName(opponentFaction)}】继续激活。`);
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
  op.actionsPerformed = [];

  gameState.activeAgent = op;

  ui.addLog(`>>> 【${op.name}】发动反击！获得 1 AP（移动不超过 2"）。`);
  ui.hideCounteractOverlay();
  ui.renderOperatives();
  ui.updateActivePanel();
}
