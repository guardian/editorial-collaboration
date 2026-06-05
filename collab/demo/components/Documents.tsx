import { css } from '@emotion/react';
import { baseColors, baseTypography } from '@guardian/stand';
import { Button } from '@guardian/stand/button';
import type { FunctionComponent } from 'react';
import { useCallback, useEffect , useState } from 'react';
import { z } from 'zod';
import { getMonthName } from '../libs/constants';
import { fetchDocuments, registerDocument } from '../libs/documents';
import { document } from '../model/document';
import type { Document } from '../model/document';
import { v4 } from 'uuid';
import { createNewEditorState } from '../libs/prosemirror-config';

type DocumentSearchProps = {
  currentDocument: Document | undefined;
  setCurrentDocument: (document: Document | undefined) => void;
};

const style = {
  panel: css({
    backgroundColor: baseColors.neutral[800],
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: 'inherit',
  }),
  header: css({
    width: 'stretch',
    backgroundColor: baseColors.neutral[700],
    padding: 10,
    fontSize: baseTypography.size['16-rem'],
    fontWeight: baseTypography.weight['Guardian Text Egyptian'].bold,
  }),
  contents: css({
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    width: 'stretch',
    padding: '10px',
    overflowX: 'hidden',
    overflowY: 'auto',
  }),
  documentEntry: (isCurrentDocument: boolean) => css({
    backgroundColor: baseColors.neutral[900],
    border: isCurrentDocument ?
      `3px solid ${baseColors.orange[400]}` :
      `1px solid ${baseColors.neutral[700]}`,
    padding: 10,
    textAlign: 'left',
  }),
  button: css({
    fontFamily: baseTypography.family['Guardian Text Egyptian'],
    fontWeight: baseTypography.weight['Guardian Text Egyptian'].normal,
    width: 'fit-content',
  }),
};

const getDate = (timestamp: string) => {
  const date = new Date(timestamp);
  if (date.toString() === 'Invalid Date') {
    return;
  }
  return `${date.getDate()} ${getMonthName(date.getMonth())}, ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
}

const Documents: FunctionComponent<DocumentSearchProps> = ({
  currentDocument,
  setCurrentDocument,
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setPending(true);
    fetchDocuments()
      .then(response => response.json())
      .then(json => {
        const documents = z.array(document).parse(json);
        setDocuments(documents);
      })
      .catch(err => console.error(err))
      .finally(() => setPending(false));
  }, []);

  const onClick = useCallback(async (id?: string) => {
    const maybeDocument = documents.find(document => document.id === id);
    if (maybeDocument) {
      setCurrentDocument(maybeDocument);
    } else {
      setPending(true);
      const id = v4();
      const state = createNewEditorState();
      await registerDocument(id, state)
        .then(response => response.json())
        .then(json => {
          const newDocument = document.parse(json);
          setCurrentDocument(newDocument);
          setDocuments([...documents, newDocument]);
        })
        .catch(err => console.error(err))
        .finally(() => setPending(false));
    }
  }, [documents, setCurrentDocument]);

  const DocumentEntry = (document: Document) => {
    return (
      <button
        css={style.documentEntry(currentDocument?.id === document.id)}
        onClick={() => onClick(document.id)}
      >
        <div>{document.id}</div>
        <div>created: {getDate(document.timestamp)}</div>
      </button>
    );
  }

  return (
    <div css={style.panel}>
      <div css={style.header}>Documents</div>
      <div css={style.contents}>
        {documents.length > 0 ?
          (documents.map(document =>
            <DocumentEntry key={document.id} {...document} />
          )) :
          (<div>No documents found</div>)
        }
        <Button isDisabled={pending} cssOverrides={style.button} onClick={() => onClick()}>Create New Document</Button>
      </div>
    </div>
  );
};

export { Documents };