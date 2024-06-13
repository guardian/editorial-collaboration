/* eslint-disable @typescript-eslint/no-misused-promises -- fixes middleware linting warning, which is a known issue with Express typings, see: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871*/
import type { Request, Response } from "express";
/* eslint "import/no-named-as-default-member": "off" -- This is the only way I can see to avoid a warning about the (correct) way express is imported below */
import express from 'express';
import {authMiddleware} from "./middleware/auth-middleware";
import { validateSteps } from "./lib/parse-steps";

export const app = express();

app.use(express.json())

app.get('/', authMiddleware, (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.get('/healthcheck', (req: Request, res: Response) => {
    res.send('OK');
});

app.post('/documents/:id/steps', authMiddleware, (req: Request, res: Response) => {
  const requestBody = req.body as unknown;
  const validationResult = validateSteps(requestBody)

  console.log(
    {
      requestBody,
      documentId: req.params['id'],
      ...validationResult,
    }
  );

  if (!validationResult.valid) {
    res.status(400);
    res.send("Not valid steps");
    return
  }

  res.status(202);
  res.send("Received");
});
