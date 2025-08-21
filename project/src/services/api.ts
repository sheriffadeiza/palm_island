// API service for backend integration
const API_BASE_URL = 'http://localhost:5000';

export interface RegisterRequest {
  fullname: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  fullname: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
}

export interface ApiResponse<T> {
  message: string;
  data?: T;
}

export interface RegisterResponse {
  message: string;
  userId: string;
  verificationToken?: string;
}

export interface LoginResponse {
  message: string;
  user: User;
}

export interface VerifyEmailResponse {
  message: string;
  isVerified: boolean;
}

export interface Player {
  _id: string;
  fullname: string;
  email: string;
  age: number;
  position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
  phoneNumber: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalInfo: {
    allergies: string;
    medications: string;
    conditions: string;
  };
  performance: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';
  attendance: string;
  joinDate: string;
  isActive: boolean;
  coachId: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddPlayerRequest {
  fullname: string;
  email: string;
  age: number;
  position: string;
  phoneNumber: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalInfo?: {
    allergies: string;
    medications: string;
    conditions: string;
  };
  coachId: string;
  notes?: string;
}

export interface PlayersResponse {
  message: string;
  players: Player[];
}

export interface AddPlayerResponse {
  message: string;
  player: Player;
}

export interface TrainingSession {
  _id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  type: 'Technical Skills' | 'Physical Fitness' | 'Tactical Training' | 'Scrimmage' | 'Recovery' | 'Team Building';
  intensity: 'Low' | 'Medium' | 'High';
  maxParticipants: number;
  participants: Array<{
    playerId: string;
    attended: boolean;
    performance?: 'Excellent' | 'Good' | 'Average' | 'Poor';
    notes: string;
  }>;
  equipment: string[];
  objectives: string[];
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  weather: string;
  coachId: string;
  notes: string;
  isRecurring: boolean;
  recurringPattern?: {
    frequency: 'Daily' | 'Weekly' | 'Bi-weekly' | 'Monthly';
    endDate?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Match {
  _id: string;
  title: string;
  opponent: {
    name: string;
    logo?: string;
    contact?: string;
  };
  date: string;
  time: string;
  venue: {
    name: string;
    address: string;
    isHome: boolean;
  };
  type: 'Friendly' | 'League' | 'Cup' | 'Tournament' | 'Playoff';
  ageGroup: string;
  squad: Array<{
    playerId: string;
    position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
    isStarter: boolean;
    jerseyNumber?: number;
  }>;
  result?: {
    homeScore?: number;
    awayScore?: number;
    ourScore?: number;
    opponentScore?: number;
    outcome?: 'Win' | 'Loss' | 'Draw';
    penalties?: {
      ourPenalties?: number;
      opponentPenalties?: number;
    };
  };
  events: Array<{
    type: 'Goal' | 'Assist' | 'Yellow Card' | 'Red Card' | 'Substitution' | 'Injury';
    playerId: string;
    minute: number;
    description: string;
  }>;
  status: 'Scheduled' | 'Live' | 'Completed' | 'Cancelled' | 'Postponed';
  importance: 'Low' | 'Medium' | 'High' | 'Critical';
  coachId: string;
  notes: string;
  preparation?: {
    tactics: string;
    keyPlayers: string[];
    weaknesses: string;
    strengths: string;
  };
  attendance?: {
    expected: number;
    actual: number;
  };
  createdAt: string;
  updatedAt: string;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    console.log(`🔗 Making API request to: ${url}`);
    console.log(`📤 Request options:`, options);

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      console.log(`📥 Response status: ${response.status}`);

      const data = await response.json();
      console.log(`📦 Response data:`, data);

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('❌ API request failed:', error);
      console.error('🔍 URL:', url);
      console.error('⚙️ Config:', config);
      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    return this.makeRequest<RegisterResponse>('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.makeRequest<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    return this.makeRequest<VerifyEmailResponse>(`/verify-email?token=${token}`, {
      method: 'GET',
    });
  }

  async resendVerification(email: string): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>('/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async checkServerHealth(): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      return await response.text();
    } catch (error) {
      throw new Error('Backend server is not available');
    }
  }

  // Player Management Methods
  async getPlayers(coachId: string): Promise<PlayersResponse> {
    return this.makeRequest<PlayersResponse>(`/players/${coachId}`, {
      method: 'GET',
    });
  }

  async addPlayer(playerData: AddPlayerRequest): Promise<AddPlayerResponse> {
    return this.makeRequest<AddPlayerResponse>('/players', {
      method: 'POST',
      body: JSON.stringify(playerData),
    });
  }

  async updatePlayer(playerId: string, playerData: Partial<AddPlayerRequest>): Promise<{ message: string; player: Player }> {
    return this.makeRequest<{ message: string; player: Player }>(`/players/${playerId}`, {
      method: 'PUT',
      body: JSON.stringify(playerData),
    });
  }

  async deletePlayer(playerId: string): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>(`/players/${playerId}`, {
      method: 'DELETE',
    });
  }

  // Training Session Management Methods
  async getTrainingSessions(coachId: string): Promise<{ message: string; sessions: TrainingSession[] }> {
    return this.makeRequest<{ message: string; sessions: TrainingSession[] }>(`/training/${coachId}`, {
      method: 'GET',
    });
  }

  async addTrainingSession(sessionData: Partial<TrainingSession>): Promise<{ message: string; session: TrainingSession }> {
    return this.makeRequest<{ message: string; session: TrainingSession }>('/training', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async updateTrainingSession(sessionId: string, sessionData: Partial<TrainingSession>): Promise<{ message: string; session: TrainingSession }> {
    return this.makeRequest<{ message: string; session: TrainingSession }>(`/training/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData),
    });
  }

  async deleteTrainingSession(sessionId: string): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>(`/training/${sessionId}`, {
      method: 'DELETE',
    });
  }

  // Match Management Methods
  async getMatches(coachId: string): Promise<{ message: string; matches: Match[] }> {
    return this.makeRequest<{ message: string; matches: Match[] }>(`/matches/${coachId}`, {
      method: 'GET',
    });
  }

  async addMatch(matchData: Partial<Match>): Promise<{ message: string; match: Match }> {
    return this.makeRequest<{ message: string; match: Match }>('/matches', {
      method: 'POST',
      body: JSON.stringify(matchData),
    });
  }

  async updateMatch(matchId: string, matchData: Partial<Match>): Promise<{ message: string; match: Match }> {
    return this.makeRequest<{ message: string; match: Match }>(`/matches/${matchId}`, {
      method: 'PUT',
      body: JSON.stringify(matchData),
    });
  }

  async deleteMatch(matchId: string): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>(`/matches/${matchId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
