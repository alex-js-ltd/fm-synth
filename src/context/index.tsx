import { ReactNode } from 'react';
import { SynthProvider } from 'context/synth-context';

const AppProviders = ({ children }: { children: ReactNode }) => (
  <SynthProvider>{children}</SynthProvider>
);

export { AppProviders };
