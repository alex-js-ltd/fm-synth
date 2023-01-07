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

const SynthContext = createContext<
  { setAudioCtx: Function; nodes?: Nodes } | undefined
>(undefined);

SynthContext.displayName = 'SynthContext';

const SynthProvider = ({ children }: SynthProviderProps) => {
  const [audioCtx, setAudioCtx] = useState<AudioContext>(new AudioContext());
  const [nodes, setNodes] = useState<Nodes>();

  const createNodes = (audioCtx: AudioContext) => {
    const analyser = audioCtx.createAnalyser();
    const modulator = audioCtx.createOscillator();
    const carrier = audioCtx.createOscillator();
    const modGain = audioCtx.createGain();
    const masterGain = audioCtx.createGain();

    return {
      analyser,
      modulator,
      carrier,
      modGain,
      masterGain,
    };
  };

  const { analyser, modulator, carrier, modGain, masterGain } =
    createNodes(audioCtx);

  const connectNodes = () => {
    modulator.connect(modGain);
    modGain.connect(carrier.frequency);
    carrier.connect(masterGain);
    masterGain.connect(analyser);
    analyser.connect(audioCtx.destination);
    startSynth(modulator, carrier);
  };

  const startSynth = (modulator: OscillatorNode, carrier: OscillatorNode) => {
    modulator.frequency.setValueAtTime(176, audioCtx.currentTime);
    carrier.frequency.value = 44;
    modulator.start();
    carrier.start();
  };

  useNonInitialEffect(() => {
    createNodes(audioCtx);
    connectNodes();
    startSynth(modulator, carrier);
  }, [audioCtx]);

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
