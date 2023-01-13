import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type { Nodes } from 'types';
import { useNodes } from 'utils/use-nodes';

type SynthProviderProps = { children: ReactNode };

const SynthContext = createContext<
  { setAudioCtx: Function; nodes: Nodes | null } | undefined
>(undefined);

SynthContext.displayName = 'SynthContext';

const SynthProvider = ({ children }: SynthProviderProps) => {
  const [audioCtx, setAudioCtx] = useState<AudioContext>();

  const nodes = useNodes(audioCtx);

  const value = { setAudioCtx, nodes };

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
