import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthContextProvider } from './state/auth/AuthContextProvider';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import HomePage from './pages/HomePage/HomePage';
import ExamplePage from './pages/ExamplePage/ExamplePage';
import BoardPage from './pages/BoardPage/BoardPage';
import ConversationsListPage from './pages/ChatPages/ConversationsListPage';
import ConversationPage from './pages/ChatPages/ConversationPage';
import LoginPage from './pages/LoginPage/LoginPage';
import ProtectedPage from './pages/ProtectedPage/ProtectedPage';

const router = createBrowserRouter([
  {
    path: '/signup',
    element: <SignUpPage />,
  },
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
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/protected/',
    element: (
      <ProtectedPage>
        <p>Can only see this if you're logged in!!!</p>
      </ProtectedPage>
    ),
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
