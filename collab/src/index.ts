import type { Request, Response } from "express";
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
