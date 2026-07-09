// src/hooks/useFirestoreList.js
//
// Convenience hook that loads a list from a firestoreService instance and
// exposes { data, loading, error, refetch } - used by table/list pages so
// they don't each repeat the same loading-state boilerplate.

import { useCallback, useEffect, useState } from 'react';

export function useFirestoreList(service, options = {}, deps = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.getAll(options);
      setData(result);
    } catch (err) {
      console.error('Firestore list load failed:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
