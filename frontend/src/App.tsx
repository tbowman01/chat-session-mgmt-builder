import React from 'react';
import { WizardProvider } from '@/contexts/WizardContext';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { PrivateRoute } from '@/components/auth/PrivateRoute';
import ChatManagerBuilder from '@/components/ChatManagerBuilder';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <PrivateRoute>
        <WizardProvider>
          <div className="App">
            <ChatManagerBuilder />
          </div>
        </WizardProvider>
      </PrivateRoute>
    </AuthProvider>
  );
}

export default App;