import type { FunctionComponent } from 'react';
import { useCallback } from 'react';
import { formatDate } from '../libs/format-date';
import type { Document } from '../model/document';
import { panel as style } from '../styles';

type DocumentSearchProps = {
  documents: Document[];
  currentDocument: Document | null;
  setCurrentDocument: (document: Document) => void;
  setError: (error: string) => void;
};

const DocumentSearch: FunctionComponent<DocumentSearchProps> = ({
  documents,
  currentDocument,
  setCurrentDocument,
  setError,
}) => {
  const onClick = useCallback((id: string) => {
    const maybeDocument = documents.find(document => document.id === id);
    if (maybeDocument != undefined) {
      setCurrentDocument(maybeDocument);
    } else {
      setError('Document not found');
    }
  }, [documents, setCurrentDocument, setError]);

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
      </div>
    </div>
  );
};

export { DocumentSearch };