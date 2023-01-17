/** @jsxImportSource @emotion/react */

import * as mq from 'styles/media-queries';
import * as colors from 'styles/colors';
import styled from '@emotion/styled';

const PadListUL = styled.ul({
  width: '100%',
  margin: '0 auto',
  listStyle: 'none',
  display: 'grid',
  gridTemplateColumns: `repeat(8, 1fr)`,
  gridGap: '1em',

  [mq.small]: {
    gridTemplateColumns: `repeat(4, 1fr)`,
  },

  [mq.mobile]: {
    gridTemplateColumns: `repeat(2, 1fr)`,
  },
});

const Splash = styled.div({
  position: 'fixed',
  top: '0px',
  right: '0px',
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: colors.dark,
  colors: 'white',
});

export { PadListUL, Splash };
