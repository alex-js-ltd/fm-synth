import { useSynth } from 'context/synth-context';
import SpectrumAnalayser from 'comps/spectrum-analyser';
import Grid from 'comps/grid';
import './App.css';

const App = () => {
  const { setAudioCtx } = useSynth();

  return (
    <section>
      <button onClick={() => setAudioCtx(new AudioContext())}>start!</button>

      <SpectrumAnalayser />
      <Grid />
    </section>
  );
};

export default App;
