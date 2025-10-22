import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  color?: string;
}

export interface QuickActionsProps {
  actions: QuickAction[];
}

export const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {actions.map((action) => {
        const Icon = action.icon;
        const colorClass = action.color || 'from-tiger-neutral-700 to-tiger-neutral-900';

        return (
          <button
            key={action.id}
            onClick={action.onClick}
            className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-tiger hover:shadow-tiger-lg transition-all group"
          >
            <div className={`flex-shrink-0 p-3 rounded-lg bg-gradient-to-br ${colorClass} group-hover:scale-110 transition-transform`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-tiger-primary-black text-left">
              {action.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
