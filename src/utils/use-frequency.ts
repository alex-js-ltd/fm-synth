import { useEffect } from 'react';
import { useSynth } from 'context/synth-context';

const useFrequency = (note: number) => {
  const { audioCtx, nodes, env, freq, setSynthState } = useSynth();

  const changeFrequency = (frequency: number) => {
    if (!audioCtx || !nodes) return;

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const copyNodes = { ...nodes };
    const now = audioCtx.currentTime;
    copyNodes.carrier.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    copyNodes.masterGain.gain.cancelScheduledValues(now);
    copyNodes.masterGain.gain.setValueAtTime(
      copyNodes.masterGain.gain.value,
      now
    );
    copyNodes.masterGain.gain.linearRampToValueAtTime(1, now + env.attack);
    copyNodes.masterGain.gain.linearRampToValueAtTime(
      0,
      now + env.attack + env.release * 5
    );
    setSynthState((prev) => ({ ...prev, nodes: copyNodes }));
  };

  useEffect(() => {
    changeFrequency(freq.carrier);
  }, [freq.carrier]);

  return { on: freq.carrier === note };
};

export { useFrequency };
