import { css } from '@emotion/react';
import { AlertBanner } from '@guardian/stand/alert-banner';
import { Grid, Item } from '@guardian/stand/grid';
import { Layout, Sidebar } from '@guardian/stand/layout';
import { TopBar, TopBarToolName } from '@guardian/stand/TopBar';
import { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';
import { DocumentSearch } from './components/DocumentSearch';
import { Editor } from './components/Editor';
import { VersionHistory } from './components/VersionHistory';
import { fetchDocuments, fetchSteps } from './libs/api';
import { document } from './model/document';
import type { Document } from './model/document';
import { stepServerResponse } from './model/steps';
import type { SendableSteps, StepSelection } from './model/steps';
import { heightInherit, typography } from './styles';

const App = () => {
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [steps, setSteps] = useState<SendableSteps[]>([]);
  const [stepSelection, setStepSelection] = useState<StepSelection | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments()
      .then(response => response.json())
      .then(json => {
        const documents = z.array(document).parse(json);
        setDocuments(documents.reverse());
      })
      .catch(() => setError('Failed to fetch documents'));
  }, []);

  const fetchStepsAndSetCurrentDocument = useCallback((document: Document) => {
    void fetchSteps(document.id)
      .then(response => response.json()
      ).then(json => stepServerResponse.parse(json)
      ).then(steps => {
        setCurrentDocument(document);
        setSteps(steps.map(step => step.content));
        setStepSelection(null);
        setError(null);
      }).catch(() => setError('Failed to fetch document'));
  }, []);

  const createNewDocument = useCallback((document: Document) => {
    setCurrentDocument(document);
    setDocuments(prevDocuments => [document, ...prevDocuments]);
    setSteps([]);
    setStepSelection(null);
    setError(null);
  }, []);
  
  return (
    <Layout cssOverrides={css(heightInherit)}>
      {(error != null) && (
        <AlertBanner
          level={'error'}
          showIcon={true}
          closeButtonProps={{ onPress: () => setError(null) }}
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
          documents={documents}
          currentDocument={currentDocument}
          setCurrentDocument={fetchStepsAndSetCurrentDocument}
          setError={setError}
        />
      </Sidebar>
      <Grid cssOverrides={css(heightInherit)}>
        <Item size={{sm: 12, md: 8}}>
          <Editor
            currentDocument={currentDocument}
            createNewDocument={createNewDocument}
            setError={setError}
            steps={steps}
            stepSelection={stepSelection}
          />
        </Item>
        <Item size={{ sm: 12, md: 4 }} cssOverrides={css(heightInherit)}>
          <VersionHistory
            steps={steps}
            setStepSelection={setStepSelection}
          />
        </Item>
      </Grid>
    </Layout>
  );
}

export { App };