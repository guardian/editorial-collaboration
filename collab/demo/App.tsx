import { css } from '@emotion/react';
import { Editor } from './components/Editor';

const style = css({
  margin: '5% auto',
  width: '80%',
  height: '100vh',
});

const App = () => {
  return <div css={style}><Editor /></div>;
}

export { App };