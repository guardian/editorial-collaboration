import { css } from '@emotion/react';
import { baseColors, baseTypography } from '@guardian/stand';
import { Button } from '@guardian/stand/button';
import type { FunctionComponent } from 'react';
import { useCallback, useEffect , useState } from 'react';
import { v4 } from 'uuid';
import { z } from 'zod';
import { getMonthName } from '../libs/constants';
import { getDocuments } from '../libs/register-document';

type DocumentSearchProps = {
  setDocumentId: (id: string) => void;
  currentDocumentId: string | undefined;
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

const document = z.object({
  id: z.string(),
  timestamp: z.string(),
});
type Document = z.infer<typeof document>;

const parseDocuments = (response: unknown): Document[] => {
  const documents = z.array(document).safeParse(response);
  if (documents.success) {
    return documents.data;
  }
  return [];
}

const getDate = (timestamp: string) => {
  const date = new Date(timestamp);
  if (date.toString() === 'Invalid Date') {
    return;
  }
  return `${date.getDate()} ${getMonthName(date.getMonth())}, ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
}

const Documents: FunctionComponent<DocumentSearchProps> = ({
  setDocumentId,
  currentDocumentId,
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    getDocuments()
      .then(response => response.json())
      .then(json => setDocuments(parseDocuments(json)))
      .catch(err => console.error(err));
  }, []);

  const onClick = useCallback((id?: string) => setDocumentId(id ?? v4()), [setDocumentId]);

  const DocumentEntry = (document: Document) => {
    return (
      <button
        css={style.documentEntry(currentDocumentId === document.id)}
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
        <Button cssOverrides={style.button} onClick={() => onClick()}>Create New Document</Button>
      </div>
    </div>
  );
};

export { Documents };