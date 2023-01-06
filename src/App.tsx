import React, { useEffect } from 'react';
import { useSynth } from 'context/synth-context';

function App() {
  const { setAudioCtx } = useSynth();

  useEffect(() => {}, []);

  return (
    <div className='App'>
      <button onClick={() => setAudioCtx(new AudioContext())}>
        start the synth!
      </button>
    </div>
  );
}

export default App;
