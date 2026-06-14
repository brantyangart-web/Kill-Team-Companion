export function showDamageAnimation(imageUrl, maxWounds, currentWounds, damageAmount, themeVar = '--red') {
  const container = document.getElementById('damage-animation-container');
  if (!container) return;

  // Ensure any previous animation is cleared
  container.innerHTML = '';

  const finalWounds = Math.max(0, currentWounds - damageAmount);
  const startPercent = Math.max(0, Math.min(100, (currentWounds / maxWounds) * 100));
  const endPercent = Math.max(0, Math.min(100, (finalWounds / maxWounds) * 100));

  // Construct DOM
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
  container.appendChild(wrapper);

  // Trigger animation after a brief delay so initial layout calculates
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      barFill.style.width = `${endPercent}%`;
      wrapper.classList.add('glitch-shake');
    });
  });

  // Cleanup
  setTimeout(() => {
    wrapper.classList.add('fade-out');
    setTimeout(() => {
      if (container.contains(wrapper)) {
        container.removeChild(wrapper);
      }
    }, 400); // Wait for fade-out
  }, 1800); // Display duration
}
