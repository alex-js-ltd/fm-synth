import { useEffect } from 'react';
import { useSynth } from 'context/synth-context';

type Props = { frequency: number };

const useFrequency = () => {
  const { audioCtx, nodes, env } = useSynth();

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

  return { changeFrequency, nodes };
};

export { useFrequency };
