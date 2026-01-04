import { authService } from './authService';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Url {
  id: number;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
}

export interface UrlResponse {
  success: boolean;
  message: string;
  data?: {
    id?: number;
    originalUrl?: string;
    shortCode?: string;
    shortUrl?: string;
    clicks?: number;
    urls?: Url[];
    count?: number;
    limit?: number;
  };
  limitReached?: boolean;
}

class UrlService {
  // Create short URL
  async createUrl(originalUrl: string): Promise<UrlResponse> {
    try {
      const response = await fetch(`${API_URL}/api/urls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
        body: JSON.stringify({ originalUrl }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  }

  // Get user's URLs
  async getUserUrls(): Promise<UrlResponse> {
    try {
      const response = await fetch(`${API_URL}/api/urls`, {
        headers: {
          ...authService.getAuthHeader(),
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  }

  // Delete URL
  async deleteUrl(id: number): Promise<UrlResponse> {
    try {
      const response = await fetch(`${API_URL}/api/urls/${id}`, {
        method: 'DELETE',
        headers: {
          ...authService.getAuthHeader(),
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  }

  // Copy to clipboard
  copyToClipboard(text: string): Promise<boolean> {
    if (typeof window === 'undefined' || !navigator.clipboard) {
      return Promise.resolve(false);
    }

    return navigator.clipboard
      .writeText(text)
      .then(() => true)
      .catch(() => false);
  }
}

export const urlService = new UrlService();
