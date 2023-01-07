import { useEffect, useRef } from 'react';
import type { DependencyList, EffectCallback } from 'react';

export const useNonInitialEffect = (
  effect: EffectCallback,
  deps?: DependencyList
) => {
  const initialRender = useRef(true);

  useEffect(() => {
    let effectReturns: void | (() => void) = () => {};

    if (initialRender.current) {
      initialRender.current = false;
    } else {
      effectReturns = effect();
    }

    if (effectReturns && typeof effectReturns === 'function') {
      return effectReturns;
    }
  }, deps);
};
