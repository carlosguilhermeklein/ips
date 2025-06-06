import React, { useState } from 'react';
import { Header } from '../Layout/Header';
import { IPGrid } from './IPGrid';
import { Filters } from './Filters';
import { AddIPModal } from './AddIPModal';
import { StatsCards } from './StatsCards';
import { useIPs } from '../../hooks/useAPI';
import { Plus } from 'lucide-react';

export function Dashboard() {
  const { ips, loading, addIP, updateIP, deleteIP, exportData } = useIPs();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    search: '',
  });

  const filteredIPs = ips.filter(ip => {
    if (filters.status !== 'all' && ip.status !== filters.status) return false;
    if (filters.category !== 'all' && ip.category !== filters.category) return false;
    if (filters.search && !ip.ip.includes(filters.search) && 
        !ip.hostname?.toLowerCase().includes(filters.search.toLowerCase()) &&
        !ip.description?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Network Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your IP address allocations and network resources
              </p>
            </div>
            
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Add IP</span>
            </button>
          </div>

          <StatsCards ips={ips} />
          
          <Filters 
            filters={filters} 
            onFiltersChange={setFilters}
            onExport={exportData}
          />
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <IPGrid 
              ips={filteredIPs} 
              onEdit={updateIP}
              onDelete={deleteIP}
            />
          )}
        </div>
      </main>

      {isAddModalOpen && (
        <AddIPModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={addIP}
        />
      )}
    </div>
  );
}