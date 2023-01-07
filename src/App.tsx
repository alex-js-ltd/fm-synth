import React, { useEffect } from 'react';
import { useSynth } from 'context/synth-context';

import './App.css';

function App() {
  const { setAudioCtx } = useSynth();

  return (
    <section>
      <button onClick={() => setAudioCtx(new AudioContext())}>start!</button>
    </section>
  );
}

export default App;
