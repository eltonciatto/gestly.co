import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

interface UseTabsOptions {
  defaultValue?: string;
  persistInUrl?: boolean;
  urlParam?: string;
  onChange?: (value: string) => void;
}

export function useTabs({
  defaultValue,
  persistInUrl = false,
  urlParam = 'tab',
  onChange
}: UseTabsOptions = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    if (persistInUrl) {
      return searchParams.get(urlParam) || defaultValue;
    }
    return defaultValue;
  });

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    
    if (persistInUrl) {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set(urlParam, value);
        return newParams;
      });
    }

    onChange?.(value);
  }, [persistInUrl, urlParam, setSearchParams, onChange]);

  return {
    activeTab,
    setActiveTab: handleTabChange
  };
}