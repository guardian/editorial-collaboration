import { Grid, Item } from '@guardian/stand/grid';
import { Layout, Sidebar } from '@guardian/stand/layout';
import { TopBar, TopBarToolName } from '@guardian/stand/TopBar';
import { DocumentSearch } from './components/DocumentSearch';
import { Editor } from './components/Editor';
import { EditHistory } from './components/EditHistory';
import { css, Global } from '@emotion/react';
import { baseTypography } from '@guardian/stand';

const globalStyles = css({
  body: {
    fontFamily: baseTypography.family['Guardian Text Egyptian'],
    fontSize: baseTypography.size['14-rem'],
  },
});

const App = () => {
  return (
    <>
      <Global styles={globalStyles} />
      <Layout>
        <TopBar>
          <TopBarToolName name='Edit History Demo' favicon={{ letter: 'C' }} />
        </TopBar>
        <Sidebar layoutSmBreakpoint='above-grid'>
          <DocumentSearch />
        </Sidebar>
        <Grid>
          <Item size={{sm: 12, md: 8}}><Editor /></Item>
          <Item size={{ sm: 12, md: 4 }}><EditHistory /></Item>
        </Grid>
      </Layout>
    </>
  );
}

export { App };