import { useFrequency } from 'utils/use-frequency';
import { useSynth } from 'context/synth-context';

type Props = {
  frequency: number;
};

const blue = '1px solid #7efbec';
const light = '1px solid #444342';

const Note = ({ frequency }: Props) => {
  const { on } = useFrequency(frequency);
  const { setSynthState } = useSynth();

  return (
    <button
      style={{
        border: on ? blue : light,
      }}
      onClick={() =>
        setSynthState((prev) => ({
          ...prev,
          freq: { ...prev.freq, carrier: frequency },
        }))
      }
    >
      {frequency}
    </button>
  );
};

export default Note;
