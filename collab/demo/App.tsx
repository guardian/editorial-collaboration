import { css } from '@emotion/react';
import { Grid, Item } from '@guardian/stand/grid';
import { Layout, Sidebar } from '@guardian/stand/layout';
import { TopBar, TopBarToolName } from '@guardian/stand/TopBar';
import { useState } from 'react';
import { Documents } from './components/Documents';
import { EditHistory } from './components/EditHistory';
import { Editor } from './components/Editor';
import type { Document } from './model/document';
import { heightInherit } from './styles';

const App = () => {
  const [currentDocument, setCurrentDocument] = useState<Document | undefined>();
  return (
    <Layout cssOverrides={css(heightInherit)}>
      <TopBar>
        <TopBarToolName name='Edit History' favicon={{ icon: 'history' }} />
      </TopBar>
      <Sidebar layoutSmBreakpoint='above-grid' cssOverrides={css(heightInherit)}>
        <Documents currentDocument={currentDocument} setCurrentDocument={setCurrentDocument} />
      </Sidebar>
      <Grid cssOverrides={css(heightInherit)}>
        <Item size={{sm: 12, md: 8}}><Editor document={currentDocument} /></Item>
        <Item size={{ sm: 12, md: 4 }} cssOverrides={css(heightInherit)}><EditHistory /></Item>
      </Grid>
    </Layout>
  );
}

export { App };