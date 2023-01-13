import { Fragment } from 'react';
import { useSynth } from 'context/synth-context';
import SpectrumAnalayser from 'comps/spectrum-analyser';
import Grid from 'comps/grid';
import ModulatorFreq from 'comps/modulator-freq';
import ModulatorDepth from 'comps/modulator-depth';
import './App.css';

const App = () => {
  const { setSynthState } = useSynth();

  return (
    <Fragment>
      <section>
        <button
          onClick={() =>
            setSynthState((prev) => ({ ...prev, audioCtx: new AudioContext() }))
          }
        >
          start!
        </button>

        <ModulatorFreq />
        <ModulatorDepth />
      </section>

      <SpectrumAnalayser />
      <Grid />
    </Fragment>
  );
};

export default App;
