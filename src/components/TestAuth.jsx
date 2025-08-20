import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function TestAuth() {
  const { currentUser, login, logout } = useAuth();

  const handleTestLogin = () => {
    const testUser = {
      uid: 'test123',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: null
    };
    login(testUser);
  };

  const handleTestLogout = () => {
    logout();
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Authentication Test</h2>
      
      {currentUser ? (
        <div>
          <p>✅ Logged in as: {currentUser.displayName}</p>
          <p>Email: {currentUser.email}</p>
          <p>UID: {currentUser.uid}</p>
          <button onClick={handleTestLogout} style={{ 
            background: '#e74c3c', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Test Logout
          </button>
        </div>
      ) : (
        <div>
          <p>❌ Not logged in</p>
          <button onClick={handleTestLogin} style={{ 
            background: '#27ae60', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Test Login
          </button>
        </div>
      )}
      
      <div style={{ marginTop: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
        <h3>Current Auth State:</h3>
        <pre>{JSON.stringify({ currentUser }, null, 2)}</pre>
      </div>
    </div>
  );
}

export default TestAuth;
