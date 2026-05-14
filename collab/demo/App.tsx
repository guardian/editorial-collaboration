import { css } from '@emotion/react';
import { Editor } from './components/Editor';
import {Sidebar} from "./components/Sidebar";

const style = css({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) [decoration-start title-start] repeat(3, 60px) [title-end content-start] repeat(12, 60px) [content-end hide-start] 60px [decoration-end hide-end] minmax(0, 1fr)',
  gridAutoColumns: '60px',
  gridTemplateRows: '[headline-start content-start content-toggleable-start controls-start] auto [controls-end] auto [headline-end treats-start] auto [content-end content-toggleable-end treats-end bottom-content-start] auto [bottom-content-end]',
  columnGap: '20px',
  placeItems: 'center',
  placeContent: 'center',
});

const App = () => {
  return (
    <div css={style}>

      <Sidebar />
      <Editor />
    </div>
  );
}

export { App };