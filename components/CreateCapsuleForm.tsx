
import React, { useState } from 'react';

interface CreateCapsuleFormProps {
  createCapsule: (details: {
    recipient: string;
    content: string;
    unlockBlock: number;
    unlockStxAmount: number;
    poxStacking: boolean;
  }) => Promise<number>;
  isLoading: boolean;
  isConnected: boolean;
}

const CreateCapsuleForm: React.FC<CreateCapsuleFormProps> = ({ createCapsule, isLoading, isConnected }) => {
  const [recipient, setRecipient] = useState('');
  const [content, setContent] = useState('');
  const [unlockBlock, setUnlockBlock] = useState('');
  const [unlockStx, setUnlockStx] = useState('');
  const [poxStacking, setPoxStacking] = useState(false);
  
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      setMessage({ type: 'error', text: 'Please connect your wallet first.' });
      return;
    }
    
    setMessage(null);
    try {
      const capsuleId = await createCapsule({
        recipient,
        content,
        unlockBlock: Number(unlockBlock),
        unlockStxAmount: unlockStx ? Number(unlockStx) * 1000000 : 0, // Convert STX to micro-STX
        poxStacking,
      });
      setMessage({ type: 'success', text: `Capsule created successfully! ID: ${capsuleId}` });
      // Reset form
      setRecipient('');
      setContent('');
      setUnlockBlock('');
      setUnlockStx('');
      setPoxStacking(false);
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold mb-6 text-brand-text">Create a New Time Capsule</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="recipient" className="block text-sm font-medium text-brand-text-secondary mb-1">
              Recipient Wallet Address
            </label>
            <input
              id="recipient"
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="ST..."
              required
              className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
          <div>
            <label htmlFor="unlockBlock" className="block text-sm font-medium text-brand-text-secondary mb-1">
              Unlock Block Height
            </label>
            <input
              id="unlockBlock"
              type="number"
              min="1"
              value={unlockBlock}
              onChange={(e) => setUnlockBlock(e.target.value)}
              placeholder="e.g., 850000"
              required
              className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-brand-text-secondary mb-1">
            Capsule Content (Text or IPFS Hash)
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="Your secret message or ipfs://..."
            required
            className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 focus:ring-brand-primary focus:border-brand-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <label htmlFor="unlockStx" className="block text-sm font-medium text-brand-text-secondary mb-1">
                Optional STX Unlock Amount
              </label>
              <input
                id="unlockStx"
                type="number"
                min="0"
                step="0.000001"
                value={unlockStx}
                onChange={(e) => setUnlockStx(e.target.value)}
                placeholder="e.g., 10.5"
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <div className="flex items-center justify-start mt-4">
                <label htmlFor="poxStacking" className="flex items-center cursor-pointer">
                <div className="relative">
                    <input id="poxStacking" type="checkbox" className="sr-only" checked={poxStacking} onChange={() => setPoxStacking(!poxStacking)} />
                    <div className="block bg-brand-bg border-2 border-brand-border w-14 h-8 rounded-full"></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${poxStacking ? 'transform translate-x-full bg-brand-accent' : 'bg-brand-text-secondary'}`}></div>
                </div>
                <div className="ml-3 text-brand-text-secondary font-medium">
                    Enable PoX Stacking?
                </div>
                </label>
            </div>
        </div>

        <div className="pt-2">
            <button
                type="submit"
                disabled={isLoading || !isConnected}
                className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : 'Create Capsule'}
            </button>
            {!isConnected && <p className="text-center text-yellow-400 text-sm mt-4">Please connect wallet to create a capsule.</p>}
        </div>
      </form>
      {message && (
        <div className={`mt-4 p-4 rounded-lg text-center ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default CreateCapsuleForm;
