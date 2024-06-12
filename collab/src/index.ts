/* eslint-disable @typescript-eslint/no-misused-promises -- fixes middleware linting warning, which is a known issue with Express typings, see: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/50871*/
import type { Request, Response } from "express";
/* eslint "import/no-named-as-default-member": "off" -- This is the only way I can see to avoid a warning about the (correct) way express is imported below */
import express from 'express';
import {authMiddleware} from "./middleware/auth-middleware";

export const app = express();

app.use(express.json())

app.get('/', authMiddleware, (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.get('/healthcheck', (req: Request, res: Response) => {
    res.send('OK');
});

app.post('/documents/:id/steps', authMiddleware, (req: Request, res: Response) => {
  console.log(
    {
      requestBody: req.body as unknown,
      documentId: req.params['id'],
    }
  );
  res.status(202);
  res.send("Received");
});
