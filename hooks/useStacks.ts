
import { useState, useCallback } from 'react';
import type { Capsule } from '../types';
import { CapsuleStatus } from '../types';

// Mock database for capsules
const mockCapsulesDB = new Map<number, Capsule>();
let nextCapsuleId = 1;

// Seed some initial data
const seedInitialData = () => {
    if (mockCapsulesDB.size > 0) return;
    const initialCapsule: Capsule = {
        id: nextCapsuleId,
        owner: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        recipient: 'ST2CY5V39NHH1E12FBH0HYS1VF2J2M7063CPA718R',
        content: 'Initial secret message for demo purposes.',
        unlockBlock: 840000,
        unlockStxAmount: 1000000, // 1 STX
        poxStacking: true,
        status: CapsuleStatus.Pending,
    };
    mockCapsulesDB.set(nextCapsuleId, initialCapsule);
    nextCapsuleId++;
};

seedInitialData();


export const useStacks = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsConnected(true);
      setUserAddress('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'); // Mock address
      setIsLoading(false);
    }, 500);
  }, []);

  const disconnectWallet = useCallback(() => {
    setIsConnected(false);
    setUserAddress(null);
  }, []);

  const simulateTransaction = <T,>(action: () => T): Promise<T> => {
    return new Promise((resolve, reject) => {
      if (!isConnected || !userAddress) {
        reject(new Error('Wallet not connected.'));
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        try {
          const result = action();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          setIsLoading(false);
        }
      }, 1200);
    });
  };

  const createCapsule = (details: Omit<Capsule, 'id' | 'owner' | 'status'>) => {
    return simulateTransaction(() => {
      const id = nextCapsuleId++;
      const newCapsule: Capsule = {
        ...details,
        id,
        owner: userAddress!,
        status: CapsuleStatus.Pending,
      };
      mockCapsulesDB.set(id, newCapsule);
      return id;
    });
  };

  const getCapsule = (id: number): Promise<Capsule | null> => {
     return new Promise((resolve) => {
       setIsLoading(true);
       setTimeout(() => {
         const capsule = mockCapsulesDB.get(id) || null;
         setIsLoading(false);
         resolve(capsule);
       }, 500);
     });
  };

  const lockCapsule = (id: number) => {
    return simulateTransaction(() => {
      const capsule = mockCapsulesDB.get(id);
      if (!capsule) throw new Error('Capsule not found.');
      if (capsule.owner !== userAddress) throw new Error('Only the owner can lock the capsule.');
      if (capsule.status !== CapsuleStatus.Pending) throw new Error('Capsule is not in a pending state.');
      
      capsule.status = CapsuleStatus.Locked;
      mockCapsulesDB.set(id, capsule);
      return capsule;
    });
  };

  const unlockCapsule = (id: number, paidStxAmount?: number) => {
     return simulateTransaction(() => {
      const capsule = mockCapsulesDB.get(id);
      if (!capsule) throw new Error('Capsule not found.');
      if (capsule.recipient !== userAddress) throw new Error('Only the recipient can unlock the capsule.');
      if (capsule.status !== CapsuleStatus.Locked) throw new Error('Capsule is not locked.');
      if (capsule.unlockStxAmount > 0 && (paidStxAmount || 0) < capsule.unlockStxAmount) {
          throw new Error(`Unlock requires a payment of ${capsule.unlockStxAmount / 1000000} STX.`);
      }
      // In a real scenario, we would check the current block height against capsule.unlockBlock
      
      capsule.status = CapsuleStatus.Unlocked;
      mockCapsulesDB.set(id, capsule);
      return capsule;
    });
  };

  const cancelCapsule = (id: number) => {
    return simulateTransaction(() => {
      const capsule = mockCapsulesDB.get(id);
      if (!capsule) throw new Error('Capsule not found.');
      if (capsule.owner !== userAddress) throw new Error('Only the owner can cancel the capsule.');
      if (capsule.status !== CapsuleStatus.Pending) throw new Error('Can only cancel a pending capsule.');
      
      capsule.status = CapsuleStatus.Cancelled;
      mockCapsulesDB.set(id, capsule);
      return capsule;
    });
  };

  return {
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
  };
};
