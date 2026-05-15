import { Button } from '@guardian/stand/button';
import { css } from '@emotion/react';
import { baseColors, baseTypography } from '@guardian/stand';

const style = {
  panel: css({
    backgroundColor: baseColors.neutral['800'],
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }),
  header: css({
    width: 'stretch',
    backgroundColor: baseColors.neutral['700'],
    padding: 10,
    fontSize: baseTypography.size['16-rem'],
    fontWeight: baseTypography.weight['Guardian Text Egyptian'].bold,
  }),
  contents: css({
    padding: 10,
  }),
  button: css({
    fontFamily: baseTypography.family['Guardian Text Egyptian'],
    fontWeight: baseTypography.weight['Guardian Text Egyptian'].normal,
  })
}

const DocumentSearch = () => {
  return (
    <div css={style.panel}>
      <div css={style.header}>Document search</div>
      <div css={style.contents}>
        <p>Open an existing document or create a new one</p>
        <Button cssOverrides={style.button}>Create New Article</Button>
      </div>
    </div>

  );
};

export { DocumentSearch };