import React from 'react';
import { ChatBubbleLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface SidebarItemProps {
  icon?: React.ReactNode;
  text: string;
  isNew?: boolean;
  subtext?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, isNew, subtext }) => {
  return (
    <div className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 cursor-pointer">
      {icon && <div className="w-5 h-5 mr-3">{icon}</div>}
      <div>
        <div className="text-sm">{text}</div>
        {subtext && <div className="text-xs text-gray-500">{subtext}</div>}
      </div>
      {isNew && (
        <span className="ml-auto text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
          New
        </span>
      )}
    </div>
  );
};

export const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-900 h-screen">
      <div className="p-4">
        <button className="w-full flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 rounded">
          <PlusIcon className="w-5 h-5 mr-2" />
          New chat
        </button>
      </div>
      <div className="space-y-1">
        <SidebarItem 
          icon={<ChatBubbleLeftIcon />}
          text="LEGO sets evolution"
          subtext="Lego KPI"
        />
        <SidebarItem 
          text="Rental stats"
          subtext="Dad (Better Games)"
        />
        <SidebarItem 
          text="Monthly orders"
          subtext="Snowflake, Samples"
        />
        {/* Add more sidebar items as needed */}
      </div>
    </div>
  );
};