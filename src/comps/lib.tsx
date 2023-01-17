/** @jsxImportSource @emotion/react */

import * as mq from 'styles/media-queries';
import styled from '@emotion/styled';

const PadListUL = styled.ul({
  padding: 0,
  width: '100%',
  margin: '0 auto',
  listStyle: 'none',
  display: 'grid',
  gridTemplateColumns: `repeat(8, 1fr)`,
  gridGap: '1em',

  [mq.small]: {
    gridTemplateColumns: `repeat(4, 1fr)`,
  },
});

export { PadListUL };
