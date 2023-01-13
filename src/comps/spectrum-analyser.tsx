import { useSpectrumAnalyser } from 'utils/use-spectrum-analyser';

type Props = { analyser?: AnalyserNode };

const SpectrumAnalayser = ({ analyser }: Props) => {
  const { oscilloscope } = useSpectrumAnalyser(analyser);

  return <canvas ref={oscilloscope}></canvas>;
};

export default SpectrumAnalayser;
