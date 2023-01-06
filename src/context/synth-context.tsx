import {
  createContext,
  useContext,
  useRef,
  useState,
  useLayoutEffect,
} from 'react';
import type { ReactNode } from 'react';

type SynthProviderProps = { children: ReactNode };

type Nodes = {
  analyser: AnalyserNode;
  modulator: OscillatorNode;
  carrier: OscillatorNode;
  modGain: GainNode;
  masterGain: GainNode;
};

const SynthContext = createContext<{ setAudioCtx: Function } | undefined>(
  undefined
);

SynthContext.displayName = 'SynthContext';

const SynthProvider = ({ children }: SynthProviderProps) => {
  const [audioCtx, setAudioCtx] = useState<AudioContext>();
  const [nodes, setNodes] = useState<Nodes>();

  const createNodes = (audioCtx: AudioContext) => {
    const analyser = audioCtx.createAnalyser();
    const modulator = audioCtx.createOscillator();
    const carrier = audioCtx.createOscillator();
    const modGain = audioCtx.createGain();
    const masterGain = audioCtx.createGain();

    setNodes({
      analyser,
      modulator,
      carrier,
      modGain,
      masterGain,
    });
  };

  const connectNodes = (nodes: Nodes, audioCtx: AudioContext) => {
    const { analyser, modulator, carrier, modGain, masterGain } = nodes;

    modulator.connect(modGain);
    modGain.connect(carrier.frequency);
    carrier.connect(masterGain);
    masterGain.connect(analyser);
    analyser.connect(audioCtx.destination);
  };

  async function init() {}

  const value = { setAudioCtx };

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
