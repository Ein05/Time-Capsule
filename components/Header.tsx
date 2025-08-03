
import React from 'react';
import { WalletIcon } from './Icons';

interface HeaderProps {
  isConnected: boolean;
  userAddress: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
  isLoading: boolean;
}

const Header: React.FC<HeaderProps> = ({ isConnected, userAddress, connectWallet, disconnectWallet, isLoading }) => {
  return (
    <header className="bg-brand-surface border-b border-brand-border p-4 flex justify-between items-center">
      <h1 className="text-xl md:text-2xl font-bold text-brand-text">
        <span className="text-brand-primary">Time</span> Capsule
      </h1>
      <div>
        {isConnected && userAddress ? (
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block bg-brand-bg text-brand-text-secondary px-4 py-2 rounded-md font-mono text-sm">
              {`${userAddress.substring(0, 5)}...${userAddress.substring(userAddress.length - 5)}`}
            </div>
            <button
              onClick={disconnectWallet}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            disabled={isLoading}
            className="bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            <WalletIcon className="h-5 w-5" />
            <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
