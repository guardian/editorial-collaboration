import { css } from '@emotion/react';
import { AlertBanner } from '@guardian/stand/alert-banner';
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
import { heightInherit, typography } from './styles';

const App = () => {
  const [currentDocument, setCurrentDocument] = useState<Document | undefined>();
  const [allSteps, setAllSteps] = useState<SendableSteps[]>([]);
  const [currentSteps, setCurrentSteps] = useState<SendableSteps[]>([]);
  const [editing, setEditing] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const fetchStepsAndSetCurrentDocument = useCallback((document: Document) => {
    void fetchSteps(document.id)
      .then(response => response.json()
      ).then(json => stepServerResponse.parse(json)
      ).then(steps => {
        const content = steps.map(step => step.content);
        setAllSteps(content);
        setCurrentSteps(content);
        setCurrentDocument(document);
        setEditing(true);
        setError(undefined);
      }).catch(() => setError('Failed to fetch document'));
  }, []);
  
  return (
    <Layout cssOverrides={css(heightInherit)}>
      {(error != null) && (
        <AlertBanner
          level={'error'}
          showIcon={true}
          closeButtonProps={{ onPress: () => setError(undefined) }}
          cssOverrides={css({width: 'unset'})}
          theme={{
            shared: {
              content: {
                typography
              }
            }
          }}
        >{error}</AlertBanner>
      )}
      <TopBar>
        <TopBarToolName name='Edit History' favicon={{ icon: 'history' }} />
      </TopBar>
      <Sidebar layoutSmBreakpoint='above-grid' cssOverrides={css(heightInherit)}>
        <DocumentSearch
          currentDocument={currentDocument}
          setCurrentDocument={fetchStepsAndSetCurrentDocument}
          setError={setError}
        />
      </Sidebar>
      <Grid cssOverrides={css(heightInherit)}>
        <Item size={{sm: 12, md: 8}}>
          <Editor
            document={currentDocument}
            steps={currentSteps}
            editing={editing}
          />
        </Item>
        <Item size={{ sm: 12, md: 4 }} cssOverrides={css(heightInherit)}>
          <VersionHistory
            steps={allSteps}
            setCurrentSteps={setCurrentSteps}
            setEditing={setEditing}
          />
        </Item>
      </Grid>
    </Layout>
  );
}

export { App };