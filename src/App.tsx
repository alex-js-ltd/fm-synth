import { Fragment } from 'react';
import { useSynth } from 'context/synth-context';
import SpectrumAnalayser from 'comps/spectrum-analyser';
import Grid from 'comps/grid';
import ModulatorFreq from 'comps/modulator-freq';
import ModulatorDepth from 'comps/modulator-depth';
import Github from 'comps/github';
import './App.css';

const App = () => {
  const { setSynthState, audioCtx } = useSynth();

  const Start = () => (
    <button
      onClick={() =>
        setSynthState((prev) => ({ ...prev, audioCtx: new AudioContext() }))
      }
    >
      start!
    </button>
  );

  return (
    <Fragment>
      <div className='controls'>
        {audioCtx ? null : <Start />}
        <ModulatorFreq />
        <ModulatorDepth />
      </div>

      <SpectrumAnalayser />
      <Grid />
      <Github />
    </Fragment>
  );
};

export default App;
