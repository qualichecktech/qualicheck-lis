// src/routes/AppRoutes.jsx
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import { LoadingOverlay } from '../components/common/LoadingSpinner';
import { navigationConfig, flattenRoutes } from './navigationConfig';
import ComingSoon from '../pages/ComingSoon';

// Lazy-loaded top-level pages.
const Login = lazy(() => import('../pages/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Forbidden = lazy(() => import('../pages/Forbidden'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Lazy-loaded implemented module pages.
// Add new entries here as each module gets built; everything else in
// navigationConfig automatically falls back to <ComingSoon />.
const IMPLEMENTED_PAGES = {
  '/dashboard': Dashboard,
  '/laboratory/test-catalog': lazy(() => import('../modules/laboratory/pages/TestCatalog')),
  '/laboratory/reference-ranges': lazy(() => import('../modules/laboratory/pages/ReferenceRanges')),
};

const routeItems = flattenRoutes(navigationConfig);

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {routeItems.map((item) => {
            const PageComponent = IMPLEMENTED_PAGES[item.path];
            return (
              <Route
                key={item.path}
                path={item.path}
                element={
                  <ProtectedRoute permission={item.permission}>
                    {PageComponent ? <PageComponent /> : <ComingSoon label={item.label} />}
                  </ProtectedRoute>
                }
              />
            );
          })}

          <Route path="/403" element={<Forbidden />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
