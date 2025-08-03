
import React from 'react';
import type { ViewType } from '../types';
import { CreateIcon, ManageIcon } from './Icons';
import { FULL_CONTRACT_ID } from '../constants';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

const NavItem: React.FC<{
  label: string;
  viewName: ViewType;
  currentView: ViewType;
  setView: (view: ViewType) => void;
  children: React.ReactNode;
}> = ({ label, viewName, currentView, setView, children }) => {
  const isActive = currentView === viewName;
  return (
    <li
      onClick={() => setView(viewName)}
      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
        isActive
          ? 'bg-brand-primary text-white'
          : 'text-brand-text-secondary hover:bg-brand-surface hover:text-brand-text'
      }`}
    >
      {children}
      <span className="font-semibold">{label}</span>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  return (
    <aside className="w-64 bg-brand-surface p-4 flex-shrink-0 flex flex-col justify-between">
      <nav>
        <ul className="space-y-2">
          <NavItem label="Create Capsule" viewName="create" currentView={currentView} setView={setView}>
            <CreateIcon className="h-6 w-6" />
          </NavItem>
          <NavItem label="Manage Capsule" viewName="manage" currentView={currentView} setView={setView}>
            <ManageIcon className="h-6 w-6" />
          </NavItem>
        </ul>
      </nav>
      <div className="text-center text-xs text-brand-text-secondary mt-4">
        <p>Contract:</p>
        <p className="font-mono break-all">{FULL_CONTRACT_ID}</p>
        <p className="mt-4">Stacks Testnet</p>
      </div>
    </aside>
  );
};

export default Sidebar;
