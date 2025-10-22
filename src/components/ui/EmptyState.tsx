import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction
}) => {
  return (
    <div className="text-center py-12 px-6">
      <div className="inline-flex p-4 rounded-full bg-tiger-neutral-100 mb-4">
        <Icon className="w-12 h-12 text-tiger-neutral-400" />
      </div>
      <h3 className="text-xl font-bold text-tiger-primary-black mb-2">
        {title}
      </h3>
      <p className="text-tiger-neutral-600 mb-6 max-w-md mx-auto">
        {description}
      </p>
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex items-center justify-center gap-3">
          {actionLabel && onAction && (
            <Button onClick={onAction} variant="primary">
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button onClick={onSecondaryAction} variant="ghost">
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
