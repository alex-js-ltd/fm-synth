import { useFrequency } from 'utils/use-frequency';
import { useSynth } from 'context/synth-context';

type Props = {
  frequency: number;
};

const blue = '1px solid #7efbec';
const light = '1px solid #444342';

const Note = ({ frequency }: Props) => {
  const { changeFrequency } = useFrequency();
  const { nodes } = useSynth();

  console.log('carrier freq', nodes?.carrier.frequency.value);
  return (
    <button
      style={{
        border: nodes?.carrier.frequency.value === frequency ? blue : light,
      }}
      onClick={() => changeFrequency(frequency)}
    >
      {frequency}
    </button>
  );
};

export default Note;
