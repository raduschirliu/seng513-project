import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import ExamplePage from './pages/ExamplePage/ExamplePage';
import BoardPage from './pages/BoardPage/BoardPage';
import ConversationsListPage from './pages/ChatPages/ConversationsListPage';
import ConversationPage from './pages/ChatPages/ConversationPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/example',
    element: <ExamplePage />,
  },
  {
    path: '/board/:boardId',
    element: <BoardPage />,
  },
  {
    path: '/chat',
    element: <ConversationsListPage />,
  },
  {
    path: '/chat/:conversationId',
    element: <ConversationPage />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
