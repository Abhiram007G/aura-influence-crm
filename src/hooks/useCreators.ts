import { useState, useCallback } from 'react';
import { getCreators, CreatorSearchParams, CreatorResponse } from '../lib/services/creatorService';

interface UseCreatorsReturn {
  creators: CreatorResponse | null;
  loading: boolean;
  error: Error | null;
  fetchCreators: (params: CreatorSearchParams) => Promise<void>;
}

/**
 * Custom hook for fetching and managing creator data
 * @returns Object containing creators data, loading state, error state, and fetch function
 */
export const useCreators = (): UseCreatorsReturn => {
  const [creators, setCreators] = useState<CreatorResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCreators = useCallback(async (params: CreatorSearchParams) => {
    try {
      console.log('useCreators: Starting fetch with params:', params);
      setLoading(true);
      setError(null);
      const data = await getCreators(params);
      console.log('useCreators: Received data:', data);
      setCreators(data);
    } catch (err) {
      console.error('useCreators: Error occurred:', err);
      setError(err instanceof Error ? err : new Error('An error occurred'));
      setCreators(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    creators,
    loading,
    error,
    fetchCreators,
  };
}; 