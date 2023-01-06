import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type SynthProviderProps = { children: ReactNode };

type SynthState = {
  audioCtx: AudioContext;
  analyser: AnalyserNode;
  modulator: OscillatorNode;
  carrier: OscillatorNode;
  modGain: GainNode;
  masterGain: GainNode;
};

type SynthContext = { init: any };

const SynthContext = createContext<SynthContext | undefined>(undefined);

SynthContext.displayName = 'SynthContext';

const SynthProvider = ({ children }: SynthProviderProps) => {
  const [state, setState] = useState<SynthState | undefined>(undefined);

  function createAudioCtx() {
    return new Promise<AudioContext>((resolve, reject) => {
      const audioCtx = new AudioContext();
      resolve(audioCtx);
    });
  }

  function createNodes(audioCtx: AudioContext) {
    return new Promise<SynthState>((resolve, reject) => {
      const analyser = audioCtx.createAnalyser();
      const modulator = audioCtx.createOscillator();
      const carrier = audioCtx.createOscillator();
      const modGain = audioCtx.createGain();
      const masterGain = audioCtx.createGain();

      const synthState = {
        analyser,
        modulator,
        carrier,
        modGain,
        masterGain,
        audioCtx,
      };
      resolve(synthState);
    });
  }

  function connectNodes(synthState: SynthState) {
    const { analyser, modulator, carrier, modGain, masterGain, audioCtx } =
      synthState;
    modulator.connect(modGain);
    modGain.connect(carrier.frequency);
    carrier.connect(masterGain);
    masterGain.connect(analyser);
    analyser.connect(audioCtx.destination);
    modulator.frequency.setValueAtTime(176, audioCtx.currentTime);
    carrier.frequency.value = 44;
    modulator.start();
    carrier.start();
  }

  async function init(): Promise<SynthState> {
    const audioCtx = await createAudioCtx();
    const synthState = await createNodes(audioCtx);
    connectNodes(synthState);

    console.log(synthState);
    return synthState;
  }

  const value = { init };

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
