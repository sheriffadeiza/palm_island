export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'coach' | 'student';
  avatar?: string;
  phone?: string;
  position?: string;
  team?: string;
  joinDate: string;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  category: 'tournament' | 'fixture' | 'news';
}

export interface Payment {
  id: string;
  amount: number;
  description: string;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}