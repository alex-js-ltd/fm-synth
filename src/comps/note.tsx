import { useFrequency } from "utils/use-frequency";
import { useSynth } from "context/synth-context";
import { blue, light } from "styles/colors";

type Props = {
  frequency: number;
};

const Note = ({ frequency }: Props) => {
  const { on } = useFrequency(frequency);
  const { setSynthState } = useSynth();

  let color = on ? blue : light;
  let border = `1px solid ${color}`;

  return (
    <button
      style={{
        border,
      }}
      onClick={() =>
        setSynthState((prev) => ({
          ...prev,
          freq: { ...prev.freq, carrier: frequency },
        }))
      }
    ></button>
  );
};

export default Note;
