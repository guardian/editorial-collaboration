import type { Request, Response } from 'express';
import express, { static as serveStatic } from 'express';

export const app = express();

app.use('/public', serveStatic('demo/dist'));

app.get('/:id', (req: Request, res: Response) => {
  res.send(`
	    <!doctype html>
	    <html lang="en">
	      <head>
	        <title>Edit History - Demo</title>
	        <meta charset="UTF-8" />
	        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
	      </head>
	      <body>
	        <div id="root"></div>
	        <script src="/public/main.js"></script>
	      </body>
	    </html>
	`);
});

const port = 3001;

app.listen(port, () => {
  console.log(`Demo app listening on port ${port}`);
});