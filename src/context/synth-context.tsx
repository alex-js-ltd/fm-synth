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
  const [synth, setSynthState] = useState<SynthState | null>(null);

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
    return new Promise<SynthState>((resolve, reject) => {
      const { analyser, modulator, carrier, modGain, masterGain, audioCtx } =
        synthState;
      modulator.connect(modGain);
      modGain.connect(carrier.frequency);
      carrier.connect(masterGain);
      masterGain.connect(analyser);
      analyser.connect(audioCtx.destination);

      resolve(synthState);
    });
  }

  async function init() {
    const audioCtx = await createAudioCtx();
    const synthState = await createNodes(audioCtx);
    const connected = await connectNodes(synthState);
    setSynthState(connected);
  }

  function startSynth() {
    if (!synth) return;
    synth.modulator.frequency.setValueAtTime(176, synth.audioCtx.currentTime);
    synth.carrier.frequency.value = 44;
    synth.modulator.start();
    synth.carrier.start();
  }

  useEffect(() => {
    startSynth();
  }, [synth]);

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
