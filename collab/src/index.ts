/* eslint-disable @typescript-eslint/no-misused-promises -- fixes middleware linting warning, which is a known issue with Express typings, see: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871*/
import type { Request, Response } from 'express';
/* eslint "import/no-named-as-default-member": "off" -- This is the only way I can see to avoid a warning about the (correct) way express is imported below */
import express from 'express';
import { database } from './lib/database';
import { parseSteps } from './lib/parse-steps';
import { authMiddleware } from './middleware/auth-middleware';
import type { Json } from "./types/json";

export const app = express();

app.use(express.json())

app.get('/', authMiddleware, (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.get('/healthcheck', (req: Request, res: Response) => {
    res.send('OK');
});

app.post('/documents/:id/steps', authMiddleware, async (req: Request, res: Response) => {
  const requestBody = req.body as Json;
  const { id } = req.params;
  const parsedSteps = parseSteps(requestBody)

  if (typeof parsedSteps === 'undefined') {
    res.status(400);
    res.send("Not valid steps");
    return;
  }

  if (id == null) {
    res.status(400);
    res.send("Missing required ID parameter");
    return;
  }

  await database.saveSteps(id, parsedSteps).then(() => {
    res.status(202);
    res.send("Received");
  }).catch(() => {
    res.status(500);
    res.send("Error saving steps to database");
  })

});
