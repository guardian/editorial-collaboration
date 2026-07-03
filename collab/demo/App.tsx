import { css } from '@emotion/react';
import { Grid, Item } from '@guardian/stand/grid';
import { Layout, Sidebar } from '@guardian/stand/layout';
import { TopBar, TopBarToolName } from '@guardian/stand/TopBar';
import { useCallback, useState } from 'react';
import { DocumentSearch } from './components/DocumentSearch';
import { Editor } from './components/Editor';
import { VersionHistory } from './components/VersionHistory';
import { fetchSteps } from './libs/api';
import type { Document } from './model/document';
import type { SendableSteps} from './model/steps';
import { stepServerResponse } from './model/steps';
import { heightInherit } from './styles';

const App = () => {
  const [currentDocument, setCurrentDocument] = useState<Document | undefined>();
  const [currentSteps, setCurrentSteps] = useState<SendableSteps[]>([]);

  const fetchStepsAndSetCurrentDocument = useCallback((document: Document) => {
    void fetchSteps(document.id)
      .then(response => response.json()
      ).then(json => stepServerResponse.parse(json)
      ).then(steps => {
        setCurrentSteps(steps.map(step => step.content));
        setCurrentDocument(document);
      });
  }, []);
  
  return (
    <Layout cssOverrides={css(heightInherit)}>
      <TopBar>
        <TopBarToolName name='Edit History' favicon={{ icon: 'history' }} />
      </TopBar>
      <Sidebar layoutSmBreakpoint='above-grid' cssOverrides={css(heightInherit)}>
        <DocumentSearch
          currentDocument={currentDocument}
          setCurrentDocument={fetchStepsAndSetCurrentDocument}
        />
      </Sidebar>
      <Grid cssOverrides={css(heightInherit)}>
        <Item size={{sm: 12, md: 8}}>
          <Editor
            document={currentDocument}
            steps={currentSteps}
          />
        </Item>
        <Item size={{ sm: 12, md: 4 }} cssOverrides={css(heightInherit)}>
          <VersionHistory
            steps={currentSteps}
          />
        </Item>
      </Grid>
    </Layout>
  );
}

export { App };