import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import { useNonInitialEffect } from 'utils/use-non-initial-effect';

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

  const createNodes = (audioCtx?: AudioContext) => {
    if (!audioCtx) return;
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

  const connectNodes = (nodes?: Nodes, audioCtx?: AudioContext) => {
    if (!nodes || !audioCtx) return;

    const { analyser, modulator, carrier, modGain, masterGain } = nodes;

    modulator.connect(modGain);
    modGain.connect(carrier.frequency);
    carrier.connect(masterGain);
    masterGain.connect(analyser);
    analyser.connect(audioCtx.destination);
    startSynth(nodes, audioCtx);
  };

  const startSynth = (nodes?: Nodes, audioCtx?: AudioContext) => {
    if (!nodes || !audioCtx) return;

    const { modulator, carrier } = nodes;

    modulator.frequency.setValueAtTime(176, audioCtx.currentTime);
    carrier.frequency.value = 44;
    modulator.start();
    carrier.start();
  };

  useNonInitialEffect(() => {
    createNodes(audioCtx);
  }, [audioCtx]);

  useNonInitialEffect(() => {
    connectNodes(nodes, audioCtx);
  }, [nodes]);

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
