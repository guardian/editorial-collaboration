/* eslint-disable @typescript-eslint/no-misused-promises -- fixes middleware linting warning, which is a known issue with Express typings, see: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871*/
import cors from 'cors';
import type { Request, Response } from 'express';
/* eslint "import/no-named-as-default-member": "off" -- This is the only way I can see to avoid a warning about the (correct) way express is imported below */
import express from 'express';
import z from 'zod';
import { DOMAIN } from './constants';
import { database } from './lib/database';
import { authMiddleware } from './middleware/auth-middleware';
import type { Json } from './model/json';
import { sendableSteps } from './model/step';

export const app = express();

app.use(express.json());

app.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({
  origin: [`https://composer.${DOMAIN}`, `https://editorial-collaboration-demo.${DOMAIN}`],
  credentials: true
}));

app.get('/', authMiddleware, (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.get('/healthcheck', (req: Request, res: Response) => {
    res.send('OK');
});

app.post('/document/:id/steps', authMiddleware, async (req: Request, res: Response) => {
  const requestBody = req.body as Json;
  const { id } = req.params;
  const result = z.array(sendableSteps).safeParse(requestBody)

  if (!result.success) {
    res.status(400);
    res.send('Not valid steps');
    return;
  }

  if (id == null) {
    res.status(400);
    res.send('Missing required ID parameter');
    return;
  }

  await database.saveSteps(id, result.data).then(() => {
    res.status(202);
    res.send('Received');
  }).catch(() => {
    res.status(500);
    res.send('Error saving steps to database');
  });
});

app.get('/document/:id/steps', authMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;

  if (id == null) {
    res.status(400);
    res.send('Missing required ID parameter');
    return;
  }

  await database.readSteps(id).then(steps => {
    res.status(200);
    res.send(steps);
  }).catch(() => {
    res.status(500);
    res.send('Error retrieving steps from database');
  });
});


app.post('/document/:id/register', authMiddleware, async (req: Request, res: Response) => {
  const requestBody = req.body as Json;
  const { id } = req.params;

  // TODO - type validation of request body / document

  if (id == null) {
    res.status(400);
    res.send('Missing required ID parameter');
    return;
  }

  await database.saveDocument(id, requestBody).then((document) => {
    res.status(202);
    res.send(document);
  }).catch(() => {
    res.status(500);
    res.send('Error saving document to database');
  })
});

app.get('/documents', authMiddleware, async (req: Request, res: Response) => {
  await database.readDocuments().then(ids => {
    res.status(200);
    res.send(ids);
  }).catch(() => {
    res.status(500);
    res.send('Error fetching document ids from database');
  });
});
