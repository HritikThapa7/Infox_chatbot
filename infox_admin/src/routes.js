import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import { useContext } from 'react';
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import Blog from './pages/Blog';
import NotFound from './pages/Page404';
import { AuthContext } from './context/AuthContext';
import News from './pages/News';
import Gallery from './pages/Gallery';
import Program from './pages/Program';
import Chatbots from './pages/Chatbots';

// ----------------------------------------------------------------------

const PrivateRoute = ({ children }) => {
  const auth = useContext(AuthContext);
  return auth.isAuthenticated() ? children : <Navigate to="/login" />;
};

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        {
          element: <Navigate to="/dashboard/app" replace />
        },
        {
          path: 'app',
          element: (
            <PrivateRoute>
              <DashboardApp />
            </PrivateRoute>
          )
        },
        //   {
        //     path: 'news',
        //     element: (
        //       <PrivateRoute>
        //         <News />
        //       </PrivateRoute>
        //     )
        //   },
        //   {
        //     path: 'programs',
        //     element: (
        //       <PrivateRoute>
        //         <Program />
        //       </PrivateRoute>
        //     )
        //   },
        {
          path: 'chatbots',
          element: <Chatbots />
        }
        //   {
        //     path: 'blog',
        //     element: (
        //       // <PrivateRoute>
        //       <Blog />
        //       // </PrivateRoute>
        //     )
        //   },
        //   {
        //     path: 'gallery',
        //     element: (
        //       // <PrivateRoute>
        //       <Gallery />
        //       // </PrivateRoute>
        //     )
        //   }
      ]
    },

    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/dashboard" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
