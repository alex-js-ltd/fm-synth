import { useEffect } from 'react';
import { useSynth } from 'context/synth-context';

const useFrequency = (note: number) => {
  const { audioCtx, nodes, env, freq } = useSynth();

  const changeFrequency = (frequency: number) => {
    if (!audioCtx || !nodes) return;

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    nodes.carrier.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    const now = audioCtx.currentTime;
    nodes.masterGain.gain.cancelScheduledValues(now);
    nodes.masterGain.gain.setValueAtTime(nodes.masterGain.gain.value, now);
    nodes.masterGain.gain.linearRampToValueAtTime(1, now + env.attack);
    nodes.masterGain.gain.linearRampToValueAtTime(
      0,
      now + env.attack + env.release * 5
    );
  };

  useEffect(() => {
    changeFrequency(freq.carrier);
  }, [freq.carrier]);

  return { on: freq.carrier === note };
};

export { useFrequency };
