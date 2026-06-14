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
  rollInitiativeOverlay, selectTurnOrder, confirmTurnOrder, startStrategyPhase, buyPloy,
  proceedToFirefight, showRuleHelp, closeHelpModal,
  triggerOperativeDeathOverlay, confirmOperativeDeath, checkVictory, declareVictory,
  showTurnEndScoringOverlay, renderTurnEndScoringContent, toggleScoringChecklist,
  adjustScoreTemp, confirmTurnEndScoring, declareScoreVictory,
  triggerAvatarUpload, handleAvatarFileSelect,
  triggerCombatVisual, triggerAvatarHitEffect,
  rollDicePool, evaluateAttackRolls, evaluateDefenseRolls,
  showToast, trapFocus, releaseFocusTrap,
  initCombatCallbacks
} from './ui.js';

import { skipCounteract } from './state.js';

import {
  openModal, closeModal, nextModalStep,
  openShootWizard, renderShootStep, selectShootDefender, selectShootWeapon,
  setQA, setRollMode, rollAttackDice, renderAttackDiceView, rerollSingleAttackDice,
  recalculateAttackStats, rollDefenseDice, renderDefenseDiceView, rerollSingleDefenseDice,
  recalculateDefenseStats, parseManualAttack, parseManualDefense, confirmShootResult,
  openFightWizard, selectFightDefender, selectFightWeapon, renderFightStep,
  rollMeleeDice, rerollMeleeDice, renderMeleeRollsView,
  getDuelAvatarHtml, getMeleeDuelHeaderHtml, getShootDuelHeaderHtml,
  chooseMeleeDice, resolveMeleeChoice, cancelMeleeChoice, confirmFightResult,
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
window.setRollMode = setRollMode;
window.rollAttackDice = rollAttackDice;
window.rollDefenseDice = rollDefenseDice;
window.selectFightDefender = selectFightDefender;
window.selectFightWeapon = selectFightWeapon;
window.rollMeleeDice = rollMeleeDice;
window.rerollMeleeDice = rerollMeleeDice;
window.chooseMeleeDice = chooseMeleeDice;
window.resolveMeleeChoice = resolveMeleeChoice;
window.cancelMeleeChoice = cancelMeleeChoice;

// Phase Flow
window.rollInitiativeOverlay = rollInitiativeOverlay;
window.selectTurnOrder = selectTurnOrder;
window.confirmTurnOrder = confirmTurnOrder;
window.buyPloy = buyPloy;
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
