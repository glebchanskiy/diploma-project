export interface QueryStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'escalated';
  createdAt: Date;
  updatedAt: Date;
}

export interface NavigationStep {
  id: string;
  label: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
  confidence: number;
}

export interface NavigationPath {
  queryId: string;
  steps: NavigationStep[];
  currentStepIndex: number;
}

export interface Answer {
  id: string;
  queryId: string;
  content: string;
  sources: Source[];
  confidence: number;
  generatedAt: Date;
}

export interface Source {
  id: string;
  title: string;
  url?: string;
  snippet: string;
  relevance: number;
}

export interface User {
  id: string;
  name: string;
  role: 'user' | 'admin' | 'operator';
  avatar?: string;
}

export interface KnowledgeNode {
  id: string;
  title: string;
  content: string;
  parentId?: string;
  children: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface QueryHistory {
  id: string;
  query: string;
  answer: Answer | null;
  status: QueryStatus;
  navigationPath: NavigationPath | null;
  timestamp: Date;
}