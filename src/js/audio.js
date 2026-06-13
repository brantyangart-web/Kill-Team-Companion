const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

export { audioCtx };

export function playSound(type) {
  try {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'click') {
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);
      osc.start(); osc.stop(audioCtx.currentTime + 0.08);
    } else if (type === 'shoot') {
      // 激情枪战：连续播放 3 声冲锋枪连射音效
      const now = audioCtx.currentTime;
      const bursts = [0, 0.08, 0.16];
      bursts.forEach(delay => {
        const bufferSize = audioCtx.sampleRate * 0.08;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) { data[i] = Math.random() * 2 - 1; }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass'; filter.frequency.value = 1000;
        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.12, now + delay);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.08);
        noise.connect(filter); filter.connect(noiseGain); noiseGain.connect(audioCtx.destination);
        noise.start(now + delay);

        const oscNode = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscNode.frequency.setValueAtTime(160, now + delay);
        oscNode.frequency.linearRampToValueAtTime(80, now + delay + 0.06);
        gainNode.gain.setValueAtTime(0.15, now + delay);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.06);
        oscNode.connect(gainNode); gainNode.connect(audioCtx.destination);
        oscNode.start(now + delay); oscNode.stop(now + delay + 0.06);
      });
    } else if (type === 'crit') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.25);
      osc.start(); osc.stop(audioCtx.currentTime + 0.25);
    } else if (type === 'save') {
      osc.type = 'sine'; osc.frequency.setValueAtTime(988, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.12);
      osc.start(); osc.stop(audioCtx.currentTime + 0.12);
    } else if (type === 'flesh') {
      const bufferSize = audioCtx.sampleRate * 0.15;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) { data[i] = Math.random() * 2 - 1; }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass'; filter.frequency.value = 300;
      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);
      noise.connect(filter); filter.connect(noiseGain); noiseGain.connect(audioCtx.destination);
      noise.start();
    } else if (type === 'bubble') {
      osc.type = 'sine'; osc.frequency.setValueAtTime(200, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.06);
      osc.start(); osc.stop(audioCtx.currentTime + 0.06);
    } else if (type === 'alert') {
      osc.type = 'triangle'; osc.frequency.setValueAtTime(330, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
      osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    }

    // --- 新增音效类型 ---
    else if (type === 'epic_win') {
      // 胜利大捷：快速上行大调琶音
      const notes = [523.25, 659.25, 783.99, 1046.50];
      const now = audioCtx.currentTime;
      notes.forEach((freq, idx) => {
        const oscNode = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscNode.type = 'triangle';
        oscNode.frequency.setValueAtTime(freq, now + idx * 0.08);
        gainNode.gain.setValueAtTime(0, now + idx * 0.08);
        gainNode.gain.linearRampToValueAtTime(0.08, now + idx * 0.08 + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.22);
        oscNode.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscNode.start(now + idx * 0.08);
        oscNode.stop(now + idx * 0.08 + 0.22);
      });
    } else if (type === 'epic_fail') {
      // 砸锅/大悲催：卡通悲情滑音长号效果 (下行弯音)
      const notes = [164.81, 155.56, 146.83, 138.59];
      const now = audioCtx.currentTime;
      notes.forEach((freq, idx) => {
        const oscNode = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscNode.type = 'sawtooth';
        const startTime = now + idx * 0.2;
        const duration = idx === 3 ? 0.65 : 0.18;

        oscNode.frequency.setValueAtTime(freq, startTime);
        if (idx === 3) {
          oscNode.frequency.linearRampToValueAtTime(95, startTime + duration);
        }

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.08, startTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        oscNode.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscNode.start(startTime);
        oscNode.stop(startTime + duration);
      });
    } else if (type === 'funeral') {
      // 阵亡送葬曲：庄重悲伤短调
      const notes = [261.63, 261.63, 261.63, 207.65];
      const durations = [0.35, 0.35, 0.35, 0.7];
      const delays = [0, 0.45, 0.9, 1.35];
      const now = audioCtx.currentTime;
      notes.forEach((freq, idx) => {
        const oscNode = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscNode.type = 'sine';
        const startTime = now + delays[idx];
        const dur = durations[idx];

        oscNode.frequency.setValueAtTime(freq, startTime);
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.06, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

        oscNode.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscNode.start(startTime);
        oscNode.stop(startTime + dur);
      });
    } else if (type === 'metal_clash') {
      // 金属格挡招架：双音高频清脆撞击
      const now = audioCtx.currentTime;
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1400, now);
      osc1.frequency.linearRampToValueAtTime(900, now + 0.25);
      gain1.gain.setValueAtTime(0.06, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      osc1.connect(gain1); gain1.connect(audioCtx.destination);
      osc1.start(); osc1.stop(now + 0.3);

      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(300, now);
      osc2.frequency.linearRampToValueAtTime(120, now + 0.15);
      gain2.gain.setValueAtTime(0.1, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
      osc2.connect(gain2); gain2.connect(audioCtx.destination);
      osc2.start(); osc2.stop(now + 0.18);
    } else if (type === 'heavy_strike') {
      // 近战沉重打击：重拳 thud + 撕裂 flesh + 剑刃余音
      const now = audioCtx.currentTime;
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(80, now);
      osc1.frequency.exponentialRampToValueAtTime(35, now + 0.2);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
      osc1.connect(gain1); gain1.connect(audioCtx.destination);
      osc1.start(); osc1.stop(now + 0.2);

      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(550, now);
      gain2.gain.setValueAtTime(0.05, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      osc2.connect(gain2); gain2.connect(audioCtx.destination);
      osc2.start(); osc2.stop(now + 0.12);

      const bufferSize = audioCtx.sampleRate * 0.12;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) { data[i] = Math.random() * 2 - 1; }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass'; filter.frequency.value = 220;
      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.12, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      noise.connect(filter); filter.connect(noiseGain); noiseGain.connect(audioCtx.destination);
      noise.start();
    }
  } catch (e) {}
}
