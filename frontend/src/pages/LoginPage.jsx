import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export function LoginPage({ onLogin }) {
  const { login, register } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        await register(email, password, name);
      } else {
        await login(email, password);
      }
      onLogin();
    } catch (err) {
      setError(err.message || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1A3A5C 0%, #2B5C8A 100%)',
      fontFamily: "'Open Sans', sans-serif",
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '48px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          marginBottom: '8px',
          color: '#1A3A5C',
          fontFamily: "'Montserrat', sans-serif",
        }}>
          {isRegistering ? 'Create Account' : 'Achievement Tracker'}
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#7A7A7A',
          marginBottom: '28px',
        }}>
          {isRegistering ? 'Join to track your performance' : 'Sign in to continue'}
        </p>

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '16px',
                border: '1px solid #E8E8E4',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: "'Open Sans', sans-serif",
              }}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '16px',
              border: '1px solid #E8E8E4',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: "'Open Sans', sans-serif",
            }}
          />

          <input
            type="password"
            placeholder={isRegistering ? 'Password (min 8 characters)' : 'Password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={isRegistering ? 8 : undefined}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '16px',
              border: '1px solid #E8E8E4',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: "'Open Sans', sans-serif",
            }}
          />

          {error && (
            <div style={{
              background: '#FFE0E0',
              color: '#C0392B',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '13px',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#ccc' : '#1A3A5C',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '16px',
            }}
          >
            {loading ? 'Loading...' : isRegistering ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#1A3A5C',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
}
