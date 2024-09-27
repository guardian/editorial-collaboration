import React from 'react';
import { createRoot } from 'react-dom/client';

const rootNode = document.getElementById('root');

if (rootNode == null) { throw new Error('root node not found'); }

const root = createRoot(rootNode);

root.render(
  <React.StrictMode>
    <div>Demo page</div>
  </React.StrictMode>,
);