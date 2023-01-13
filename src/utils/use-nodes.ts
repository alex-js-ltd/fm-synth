import type { Nodes, Freq } from 'types';

const useNodes = (freq: Freq, audioCtx?: AudioContext): Nodes | null => {
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

  modulator.frequency.setValueAtTime(freq.modulator, audioCtx.currentTime);
  carrier.frequency.value = freq.carrier;
  modulator.start();
  carrier.start();

  return { analyser, modulator, carrier, modGain, masterGain };
};

export { useNodes };
