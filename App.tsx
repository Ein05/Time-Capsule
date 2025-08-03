
import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CreateCapsuleForm from './components/CreateCapsuleForm';
import ManageCapsule from './components/ManageCapsule';
import { useStacks } from './hooks/useStacks';
import type { ViewType } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('create');
  const { 
    isConnected, 
    userAddress, 
    isLoading, 
    connectWallet, 
    disconnectWallet,
    createCapsule,
    getCapsule,
    lockCapsule,
    unlockCapsule,
    cancelCapsule,
  } = useStacks();

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Header
        isConnected={isConnected}
        userAddress={userAddress}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
        isLoading={isLoading}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentView={view} setView={setView} />
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {view === 'create' && (
            <CreateCapsuleForm 
              createCapsule={createCapsule}
              isLoading={isLoading}
              isConnected={isConnected}
            />
          )}
          {view === 'manage' && (
            <ManageCapsule 
              getCapsule={getCapsule}
              lockCapsule={lockCapsule}
              unlockCapsule={unlockCapsule}
              cancelCapsule={cancelCapsule}
              isLoading={isLoading}
              isConnected={isConnected}
              userAddress={userAddress}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
