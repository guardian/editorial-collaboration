/* eslint-disable @typescript-eslint/no-misused-promises -- fixes middleware linting warning, which is a known issue with Express typings, see: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871*/
import cors from 'cors';
import type { Request, Response } from 'express';
/* eslint "import/no-named-as-default-member": "off" -- This is the only way I can see to avoid a warning about the (correct) way express is imported below */
import express from 'express';
import { DOMAIN } from './constants';
import { database } from './lib/database';
import { parseSteps } from './lib/parse-steps';
import { authMiddleware } from './middleware/auth-middleware';
import type { Json } from './types/json';

export const app = express();

app.use(express.json());

app.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({
  origin: `https://composer.${DOMAIN}`,
  credentials: true
}));

app.get('/', authMiddleware, (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.get('/healthcheck', (req: Request, res: Response) => {
    res.send('OK');
});

app.get('/documents', authMiddleware, async  (req: Request, res: Response) => {
  const documentIds = await database.listDocumentIds()
  res.json( { documentIds})
})

app.get('/documents/:id', authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  if ( typeof id !== 'string' || id === '') {
     res.status(400).send('No id');
     return;
  }
  const steps = await database.getStepsForDocument(id)
  res.json( {id, steps})
})

app.post('/documents/:id/steps', authMiddleware, async (req: Request, res: Response) => {
  const requestBody = req.body as Json;
  const { id } = req.params;
  const parsedSteps = parseSteps(requestBody)

  if (typeof parsedSteps === 'undefined') {
    res.status(400);
    res.send('Not valid steps');
    return;
  }

  if (id == null) {
    res.status(400);
    res.send('Missing required ID parameter');
    return;
  }

  await database.saveSteps(id, parsedSteps).then(() => {
    res.status(202);
    res.send('Received');
  }).catch(() => {
    res.status(500);
    res.send('Error saving steps to database');
  })

});
