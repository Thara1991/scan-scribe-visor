// API service for backend communication
const API_BASE_URL = 'http://localhost:8085';

// Types for API responses
export interface LoginResponse {
  userName: string;
  userID: string;
}

export interface LoginRequest {
  userID: string;
  password: string;
}

// API service class
export class ApiService {
  private static async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    // If custom headers are provided, merge them properly
    if (options.headers) {
      defaultOptions.headers = { ...defaultOptions.headers, ...options.headers };
    }

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Login method
  static async login(credentials: LoginRequest): Promise<LoginResponse[]> {
    // Build URL with query parameters
    const url = `${API_BASE_URL}/Login?sUid=${encodeURIComponent(credentials.userID)}&sPass=${encodeURIComponent(credentials.password)}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        // No body needed - parameters are in URL
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Login API request failed:', error);
      throw error;
    }
  }

  // Health check method (for testing connection)
  static async healthCheck(): Promise<any> {
    return this.makeRequest('/health');
  }
}
