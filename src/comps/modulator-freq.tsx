import type { ChangeEvent } from 'react';
import { useSynth } from 'context/synth-context';

const ModulatorFreq = () => {
  const { audioCtx, nodes, freq, setSynthState } = useSynth();

  if (!audioCtx || !nodes) {
    return null;
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const update = Number(e.target.value);

    const copyNodes = { ...nodes };

    copyNodes?.modulator.frequency.setValueAtTime(update, audioCtx.currentTime);

    setSynthState((prev) => ({ ...prev, nodes: copyNodes }));
  };

  return (
    <input
      type='range'
      min={40}
      max={300}
      defaultValue={freq.carrier}
      onChange={(e) => onChange(e)}
    />
  );
};

export default ModulatorFreq;
