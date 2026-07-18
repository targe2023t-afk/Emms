import { useState, useCallback } from 'react';
import { APP_CONFIG } from '@/shared/config/app.config';

interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

interface UsePaginationReturn {
  pagination: PaginationState;
  setPageIndex: (index: number) => void;
  setPageSize: (size: number) => void;
  resetPagination: () => void;
}

export function usePagination(
  initialPageSize: number = APP_CONFIG.pagination.defaultPageSize
): UsePaginationReturn {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const setPageIndex = useCallback((index: number) => {
    setPagination((prev) => ({ ...prev, pageIndex: index }));
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPagination((prev) => ({ ...prev, pageSize: size, pageIndex: 0 }));
  }, []);

  const resetPagination = useCallback(() => {
    setPagination({ pageIndex: 0, pageSize: initialPageSize });
  }, [initialPageSize]);

  return { pagination, setPageIndex, setPageSize, resetPagination };
}
