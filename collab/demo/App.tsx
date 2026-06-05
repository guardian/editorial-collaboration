import { css, Global } from '@emotion/react';
import { baseTypography } from '@guardian/stand';
import { Grid, Item } from '@guardian/stand/grid';
import { Layout, Sidebar } from '@guardian/stand/layout';
import { TopBar, TopBarToolName } from '@guardian/stand/TopBar';
import { useState } from 'react';
import { Documents } from './components/Documents';
import { EditHistory } from './components/EditHistory';
import { Editor } from './components/Editor';

// required for panel scrolling to work correctly.
const heightInherit = {
  height: 'inherit',
  overflow: 'hidden',
}

const globalStyles = css({
  '#root': heightInherit,
  body: {
    height: '100%',
    fontFamily: baseTypography.family['Guardian Text Egyptian'],
    fontSize: baseTypography.size['14-rem'],
  },
});

const App = () => {
  const [currentDocumentId, setCurrentDocumentId] = useState<string | undefined>();
  return (
    <>
      <Global styles={globalStyles} />
      <Layout cssOverrides={css(heightInherit)}>
        <TopBar>
          <TopBarToolName name='Edit History' favicon={{ icon: 'history' }} />
        </TopBar>
        <Sidebar layoutSmBreakpoint='above-grid' cssOverrides={css(heightInherit)}>
          <Documents setDocumentId={setCurrentDocumentId} currentDocumentId={currentDocumentId} />
        </Sidebar>
        <Grid>
          <Item size={{sm: 12, md: 8}}><Editor documentId={currentDocumentId} /></Item>
          <Item size={{ sm: 12, md: 4 }}><EditHistory /></Item>
        </Grid>
      </Layout>
    </>
  );
}

export { App };