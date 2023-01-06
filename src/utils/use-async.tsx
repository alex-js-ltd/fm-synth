import {
  Dispatch,
  useLayoutEffect,
  useRef,
  useReducer,
  useCallback,
} from 'react';

type Action =
  | { type: 'pending' }
  | { type: 'resolved'; data: any }
  | { type: 'rejected'; error: Error }
  | { type: undefined };

type State =
  | {
      status: 'idle' | 'pending' | 'resolved' | 'rejected';
      data: any;
      error: Error | null;
    }
  | {};

function useSafeDispatch(dispatch: Dispatch<Action>) {
  const mounted = useRef(false);

  useLayoutEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return useCallback(
    (...args: [Action]) => (mounted.current ? dispatch(...args) : void 0),
    [dispatch]
  );
}

function asyncReducer(_state: State, action: Action) {
  switch (action.type) {
    case 'pending': {
      return { status: 'pending', data: null, error: null };
    }
    case 'resolved': {
      return { status: 'resolved', data: action.data, error: null };
    }
    case 'rejected': {
      return { status: 'rejected', data: null, error: action.error };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function useAsync() {
  const [state, unsafeDispatch] = useReducer(asyncReducer, {
    status: 'idle',
    data: null,
    error: null,
  });

  const dispatch = useSafeDispatch(unsafeDispatch);

  const { data, error, status } = state;

  const run = useCallback(
    (promise: Promise<any>) => {
      dispatch({ type: 'pending' });

      return promise.then(
        (data) => {
          dispatch({ type: 'resolved', data });
        },
        (error) => {
          dispatch({ type: 'rejected', error });
        }
      );
    },
    [dispatch]
  );

  const setData = useCallback(
    (data: any) => dispatch({ type: 'resolved', data }),
    [dispatch]
  );

  return {
    // using the same names that react-query uses for convenience
    isIdle: status === 'idle',
    isLoading: status === 'pending',
    isError: status === 'rejected',
    isSuccess: status === 'resolved',

    setData,
    error,
    status,
    data,
    run,
  };
}

export { useAsync };
