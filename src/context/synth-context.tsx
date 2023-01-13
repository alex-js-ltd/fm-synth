import type { ReactNode, Dispatch, SetStateAction } from 'react';
import type { Nodes, Freq, Env } from 'types';
import { createContext, useContext, useState, useEffect } from 'react';

type SynthProviderProps = { children: ReactNode };

type State = {
  audioCtx?: AudioContext;
  nodes?: Nodes;
  env: { attack: number; release: number };
};

type Context = State & {
  setAudioCtx: Function;
};

const SynthContext = createContext<Context | undefined>(undefined);

SynthContext.displayName = 'SynthContext';

const SynthProvider = ({ children }: SynthProviderProps) => {
  const [state, setState] = useState<State>({
    env: { attack: 1, release: 1 },
  });

  const setAudioCtx = () => {
    setState({ ...state, audioCtx: new AudioContext() });
  };

  const setNodes = (audioCtx?: AudioContext) => {
    if (!audioCtx) return;
    const nodes = {
      analyser: audioCtx.createAnalyser(),
      modulator: audioCtx.createOscillator(),
      carrier: audioCtx.createOscillator(),
      modGain: audioCtx.createGain(),
      masterGain: audioCtx.createGain(),
    };

    nodes.modulator.connect(nodes.modGain);
    nodes.modGain.connect(nodes.carrier.frequency);
    nodes.carrier.connect(nodes.masterGain);
    nodes.masterGain.connect(nodes.analyser);
    nodes.analyser.connect(audioCtx.destination);
    nodes.modulator.frequency.setValueAtTime(176, audioCtx.currentTime);
    nodes.carrier.frequency.value = 44;
    nodes.modulator.start();
    nodes.carrier.start();

    setState({ ...state, nodes });
  };

  useEffect(() => {
    setNodes(state?.audioCtx);
  }, [state?.audioCtx]);

  const value = {
    audioCtx: state?.audioCtx,
    setAudioCtx,
    nodes: state?.nodes,
    env: state.env,
  };

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
