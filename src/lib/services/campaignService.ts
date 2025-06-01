import { config } from '../config';

// Types for campaign creation
export interface CampaignCreate {
  product_name: string;
  brand_name: string;
  product_description?: string;
  target_audience?: string;
  key_use_cases?: string;
  campaign_goal?: string;
  product_niche?: string;
  total_budget: number;
}

// Type for the API response
export interface CampaignResponse {
  id: string;
  product_name: string;
  brand_name: string;
  product_description?: string;
  target_audience?: string;
  key_use_cases?: string;
  campaign_goal?: string;
  product_niche?: string;
  total_budget: number;
  status: 'active' | 'draft' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
}

// Common headers for all requests
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

/**
 * Creates a new campaign
 * @param campaignData - The campaign data to create
 * @returns Promise containing the created campaign
 */
export const createCampaign = async (campaignData: CampaignCreate): Promise<CampaignResponse> => {
  const apiUrl = `${config.apiBaseUrl}/api/v1/campaigns/`;

  try {
    console.log('Attempting to create campaign at:', apiUrl);
    console.log('With data:', campaignData);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(campaignData),
      credentials: 'include', // Include cookies if needed
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData?.message || response.statusText}`
      );
    }
    
    const data = await response.json();
    console.log('Campaign created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating campaign:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        `Unable to connect to the server at ${apiUrl}. Please check if the server is running and accessible.`
      );
    }
    throw error;
  }
};

/**
 * Gets all campaigns with optional filtering
 * @param params - Optional parameters for filtering campaigns
 * @returns Promise containing the list of campaigns
 */
export const getCampaigns = async (params?: {
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<CampaignResponse[]> => {
  const searchParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
  }

  const apiUrl = `${config.apiBaseUrl}/api/v1/campaigns/?${searchParams.toString()}`;

  try {
    const response = await fetch(apiUrl, {
      headers: defaultHeaders,
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData?.message || response.statusText}`
      );
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        `Unable to connect to the server at ${apiUrl}. Please check if the server is running and accessible.`
      );
    }
    throw error;
  }
};

/**
 * Gets a campaign by ID
 * @param campaignId - The ID of the campaign to get
 * @returns Promise containing the campaign details
 */
export const getCampaignById = async (campaignId: string): Promise<CampaignResponse> => {
  const apiUrl = `${config.apiBaseUrl}/api/v1/campaigns/${campaignId}`;

  try {
    const response = await fetch(apiUrl, {
      headers: defaultHeaders,
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData?.message || response.statusText}`
      );
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching campaign:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        `Unable to connect to the server at ${apiUrl}. Please check if the server is running and accessible.`
      );
    }
    throw error;
  }
}; 