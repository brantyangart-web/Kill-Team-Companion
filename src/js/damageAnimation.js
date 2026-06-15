import { showDamageAnimation as originalShow } from './damageAnimation.js';

export function showDamageAnimation(imageUrl, maxWounds, currentWounds, damageAmount, themeVar = '--red', drReduced = 0) {
  const container = document.getElementById('damage-animation-container');
  if (!container) return;

  container.innerHTML = '';

  const finalWounds = Math.max(0, currentWounds - damageAmount);
  const startPercent = Math.max(0, Math.min(100, (currentWounds / maxWounds) * 100));
  const endPercent = Math.max(0, Math.min(100, (finalWounds / maxWounds) * 100));

  const wrapper = document.createElement('div');
  wrapper.className = 'damage-anim-wrapper';

  const avatar = document.createElement('img');
  avatar.className = 'damage-anim-avatar';
  avatar.src = imageUrl;

  const barContainer = document.createElement('div');
  barContainer.className = 'damage-anim-bar-container';

  const barFill = document.createElement('div');
  barFill.className = 'damage-anim-bar-fill';
  barFill.style.width = `${startPercent}%`;
  barFill.style.backgroundColor = `var(--red, #e11d48)`;

  const textLabel = document.createElement('div');
  textLabel.className = 'damage-anim-text';
  textLabel.innerHTML = `<span style="color:var(--red)">-${damageAmount}</span>`;

  barContainer.appendChild(barFill);
  wrapper.appendChild(avatar);
  wrapper.appendChild(barContainer);
  wrapper.appendChild(textLabel);
  
  if (drReduced > 0) {
    const drLabel = document.createElement('div');
    drLabel.className = 'damage-anim-dr-text';
    drLabel.style.position = 'absolute';
    drLabel.style.top = '10px';
    drLabel.style.right = '-20px';
    drLabel.style.color = '#4ade80';
    drLabel.style.fontWeight = 'bold';
    drLabel.style.fontSize = '1.2rem';
    drLabel.style.textShadow = '0 0 5px rgba(0,255,0,0.5)';
    drLabel.style.opacity = '0';
    drLabel.style.transform = 'translateY(10px)';
    drLabel.style.transition = 'all 0.4s ease-out';
    drLabel.innerHTML = `恶心无视 -${drReduced}`;
    wrapper.appendChild(drLabel);
    
    // Animate DR text
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        drLabel.style.opacity = '1';
        drLabel.style.transform = 'translateY(-20px)';
      });
    });
  }

  container.appendChild(wrapper);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      barFill.style.width = `${endPercent}%`;
      wrapper.classList.add('glitch-shake');
    });
  });

  setTimeout(() => {
    wrapper.classList.add('fade-out');
    setTimeout(() => {
      if (container.contains(wrapper)) {
        container.removeChild(wrapper);
      }
    }, 400);
  }, 1800);
}
