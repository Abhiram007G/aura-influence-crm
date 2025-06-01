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
      setLoading(true);
      setError(null);
      const data = await getCreators(params);
      setCreators(data);
    } catch (err) {
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