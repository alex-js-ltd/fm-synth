import type { ReactNode, Dispatch, SetStateAction } from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

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

SynthContext.displayName = "SynthContext";

const SynthProvider = ({ children }: SynthProviderProps) => {
  const [state, setSynthState] = useState<State>({
    audioCtx: undefined,
    nodes: undefined,
    env: { attack: 1, release: 1 },
    freq: { carrier: 66, modulator: 176 },
    gain: { carrier: 100, modulator: 100 },
  });

  const { audioCtx, nodes, env, freq, gain } = state;

  const initialize = useCallback(
    (audioCtx?: AudioContext) => {
      if (!audioCtx) return;

      const analyser = audioCtx.createAnalyser();
      const modulator = audioCtx.createOscillator();
      const carrier = audioCtx.createOscillator();
      const modGain = audioCtx.createGain();
      const masterGain = audioCtx.createGain();

      modulator.connect(modGain);
      modGain.connect(carrier.frequency);
      carrier.connect(masterGain);
      masterGain.connect(analyser);
      analyser.connect(audioCtx.destination);
      modulator.frequency.setValueAtTime(freq.modulator, audioCtx.currentTime);
      carrier.frequency.value = freq.carrier;
      modulator.start();
      carrier.start();

      const nodes = { analyser, modulator, carrier, modGain, masterGain };

      setSynthState((prevState) => ({ ...prevState, nodes }));
    },
    [setSynthState, freq]
  );

  useEffect(() => {
    initialize(audioCtx);
  }, [initialize, audioCtx]);

  return (
    <SynthContext.Provider
      value={{
        audioCtx,
        nodes,
        env,
        freq,
        gain,
        setSynthState,
      }}
    >
      {children}{" "}
    </SynthContext.Provider>
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
