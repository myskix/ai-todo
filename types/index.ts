export type Priority = 'high' | 'medium' | 'low';

export type Category = 'work' | 'personal' | 'health' | 'learning' | 'other';

export interface Task {
  id: string;
  user_id?: string;
  title: string;
  description?: string;
  priority: Priority;
  category: Category;
  deadline?: string; // ISO date string
  timeSuggestion?: string;
  completed: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

export interface AIGenerateRequest {
  prompt: string;
  userId?: string;
}

export interface AIGenerateResponse {
  tasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed'>[];
}

export interface AIPriorityRequest {
  task: Pick<Task, 'title' | 'description' | 'deadline' | 'category'>;
}

export interface AIPriorityResponse {
  priority: Priority;
  reasoning: string;
}

export interface AISuggestTimeRequest {
  task: Pick<Task, 'title' | 'description' | 'priority' | 'category' | 'deadline'>;
}

export interface AISuggestTimeResponse {
  timeSuggestion: string;
  reasoning: string;
}
