import React, { useState } from 'react';
import { Edit3, Trash2, Monitor, AlertCircle, CheckCircle, Lock, Wifi } from 'lucide-react';
import { IPEntry } from '../../types';
import { EditIPModal } from './EditIPModal';

interface IPGridProps {
  ips: IPEntry[];
  onEdit: (id: string, data: Partial<IPEntry>) => Promise<IPEntry>;
  onDelete: (id: string) => Promise<void>;
}

export function IPGrid({ ips, onEdit, onDelete }: IPGridProps) {
  const [editingIP, setEditingIP] = useState<IPEntry | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'occupied':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'reserved':
        return <Lock className="w-5 h-5 text-orange-500" />;
      case 'dhcp':
        return <Wifi className="w-5 h-5 text-purple-500" />;
      default:
        return <Monitor className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'border-l-green-500 bg-green-50 dark:bg-green-900/10';
      case 'occupied':
        return 'border-l-red-500 bg-red-50 dark:bg-red-900/10';
      case 'reserved':
        return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/10';
      case 'dhcp':
        return 'border-l-purple-500 bg-purple-50 dark:bg-purple-900/10';
      default:
        return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/10';
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'servers':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'workstations':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'printers':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'cameras':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'network':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this IP entry?')) {
      try {
        await onDelete(id);
      } catch (error) {
        alert('Failed to delete IP entry');
      }
    }
  };

  if (ips.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <Monitor className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No IP addresses found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Add your first IP address to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {ips.map((ip) => (
          <div
            key={ip.id}
            className={`bg-white dark:bg-gray-800 rounded-xl border-l-4 ${getStatusColor(ip.status)} border-r border-t border-b border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(ip.status)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {ip.ip}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {ip.subnet}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingIP(ip)}
                    className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(ip.id)}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {ip.hostname && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Hostname
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {ip.hostname}
                    </p>
                  </div>
                )}

                {ip.category && (
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(ip.category)}`}>
                      {ip.category}
                    </span>
                  </div>
                )}

                {ip.assignedTo && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Assigned To
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {ip.assignedTo}
                    </p>
                  </div>
                )}

                {ip.description && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Description
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {ip.description}
                    </p>
                  </div>
                )}

                {ip.macAddress && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      MAC Address
                    </p>
                    <p className="text-sm font-mono text-gray-900 dark:text-white">
                      {ip.macAddress}
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Updated {new Date(ip.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingIP && (
        <EditIPModal
          ip={editingIP}
          onClose={() => setEditingIP(null)}
          onSave={onEdit}
        />
      )}
    </>
  );
}