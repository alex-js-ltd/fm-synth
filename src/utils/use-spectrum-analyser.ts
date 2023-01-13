import { useRef, useEffect } from 'react';
import type { RefObject } from 'react';
import { blue } from 'styles/colors';

type SpectrumAnalyser = { oscilloscope: RefObject<HTMLCanvasElement> };

const useSpectrumAnalyser = (analyser?: AnalyserNode): SpectrumAnalyser => {
  const oscilloscope = useRef<HTMLCanvasElement>(null);

  const createWaveForm = (
    analyser?: AnalyserNode
  ): Float32Array | undefined => {
    if (!analyser) return;
    return new Float32Array(analyser.frequencyBinCount);
  };

  const getTimeDomain = (analyser?: AnalyserNode, waveform?: Float32Array) => {
    if (!analyser || !waveform) return;
    analyser.getFloatTimeDomainData(waveform);
  };

  const updateWaveform = (waveform?: Float32Array, analyser?: AnalyserNode) => {
    if (!waveform || !analyser) return;
    requestAnimationFrame(() => updateWaveform(waveform, analyser));
    analyser.getFloatTimeDomainData(waveform);
  };

  const drawOscilloscope = (
    scopeContext: CanvasRenderingContext2D | null,
    scopeCanvas: HTMLCanvasElement | null,
    waveform: Float32Array
  ) => {
    if (!scopeContext || !scopeCanvas || !waveform) return;

    requestAnimationFrame(() =>
      drawOscilloscope(scopeContext, scopeCanvas, waveform)
    );
    scopeContext.clearRect(0, 0, scopeCanvas.width, scopeCanvas.height);
    scopeContext.beginPath();
    for (let i = 0; i < waveform.length; i++) {
      const x = i;
      const y = (0.5 + waveform[i] / 2) * scopeCanvas.height;
      if (i === 0) {
        scopeContext.moveTo(x, y);
      } else {
        scopeContext.lineTo(x, y);
      }
    }
    scopeContext.stroke();
  };

  useEffect(() => {
    const waveform = createWaveForm(analyser);
    getTimeDomain(analyser, waveform);
    updateWaveform(waveform, analyser);

    const scopeCanvas = oscilloscope.current;

    if (!scopeCanvas || !waveform) return;
    scopeCanvas.width = waveform.length;
    scopeCanvas.height = 200;
    const scopeContext = scopeCanvas.getContext('2d');

    if (!scopeContext) return;
    scopeContext.strokeStyle = blue;
    drawOscilloscope(scopeContext, scopeCanvas, waveform);
  }, [analyser]);

  return { oscilloscope };
};

export { useSpectrumAnalyser };
