import { OrderAdminStatus } from "../types";

const API_BASE_URL = '/api';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! Status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // Ignore if response is not json
      }
      throw new Error(errorMessage);
    }

    // Handle cases where backend sends success:false
    const data = await response.json();
    if (data.success === false) {
        throw new Error(data.message || 'API returned a failure response.');
    }

    return data;

  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('فشل الاتصال بالخادم. يرجى التأكد من أن الخادم يعمل.');
    }
    throw error;
  }
}