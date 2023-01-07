import { useRef, useEffect } from 'react';
import { useSynth } from 'context/synth-context';

const SpectrumAnalyser = () => {
  const { nodes } = useSynth();

  if (!nodes) return null;

  const { analyser } = nodes;

  const oscilloscope = useRef<HTMLCanvasElement | null>(null);

  const createWaveForm = (analyser: AnalyserNode) => {
    return new Float32Array(analyser.frequencyBinCount);
  };

  const updateWaveform = (waveform: Float32Array, analyser: AnalyserNode) => {
    requestAnimationFrame(() => updateWaveform(waveform, analyser));
    analyser.getFloatTimeDomainData(waveform);
  };

  const drawOscilloscope = (
    scopeContext: CanvasRenderingContext2D,
    scopeCanvas: HTMLCanvasElement,
    waveform: Float32Array
  ) => {
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
    analyser.getFloatTimeDomainData(waveform);
    updateWaveform(waveform, analyser);

    const scopeCanvas = oscilloscope.current;

    if (!scopeCanvas) return;

    scopeCanvas.width = waveform.length;
    scopeCanvas.height = 200;
    const scopeContext = scopeCanvas.getContext('2d');

    if (!scopeContext) return;
    scopeContext.strokeStyle = '#7efbec';
    drawOscilloscope(scopeContext, scopeCanvas, waveform);
  }, [analyser]);

  return <canvas ref={oscilloscope}></canvas>;
};

export default SpectrumAnalyser;
