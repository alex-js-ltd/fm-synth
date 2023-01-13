import { useFrequency } from 'utils/use-frequency';

type Props = {
  frequency: number;
};

const blue = '1px solid #7efbec';
const light = '1px solid #444342';

const Note = ({ frequency }: Props) => {
  const { setFreq, on } = useFrequency({ frequency });

  return (
    <button
      style={{ border: on ? blue : light }}
      onClick={() => setFreq((prev) => ({ ...prev, carrier: frequency }))}
    ></button>
  );
};

export default Note;
