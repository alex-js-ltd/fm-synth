import type { Nodes } from 'types';

const useNodes = (audioCtx?: AudioContext): Nodes | null => {
  if (!audioCtx) return null;

  const analyser = audioCtx.createAnalyser();
  const modulator = audioCtx.createOscillator();
  const carrier = audioCtx.createOscillator();
  const modGain = audioCtx.createGain();
  const masterGain = audioCtx.createGain();

  modulator.connect(modGain);
  modGain.connect(carrier.frequency);
  carrier.connect(masterGain);
  masterGain.connect(analyser);
  analyser.connect(audioCtx.destination);

  modulator.frequency.setValueAtTime(176, audioCtx.currentTime);
  carrier.frequency.value = 44;
  modulator.start();
  carrier.start();

  return { analyser, modulator, carrier, modGain, masterGain };
};

export { useNodes };
