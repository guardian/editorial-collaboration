import { Button } from '@guardian/stand/button';
import type { FunctionComponent } from 'react';
import { useCallback, useEffect , useState } from 'react';
import { v4 } from 'uuid';
import { z } from 'zod';
import { fetchDocuments, registerDocument } from '../libs/api';
import { configureEditorState } from '../libs/configure-editor-state';
import { formatDate } from '../libs/format-date';
import { document } from '../model/document';
import type { Document } from '../model/document';
import { panel as style } from '../styles';

type DocumentSearchProps = {
  currentDocument: Document | undefined;
  setCurrentDocument: (document: Document) => void;
  setError: (error: string) => void;
};

const DocumentSearch: FunctionComponent<DocumentSearchProps> = ({
  currentDocument,
  setCurrentDocument,
  setError,
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
      .catch(() => setError('Failed to fetch documents'))
      .finally(() => setPending(false));
  }, []);

  const onClick = useCallback((id?: string) => {
    const maybeDocument = documents.find(document => document.id === id);
    if (maybeDocument != undefined) {
      setCurrentDocument(maybeDocument);
    } else {
      setPending(true);
      const id = v4();
      const state = configureEditorState();
      void registerDocument(id, state)
        .then(response => response.json())
        .then(json => {
          const newDocument = document.parse(json);
          setCurrentDocument(newDocument);
          setDocuments([...documents, newDocument]);
        })
        .catch(() => setError('Failed to create new document'))
        .finally(() => setPending(false));
    }
  }, [documents, setCurrentDocument]);

  const DocumentItem = (document: Document) => {
    return (
      <button
        css={[style.item, currentDocument?.id === document.id && style.selected]}
        onClick={() => onClick(document.id)}
      >
        <div>{document.id}</div>
        <div>created: {formatDate(document.timestamp)}</div>
      </button>
    );
  }

  return (
    <div css={style.container}>
      <div css={style.header}>Document Search</div>
      <div css={style.contents}>
        {documents.length > 0 ?
          (documents.map(document =>
            <DocumentItem key={document.id} {...document} />
          )) :
          (<div>No documents found</div>)
        }
        <Button isDisabled={pending} cssOverrides={style.button} onClick={() => onClick()}>Create New Document</Button>
      </div>
    </div>
  );
};

export { DocumentSearch };