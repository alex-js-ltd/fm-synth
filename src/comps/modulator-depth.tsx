import type { ChangeEvent } from 'react';
import { useSynth } from 'context/synth-context';

const ModulatorDepth = () => {
  const { audioCtx, nodes, freq, setSynthState } = useSynth();

  if (!audioCtx) {
    return null;
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!nodes) return;

    const update = Number(e.target.value);

    const copyNodes = { ...nodes };

    copyNodes.modGain.gain.setValueAtTime(update, audioCtx.currentTime);

    setSynthState((prev) => ({ ...prev, nodes: copyNodes }));
  };

  return (
    <input
      type='range'
      min={0}
      max={300}
      defaultValue={freq.carrier}
      onChange={(e) => onChange(e)}
    />
  );
};

export default ModulatorDepth;
