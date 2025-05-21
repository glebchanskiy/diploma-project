import React, { createContext, useContext, useState, useEffect } from 'react';
import { NavigationPath, QueryStatus, Answer, QueryHistory } from '@/lib/types';
import { mockNavigationPathCombatRules, mockNavigationPathDefault, mockNavigationPathDwarf, mockNavigationPathFighter, mockNavigationPathFireball } from './mocks';
import { answers } from './answer';

interface QueryContextType {
  query: string;
  setQuery: (query: string) => void;
  queryStatus: QueryStatus | null;
  navigationPath: NavigationPath | null;
  answer: Answer | null;
  isLoading: boolean;
  submitQuery: (query: string) => Promise<void>;
  resetQuery: () => void;
  escalateToHuman: () => void;
  queryHistory: QueryHistory[];
}

const defaultContext: QueryContextType = {
  query: '',
  setQuery: () => {},
  queryStatus: null,
  navigationPath: null,
  answer: null,
  isLoading: false,
  submitQuery: async () => {},
  resetQuery: () => {},
  escalateToHuman: () => {},
  queryHistory: [],
};

const QueryContext = createContext<QueryContextType>(defaultContext);

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState<string>('');
  const [queryStatus, setQueryStatus] = useState<QueryStatus | null>(null);
  const [navigationPath, setNavigationPath] = useState<NavigationPath | null>(null);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryHistory, setQueryHistory] = useState<QueryHistory[]>(() => {
    const saved = localStorage.getItem('queryHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('queryHistory', JSON.stringify(queryHistory));
  }, [queryHistory]);

  // Simulated query submission
  const submitQuery = async (queryText: string) => {
    setIsLoading(true);
    setQuery(queryText);
    
    // Create a new query status
    const newQueryStatus: QueryStatus = {
      id: Math.random().toString(36).substring(2, 9),
      status: 'processing',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setQueryStatus(newQueryStatus);
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    let mockNavigationPath = mockNavigationPathDefault
    console.log('queryText: ', queryText)

    if (queryText === 'Расскажи про класс Воина') {
       mockNavigationPath = mockNavigationPathFighter
    }
    if (queryText === 'Как работает маханика сражения в днд') {
       mockNavigationPath = mockNavigationPathCombatRules
    }
    if (queryText === 'Характеристики расы дварфов') {
       mockNavigationPath = mockNavigationPathDwarf
    }
    if (queryText === 'Заклинание огненный шар') {
       mockNavigationPath = mockNavigationPathFireball
    }

    // Set navigation path
    const newNavigationPath = {...mockNavigationPath, queryId: newQueryStatus.id};
    setNavigationPath(newNavigationPath);
    
    // Simulate processing steps
    for (let i = 0; i <= mockNavigationPath.steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setNavigationPath(prev => {
        if (!prev) return null;
        
        const updatedSteps = prev.steps.map((step, index) => {
          if (index < i) return { ...step, status: 'completed' };
          if (index === i) return { ...step, status: 'active' };
          return { ...step, status: 'pending' };
        });
        
        return {
          ...prev,
          currentStepIndex: i,
          steps: updatedSteps,
        };
      });
    }
    
    // Simulate answer generation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Update query status to completed
    const finalStatus = { ...newQueryStatus, status: 'completed' as const, updatedAt: new Date() };
    setQueryStatus(finalStatus);
    
    // Set mock answer
    const newAnswer: Answer = {
      id: Math.random().toString(36).substring(2, 9),
      queryId: newQueryStatus.id,
      content: `Согласно нашей базе знаний, "${queryText}" можно решить, следуя нашей стандартной процедуре. Сначала определите конкретную проблему, затем примените рекомендованное решение из наших инструкций.`,
      sources: answers[queryText] ?? [
        { id: '1', title: 'Руководство по поддержке', snippet: 'Стандартная процедура обработки запросов клиентов...', relevance: 0.9 },
        { id: '2', title: 'Фрагмент базы знаний №42', snippet: 'Подробные шаги по устранению распространенных проблем...', relevance: 0.75 },
      ],
      confidence: 0.85,
      generatedAt: new Date(),
    };
    setAnswer(newAnswer);
    
    // Add to history
    const historyEntry: QueryHistory = {
      id: newQueryStatus.id,
      query: queryText,
      answer: newAnswer,
      status: finalStatus,
      navigationPath: newNavigationPath,
      timestamp: new Date(),
    };
    
    setQueryHistory(prev => [historyEntry, ...prev]);
    setIsLoading(false);
  };

  const resetQuery = () => {
    setQuery('');
    setQueryStatus(null);
    setNavigationPath(null);
    setAnswer(null);
  };

  const escalateToHuman = () => {
    setQueryStatus(prev => {
      if (!prev) return null;
      const updatedStatus = { ...prev, status: 'escalated' as const, updatedAt: new Date() };
      
      // Update the status in history
      setQueryHistory(history => 
        history.map(entry => 
          entry.id === prev.id 
            ? { ...entry, status: updatedStatus }
            : entry
        )
      );
      
      return updatedStatus;
    });
  };

  return (
    <QueryContext.Provider 
      value={{ 
        query, 
        setQuery, 
        queryStatus, 
        navigationPath, 
        answer, 
        isLoading,
        submitQuery,
        resetQuery,
        escalateToHuman,
        queryHistory,
      }}
    >
      {children}
    </QueryContext.Provider>
  );
}

export const useQuery = () => {
  const context = useContext(QueryContext);
  if (context === undefined) {
    throw new Error('useQuery must be used within a QueryProvider');
  }
  return context;
};