'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  SearchIndex,
  SearchResult,
  GroupedResults,
  buildSearchIndex,
  search,
  groupResults,
  SearchResultType,
} from '@/lib/search';
import type { Note } from '@/lib/types';
import type { Agent } from '@/lib/mission-control-data';
import type { AgentDetail } from '@/lib/data-source';

interface UseSearchOptions {
  notes: Note[];
  agents: Agent[];
  agentDetails: Map<string, AgentDetail>;
  memoryContent?: string;
}

interface UseSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult[];
  groupedResults: GroupedResults;
  isSearching: boolean;
  isIndexed: boolean;
  resultCount: number;
  clearSearch: () => void;
}

/**
 * Hook for searching across all Command Center content
 */
export function useSearch(options: UseSearchOptions): UseSearchReturn {
  const { notes, agents, agentDetails, memoryContent } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Build search index when data changes
  const searchIndex = useMemo<SearchIndex>(() => {
    return buildSearchIndex({
      notes,
      agents,
      agentDetails,
      memoryContent,
    });
  }, [notes, agents, agentDetails, memoryContent]);

  // Perform search when query changes
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    // Small delay for debounce effect
    const timeoutId = setTimeout(() => {
      const searchResults = search(searchIndex, query, { maxResults: 30 });
      setResults(searchResults);
      setIsSearching(false);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [query, searchIndex]);

  const groupedResults = useMemo(() => groupResults(results), [results]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
  }, []);

  return {
    query,
    setQuery,
    results,
    groupedResults,
    isSearching,
    isIndexed: searchIndex.items.length > 0,
    resultCount: results.length,
    clearSearch,
  };
}
