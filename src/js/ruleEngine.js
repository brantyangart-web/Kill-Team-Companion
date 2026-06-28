import { playSound } from './audio.js';
import { rollD6 } from './models.js';

export function resolveRuleQueue(rules, onComplete) {
  if (!rules || rules.length === 0) {
    if (onComplete) onComplete();
    return;
  }

  const currentRule = rules.shift();
  showGenericRuleModal(currentRule, () => {
    // recursively resolve the rest of the queue
    resolveRuleQueue(rules, onComplete);
  });
}

export function showGenericRuleModal(ruleConfig, onComplete) {
  playSound('click');
  let overlay = document.getElementById('generic-rule-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'generic-rule-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:99999;display:flex;justify-content:center;align-items:center;backdrop-filter:blur(5px);';
    document.body.appendChild(overlay);
  }

  const requiresDice = !!ruleConfig.requiresDice;
  const diceCount = ruleConfig.diceCount || 0;
  
  overlay.innerHTML = `
    <div style="background:var(--bg-dark); border:1px solid #7ab88a; border-radius:12px; padding:20px; text-align:center; max-width:90%; width:450px; box-shadow:0 0 30px rgba(0,0,0,0.8); overflow:hidden;">
      <h3 style="color:var(--imperial-gold-bright); margin-top:0; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px;">${ruleConfig.title || '特殊规则结算'}</h3>
      <div style="margin:20px 0; padding:15px; background:rgba(255,255,255,0.05); border-radius:8px; border-left:4px solid var(--sm-accent); text-align:left; color:#e2e8f0; font-size:0.95rem; line-height:1.5;">
        ${ruleConfig.description || ''}
      </div>
      
      <div id="rule-dice-container" style="margin:20px 0; min-height:${requiresDice ? '80px' : '0'}; display:flex; justify-content:center; align-items:center; gap:10px; flex-wrap:wrap;"></div>
      
      <button id="rule-roll-btn" class="modal-btn" style="display:${requiresDice ? 'block' : 'none'}; background:linear-gradient(135deg, #7ab88a, #4a8c5e); width:100%; padding:12px; font-size:1.1em; cursor:pointer; margin-bottom:12px;">投掷 ${diceCount} 个判定骰</button>
      <button id="rule-continue-btn" class="modal-btn" style="display:${requiresDice ? 'none' : 'block'}; width:100%; padding:12px; font-size:1.1em; cursor:pointer;">确认 (Acknowledge)</button>
    </div>
  `;
  overlay.style.display = 'flex';

  const rollBtn = document.getElementById('rule-roll-btn');
  const continueBtn = document.getElementById('rule-continue-btn');
  const diceContainer = document.getElementById('rule-dice-container');

  rollBtn.onclick = () => {
    playSound('roll');
    rollBtn.style.display = 'none';
    
    let rollingHtml = '';
    for(let i=0; i<diceCount; i++) {
      rollingHtml += `<div class="kt-dice-cube rolling sm-dice">?</div>`;
    }
    diceContainer.innerHTML = rollingHtml;
    
    setTimeout(() => {
      let finalHtml = '';
      let rolls = [];
      let successes = 0;

      for (let i = 0; i < diceCount; i++) {
        const roll = rollD6();
        rolls.push(roll);
        
        let success = false;
        if (ruleConfig.diceThreshold) {
           success = roll >= ruleConfig.diceThreshold;
        } else if (ruleConfig.diceIsUnder) { // Like 'Hot' wants < TS
           success = roll < ruleConfig.diceIsUnder;
        }
        if (success) successes++;
        
        const dieClass = success ? 'success-dice' : (ruleConfig.diceThreshold || ruleConfig.diceIsUnder ? 'fail-dice' : '');
        finalHtml += `
          <div class="kt-dice-cube sm-dice ${dieClass}" style="transform: scale(1.1);">
            ${roll}
          </div>
        `;
      }
      
      diceContainer.innerHTML = finalHtml;
      
      if (ruleConfig.onDiceRolled) {
        ruleConfig.onDiceRolled(rolls, successes);
      }

      continueBtn.style.display = 'block';
    }, 600);
  };

  continueBtn.onclick = () => {
    overlay.style.display = 'none';
    if (ruleConfig.onResolve && !requiresDice) {
      ruleConfig.onResolve();
    }
    if (onComplete) onComplete();
  };
}
