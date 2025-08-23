import React from 'react';
import { WizardProvider } from '@/contexts/WizardContext';
import ChatManagerBuilder from '@/components/ChatManagerBuilder';
import './App.css';

function App() {
  return (
    <WizardProvider>
      <div className="App">
        <ChatManagerBuilder />
      </div>
    </WizardProvider>
  );
}

export default App;