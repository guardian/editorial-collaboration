import { Global } from "@emotion/react";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { App } from './App';
import { global } from './styles';

const rootNode = document.getElementById('root');

if (rootNode == null) { throw new Error('root node not found'); }

const router = createBrowserRouter([{
  path: '/',
  errorElement: <>Not found</>,
  element: <App />,
}]);

const root = createRoot(rootNode);
root.render(
  <StrictMode>
    <Global styles={global}></Global>
    <RouterProvider router={router} />
  </StrictMode>,
);