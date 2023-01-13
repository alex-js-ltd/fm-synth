import React, { useEffect } from 'react';
import { useSynth } from 'context/synth-context';
import SpectrumAnalayser from 'comps/spectrum-analyser';
import './App.css';

const App = () => {
  const { setAudioCtx, nodes } = useSynth();

  return (
    <section>
      <button onClick={() => setAudioCtx(new AudioContext())}>start!</button>

      <SpectrumAnalayser analyser={nodes?.analyser} />
    </section>
  );
};

export default App;
