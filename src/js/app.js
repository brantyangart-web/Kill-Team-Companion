// ==========================================
//   Kill Team Companion - Main Entry Point
// ==========================================

import '../styles/main.css';

import { gameState, wizardState, initUiCallbacks, hasUsableOperatives, GAG_MESSAGES } from './state.js';
import { audioCtx, playSound } from './audio.js';
import { Weapon, Operative, initModelCallbacks } from './models.js';
import { SM_TEMPLATES, PM_TEMPLATES, RULE_TEXTS } from './constants.js';

import {
  addLog, updateScoresUI, adjustScore, confirmReset, updateGuidance,
  getAvatarHtml, renderRosterPickers, toggleSelectSM, toggleSelectPM,
  updateSelectionCounts, validateRostersAndDeploy, renderOperatives,
  activateOperative, updateActivePanel, performMove, performCharge,
  endActivation, startInitiativePhase, showPhaseOverlay, hidePhaseOverlay,
  rollInitiativeOverlay, selectTurnOrder, startStrategyPhase, buyPloy,
  proceedToFirefight, showRuleHelp, closeHelpModal,
  triggerOperativeDeathOverlay, confirmOperativeDeath, checkVictory, declareVictory,
  showTurnEndScoringOverlay, renderTurnEndScoringContent, toggleScoringChecklist,
  adjustScoreTemp, confirmTurnEndScoring, declareScoreVictory,
  triggerAvatarUpload, handleAvatarFileSelect,
  triggerCombatVisual, triggerAvatarHitEffect,
  rollDicePool, evaluateAttackRolls, evaluateDefenseRolls,
  initCombatCallbacks
} from './ui.js';

import {
  openModal, closeModal, nextModalStep,
  openShootWizard, renderShootStep, selectShootDefender, selectShootWeapon,
  setQA, setRollMode, rollAttackDice, renderAttackDiceView, rerollSingleAttackDice,
  recalculateAttackStats, rollDefenseDice, renderDefenseDiceView, rerollSingleDefenseDice,
  recalculateDefenseStats, parseManualAttack, parseManualDefense, confirmShootResult,
  openFightWizard, selectFightDefender, selectFightWeapon, renderFightStep,
  rollMeleeDice, renderMeleeRollsView,
  getDuelAvatarHtml, getMeleeDuelHeaderHtml, getShootDuelHeaderHtml,
  chooseMeleeDice, resolveMeleeChoice, cancelMeleeChoice, confirmFightResult,
  initCombatUiCallbacks
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
  hidePhaseOverlay,
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

// ==========================================
//   Expose to window for HTML onclick handlers
// ==========================================

// Score & Dashboard
window.adjustScore = adjustScore;
window.confirmReset = confirmReset;

// Roster Selection
window.toggleSelectSM = toggleSelectSM;
window.toggleSelectPM = toggleSelectPM;
window.validateRostersAndDeploy = validateRostersAndDeploy;

// Avatar Upload
window.triggerAvatarUpload = triggerAvatarUpload;
window.handleAvatarFileSelect = handleAvatarFileSelect;

// Active Panel Actions
window.activateOperative = activateOperative;
window.performMove = performMove;
window.performCharge = performCharge;
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
window.chooseMeleeDice = chooseMeleeDice;
window.resolveMeleeChoice = resolveMeleeChoice;
window.cancelMeleeChoice = cancelMeleeChoice;

// Phase Flow
window.rollInitiativeOverlay = rollInitiativeOverlay;
window.selectTurnOrder = selectTurnOrder;
window.buyPloy = buyPloy;
window.proceedToFirefight = proceedToFirefight;

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
  renderRosterPickers();
});
