import React, { useEffect } from 'react';
import { useSynth } from 'context/synth-context';
import { useSpectrumAnalayser } from 'utils/use-spectrum-analyser';
import './App.css';

function App() {
  const { setAudioCtx, nodes } = useSynth();

  const { oscilloscope } = useSpectrumAnalayser(nodes?.analyser);
  return (
    <section>
      <button onClick={() => setAudioCtx(new AudioContext())}>start!</button>

      <canvas ref={oscilloscope}></canvas>
    </section>
  );
}

export default App;
