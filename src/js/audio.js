import { getAssetPath } from './paths.js';

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
export { audioCtx };

// Store decoded AudioBuffers instead of HTMLAudioElements
const audioBufferCache = {};

const types = [
  'click', 'alert', 'dice_roll', 'dice_drop', 'shoot', 'sword_clash', 
  'heavy_strike', 'metal_clash', 'crit', 'save', 'flesh', 'bubble', 
  'epic_win', 'epic_fail', 'funeral', 'important_decision'
];

// Preload and decode audio files into Web Audio API buffers
types.forEach(async type => {
  try {
    const response = await fetch(getAssetPath(`assets/audio/${type}.wav`));
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    audioBufferCache[type] = audioBuffer;
  } catch (e) {
    console.warn(`Failed to preload/decode audio for ${type}:`, e);
  }
});

export function playSound(type) {
  try {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    const buffer = audioBufferCache[type];
    if (buffer) {
      // Create a new source node for each playback (extremely fast, zero DOM overhead)
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.start(0);
    } else {
      console.warn(`Sound buffer not found or not yet loaded: ${type}`);
    }
  } catch (e) {
    console.warn(`Error playing sound ${type}:`, e);
  }
}
