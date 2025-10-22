import React from 'react';
import { RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export interface SyncIndicatorProps {
  status: 'syncing' | 'synced' | 'error' | 'pending';
  lastSyncDate?: Date;
  errorMessage?: string;
  compact?: boolean;
}

export const SyncIndicator: React.FC<SyncIndicatorProps> = ({
  status,
  lastSyncDate,
  errorMessage,
  compact = false
}) => {
  const statusConfig = {
    syncing: {
      icon: RefreshCw,
      text: 'Syncing...',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      iconClass: 'animate-spin'
    },
    synced: {
      icon: CheckCircle,
      text: 'Synced',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      iconClass: ''
    },
    error: {
      icon: AlertCircle,
      text: 'Sync Error',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      iconClass: ''
    },
    pending: {
      icon: Clock,
      text: 'Pending',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      iconClass: ''
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  const getTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 text-xs" title={status === 'error' ? errorMessage : undefined}>
        <Icon className={`w-3 h-3 ${config.color} ${config.iconClass}`} />
        {lastSyncDate && status === 'synced' && (
          <span className="text-tiger-neutral-500">{getTimeAgo(lastSyncDate)}</span>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${config.bgColor} ${config.color}`}>
      <Icon className={`w-4 h-4 ${config.iconClass}`} />
      <div className="flex flex-col">
        <span className="text-sm font-semibold">{config.text}</span>
        {lastSyncDate && status === 'synced' && (
          <span className="text-xs opacity-75">
            Updated {getTimeAgo(lastSyncDate)}
          </span>
        )}
        {status === 'error' && errorMessage && (
          <span className="text-xs opacity-75">{errorMessage}</span>
        )}
      </div>
    </div>
  );
};
