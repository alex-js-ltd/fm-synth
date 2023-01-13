import type { ReactNode, Dispatch, SetStateAction } from 'react';
import type { Nodes, Freq, Env } from 'types';
import { createContext, useContext, useState } from 'react';
import { useNodes } from 'utils/use-nodes';

type SynthProviderProps = { children: ReactNode };

const SynthContext = createContext<
  | {
      audioCtx?: AudioContext;
      setAudioCtx: Function;
      nodes: Nodes | null;
      freq: Freq;
      setFreq: Dispatch<SetStateAction<Freq>>;
      env: Env;
      setEnv: Dispatch<SetStateAction<Env>>;
    }
  | undefined
>(undefined);

SynthContext.displayName = 'SynthContext';

const SynthProvider = ({ children }: SynthProviderProps) => {
  const [audioCtx, setAudioCtx] = useState<AudioContext>();
  const [freq, setFreq] = useState<Freq>({ carrier: 44, modulator: 176 });
  const [env, setEnv] = useState<Env>({
    attack: 1,
    release: 1,
  });

  const nodes = useNodes(freq, audioCtx);

  const value = { audioCtx, setAudioCtx, nodes, freq, setFreq, env, setEnv };

  return (
    <SynthContext.Provider value={value}>{children} </SynthContext.Provider>
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
