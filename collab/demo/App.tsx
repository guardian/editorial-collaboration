import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Editor } from './src/Editor';

const rootNode = document.getElementById('root');

if (rootNode == null) { throw new Error('root node not found'); }

const root = createRoot(rootNode);

const router = createBrowserRouter([{
  path: '/:id',
  element: <Editor />,
}]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);