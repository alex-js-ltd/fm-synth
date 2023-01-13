type Nodes = {
  analyser: AnalyserNode;
  modulator: OscillatorNode;
  carrier: OscillatorNode;
  modGain: GainNode;
  masterGain: GainNode;
};

type Freq = { carrier: number; modulator: number };
type Env = { attack: number; release: number };

export type { Nodes, Freq, Env };
