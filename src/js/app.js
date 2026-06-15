// ==========================================
//   Kill Team Companion - Main Entry Point
// ==========================================

import '../styles/main.css';

import { gameState, wizardState, initUiCallbacks, hasUsableOperatives, GAG_MESSAGES } from './state.js';
import { audioCtx, playSound } from './audio.js';
import { Weapon, Operative, initModelCallbacks } from './models.js';
import { SM_TEMPLATES, PM_TEMPLATES, LEG_TEMPLATES, RULE_TEXTS } from './constants.js';
import { injectTemplates } from '../rules/faction.js';

import {
  addLog, updateScoresUI, adjustScore, confirmReset, updateGuidance,
  getAvatarHtml, renderRosterPickers, toggleSelect, handleFactionChange,
  incrementWarrior, decrementWarrior,
  updateSelectionCounts, validateRostersAndDeploy, renderOperatives,
  updateMissionDesc, updateRulesVersion,
  selectOperative, confirmActivation, cancelSelection,
  activateOperative, updateActivePanel, performMove, performCharge, performAdvance, performDash, performFallBack, toggleConceal,
  endActivation, startInitiativePhase, showPhaseOverlay, hidePhaseOverlay, hideCounteractOverlay,
  showCounteractOverlay, selectCounteractOperative, skipCounteractAction,
  rollInitiativeOverlay, selectTurnOrder, confirmTurnOrder, startStrategyPhase, buyStrategyPloy, selectDoctrine,
  proceedToFirefight, showRuleHelp, closeHelpModal,
  triggerOperativeDeathOverlay, confirmOperativeDeath, checkVictory, declareVictory,
  showTurnEndScoringOverlay, renderTurnEndScoringContent, toggleScoringChecklist,
  adjustScoreTemp, confirmTurnEndScoring, declareScoreVictory,
  triggerAvatarUpload, handleAvatarFileSelect,
  triggerCombatVisual, triggerAvatarHitEffect, getOperativeAvatarUrl,
  rollDicePool, evaluateAttackRolls, evaluateDefenseRolls,
  showToast, trapFocus, releaseFocusTrap,
  initCombatCallbacks, queueVisualEvent
} from './ui.js';

import { skipCounteract } from './state.js';
import './damageAnimation.js';

import {
  openModal, closeModal, nextModalStep,
  openShootWizard, renderShootStep, selectShootDefender, selectShootWeapon,
  setQA, rollAttackDice, renderAttackDiceView, rerollSingleAttackDice,
  recalculateAttackStats, rollDefenseDice, renderDefenseDiceView, rerollSingleDefenseDice,
  recalculateDefenseStats, parseManualAttack, parseManualDefense, confirmShootResult,
  openFightWizard, selectFightDefender, selectFightWeapon, renderFightStep,
  rollMeleeDice, rerollMeleeDice, renderMeleeRollsView,
  getDuelAvatarHtml, getMeleeDuelHeaderHtml, getShootDuelHeaderHtml,
  chooseMeleeDice, resolveMeleeChoice, cancelMeleeChoice, confirmFightResult,
  resolveSecondaries, selectDefFightWeapon,
  initCombatUiCallbacks, initCombatAccessibility
} from './combat.js';

// ==========================================
//   Wire up cross-module callbacks
// ==========================================

// State module needs UI functions
initUiCallbacks({
  addLog,
  updateScoresUI,
  renderOperatives,
  updateActivePanel,
  startInitiativePhase,
  showTurnEndScoringOverlay,
  showCounteractOverlay,
  hidePhaseOverlay,
  hideCounteractOverlay,
});

// Models module needs UI functions
initModelCallbacks({
  addLog,
  triggerOperativeDeathOverlay,
  queueVisualEvent,
  getOperativeAvatarUrl,
});

// UI module needs Combat functions
initCombatCallbacks({
  openShootWizard,
  openFightWizard,
  renderShootStep,
  renderFightStep,
  closeModal,
});

// Combat module needs UI functions
initCombatUiCallbacks({
  addLog,
  renderOperatives,
  updateActivePanel,
  updateScoresUI,
  triggerAvatarHitEffect,
  triggerCombatVisual,
  getOperativeAvatarUrl,
});

// Combat module needs toast/focus-trap for validation prompts
initCombatAccessibility({
  showToast,
  trapFocus,
  releaseFocusTrap,
});

// ==========================================
//   Expose to window for HTML onclick handlers
// ==========================================

// Score & Dashboard
window.adjustScore = adjustScore;
window.confirmReset = confirmReset;

