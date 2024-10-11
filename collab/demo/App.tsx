import React from 'react';
import { createRoot } from 'react-dom/client';
import type { Params } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Editor } from './src/Editor';

const rootNode = document.getElementById('root');

if (rootNode == null) { throw new Error('root node not found'); }

const root = createRoot(rootNode);

const loader = async ({ params }: { params: Params }) => {
      const id = params['id'] ?? '';
      return await fetch(`https://editorial-collaboration.local.dev-gutools.co.uk/document/${id}/steps`, {
        mode: 'cors',
        credentials: 'include'
      }).then((res) => res.json() as unknown)
        .catch((error) => {
          return { error: String(error) }
        });
    };

const router = createBrowserRouter([{
  path: '/:id',
  element: <Editor />,
  loader
}]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);