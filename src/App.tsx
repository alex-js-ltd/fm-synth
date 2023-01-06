import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import { useSynth } from 'context/synth-context';

function App() {
  const { init } = useSynth();

  useEffect(() => {}, []);

  return (
    <div className='App'>
      <button onClick={() => init()}>start the synth!</button>
    </div>
  );
}

export default App;
