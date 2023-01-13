import { useEffect } from 'react';
import { useSynth } from 'context/synth-context';

type Props = { frequency: number };

const useFrequency = () => {
  const { audioCtx, nodes, env, setSynthState } = useSynth();

  const changeFrequency = (frequency: number) => {
    if (!audioCtx || !nodes) return;

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const copyNodes = { ...nodes };

    copyNodes.carrier.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    const now = audioCtx.currentTime;
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

  return { changeFrequency };
};

export { useFrequency };
