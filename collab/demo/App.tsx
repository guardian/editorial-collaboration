import { css } from '@emotion/react';

const style = css({
  border: 'solid 1px black',
  margin: '5% auto',
  width: '80%'
});

const App = () => {
  return <div css={style}>Editor goes here</div>;
}

export { App };