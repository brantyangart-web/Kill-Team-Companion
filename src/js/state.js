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

  // CP gains at start of TP
  gameState.smCp += 1;
  gameState.pmCp += 1;

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
  ui.addLog(`>>> 双方各获得 1 CP。`);
  ui.addLog(`========================================`);

  ui.startInitiativePhase();
}

export function switchSides() {
  const nextFaction = gameState.activeTurn === 'Space Marine' ? 'Plague Marine' : 'Space Marine';
  const nextHasUsable = hasUsableOperatives(nextFaction);
  const currentHasUsable = hasUsableOperatives(gameState.activeTurn);

  if (nextHasUsable) {
    gameState.activeTurn = nextFaction;
    ui.addLog(`>>> 交替轮转：轮到【${nextFaction === 'Space Marine' ? '死亡天使' : '瘟疫守卫'}】选择特工激活。`);
  } else if (currentHasUsable) {
    ui.addLog(`>>> 【${nextFaction === 'Space Marine' ? '死亡天使' : '瘟疫守卫'}】已无可用特工。继续激活【${gameState.activeTurn === 'Space Marine' ? '死亡天使' : '瘟疫守卫'}】。`);
  } else {
    ui.addLog(`>>> 双方全部特工激活完毕。准备开始回合得分结算。`);
    ui.showTurnEndScoringOverlay();
  }
  ui.renderOperatives();
  ui.updateActivePanel();
}
