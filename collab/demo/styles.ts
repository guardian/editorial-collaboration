import { css } from '@emotion/react';
import { baseColors, baseTypography } from '@guardian/stand';

// required for panel scrolling to work correctly.
const heightInherit = {
  height: 'inherit',
  overflow: 'hidden',
};

const global = css({
  '#root': heightInherit,
  html: {
    height: '100vh',
    width: '100vw',
  },
  body: {
    height: '100%',
    width: '100vw',
    margin: '0 auto',
    fontFamily: baseTypography.family['Guardian Text Egyptian'],
    fontSize: baseTypography.size['14-rem'],
  }
});

const panel = {
  container: css({
    backgroundColor: baseColors.neutral[800],
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: 'inherit',
  }),
  header: css({
    width: 'stretch',
    backgroundColor: baseColors.neutral[700],
    padding: 10,
    fontSize: baseTypography.size['16-rem'],
    fontWeight: baseTypography.weight['Guardian Text Egyptian'].bold,
  }),
  contents: css({
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    width: 'stretch',
    padding: '10px',
    overflowX: 'hidden',
    overflowY: 'auto',
  })
}

export { heightInherit, global, panel };