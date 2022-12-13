// @ts-nocheck
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthContextProvider } from './state/auth/AuthContextProvider';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import BoardPage from './pages/BoardPages/BoardPage';
import ConversationsListPage from './pages/ChatPages/ConversationsListPage';
import ConversationPage from './pages/ChatPages/ConversationPage';
import LoginPage from './pages/LoginPage/LoginPage';
import JoinedBoardsPage from './pages/JoinedBoardsPage/JoinedBoardsPage';
import AppRoot from './components/AppRoot/AppRoot';
import PageNotFound from './pages/PageNotFound/PageNotFound';
import BoardUserListPage from './pages/BoardPages/BoardUserListPage';
import { NavContextProvider } from './state/nav/NavContextProvider';
import SettingsPage from './pages/SettingsPage/SettingsPage';

const router = createBrowserRouter([
  // Signup and login routes do not need to be protected
  {
    path: '/signup',
    element: <SignUpPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <LoginPage />,
  },

  // Everything else should be protected
  {
    path: '/app',
    element: <AppRoot />,
    children: [
      {
        path: '/app/',
        element: <p>not sure what should go here...</p>,
      },
      {
        path: '/app/boards',
        element: <JoinedBoardsPage />,
      },
      {
        path: '/app/boards/:boardId',
        element: <BoardPage />,
      },
      {
        path: '/app/boards/:boardId/users',
        element: <BoardUserListPage />,
      },
      {
        path: '/app/chat',
        element: <ConversationsListPage />,
      },
      {
        path: '/app/chat/:conversationId',
        element: <ConversationPage />,
      },
      {
        path: '/app/settings',
        element: <SettingsPage />,
      },

      // 404 Page for /app sub-route
      {
        path: '*',
        element: <PageNotFound />,
      },
    ],
  },

  // Global 404 Page
  {
    path: '*',
    element: <PageNotFound />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  //<React.StrictMode>
  <AuthContextProvider>
    <NavContextProvider>
      <RouterProvider router={router} />
    </NavContextProvider>
  </AuthContextProvider>
  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
