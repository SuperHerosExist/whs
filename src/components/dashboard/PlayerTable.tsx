import React, { useState } from 'react';
import { Search, Edit2, MoreVertical, Check, X } from 'lucide-react';
import type { Player } from '@/types';
import { Badge, EmptyState } from '@/components/ui';

export interface PlayerTableProps {
  players: Player[];
  onEditPlayer?: (player: Player) => void;
  onToggleStatus?: (playerId: string, currentStatus: boolean) => void;
  loading?: boolean;
}

export const PlayerTable: React.FC<PlayerTableProps> = ({
  players,
  onEditPlayer,
  onToggleStatus,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Player>('averageScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (player.grade && player.grade.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();
    return sortDirection === 'asc'
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });

  const handleSort = (field: keyof Player) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tiger-primary-black"></div>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title="No players yet"
        description="Add your first player to get started with roster management"
        actionLabel="Add Player"
        onAction={() => {/* Will be handled by parent */}}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tiger-neutral-400" />
        <input
          type="text"
          placeholder="Search by name, email, or grade..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-tiger-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tiger-primary-black focus:border-transparent transition"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-tiger-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-tiger-neutral-50 border-b-2 border-tiger-neutral-200">
              <tr>
                <th
                  className="px-6 py-4 text-left text-xs font-bold text-tiger-neutral-700 uppercase tracking-wider cursor-pointer hover:bg-tiger-neutral-100 transition"
                  onClick={() => handleSort('name')}
                >
                  Player {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-bold text-tiger-neutral-700 uppercase tracking-wider cursor-pointer hover:bg-tiger-neutral-100 transition"
                  onClick={() => handleSort('grade')}
                >
                  Grade {sortField === 'grade' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-bold text-tiger-neutral-700 uppercase tracking-wider cursor-pointer hover:bg-tiger-neutral-100 transition"
                  onClick={() => handleSort('averageScore')}
                >
                  Average {sortField === 'averageScore' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-bold text-tiger-neutral-700 uppercase tracking-wider cursor-pointer hover:bg-tiger-neutral-100 transition"
                  onClick={() => handleSort('highGame')}
                >
                  High Game {sortField === 'highGame' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-bold text-tiger-neutral-700 uppercase tracking-wider cursor-pointer hover:bg-tiger-neutral-100 transition"
                  onClick={() => handleSort('gamesPlayed')}
                >
                  Games {sortField === 'gamesPlayed' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-tiger-neutral-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-tiger-neutral-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-tiger-neutral-200">
              {sortedPlayers.map(player => (
                <tr key={player.id} className="hover:bg-tiger-neutral-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-tiger-primary-black to-tiger-tiger-darkRed flex items-center justify-center overflow-hidden">
                        {player.photoURL ? (
                          <img
                            src={player.photoURL}
                            alt={player.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-bold text-sm">
                            {player.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="font-semibold text-tiger-primary-black">
                          {player.name}
                        </div>
                        <div className="text-sm text-tiger-neutral-500">
                          {player.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="default">
                      {player.grade ? `Grade ${player.grade}` : 'N/A'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-lg font-black text-tiger-primary-black">
                      {player.averageScore || '--'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-lg font-black text-tiger-primary-black">
                      {player.highGame || '--'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-tiger-neutral-700">
                    {player.gamesPlayed || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onToggleStatus && onToggleStatus(player.id, player.isActive)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                        player.isActive
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {player.isActive ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {player.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEditPlayer && onEditPlayer(player)}
                        className="p-2 text-tiger-neutral-600 hover:text-tiger-primary-black hover:bg-tiger-neutral-100 rounded-lg transition-colors"
                        title="Edit player"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-tiger-neutral-600 hover:text-tiger-primary-black hover:bg-tiger-neutral-100 rounded-lg transition-colors"
                        title="More options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedPlayers.length === 0 && players.length > 0 && (
          <div className="text-center py-12">
            <p className="text-tiger-neutral-600">No players match your search</p>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="text-sm text-tiger-neutral-600">
        Showing {sortedPlayers.length} of {players.length} player{players.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};
