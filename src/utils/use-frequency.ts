import { useEffect } from 'react';
import { useSynth } from 'context/synth-context';

type Props = { frequency: number };

const useFrequency = ({ frequency }: Props) => {
  const { audioCtx, nodes, freq, setFreq, env } = useSynth();

  const changeFrequency = () => {
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
    changeFrequency();
  }, [freq]);

  return { setFreq, on: frequency === freq.carrier };
};

export { useFrequency };
