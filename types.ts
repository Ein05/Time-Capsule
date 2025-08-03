
export enum CapsuleStatus {
  Pending = 'Pending',
  Locked = 'Locked',
  Unlocked = 'Unlocked',
  Cancelled = 'Cancelled',
}

export interface Capsule {
  id: number;
  owner: string;
  recipient: string;
  content: string;
  unlockBlock: number;
  unlockStxAmount: number; // in micro-STX
  poxStacking: boolean;
  status: CapsuleStatus;
}

export type ViewType = 'create' | 'manage' | 'view';
