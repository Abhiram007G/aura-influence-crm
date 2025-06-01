import { config } from '../config';

// Types for the API response
export interface OutreachResponse {
  id: string;
  creator_id: string;
  campaign_id: string;
  status: "contacted" | "responded" | "negotiating" | "signed" | "declined";
  last_contact: string;
  conversations: {
    type: "call" | "email";
    date: string;
    summary: string;
    sentiment: "positive" | "neutral" | "negative";
  }[];
}

// Common headers for all requests
const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

/**
 * Fetches all outreach entries
 * @returns Promise containing the list of outreach entries
 */
export const getOutreachEntries = async (): Promise<OutreachResponse[]> => {
  const apiUrl = `${config.apiBaseUrl}/api/v1/outreach/`;

  try {
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
    return data;
  } catch (error) {
    console.error('Error fetching outreach entries:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        `Unable to connect to the server at ${apiUrl}. Please check if the server is running and accessible.`
      );
    }
    throw error;
  }
};

/**
 * Initiates a call with an influencer
 * @param outreachId - The ID of the outreach entry
 * @param phoneNumber - The phone number to call
 * @returns Promise containing the call initiation response
 */
export const initiateCall = async (outreachId: string, phoneNumber: string): Promise<any> => {
  const apiUrl = `${config.apiBaseUrl}/api/v1/outreach/call/initiate`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({
        outreach_id: outreachId,
        phone_number: phoneNumber
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData?.message || response.statusText}`
      );
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error initiating call:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        `Unable to connect to the server at ${apiUrl}. Please check if the server is running and accessible.`
      );
    }
    throw error;
  }
};

/**
 * Sends an email to an influencer
 * @param outreachId - The ID of the outreach entry
 * @returns Promise containing the email sending response
 */
export const sendEmail = async (outreachId: string): Promise<any> => {
  const apiUrl = `${config.apiBaseUrl}/api/v1/outreach/email/send`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({
        outreach_id: outreachId
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorData?.message || response.statusText}`
      );
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error sending email:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        `Unable to connect to the server at ${apiUrl}. Please check if the server is running and accessible.`
      );
    }
    throw error;
  }
}; 