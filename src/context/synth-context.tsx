import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

type SynthProviderProps = { children: ReactNode };

type Nodes = {
  analyser: AnalyserNode;
  modulator: OscillatorNode;
  carrier: OscillatorNode;
  modGain: GainNode;
  masterGain: GainNode;
};

type State = {
  audioCtx?: AudioContext;
  nodes?: Nodes;
  env: { attack: number; release: number };
  freq: { carrier: number; modulator: number };
  gain: { carrier: number; modulator: number };
};

type Context = State & {
  setSynthState: Dispatch<SetStateAction<State>>;
};

const SynthContext = createContext<Context | undefined>(undefined);

SynthContext.displayName = 'SynthContext';

const SynthProvider = ({ children }: SynthProviderProps) => {
  const [state, setSynthState] = useState<State>({
    env: { attack: 1, release: 1 },
    freq: { carrier: 44, modulator: 176 },
    gain: { carrier: 100, modulator: 40 },
  });

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

    setSynthState({ ...state, nodes });
  };

  useEffect(() => {
    setNodes(state?.audioCtx);
  }, [state?.audioCtx]);

  const value = {
    audioCtx: state?.audioCtx,
    nodes: state?.nodes,
    env: state.env,
    freq: state.freq,
    gain: state.gain,
    setSynthState,
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
