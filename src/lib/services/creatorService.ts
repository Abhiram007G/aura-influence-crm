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
  total: number;
  creators: Array<{
    id: string;
    name: string;
    email: string;
    platform: string;
    channel_name?: string;
    handle?: string;
    profile_image?: string;
    followers_count: string;
    followers_count_numeric: number;
    engagement_rate: number;
    country: string;
    niche: string;
    language: string;
    about?: string;
    avg_views?: number;
    collaboration_rate?: number;
    rating?: number;
    match_percentage?: number;
    created_at: string;
    updated_at: string;
  }>;
  filters_applied: {
    niche?: string;
    platform?: string;
    size?: string;
  };
}

// Common headers for all requests
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

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
      // For search parameter, ensure it's properly encoded
      if (key === 'search') {
        searchParams.append('name', value.toString());
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });

  // Construct the API URL with query parameters
  const apiUrl = `${config.apiBaseUrl}/api/v1/creators/?${searchParams.toString()}`;

  try {
    console.log('Fetching creators from:', apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: defaultHeaders,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData?.message || response.statusText}`
      );
    }
    
    const data = await response.json();
    console.log('Creators fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching creators:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        `Unable to connect to the server at ${apiUrl}. Please check if the server is running and accessible.`
      );
    }
    throw error;
  }
}; 