// Roster Selection
window.toggleSelect = toggleSelect;
window.handleFactionChange = handleFactionChange;
window.incrementWarrior = incrementWarrior;
window.decrementWarrior = decrementWarrior;
window.validateRostersAndDeploy = validateRostersAndDeploy;
window.updateMissionDesc = updateMissionDesc;
window.updateRulesVersion = updateRulesVersion;

// Avatar Upload
window.triggerAvatarUpload = triggerAvatarUpload;
window.handleAvatarFileSelect = handleAvatarFileSelect;

// Active Panel Actions
window.selectOperative = selectOperative;
window.confirmActivation = confirmActivation;
window.cancelSelection = cancelSelection;
window.activateOperative = activateOperative;
window.toggleConceal = toggleConceal;
window.performMove = performMove;
window.performCharge = performCharge;
window.performAdvance = performAdvance;
window.performDash = performDash;
window.performFallBack = performFallBack;
window.openShootWizard = openShootWizard;
window.openFightWizard = openFightWizard;
window.endActivation = endActivation;

// Help Modal
window.showRuleHelp = showRuleHelp;
window.closeHelpModal = closeHelpModal;

// Combat Modal
window.closeModal = closeModal;
window.nextModalStep = nextModalStep;
window.selectShootDefender = selectShootDefender;
window.selectShootWeapon = selectShootWeapon;
window.setQA = setQA;
window.rollAttackDice = rollAttackDice;
window.rollDefenseDice = rollDefenseDice;
window.selectFightDefender = selectFightDefender;
window.selectFightWeapon = selectFightWeapon;
window.selectDefFightWeapon = selectDefFightWeapon;
window.resolveSecondaries = resolveSecondaries;
window.rollMeleeDice = rollMeleeDice;
window.rerollMeleeDice = rerollMeleeDice;
window.chooseMeleeDice = chooseMeleeDice;
window.resolveMeleeChoice = resolveMeleeChoice;
window.cancelMeleeChoice = cancelMeleeChoice;

// Phase Flow
window.rollInitiativeOverlay = rollInitiativeOverlay;
window.selectTurnOrder = selectTurnOrder;
window.confirmTurnOrder = confirmTurnOrder;
window.buyStrategyPloy = buyStrategyPloy;
window.selectDoctrine = selectDoctrine;
window.proceedToFirefight = proceedToFirefight;

// Counteract
window.showCounteractOverlay = showCounteractOverlay;
window.selectCounteractOperative = selectCounteractOperative;
window.skipCounteract = skipCounteract;
window.skipCounteractAction = skipCounteractAction;

// Death & Victory
window.confirmOperativeDeath = confirmOperativeDeath;
window.declareScoreVictory = declareScoreVictory;

// Turn Scoring
window.toggleScoringChecklist = toggleScoringChecklist;
window.adjustScoreTemp = adjustScoreTemp;
window.confirmTurnEndScoring = confirmTurnEndScoring;

// ==========================================
//   Initialize app on DOM ready
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // 注入各方阵营模板数据（避免循环依赖）
  injectTemplates('Space Marine', SM_TEMPLATES);
  injectTemplates('Plague Marine', PM_TEMPLATES);
  injectTemplates('Legionary', LEG_TEMPLATES);

  renderRosterPickers();
  updateRulesVersion(); // 初始化规则版本（默认 lite，隐藏 Advance）
});

// ==========================================
//          Global Roll Mode Toggle
// ==========================================
window.toggleRollMode = function() {
  playSound('click');
  gameState.globalRollMode = gameState.globalRollMode === 'random' ? 'manual' : 'random';
  
  const btn = document.getElementById('btn-toggle-rollmode');
  if (btn) {
    if (gameState.globalRollMode === 'random') {
      btn.textContent = '当前: 自动投骰';
      btn.classList.remove('selected');
    } else {
      btn.textContent = '当前: 物理投骰';
      btn.classList.add('selected');
    }
  }
  
  // If combat wizard is open, sync the state and re-render
  if (wizardState && wizardState.step > 0) {
    wizardState.mode = gameState.globalRollMode;
    if (wizardState.actionType === 'shoot') {
      import('./combat.js').then(module => module.renderShootStep());
    } else if (wizardState.actionType === 'fight') {
      import('./combat.js').then(module => module.renderFightStep());
    }
  }
  
  showToast(`已切换为 ${gameState.globalRollMode === 'random' ? '自动' : '物理'} 投骰模式`, 'info');
};
