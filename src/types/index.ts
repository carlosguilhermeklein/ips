export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface IPEntry {
  id: string;
  ip: string;
  subnet: string;
  status: 'available' | 'occupied' | 'reserved' | 'dhcp';
  category?: string;
  description?: string;
  hostname?: string;
  macAddress?: string;
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPRange {
  id: string;
  name: string;
  network: string;
  cidr: string;
  startIp: string;
  endIp: string;
  totalIps: number;
  description?: string;
  isDhcp: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  description?: string;
}