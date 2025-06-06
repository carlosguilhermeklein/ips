import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { IPEntry } from '../types';

const API_BASE = '/ips/api';

export function useAPI() {
  const { token } = useAuth();

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API call failed');
    }

    return response.json();
  };

  return { apiCall };
}

export function useIPs() {
  const [ips, setIps] = useState<IPEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiCall } = useAPI();

  const fetchIPs = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/ips');
      setIps(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch IPs');
    } finally {
      setLoading(false);
    }
  };

  const addIP = async (ipData: Omit<IPEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newIP = await apiCall('/ips', {
        method: 'POST',
        body: JSON.stringify(ipData),
      });
      setIps(prev => [...prev, newIP]);
      return newIP;
    } catch (err) {
      throw err;
    }
  };

  const updateIP = async (id: string, ipData: Partial<IPEntry>) => {
    try {
      const updatedIP = await apiCall(`/ips/${id}`, {
        method: 'PUT',
        body: JSON.stringify(ipData),
      });
      setIps(prev => prev.map(ip => ip.id === id ? updatedIP : ip));
      return updatedIP;
    } catch (err) {
      throw err;
    }
  };

  const deleteIP = async (id: string) => {
    try {
      await apiCall(`/ips/${id}`, { method: 'DELETE' });
      setIps(prev => prev.filter(ip => ip.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const exportData = async (format: 'json' | 'csv') => {
    try {
      const response = await fetch(`${API_BASE}/export/${format}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ips-export.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchIPs();
  }, []);

  return {
    ips,
    loading,
    error,
    fetchIPs,
    addIP,
    updateIP,
    deleteIP,
    exportData,
  };
}