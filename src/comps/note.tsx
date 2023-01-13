type Props = {
  frequency: number;
  audioCtx: AudioContext;
  attack: number;
  release: number;
  carrier: OscillatorNode;
  masterGain: GainNode;
};

const Note = ({
  frequency,
  audioCtx,
  attack,
  release,
  carrier,
  masterGain,
}: Props) => {
  const onClick = () => {
    checkAudioCtx();
    carrier.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    const now = audioCtx.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.linearRampToValueAtTime(1, now + attack);
    masterGain.gain.linearRampToValueAtTime(0, now + attack + release * 5);
  };

  const checkAudioCtx = () => {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  };

  if (!audioCtx) {
    return null;
  }

  return <button onClick={() => onClick()}></button>;
};

export default Note;
