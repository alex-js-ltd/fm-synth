import { createContext, useContext, ReactNode } from 'react';

type SynthProviderProps = { children: ReactNode };

const SynthContext = createContext<
  | {
      audioCtx: AudioContext | null;
    }
  | undefined
>(undefined);

SynthContext.displayName = 'SynthContext';

const SynthProvider = ({ children }: SynthProviderProps) => {
  const audioCtx = new AudioContext();

  const value = { audioCtx };

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
