import { config } from '../config';

// Types for the creator search parameters
export interface CreatorSearchParams {
  search?: string;
  platform?: string;
  niche?: string;
  min_followers?: number;
  max_followers?: number;
  country?: string;
  language?: string;
  min_engagement?: number;
  limit?: number;
  offset?: number;
}

// Type for the API response
export interface CreatorResponse {
  // Add specific response type properties here once we know the exact structure
  [key: string]: any;
}

/**
 * Fetches creators based on search parameters
 * @param params - Search parameters for filtering creators
 * @returns Promise containing the creator search results
 */
export const getCreators = async (params: CreatorSearchParams): Promise<CreatorResponse> => {
  // Convert params to URLSearchParams to handle query string properly
  const searchParams = new URLSearchParams();
  
  // Add all non-undefined parameters to the search params
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, value.toString());
    }
  });

  // Construct the API URL with query parameters
  const apiUrl = `${config.apiBaseUrl}/api/v1/creators/?${searchParams.toString()}`;

  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching creators:', error);
    throw error;
  }
}; 