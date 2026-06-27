// src/js/effects.js
import { gameState } from './state.js';
import { getAssetPath } from './paths.js';
import { playSound } from './audio.js';

// CSS preference for reduced motion
export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/**
 * Triggers a massive text floating on screen with a screen shake.
 */
export function playTextEffect(text, type = 'normal') {
  if (!prefersReducedMotion.matches) {
    // Try to shake the modal content if it's open, else the main app container
    const modalContent = document.querySelector('#combat-modal .modal-content');
    const isModalVisible = modalContent && modalContent.closest('#combat-modal').style.display !== 'none';
    const target = isModalVisible ? modalContent : (document.querySelector('.app-container') || document.body);
    
    target.classList.remove('intense-shake');
    void target.offsetWidth; 
    target.classList.add('intense-shake');
    setTimeout(() => {
      target.classList.remove('intense-shake');
    }, 400);
  }

  if (!text) return;

  const el = document.createElement('div');
  el.className = 'impact-effect-text';
  el.textContent = text;
  el.style.zIndex = '999999'; // Ensure it's on top of everything

  if (type === 'strike') {
    el.style.color = 'var(--red)';
    el.style.textShadow = '0 0 20px rgba(225, 29, 72, 0.85), 0 0 40px #000';
  } else if (type === 'parry') {
    el.style.color = '#38bdf8';
    el.style.textShadow = '0 0 20px rgba(56, 189, 248, 0.85), 0 0 40px #000';
  } else if (type === 'shoot') {
    el.style.color = 'var(--red)'; // Fixed to red instead of Space Marine blue
    el.style.textShadow = '0 0 20px rgba(225, 29, 72, 0.85), 0 0 40px #000';
  } else if (type === 'deflect') {
    el.style.color = '#7ab88a';
    el.style.textShadow = '0 0 20px rgba(163, 230, 53, 0.85), 0 0 40px #000';
  } else if (type === 'poison') {
    el.style.color = '#22c55e';
    el.style.textShadow = '0 0 20px rgba(34, 197, 94, 0.85), 0 0 40px #000';
  }

  document.body.appendChild(el);
  setTimeout(() => {
    el.remove();
  }, 1800);
}

/**
 * Applies a massive, independent visual hit effect (anime cut-in style).
 */
export function playHitEffect(opId, actionType) {
  // Find operative to get their avatar URL
  const op = gameState.operatives.find(o => o.id === opId);
  if (!op) {
    console.warn(`[Effects Engine] Cannot find operative ${opId} for cut-in.`);
    return;
  }

  const getOpAvatarUrl = (op) => {
    if (gameState.customAvatars && gameState.customAvatars[op.id]) return gameState.customAvatars[op.id];
    if (op.defaultAvatar) {
      return getAssetPath(op.defaultAvatar);
    }
    const cssSuffix = op.faction === 'space_marines' ? 'sm' : (op.faction === 'plague_marines' ? 'pm' : 'leg');
    const idSuffix = op.id.replace(/^(sm_|pm_|leg_)/, '');
    const path = `assets/images/operatives/${cssSuffix}/${cssSuffix}_${idSuffix}.jpg`;
    return getAssetPath(path);
  };
  
  const imgUrl = getOpAvatarUrl(op);

  // 1. Create a massive central wrapper to maintain physical centering
  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.top = '50%';
  wrapper.style.left = '50%';
  wrapper.style.transform = 'translate(-50%, -50%)'; // Handles centering safely
  wrapper.style.zIndex = '999998'; // Just below floating text
  wrapper.style.pointerEvents = 'none';

  // 2. The cut-in layer receives scale transitions and the hit flash animation
  const cutinLayer = document.createElement('div');
  cutinLayer.style.width = '240px';
  cutinLayer.style.height = '240px';
  cutinLayer.style.borderRadius = '50%';
  
  let shadowColor = 'rgba(239, 68, 68, 0.7)';
  if (actionType === 'parry' || actionType === 'deflect') {
    shadowColor = 'rgba(56, 189, 248, 0.7)';
  } else if (actionType === 'poison') {
    shadowColor = 'rgba(34, 197, 94, 0.7)';
  }
  cutinLayer.style.boxShadow = `0 0 40px ${shadowColor}, 0 0 100px rgba(0,0,0,0.9)`;
  cutinLayer.style.opacity = '0';
  cutinLayer.style.transform = 'scale(0.8)';
  cutinLayer.style.transition = 'opacity 0.1s ease, transform 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  // Hide overflow so bullet hole doesn't spill out of the circle
  cutinLayer.style.overflow = 'hidden';
  
  // The avatar image
  const img = document.createElement('img');
  img.src = imgUrl;
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'cover';
  img.style.borderRadius = '50%';
  cutinLayer.appendChild(img);

  // The hit mark
  const hitMark = document.createElement('div');
  // Use existing css classes: bullet-hole-effect or slash-effect
  hitMark.className = (actionType === 'shoot' || actionType === 'poison') ? 'bullet-hole-effect' : 'slash-effect';
  hitMark.style.zIndex = '10';
  cutinLayer.appendChild(hitMark);

  wrapper.appendChild(cutinLayer);
  document.body.appendChild(wrapper);

  // Animate in and flash
  requestAnimationFrame(() => {
    cutinLayer.style.opacity = '1';
    cutinLayer.style.transform = 'scale(1)';
    // Reuse the existing flash/shake CSS animation
    // Since wrapper handles translation, the scale/rotate inside the keyframes won't break the centering!
    cutinLayer.classList.add('avatar-hit-flash'); 
  });

  // Animate out and remove
  setTimeout(() => {
    cutinLayer.style.opacity = '0';
    cutinLayer.style.transform = 'scale(1.2)';
    setTimeout(() => wrapper.remove(), 200);
  }, 900);
}

/**
 * Wraps sound, hit effect, and floating text into a single cohesive visual event.
 */
export function playFullCombatEffect(opId, actionType, text, textType = 'normal') {
  if (typeof playSound === 'function') {
    let sound = 'heavy_strike';
    if (actionType === 'shoot') sound = 'shoot';
    if (actionType === 'parry' || actionType === 'deflect') sound = 'metal_clash';
    if (actionType === 'poison') sound = 'poison_damage';
    playSound(sound);
  }
  
  playHitEffect(opId, actionType);
  
  if (text) {
    playTextEffect(text, textType);
  }
}
