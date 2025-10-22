import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface Tab {
  id: string;
  label: string;
  icon?: LucideIcon;
  badge?: string | number;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'default'
}) => {
  if (variant === 'pills') {
    return (
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-tiger-primary-black text-white shadow-tiger'
                  : 'bg-white text-tiger-neutral-700 hover:bg-tiger-neutral-100 shadow-tiger'
              }`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  isActive
                    ? 'bg-white text-tiger-primary-black'
                    : 'bg-tiger-neutral-200 text-tiger-neutral-700'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'underline') {
    return (
      <div className="border-b-2 border-tiger-neutral-200">
        <div className="flex gap-6 -mb-0.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={`px-4 py-3 font-semibold transition-all flex items-center gap-2 border-b-2 ${
                  isActive
                    ? 'border-tiger-primary-black text-tiger-primary-black'
                    : 'border-transparent text-tiger-neutral-600 hover:text-tiger-primary-black hover:border-tiger-neutral-300'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-tiger-neutral-200 text-tiger-neutral-700">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="bg-tiger-neutral-100 rounded-lg p-1 inline-flex gap-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2.5 rounded-md font-semibold transition-all flex items-center gap-2 ${
              isActive
                ? 'bg-white text-tiger-primary-black shadow-tiger'
                : 'text-tiger-neutral-700 hover:text-tiger-primary-black'
            }`}
          >
            {Icon && <Icon className="w-4 h-4" />}
            <span className="hidden sm:inline">{tab.label}</span>
            {tab.badge && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-tiger-neutral-200 text-tiger-neutral-700">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
