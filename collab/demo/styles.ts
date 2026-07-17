import { css } from '@emotion/react';
import { baseColors, baseTypography } from '@guardian/stand';

// required for panel scrolling to work correctly.
const heightInherit = {
  height: 'inherit',
  overflow: 'hidden',
};

const font = `normal normal ${baseTypography.size['14-rem']} ${baseTypography.family['Guardian Text Egyptian']}`;

// For overriding Stand component theming
const typography = {
  font,
}

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
    font,
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
  }),
  item: css({
    backgroundColor: baseColors.neutral[900],
    border: `1px solid ${baseColors.neutral[700]}`,
    padding: 10,
    textAlign: 'left',
  }),
  button: css({
    fontFamily: baseTypography.family['Guardian Text Egyptian'],
    fontWeight: baseTypography.weight['Guardian Text Egyptian'].normal,
    width: 'fit-content',
  }),
  selected: css({
    border: `3px solid ${baseColors.orange[400]}`
  }),
}

export { heightInherit, typography, global, panel };