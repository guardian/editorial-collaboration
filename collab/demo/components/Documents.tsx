import { css } from '@emotion/react';
import { baseColors, baseTypography } from '@guardian/stand';
import { Button } from '@guardian/stand/button';
import type { FunctionComponent } from 'react';
import { useCallback, useEffect , useState } from 'react';
import { v4 } from 'uuid';
import { z } from 'zod';
import { fetchDocuments, registerDocument } from '../libs/api';
import { getMonthName } from '../libs/constants';
import { createNewEditorState } from '../libs/prosemirror-config';
import { document } from '../model/document';
import type { Document } from '../model/document';
import { panel } from '../styles';

type DocumentSearchProps = {
  currentDocument: Document | undefined;
  setCurrentDocument: (document: Document | undefined) => void;
};

const style = {
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
  const { container, header, contents } = panel;
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

  const onClick = useCallback((id?: string) => {
    const maybeDocument = documents.find(document => document.id === id);
    if (maybeDocument != undefined) {
      setCurrentDocument(maybeDocument);
    } else {
      setPending(true);
      const id = v4();
      const state = createNewEditorState();
      void registerDocument(id, state)
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
    <div css={container}>
      <div css={header}>Document Search</div>
      <div css={contents}>
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