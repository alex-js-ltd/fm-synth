import { Fragment } from 'react';
import { useSynth } from 'context/synth-context';
import SpectrumAnalayser from 'comps/spectrum-analyser';
import Grid from 'comps/grid';
import ModulatorFreq from 'comps/modulator-freq';
import ModulatorDepth from 'comps/modulator-depth';
import Github from 'comps/github';
import 'styles/app.css';

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
    <div className='wrapper'>
      <div className='controls'>
        {audioCtx ? null : <Start />}
        <ModulatorFreq />
        <ModulatorDepth />
      </div>

      <SpectrumAnalayser />
      <Grid />
      <Github />
    </div>
  );
};

export default App;
