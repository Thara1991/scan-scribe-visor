// API service for backend communication
// const API_BASE_URL = 'http://10.0.1.90:8085';
const API_BASE_URL = 'http://192.168.0.132:8085';
// Types for API responses
export interface LoginResponse {
  userName: string;
  userID: string;
}

export interface LoginRequest {
  userID: string;
  password: string;
}

export interface PatientMainInfoResponse {
  HN: string;
  ShowHN: string;
  PatName: string;
  Age: string;
  LastVisit: string;
  CurrentVist: string;
}

export interface PatientMainInfoRequest {
  hn: string;
  ocm?: string;
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
    // Build URL with query parameters for your actual API
    const url = `${API_BASE_URL}/api/user/Login?id=${encodeURIComponent(credentials.userID)}&pw=${encodeURIComponent(credentials.password)}`;
    
    console.log('🔐 Login attempt:', {
      url,
      userID: credentials.userID,
      password: credentials.password
    });
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'accept': '*/*',
        },
        body: '', // Empty body as per your Swagger spec
      });
      
      console.log('📡 API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ HTTP Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const responseData = await response.json();
      console.log('✅ Login Response Data:', responseData);
      
      return responseData;
    } catch (error) {
      console.error('💥 Login API request failed:', error);
      throw error;
    }
  }

  // Patient Main Info method (GET version for testing)
  static async getPatientMainInfoGET(hn: string, ocm?: string): Promise<PatientMainInfoResponse[]> {
    // Manual URL encoding to ensure spaces are encoded as %20 instead of +
    const encodedHN = encodeURIComponent(hn).replace(/\+/g, '%20');
    const encodedOCM = ocm ? encodeURIComponent(ocm).replace(/\+/g, '%20') : '';
    
    const fullUrl = `${API_BASE_URL}/api/patient/PatientMainInfo?hn=${encodedHN}${encodedOCM ? `&ocm=${encodedOCM}` : ''}`;
    
    console.log('🔍 Patient search attempt (GET):', {
      fullUrl,
      method: 'GET',
      hn,
      ocm
    });
    
    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'accept': '*/*',
        },
      });
      
      console.log('📡 Patient API Response (GET):', {
        url: fullUrl,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ HTTP Error Response (GET):', {
          url: fullUrl,
          status: response.status,
          statusText: response.statusText,
          errorText
        });
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const responseData = await response.json();
      console.log('✅ Patient Response Data (GET):', {
        url: fullUrl,
        responseData
      });
      
      return responseData;
    } catch (error) {
      console.error('💥 Patient API request failed (GET):', {
        url: fullUrl,
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  // Patient Main Info method (POST version)
  static async getPatientMainInfo(request: PatientMainInfoRequest): Promise<PatientMainInfoResponse> {
    // Try POST with query parameters first (as per API documentation format)
    const encodedHN = encodeURIComponent(request.hn).replace(/\+/g, '%20');
    const encodedOCM = request.ocm ? encodeURIComponent(request.ocm).replace(/\+/g, '%20') : '';
    const fullUrl = `${API_BASE_URL}/api/patient/PatientMainInfo?hn=${encodedHN}${encodedOCM ? `&ocm=${encodedOCM}` : ''}`;
    
    console.log('🔍 Patient search attempt (POST):', {
      fullUrl,
      method: 'POST',
      hn: request.hn,
      ocm: request.ocm,
      encodedHN,
      encodedOCM
    });
    
    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'accept': '*/*',
        },
        body: '', // Empty body for query parameter POST
      });
      
      console.log('📡 Patient API Response (POST):', {
        url: fullUrl,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ HTTP Error Response (POST):', {
          url: fullUrl,
          status: response.status,
          statusText: response.statusText,
          errorText
        });
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const responseData = await response.json();
      console.log('✅ Patient Response Data (POST):', {
        url: fullUrl,
        responseData
      });
      
      return responseData;
    } catch (error) {
      console.error('💥 Patient API request failed (POST):', {
        url: fullUrl,
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  // Health check method (for testing connection)
  static async healthCheck(): Promise<any> {
    return this.makeRequest('/health');
  }
}
