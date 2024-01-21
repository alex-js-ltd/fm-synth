import { useSynth } from "context/synth-context";
import { useSpectrumAnalyser } from "utils/use-spectrum-analyser";

const SpectrumAnalayser = () => {
  const { nodes } = useSynth();
  const { oscilloscope } = useSpectrumAnalyser(nodes?.analyser);

  return <canvas ref={oscilloscope}></canvas>;
};

export default SpectrumAnalayser;
