import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type SynthProviderProps = { children: ReactNode };

const SynthContext = createContext<
  | {
      analyser: AnalyserNode;
      modulator: OscillatorNode;
      carrier: OscillatorNode;
      modGain: GainNode;
      masterGain: GainNode;
    }
  | undefined
>(undefined);

SynthContext.displayName = 'SynthContext';

const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();
const modulator = audioCtx.createOscillator();
const carrier = audioCtx.createOscillator();
const modGain = audioCtx.createGain();
const masterGain = audioCtx.createGain();

const SynthProvider = ({ children }: SynthProviderProps) => {
  const [state, setState] = useState({
    analyser,
    modulator,
    carrier,
    modGain,
    masterGain,
  });

  return (
    <SynthContext.Provider value={state}>{children} </SynthContext.Provider>
  );
};

const useSynth = () => {
  const context = useContext(SynthContext);
  if (context === undefined) {
    throw new Error(`useSynth must be used within a SynthContext provider`);
  }
  return context;
};

export { SynthProvider, useSynth };
