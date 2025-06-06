import React from 'react';
import { Search, Filter, Download } from 'lucide-react';

interface FiltersProps {
  filters: {
    status: string;
    category: string;
    search: string;
  };
  onFiltersChange: (filters: any) => void;
  onExport: (format: 'json' | 'csv') => void;
}

export function Filters({ filters, onFiltersChange, onExport }: FiltersProps) {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'available', label: 'Available' },
    { value: 'occupied', label: 'Occupied' },
    { value: 'reserved', label: 'Reserved' },
    { value: 'dhcp', label: 'DHCP' },
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'servers', label: 'Servers' },
    { value: 'workstations', label: 'Workstations' },
    { value: 'printers', label: 'Printers' },
    { value: 'cameras', label: 'Cameras' },
    { value: 'network', label: 'Network Equipment' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filters</span>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search IPs, hostnames..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400"
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={filters.category}
            onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onExport('json')}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>JSON</span>
          </button>
          <button
            onClick={() => onExport('csv')}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
}