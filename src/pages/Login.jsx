// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import { FormField, TextInput } from '../components/common/FormField';
import './Login.css';

export default function Login() {
  const { login, isAuthenticated, loading: authLoading, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  if (!authLoading && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await login(email, password);
    setSubmitting(false);
    if (success) navigate(from, { replace: true });
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-brand-mark">QC</div>
          <div>
            <p className="login-brand-name">QualiCheck</p>
            <p className="login-brand-sub">Clinic Information System</p>
          </div>
        </div>

        <h1 className="login-title">Sign in</h1>
        <p className="login-subtitle">Use your clinic-issued account to continue.</p>

        <form onSubmit={handleSubmit}>
          <FormField label="Email" required>
            <TextInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@qualicheck.com"
              autoComplete="username"
              required
            />
          </FormField>

          <FormField label="Password" required>
            <TextInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </FormField>

          {authError && <p className="login-error">{authError}</p>}

          <Button type="submit" fullWidth loading={submitting}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
