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
}

export const apiService = new ApiService();
