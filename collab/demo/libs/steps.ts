import { SERVER } from './constants';

const fetchSteps = async (documentId: string) =>
  await fetch(`${SERVER}/document/${documentId}/steps`, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  });

export { fetchSteps };