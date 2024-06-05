import type { Request, Response } from "express";
/* eslint "import/no-named-as-default-member": "off" -- This is the only way I can see to avoid a warning about the (correct) way express is imported below */
import express from 'express';

const app = express();
const port = 3000;

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/healthcheck', (req: Request, res: Response) => {
    res.send('OK');
});

app.post('/documents/:id/steps', (req: Request, res: Response) => {
  console.log(
    {
      requestBody: req.body as unknown,
      documentId: req.params['id'],
    }
  );
  res.status(202);
  res.send("Received");
});

app.listen(port);
