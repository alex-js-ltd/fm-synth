import { useSynth } from 'context/synth-context';
import SpectrumAnalayser from 'comps/spectrum-analyser';
import Grid from 'comps/grid';
import './App.css';

const App = () => {
  const { setSynthState } = useSynth();

  return (
    <section>
      <button
        onClick={() =>
          setSynthState((prev) => ({ ...prev, audioCtx: new AudioContext() }))
        }
      >
        start!
      </button>

      <SpectrumAnalayser />
      <Grid />
    </section>
  );
};

export default App;
