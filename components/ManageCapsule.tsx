
import React, { useState } from 'react';
import type { Capsule } from '../types';
import { CapsuleStatus } from '../types';
import { LockIcon, UnlockIcon, CancelIcon } from './Icons';

interface ManageCapsuleProps {
  getCapsule: (id: number) => Promise<Capsule | null>;
  lockCapsule: (id: number) => Promise<Capsule>;
  unlockCapsule: (id: number, stxAmount?: number) => Promise<Capsule>;
  cancelCapsule: (id: number) => Promise<Capsule>;
  isLoading: boolean;
  isConnected: boolean;
  userAddress: string | null;
}

const CapsuleInfoCard: React.FC<{ capsule: Capsule }> = ({ capsule }) => {
  const getStatusColor = (status: CapsuleStatus) => {
    switch (status) {
      case CapsuleStatus.Pending: return 'text-yellow-400 border-yellow-400';
      case CapsuleStatus.Locked: return 'text-blue-400 border-blue-400';
      case CapsuleStatus.Unlocked: return 'text-green-400 border-green-400';
      case CapsuleStatus.Cancelled: return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  return (
    <div className="bg-brand-surface border border-brand-border rounded-lg p-6 mt-6 space-y-4 animate-fade-in">
        <div className="flex justify-between items-start">
            <h3 className="text-2xl font-bold text-brand-text">Capsule #{capsule.id}</h3>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(capsule.status)}`}>
                {capsule.status}
            </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
                <p className="text-brand-text-secondary">Owner:</p>
                <p className="font-mono text-brand-text break-all">{capsule.owner}</p>
            </div>
            <div className="space-y-1">
                <p className="text-brand-text-secondary">Recipient:</p>
                <p className="font-mono text-brand-text break-all">{capsule.recipient}</p>
            </div>
        </div>
        <div>
            <p className="text-brand-text-secondary text-sm">Content:</p>
            <p className="bg-brand-bg p-3 rounded-md mt-1 text-brand-text-secondary font-mono text-sm whitespace-pre-wrap">{capsule.content}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div><p className="text-brand-text-secondary text-sm">Unlock Block</p><p className="font-semibold text-brand-text">{capsule.unlockBlock}</p></div>
            <div><p className="text-brand-text-secondary text-sm">Unlock Fee</p><p className="font-semibold text-brand-text">{capsule.unlockStxAmount / 1000000} STX</p></div>
            <div><p className="text-brand-text-secondary text-sm">PoX Stacking</p><p className="font-semibold text-brand-text">{capsule.poxStacking ? 'Enabled' : 'Disabled'}</p></div>
        </div>
    </div>
  );
};

const ManageCapsule: React.FC<ManageCapsuleProps> = ({ getCapsule, lockCapsule, unlockCapsule, cancelCapsule, isLoading, isConnected, userAddress }) => {
  const [capsuleIdInput, setCapsuleIdInput] = useState('');
  const [selectedCapsule, setSelectedCapsule] = useState<Capsule | null>(null);
  const [unlockStxAmount, setUnlockStxAmount] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFindCapsule = async () => {
    setMessage(null);
    setSelectedCapsule(null);
    if (!capsuleIdInput) return;
    const id = parseInt(capsuleIdInput, 10);
    const capsule = await getCapsule(id);
    if (capsule) {
      setSelectedCapsule(capsule);
    } else {
      setMessage({ type: 'error', text: `Capsule with ID #${id} not found.` });
    }
  };
  
  const handleAction = async (action: 'lock' | 'unlock' | 'cancel') => {
      if (!selectedCapsule) return;
      setMessage(null);
      try {
          let updatedCapsule: Capsule;
          if(action === 'lock') {
              updatedCapsule = await lockCapsule(selectedCapsule.id);
          } else if (action === 'unlock') {
              const amount = selectedCapsule.unlockStxAmount > 0 ? Number(unlockStxAmount) * 1000000 : 0;
              updatedCapsule = await unlockCapsule(selectedCapsule.id, amount);
          } else { // cancel
              updatedCapsule = await cancelCapsule(selectedCapsule.id);
          }
          setSelectedCapsule(updatedCapsule);
          setMessage({ type: 'success', text: `Capsule successfully ${action}ed.` });
      } catch (error) {
           setMessage({ type: 'error', text: error instanceof Error ? error.message : 'An unknown error occurred.' });
      }
  };

  const renderActions = () => {
    if (!selectedCapsule || !isConnected) return null;

    const isOwner = userAddress === selectedCapsule.owner;
    const isRecipient = userAddress === selectedCapsule.recipient;

    switch (selectedCapsule.status) {
      case CapsuleStatus.Pending:
        if (!isOwner) return <p className="text-center text-yellow-400 mt-4">Only the owner can manage this pending capsule.</p>;
        return (
          <div className="flex space-x-4 mt-6">
            <button onClick={() => handleAction('lock')} disabled={isLoading} className="flex-1 bg-brand-accent hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-500 flex items-center justify-center space-x-2"><LockIcon className="h-5 w-5"/><span>Lock</span></button>
            <button onClick={() => handleAction('cancel')} disabled={isLoading} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-500 flex items-center justify-center space-x-2"><CancelIcon className="h-5 w-5"/><span>Cancel</span></button>
          </div>
        );
      case CapsuleStatus.Locked:
        if (!isRecipient) return <p className="text-center text-yellow-400 mt-4">Only the recipient can unlock this capsule.</p>;
        return (
          <div className="mt-6 space-y-4">
            {selectedCapsule.unlockStxAmount > 0 && (
              <div>
                <label className="block text-sm font-medium text-brand-text-secondary mb-1">Payment ({selectedCapsule.unlockStxAmount / 1000000} STX)</label>
                <input type="number" value={unlockStxAmount} onChange={e => setUnlockStxAmount(e.target.value)} placeholder="Enter STX amount" className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 focus:ring-brand-primary focus:border-brand-primary" />
              </div>
            )}
            <button onClick={() => handleAction('unlock')} disabled={isLoading} className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-500 flex items-center justify-center space-x-2"><UnlockIcon className="h-5 w-5"/><span>Unlock</span></button>
          </div>
        );
      default:
        return <p className="text-center text-gray-400 mt-6">This capsule is finalized and no further actions can be taken.</p>;
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold mb-2 text-brand-text">Manage a Time Capsule</h2>
      <p className="text-brand-text-secondary mb-6">Find a capsule by its ID to view its status and perform actions.</p>
      
      <div className="flex space-x-2">
        <input
          type="number"
          value={capsuleIdInput}
          onChange={(e) => setCapsuleIdInput(e.target.value)}
          placeholder="Enter Capsule ID #"
          className="flex-grow bg-brand-bg border border-brand-border rounded-lg px-3 py-2 focus:ring-brand-primary focus:border-brand-primary"
        />
        <button onClick={handleFindCapsule} disabled={isLoading} className="bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 disabled:bg-gray-500">
          {isLoading && !selectedCapsule ? 'Finding...' : 'Find'}
        </button>
      </div>

      {isLoading && !selectedCapsule && <div className="text-center p-8">Loading...</div>}
      
      {selectedCapsule && <CapsuleInfoCard capsule={selectedCapsule} />}
      
      {message && (
        <div className={`mt-4 p-4 rounded-lg text-center ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
          {message.text}
        </div>
      )}

      {selectedCapsule && !isConnected && <p className="text-center text-yellow-400 text-sm mt-4">Connect your wallet to manage this capsule.</p>}

      {renderActions()}

    </div>
  );
};

export default ManageCapsule;
