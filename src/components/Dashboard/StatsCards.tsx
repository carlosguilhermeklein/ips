import React from 'react';
import { Server, CheckCircle, AlertCircle, Lock, Wifi } from 'lucide-react';
import { IPEntry } from '../../types';

interface StatsCardsProps {
  ips: IPEntry[];
}

export function StatsCards({ ips }: StatsCardsProps) {
  const stats = {
    total: ips.length,
    available: ips.filter(ip => ip.status === 'available').length,
    occupied: ips.filter(ip => ip.status === 'occupied').length,
    reserved: ips.filter(ip => ip.status === 'reserved').length,
    dhcp: ips.filter(ip => ip.status === 'dhcp').length,
  };

  const cards = [
    {
      title: 'Total IPs',
      value: stats.total,
      icon: Server,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Available',
      value: stats.available,
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Occupied',
      value: stats.occupied,
      icon: AlertCircle,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      title: 'Reserved',
      value: stats.reserved,
      icon: Lock,
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      title: 'DHCP',
      value: stats.dhcp,
      icon: Wifi,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${card.bg}`}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}