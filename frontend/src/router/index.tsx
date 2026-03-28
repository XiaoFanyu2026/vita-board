import { createBrowserRouter, Navigate } from 'react-router-dom';
import React, { Suspense } from 'react';
import { AuthGuard } from './AuthGuard';
import { AppLayout } from '../components/Layout';

const Login = React.lazy(() => import('../pages/Login'));
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const WhiteboardList = React.lazy(() => import('../pages/WhiteboardList'));
const WhiteboardEditor = React.lazy(() => import('../pages/WhiteboardEditor'));
const UserManagement = React.lazy(() => import('../pages/UserManagement'));
const DepartmentManagement = React.lazy(() => import('../pages/DepartmentManagement'));
const RoleManagement = React.lazy(() => import('../pages/RoleManagement'));

const PageLoading = () => <div style={{ padding: 50, textAlign: 'center' }}>加载中...</div>;

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Suspense fallback={<PageLoading />}><Login /></Suspense>,
  },
  {
    path: '/board/:id',
    element: (
      <AuthGuard>
        <Suspense fallback={<PageLoading />}>
          <WhiteboardEditor />
        </Suspense>
      </AuthGuard>
    ),
  },
  {
    path: '/',
    element: <AuthGuard><AppLayout /></AuthGuard>,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Suspense fallback={<PageLoading />}><Dashboard /></Suspense> },
      { path: 'users', element: <Suspense fallback={<PageLoading />}><UserManagement /></Suspense> },
      { path: 'departments', element: <Suspense fallback={<PageLoading />}><DepartmentManagement /></Suspense> },
      { path: 'roles', element: <Suspense fallback={<PageLoading />}><RoleManagement /></Suspense> },
      { path: 'whiteboards', element: <Suspense fallback={<PageLoading />}><WhiteboardList /></Suspense> },
    ]
  }
]);
